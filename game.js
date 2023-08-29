import {
    bg, canvas, context, perchY, perchWidth, perchHeight, screenFade, 
    dragon, dragonImages, perch, obstacles, lifeBar, tapToFly, backgrounds, frame
} from './init.js';
import { draw } from './render.js';
import {
    createArrowObstacle, createLightningStrikeObstacle, createBatSwarmObstacle, createTornadoObstacle,
    createWraithObstacle, createZombieDragonObstacle, createThundercloudObstacle, createFireballObstacle
} from './obstacles.js';

let obstacleSpawnTime = 4000, topObstacle = false, obstacleY, spawnRate = 5, spawnTimer = 0, framesPerFlap = 150, gameLoopCounter = 0, gameStarted = false, jump = 8, isFlapping = false, dragonFlapSpeed = 3;

// To prevent multiple jumps
let jumpLock = false;

function handleInput() {
    if (jumpLock) return;
    jumpLock = true;
    setTimeout(() => jumpLock = false, 200);  // Unlock after 200ms

    if (!gameStarted) {
        gameStarted = true;
    }
    
    dragon.velocity = -jump; // Make the dragon go up
    dragon.y += dragon.velocity;
    
    isFlapping = true;  // Set isFlapping to true when tapped
    // console.log("handleInput called, isFlapping set to:", isFlapping);  // Debugging line

    // Set isFlapping back to false after 12 frames have passed
    setTimeout(() => {
        isFlapping = false;
        // console.log("Stopped flapping, isFlapping set to:", isFlapping);  // Debugging line
    }, framesPerFlap / dragonFlapSpeed * 12);  // 12 frames
}

// Event listeners for clicks and keydowns
window.addEventListener('click', function() {
    gameStarted = true;
    // console.log("Screen clicked, gameStarted set to:", gameStarted);  // Debugging line
    handleInput();
});
window.addEventListener('touchstart', handleInput);
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') 
        handleInput();
});

function resetGame() {
    // Reset dragon's position to its starting position
    Object.assign(dragon, { x: perch.x, y: perchY - 125, velocity: 0, scale: 1, alpha: 1 });
    gameStarted = false;
    obstacleSpawnTime = 4000;
    bg.width = canvas.height * 4;
    lifeBar.segments = 10;
}

function createObstacle() {
    const obstacleType = ['arrow', 'lightningStrike', 'batSwarm', 'tornado', 'wraith', 'zombieDragon', 'thundercloud', 'fireball'];
    const randomType = obstacleType[Math.floor(Math.random() * obstacleType.length)];
    
    const minDistance = canvas.height * 0.1;
    const centerDistance = canvas.height * 0.5;
    
    obstacleY = Math.random() * (centerDistance - minDistance) + (topObstacle ? minDistance : centerDistance);
    obstacleY = Math.min(obstacleY, canvas.height - 100);  // Limit to within canvas height


    const obstacle = {
        'arrow': () => createArrowObstacle(canvas.width, obstacleY),
        'lightningStrike': () => createLightningStrikeObstacle(),
        'batSwarm': () => createBatSwarmObstacle(canvas.width, obstacleY),
        'tornado': () => createTornadoObstacle(canvas.width, obstacleY),
        'wraith': () => createWraithObstacle(canvas.width, obstacleY),
        'zombieDragon': () => createZombieDragonObstacle(canvas.width, obstacleY),
        'thundercloud': () => createThundercloudObstacle(canvas.width, obstacleY),
        'fireball': () => createFireballObstacle(canvas.width, obstacleY)
    }[randomType]();

    obstacles.push(obstacle);
    topObstacle = !topObstacle;
    obstacleSpawnTime *= 0.999;
    obstacleY = Math.random() * (centerDistance - minDistance) + (topObstacle ? minDistance : centerDistance);
    console.log(`Created obstacle of type: ${randomType} at y-position: ${obstacleY}`);
}

function collisionDetected(dragon, obstacle) {
    const dragonCollisionArea = {
        x: dragon.x,
        y: dragon.y,
        width: dragon.width,
        height: dragon.height
    };

    const obstacleCollisionArea = {
        x: obstacle.x,
        y: obstacle.y,
        width: obstacle.width,
        height: obstacle.height
    };

    const isCollision = (
        dragonCollisionArea.x < obstacleCollisionArea.x + obstacleCollisionArea.width &&
        dragonCollisionArea.x + dragonCollisionArea.width > obstacleCollisionArea.x &&
        dragonCollisionArea.y < obstacleCollisionArea.y + obstacleCollisionArea.height &&
        dragonCollisionArea.y + dragonCollisionArea.height > obstacleCollisionArea.y
    );

    if (isCollision) {
        console.log(`Collision detected at x: ${dragonCollisionArea.x}, y: ${dragonCollisionArea.y}`);
        console.log(`Collided with obstacle: ${obstacle.type}`);
    }

    return isCollision;
}

let gravity = 0.3, let lastObstacleTime = 0;

function update() {
    if (gameStarted && !levelEnding) {
        // Apply gravity to dragon
        dragon.velocity += gravity;
        dragon.y += dragon.velocity;
        
        // Update dragon
        dragon.update();

        // Update backgrounds
        backgrounds.fgX -= 0.3; // slow
        backgrounds.bgX -= 0.2; // slower
        backgrounds.bgbgX -= 0.1; // slowest

        // Update obstacles
        obstacles.forEach((obstacle, index) => {
            obstacle.x -= 1;  // Obstacle speed
            obstacle.update();

            if (collisionDetected(dragon, obstacle)) {
                if (!dragon.collided) {
                    lifeBar.segments--;
                    if (lifeBar.segments <= 0) {
                        resetGame();
                        lifeBar.segments = 10;  // Reset segments to 10
                    }
                    obstacles.splice(index, 1);
                    dragon.collided = true;

                    setTimeout(() => {
                        dragon.collided = false;
                    }, 1000);
                }
            }
        });
                const currentTime = Date.now();
        if (currentTime - lastObstacleTime >= 2000) { // 2000ms = 2 seconds
            createObstacle();
            lastObstacleTime = currentTime;
        }

        // Update perch
        perch.x -= 1;  // Set the speed to match the obstacle speed
        perch.update();

        // Create new obstacles
        if (gameLoopCounter % 1000 === 0) {
            // createObstacle();
        }
    }
}


if (backgrounds.fgX + bg.width <= canvas.width) {
    levelEnd();
}

let levelEnding = false;  // Add this flag to indicate when the level is ending

function levelEnd() {
    levelEnding = true;  // Set the flag to true
    
    dragon.scale += 0.005;
    dragon.alpha -= 0.005;
    screenFade.alpha += 0.01;

    // Make the dragon fly to the center of the screen
    const targetX = canvas.width / 2 - dragon.width / 2;
    const targetY = canvas.height / 2 - dragon.height / 2;
    dragon.x += (targetX - dragon.x) * 0.05;
    dragon.y += (targetY - dragon.y) * 0.05;

    if (screenFade.alpha >= 1) {
        setTimeout(resetGame, 2000);
    }
}

function gameLoop() {
    update();
    draw();

    // console.log("Game Started:", gameStarted);  // Debugging line

    if (gameStarted) {
        if (isFlapping && gameLoopCounter % (framesPerFlap / dragonFlapSpeed) === 0) {
            frame.current = (frame.current + 1) % dragonImages.length;
            // console.log("Flapping! Frame:", frame.current, "Frames per Flap:", framesPerFlap, "Dragon Flap Speed:", dragonFlapSpeed);  // Debugging line
        } else {
            // console.log("Not Flapping! isFlapping:", isFlapping, "Game Loop Counter:", gameLoopCounter, "Frames per Flap:", framesPerFlap, "Dragon Flap Speed:", dragonFlapSpeed);  // Debugging line
        }
    }

    requestAnimationFrame(gameLoop);  // Keep the game loop running
}

gameLoop();  // Initial call to start the game loop

window.onload = () => {
    setTimeout(() => {
        tapToFly.alpha = 0;
    }, 2000);

    setTimeout(() => {
        dragon.velocity = jump;
        dragon.y += dragon.velocity;
    }, 2100);

    setTimeout(() => {
        dragon.velocity = jump;
        dragon.y += dragon.velocity;
        gameStarted = true;
    }, 2300);
};

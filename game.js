import {
    bg, canvas, context, perchY, perchWidth, perchHeight, screenFade, 
    dragon, dragonImages, perch, obstacles, lifeBar, tapToFly, backgrounds, frame
} from './init.js';
import { draw } from './render.js';
import {
    createArrowObstacle, createLightningStrikeObstacle, createBatSwarmObstacle, createTornadoObstacle,
    createWraithObstacle, createZombieDragonObstacle, createThundercloudObstacle, createFireballObstacle
} from './obstacles.js';

let totalFrames = 12, topObstacle = false, obstacleY, spawnRate = 5, spawnTimer = 0, framesPerFlap = 1, flapCounter = 0, gameLoopCounter = 0, gameStarted = false, jump = 8, isFlapping = false, dragonFlapSpeed = 3;

let jumpLock = false, lastFlapTime = 0;

// Handle user input
function handleInput(event) {
    if (event.type === 'keydown' && event.code === 'Space') {
        isFlapping = true;
        lastFlapTime = Date.now(); // Record the time when the user clicks
    } else if (event.type === 'touchstart' || event.type === 'mousedown') {
        isFlapping = true;
        lastFlapTime = Date.now(); // Record the time when the user clicks
    }
}

// Main game loop
function gameLoop() {
    // Update game state
    update();

    // Draw game state
    draw();

    if (gameStarted) {
        const currentTime = Date.now();
        if (isFlapping && currentTime - lastFlapTime < 600) {
            const timeSinceLastFlap = currentTime - lastFlapTime;
            frame.current = Math.floor(timeSinceLastFlap / 100);
        } else {
            frame.current = 0;
            isFlapping = false;
        }
    }

    // Request the next animation frame
    requestAnimationFrame(gameLoop);
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

let gravity = 0.3; // Gravity constant

let lastObstacleTime = 0;

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

        if (backgrounds.fgX + bg.width <= canvas.width) {  levelEnd(); }

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

        // Update perch
        perch.x -= 1;  // Set the speed to match the obstacle speed
        perch.update();

       // Increment gameLoopCounter
        gameLoopCounter++;
        
        // Create new obstacles
        if (gameLoopCounter % 180 === 0) {
            createObstacle();
        }
    }
}

// Increment flapCounter
flapCounter++;

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

    if (gameStarted) {
        if (isFlapping) {
            if (flapCounter % 5 === 0) {  // Update every 5 frames (adjust this number to control speed)
                frame.current = (frame.current + 1) % dragonImages.length;
            }
        }
    }

    flapCounter++;  // Increment the counter
    requestAnimationFrame(gameLoop);
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


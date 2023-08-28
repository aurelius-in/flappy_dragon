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
    if (isFlapping && gameLoopCounter % framesPerFlap === 0) {
            frame.current = (frame.current + 1) % dragonImages.length;
        } 
  isFlapping = true;  // Set isFlapping to true when tapped
    console.log("handleInput called, isFlapping set to:", isFlapping);  // Debugging line

    // Set isFlapping back to false after 12 frames have passed
    setTimeout(() => {
        isFlapping = false;
        console.log("Stopped flapping, isFlapping set to:", isFlapping);  // Debugging line
    }, framesPerFlap / dragonFlapSpeed * 12);  // 12 frames
}

window.addEventListener('click', function() {
    gameStarted = true;
    console.log("Screen clicked, gameStarted set to:", gameStarted);  // Debugging line
    handleInput();
});
window.addEventListener('touchstart', handleInput);
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') 
        handleInput();
});

function resetGame() {
    obstacles.length = 0;
    perch.x = 50;
    dragon.x = dragonStartX;
    dragon.y = dragonStartY;
    dragon.velocity = 0;
    gameStarted = false;
    frame.current = 0; // Fixed this line
    backgrounds.bgX = 0;
    backgrounds.fgX = 0;
    backgrounds.bgbgX = 0;
    obstacleSpawnTime = 4000;
    endGameTime = 0;
    dragon.scale = 1;
    dragon.alpha = 1;
    screenFade.alpha = 0;
    bg.width = canvas.height * 4;
}

function createObstacle() {
    const obstacleType = [
        'arrow',
        'lightningStrike',
        'batSwarm',
        'tornado',
        'wraith',
        'zombieDragon',
        'thundercloud',
        'fireball'
    ];
    const randomType = obstacleType[Math.floor(Math.random() * obstacleType.length)];

    const minDistance = canvas.height * 0.1;
    const centerDistance = canvas.height * 0.5;

    if (topObstacle) {
        obstacleY = Math.random() * (centerDistance - minDistance) + minDistance;
    } else {
        obstacleY = Math.random() * (centerDistance - minDistance) + centerDistance;
    }

    let obstacle;
    switch (randomType) {
        case 'arrow': obstacle = createArrowObstacle(canvas.width, obstacleY);
            break;
        case 'lightningStrike': obstacle = createLightningStrikeObstacle(canvas.width, obstacleY);
            break;
        case 'batSwarm': obstacle = createBatSwarmObstacle(canvas.width, obstacleY);
            break;
        case 'tornado': obstacle = createTornadoObstacle(canvas.width, obstacleY);
            break;
        case 'wraith': obstacle = createWraithObstacle(canvas.width, obstacleY);
            break;
        case 'zombieDragon': obstacle = createZombieDragonObstacle(canvas.width, obstacleY);
            break;
        case 'thundercloud': obstacle = createThundercloudObstacle(canvas.width, obstacleY);
            break;
        case 'fireball': obstacle = createFireballObstacle(canvas.width, obstacleY);
            break;
    }

    obstacles.push(obstacle);
    topObstacle = !topObstacle;
    obstacleSpawnTime *= 0.999;
    
}

function collisionDetected(dragon, obstacle) {
    const boundaryReductionX = dragon.width * 0.05;
    const boundaryReductionY = dragon.height * 0.1;

    const dragonCollisionArea = {
        x: dragon.x + boundaryReductionX,
        y: dragon.y + boundaryReductionY,
        width: dragon.width - (boundaryReductionX * 2),
        height: dragon.height - (boundaryReductionY * 2)
    };

    const obstacleCollisionArea = {
        x: obstacle.x,
        y: obstacle.y,
        width: obstacle.width,
        height: obstacle.height
    };

    return (
    dragonCollisionArea.x < obstacleCollisionArea.x + obstacleCollisionArea.width &&
    dragonCollisionArea.x + dragonCollisionArea.width > obstacleCollisionArea.x &&
    dragonCollisionArea.y < obstacleCollisionArea.y + obstacleCollisionArea.height &&
    dragonCollisionArea.y + dragonCollisionArea.height > obstacleCollisionArea.y
)

let gravity = 0.3; // Gravity constant

function update() {
    console.log(canvas, context);  // Add this line for debugging
    let lightningStartX = canvas.width / 2; // Start from the center of the canvas width 
    let lightningStartY = 0; // Start from the top of the canvas
    let lightningStrike = createLightningStrikeObstacle(lightningStartX, lightningStartY, dragon.x + 20, dragon.y - 20, canvas, context);
    
    if (gameStarted) {
        // Apply gravity to dragon
        dragon.velocity += gravity;
        dragon.y += dragon.velocity;
        
        // Update dragon
        dragon.update();

        // Update backgrounds to make the dragon appear to move forward
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


        // Create new obstacles
        if (gameLoopCounter % 100 === 0) { // Every 100 frames
            createObstacle();
        }
    }
}

if (backgrounds.fgX + bg.width <= canvas.width) {
    levelEnd();
}

function levelEnd() {
    dragon.scale += 0.005;
    dragon.alpha -= 0.005;
    screenFade.alpha += 0.01;

    if (screenFade.alpha >= 1) {
        setTimeout(resetGame, 2000);
    }
}

function gameLoop() {
    update();
    draw();

    console.log("Game Started:", gameStarted);  // Debugging line

    if (gameStarted) {
        if (isFlapping && gameLoopCounter % (framesPerFlap / dragonFlapSpeed) === 0) {
            frame.current = (frame.current + 1) % dragonImages.length;
            console.log("Flapping! Frame:", frame.current, "Frames per Flap:", framesPerFlap, "Dragon Flap Speed:", dragonFlapSpeed);  // Debugging line
        } else {
            console.log("Not Flapping! isFlapping:", isFlapping, "Game Loop Counter:", gameLoopCounter, "Frames per Flap:", framesPerFlap, "Dragon Flap Speed:", dragonFlapSpeed);  // Debugging line
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


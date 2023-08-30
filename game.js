import {
    bg, canvas, context, perchY, perchWidth, perchHeight, screenFade, bolt, arrow, arrowImages,
    dragon, dragonImages, perch, obstacles, lifeBar, tapToFly, backgrounds, frame
} from './init.js';

import { draw } from './render.js';
import {
    createArrowObstacle, createLightningStrikeObstacle, createBatSwarmObstacle, createTornadoObstacle,
    createWraithObstacle, createZombieDragonObstacle, createThundercloudObstacle, createFireballObstacle
} from './obstacles.js';

let obstacleSpawnTime = 4000, topObstacle = false, framesPerFlap = 150, obstacleY, gameLoopCounter = 0, gameStarted = false, jump = 8, isFlapping = false, dragonFlapSpeed = 3;

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
// Modify the click event listener
window.addEventListener('click', function() {
    if (!gameStarted) {
        gameStarted = true;
    }
    handleInput();
});

// Modify the touchstart event listener
window.addEventListener('touchstart', function() {
    if (!gameStarted) {
        gameStarted = true;
    }
    handleInput();
});

// Modify the keydown event listener
window.addEventListener('keydown', (e) => {
    if (!gameStarted) {
        gameStarted = true;
    }
    handleInput();
});

function resetGame() {
    // Reset dragon's position to its starting position
    Object.assign(dragon, { 
        x: perchX, 
        y: perchY - 125, 
        velocity: 0, 
        width: 150, 
        height: 150, 
        alpha: 1, 
        scale: 1 
    });
    
    // Reset game state variables
    gameStarted = false;
    lifeBar.segments = 10;
    gameLoopCounter = 0;
    isFlapping = false;
    dragonFlapSpeed = 3;
    jumpLock = false;
    topObstacle = false;
    framesPerFlap = 150;
    obstacleY = null;
    lastObstacleTime = 0;

    // Reset backgrounds to original positions
    backgrounds.bgbgX = 0;
    backgrounds.bgX = 0;
    backgrounds.fgX = 0;

    // Reset perch to its original position
    perch.x = 50;  // Original x-coordinate based on game_backup.js
    perch.y = perchY;  // Assuming perchY is the original y-coordinate

    // Clear existing obstacles
    obstacles.length = 0;
}

function createObstacle() {
    const obstacleType = ['arrow', 'lightningStrike', 'batSwarm', 'tornado', 'wraith', 'zombieDragon', 'thundercloud', 'fireball'];
    const randomType = obstacleType[Math.floor(Math.random() * obstacleType.length)];
    
    const minDistance = canvas.height * 0.1;
    const centerDistance = canvas.height * 0.5;
    
    obstacleY = Math.random() * (centerDistance - minDistance) + (topObstacle ? minDistance : centerDistance);
    obstacleY = Math.min(obstacleY, canvas.height - 100);  // Limit to within canvas height

    const obstacle = {
    'arrow': () => {
        const newArrow = createArrowObstacle(canvas.width, obstacleY, obstacles);
        newArrow.hit = false;  // Initialize hit flag for newArrow
        return newArrow;
    },
        'lightningStrike': () => createLightningStrikeObstacle(),
        'batSwarm': () => createBatSwarmObstacle(canvas.width, obstacleY),
        'tornado': () => createTornadoObstacle(canvas.width, obstacleY),
        'wraith': () => createWraithObstacle(canvas.width, obstacleY),
        'zombieDragon': () => createZombieDragonObstacle(canvas.width, obstacleY),
        'thundercloud': () => createThundercloudObstacle(canvas.width, obstacleY),
        'fireball': () => createFireballObstacle(canvas.width, obstacleY)
    }[randomType]();

    // Handle arrow collision initialization
    if (randomType === 'arrow') {
        arrow.hit = false;
    }

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

let gravity = 0.3, lastObstacleTime = 0;

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
    obstacle.update();

    if (collisionDetected(dragon, obstacle)) {
        if (!obstacle.hit) {  // Check if this obstacle has already hit the dragon
            lifeBar.segments -= 1;
            obstacle.hit = true;  // Mark the obstacle as having hit the dragon
        }
        if (lifeBar.segments <= 0) {
            resetGame();
            lifeBar.segments = 10;  // Reset segments to 10
        }
        if (obstacle.type !== 'arrow') {  // Keep arrows in the game until they leave the screen
            obstacles.splice(index, 1);  // Remove the obstacle that has hit the dragon
        }
    }

    if (obstacle.type === 'arrow' && (obstacle.x < -100 || obstacle.y < -100)) {
        obstacles.splice(index, 1);  // Remove the arrow that has left the screen
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
    if (backgrounds.fgX + bg.width <= canvas.width) {
    levelEnd();
}
}

let levelEnding = false;  // Add this flag to indicate when the level is ending

function levelEnd() {
    levelEnding = true;  // Set the flag to true
    
    // Make the dragon shrink and fade out
    dragon.scale -= 0.005;
    dragon.alpha -= 0.005;
    screenFade.alpha += 0.01;

    // Make the dragon fly to the center of the screen
    const targetX = canvas.width / 2 - dragon.width / 2;
    const targetY = canvas.height / 2 - dragon.height / 2;
    dragon.x += (targetX - dragon.x) * 0.05;
    dragon.y += (targetY - dragon.y) * 0.05;

    // Reset the game when the screen is fully faded
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
};

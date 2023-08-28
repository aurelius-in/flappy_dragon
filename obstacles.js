import { canvas, context } from './init.js';  // Import canvas and context from init.js

// Bat Swarms
function createBatSwarmObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.x -= 2;
            this.y += Math.sin(this.x) * 5;
        },
        draw: function(context) {
            context.fillStyle = 'black';
            context.beginPath();
            context.arc(this.x, this.y, 15, 0, Math.PI * 2);
            context.fill();

            // Add gray dots to represent individual bats
            context.fillStyle = 'gray';
            for (let i = 0; i < 5; i++) {
                let dotX = this.x + Math.cos(i * 72) * 10;
                let dotY = this.y + Math.sin(i * 72) * 10;
                context.beginPath();
                context.arc(dotX, dotY, 2, 0, Math.PI * 2);
                context.fill();
            }
        }
    };
}


// Arrows
function createArrowObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.x -= 2;
            this.y += 1;
        },
        draw: function(context) {
            context.fillStyle = 'brown';
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(this.x - 10, this.y + 20);
            context.lineTo(this.x + 10, this.y + 20);
            context.closePath();
            context.fill();
        }
    };
}

// Lightning Strikes
function createLightningStrikeObstacle(x, y, dragonX, dragonY, canvas, context) {
    let lastStrikeTime = Date.now();  // Initialize to current time
    let fadeAlpha = 0;  // Alpha value for the fade effect
    let flashCounter = 0;  // Counter for screen flashes

    return {
        x: canvas.width / 2,  // Start from the center of the canvas
        y: 0,  // Start from the top edge of the screen
        width: 10,
        height: 200,
        targetX: dragonX + 20,
        targetY: dragonY + 20,
        zigzagCounter: 0,
        update: function() {
            let currentTime = Date.now();

            // Targeted strike towards the dragon's position
            let dx = this.targetX - this.x;
            let dy = this.targetY - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Normalize the distance and move towards the dragon
            this.x += (dx / distance) * 2;
            this.y += (dy / distance) * 2;

            // Add zigzag movement
            this.x += Math.sin(this.zigzagCounter) * 10;
            this.zigzagCounter += 0.1;

            // Trigger the fade effect and screen flash
            if (currentTime - lastStrikeTime > 5000) {  // 5 seconds
                lastStrikeTime = currentTime;
                fadeAlpha = 0.7;  // Set a high alpha value for a bright flash
                flashCounter = 2;  // Reset flash counter
            }

            if (flashCounter > 0) {
                fadeAlpha = Math.max(0, fadeAlpha - 0.02);  // Gradually reduce the alpha value
                if (fadeAlpha === 0) {
                    flashCounter--;  // Decrease flash counter
                    fadeAlpha = 0.7;  // Reset alpha for next flash
                }
            }
        },
        draw: function() {
            context.fillStyle = `rgba(255, 255, 0, ${fadeAlpha})`;  // Use fadeAlpha for the alpha channel
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    };
}

// Tornadoes
function createTornadoObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.x -= 2;
            this.y += Math.sin(this.x) * 2;
        },
        draw: function(context) {
            context.fillStyle = 'gray';
            context.beginPath();
            context.arc(this.x, this.y, 15, 0, Math.PI * 2);
            context.fill();
        }
    };
}

// Wraiths
function createWraithObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.x -= 2;
            this.y += Math.sin(this.x) * 5;
        },
        draw: function(context) {
            context.fillStyle = 'purple';
            context.beginPath();
            context.arc(this.x, this.y, 15, 0, Math.PI * 2);
            context.fill();
        }
    };
}

// Zombie Ghost Dragons
function createZombieDragonObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.x -= 1;
        },
        draw: function(context) {
            context.fillStyle = 'green';
            context.fillRect(this.x, this.y, 30, 15);
        }
    };
}

// Thunderclouds
function createThundercloudObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.x -= 2; // Move to the left
        },
        draw: function(context) {
            context.fillStyle = 'darkgray';
            context.beginPath();
            context.arc(this.x, this.y, 20, 0, Math.PI * 2);
            context.fill();
        }
    };
}


// Fireballs
function createFireballObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.x -= 3;
            this.y += Math.sin(this.x) * 2;
        },
        draw: function(context) {
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(this.x, this.y, 10, 0, Math.PI * 2);
            context.fill();
        }
    };
}

export {
    createArrowObstacle,
    createLightningStrikeObstacle,
    createBatSwarmObstacle,
    createTornadoObstacle,
    createWraithObstacle,
    createZombieDragonObstacle,
    createThundercloudObstacle,
    createFireballObstacle
};

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
let lastStrikeTime = 0;  // To keep track of the last time a lightning strike was created
let fadeAlpha = 0;  // Alpha value for the fade effect

function createLightningStrikeObstacle(x, y, dragonX, dragonY, canvas, context) {
    let lastStrikeTime = 0;  // To keep track of the last time a lightning strike was created
    let fadeAlpha = 0;  // Alpha value for the fade effect

    // Randomize the x position within a certain range
    let randomX = Math.random() * (canvas.width - 50) + 50;

    return {
        x: randomX,
        y: y,
        targetX: dragonX + 20,
        targetY: dragonY + 20,
        zigzagCounter: 0,
        update: function() {
            // Update periodically based on the game's time
            let currentTime = Date.now();
            if (currentTime - lastStrikeTime > 5000) {  // 5 seconds
                lastStrikeTime = currentTime;

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
            }

            // Trigger the fade effect
            if (currentTime - lastStrikeTime < 200) {  // Within 200ms of the strike
                fadeAlpha = 0.7;  // Set a high alpha value for a bright flash
            } else {
                fadeAlpha = Math.max(0, fadeAlpha - 0.02);  // Gradually reduce the alpha value
            }
        },
        draw: function() {
            // Make the lightning strike bigger
            context.fillStyle = 'yellow';
            context.fillRect(this.x, this.y, 10, 60);  // Increased size

            // Draw the fade effect
            context.fillStyle = `rgba(255, 255, 255, ${fadeAlpha})`;  // White with alpha
            context.fillRect(0, 0, canvas.width, canvas.height);  // Cover the entire canvas
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

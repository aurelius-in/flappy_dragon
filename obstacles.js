import { canvas, context, bolt } from './init.js';  // Import canvas and context from init.js

// Wraiths
function createWraithObstacle(x, y) {
    return {
        x: x,
        y: y,
        update: function() {
            this.x -= 2;
            this.y += Math.sin(this.x) * 2;
        },
        draw: function(context) {
            context.fillStyle = 'purple';
            context.beginPath();
            context.arc(this.x, this.y, 15, 0, Math.PI * 2);
            context.fill();
        }
    };
}

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
function createLightningStrikeObstacle() {
    const bolt = {
        x: canvas.width,
        y: Math.random() * (canvas.height * 0.5),
        width: 50,
        height: 100,
        frame: 0,
        boltCycles: 1,
        type: 'lightningStrike',
        flicker: true,  // Add this line for flicker
        update: function() {
            this.x -= 1;
            this.frame = (this.frame + 1) % (boltImages.length * 2 * this.boltCycles);
            if (this.frame < boltImages.length) {
                context.drawImage(boltImages[this.frame], this.x, this.y, this.width, this.height);
            } else {
                context.drawImage(boltImages[boltImages.length * 2 - 1 - this.frame], this.x, this.y, this.width, this.height);
            }
        },
        draw: function(context) {
            if (this.frame < boltImages.length) {
                context.drawImage(boltImages[this.frame], this.x, this.y, this.width, this.height);
            } else {
                context.drawImage(boltImages[boltImages.length * 2 - 1 - this.frame], this.x, this.y, this.width, this.height);
            }
        }
    };

    // Turn off flicker after 1 second
    setTimeout(() => bolt.flicker = false, 1000);

    return bolt;
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

export {
    createArrowObstacle,
    createBatSwarmObstacle,
    createFireballObstacle,
    createLightningStrikeObstacle,
    createThundercloudObstacle,
    createTornadoObstacle,
    createWraithObstacle,
    createZombieDragonObstacle
};

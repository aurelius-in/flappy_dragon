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
let lastStrikeTime = 0;
let fadeAlpha = 0;
let flashCounter = 0;
let levelStartedTime = Date.now();
let struckThisLevel = false;

function createLightningStrikeObstacle() {
  return {
    x: canvas.width / 2,
    y: 0,
    width: 9,
    height: 200,
    zigzagCounter: 0,
    hasStruck: false,  // Add this line
    update: function() {
      let currentTime = Date.now();
      if (!struckThisLevel && currentTime - levelStartedTime > 10000 && currentTime - lastStrikeTime > 11000) {
        lastStrikeTime = currentTime;
        flashCounter = 2;
        struckThisLevel = true;
        this.hasStruck = true;  // Add this line
      }
      if (flashCounter > 0) {
        fadeAlpha = Math.max(0, fadeAlpha - 0.25);
        if (fadeAlpha === 0) {
          flashCounter--;
          if (flashCounter > 0) {
            fadeAlpha = 1;
          }
        }
      }
    },
    draw: function(context) {
      if (flashCounter > 0) {
        context.fillStyle = 'rgba(255, 255, 255, ' + fadeAlpha + ')';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      if (this.hasStruck) {
        context.strokeStyle = 'yellow';
        context.lineWidth = this.width;
        context.beginPath();
        context.moveTo(this.x, this.y);
        for (let i = 0; i < this.height; i += 5) {
          context.lineTo(this.x + Math.sin(this.zigzagCounter + i) * 20, this.y + i);
        }
        context.stroke();
        this.zigzagCounter += 0.1;
      }
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

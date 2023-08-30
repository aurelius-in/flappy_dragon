// Canvas and context
export const canvas = document.getElementById('game');
export const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Dragon's Perch
export const perchImage = new Image(); perchImage.src = 'images/perch.png';

// Initialize arrays to hold Image objects for each level
export const bgImage = [];
export const fgImage = [];
export const bgbgImage = [];

// Populate the arrays with Image objects for four levels
for (let i = 1; i <= 4; i++) {
    const bg = new Image();
    bg.src = `images/bg${i}.png`;
    bgImage.push(bg);

    const fg = new Image();
    fg.src = `images/fg${i}.png`;
    fgImage.push(fg);

    const bgbg = new Image();
    bgbg.src = `images/bgbg${i}.png`;
    bgbgImage.push(bgbg);
}

// Load the lightning bolt images
export const boltImages = [];
for (let i = 1; i <= 12; i++) {
    const image = new Image();
    image.src = `images/bolt${i}.png`;
    boltImages.push(image);
}
// Flicker for Lightning
export const bolt = { flicker : false };

// Load the arrow images
export const arrowImages = [];
for (let i = 1; i <= 10; i++) { 
    const image = new Image();
    image.src = `images/arrow${i}.png`;
    arrowImages.push(image);
}
// Arrow for collision detection
export const arrow = { hit: false };

// Perch
export const perch = { x: 50, update: function() {} };
export const perchY = canvas.height - 250;
export const perchWidth = 150;
export const perchHeight = 250;

// Dragon
export const dragon = {collided: false, alpha: 1, scale: 1, x: perch.x, y: perchY - 125, width: 150, height: 150, velocity: 0, update: function() {}};
export const dragonImages = [];
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= (i === 1 ? 4 : 3); j++) {
        const char = String.fromCharCode(96 + j);
        const image = new Image();
        image.src = `images/dragon${i}.png`;
        dragonImages.push(image);
    }
}

// Fading intro text
export const tapToFly = { alpha: 1 };

// End of game
export const frame = {current: 0}; // Corrected export
export const screenFade = { alpha: 0};
export const bg = {width: canvas.height * 4};

// Obstacles
export const obstacles = [];

//Background 
export const backgrounds = {
    bgbgX: 0,
    bgX: 0,
    fgX: 0,
    height: canvas.height  // Set backgrounds height match screen height
};

// Life Bar
export const lifeBar = { segments: 10 };

// Dimensions
export function updateDimensions() {
    // Update canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update background dimensions
    backgrounds.height = canvas.height;
    bg.width = canvas.height * 4;

    // Update dragon dimensions
    dragon.width = canvas.height * 0.075;  // 7.5% of canvas height
    dragon.height = canvas.height * 0.075; // 7.5% of canvas height

    // Update perch dimensions
    perchWidth = canvas.height * 0.075;  // 7.5% of canvas height
    perchHeight = canvas.height * 0.125; // 12.5% of canvas height
    perchY = canvas.height - perchHeight;

    // Update arrow dimensions
    arrow.width = canvas.height * 0.05;  // 5% of canvas height
    arrow.height = canvas.height * 0.05; // 5% of canvas height

    // Update lightning dimensions
    bolt.width = canvas.height * 0.1;  // 10% of canvas height
    bolt.height = canvas.height * 0.2; // 20% of canvas height

}


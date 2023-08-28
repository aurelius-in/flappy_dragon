// Import necessary modules and variables
import { bg, canvas, dragon, screenFade, backgrounds, resetGame } from './init.js';

// Initialize variables
let levelChangeTimer = 0;
let fadeOutTimer = 0;
let fadeInTimer = 0;

// Function to handle level ending and transition
export function handleLevelChange() {
  // Stop background movement
  backgrounds.fgX = backgrounds.fgX;
  backgrounds.bgX = backgrounds.bgX;
  backgrounds.bgbgX = backgrounds.bgbgX;

  // Animate the dragon to the center of the screen
  const targetX = canvas.width / 2 - dragon.width / 2;
  const targetY = canvas.height / 2 - dragon.height / 2;
  dragon.x += (targetX - dragon.x) * 0.05;
  dragon.y += (targetY - dragon.y) * 0.05;

  // Fade out and shrink the dragon
  dragon.alpha -= 0.005;
  dragon.scale -= 0.005;

  // Increment the level change timer
  levelChangeTimer += 1;

  // After 5 seconds, start fading out the screen
  if (levelChangeTimer >= 300) {
    screenFade.alpha += 0.01;
    fadeOutTimer += 1;
  }

  // After 3 more seconds, reset the game and start fading in
  if (fadeOutTimer >= 180) {
    resetGame();
    screenFade.alpha -= 0.01;
    fadeInTimer += 1;

    // Change backgrounds for the new level
    bg.src = 'path/to/fg2.png';
    backgrounds.bg = 'path/to/bg2.png';
    backgrounds.bgbg = 'path/to/bgbg2.png';
  }

  // After 2 more seconds, complete the transition
  if (fadeInTimer >= 120) {
    levelChangeTimer = 0;
    fadeOutTimer = 0;
    fadeInTimer = 0;
  }
}

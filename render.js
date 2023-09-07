import {
  bg,
  backgrounds,
  dragonImages,
  frame,
  obstacles,
  canvas,
  context,
  bgbgImage,
  bgImage,
  fgImage,
  perchImage,
  perchY,
  perchWidth,
  perchHeight,
  dragon,
  bolt,
  tapToFly,
  perch,
  lifeBar,
  screenFade
} from './init.js';

function screenFlicker() {
    if (bolt.flicker) {
        context.fillStyle = 'rgba(255, 255, 255, 0.5)';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Draw objects
  export function draw() {
    // Draw the furthest back background (bgbg)
    context.drawImage(bgbgImage, backgrounds.bgbgX, 0, bg.width, backgrounds.height);

    // Draw the middle background (bg)
    context.drawImage(bgImage, backgrounds.bgX, 0, bg.width, backgrounds.height);

    // Draw the closest background (fg)
    context.drawImage(fgImage, backgrounds.fgX, 0, bg.width, backgrounds.height);

    // Draw perch
    context.drawImage(perchImage, perch.x, perchY, perchWidth, perchHeight);

    // Drawing obstacles using functions from obstacles.js
    obstacles.forEach(obstacle => {
        obstacle.draw(context);
    });

    // Draw the dragon with scaling and fading
    context.save();
    context.globalAlpha = dragon.alpha;
    context.translate(dragon.x + dragon.width / 2, dragon.y + dragon.height / 2);
    context.scale(dragon.scale, dragon.scale);
    context.translate(-(dragon.x + dragon.width / 2), -(dragon.y + dragon.height / 2));
    context.drawImage(dragonImages[frame.current], dragon.x, dragon.y, dragon.width, dragon.height);
    context.restore();

 // Draw the life bar
for (let i = 0; i < lifeBar.segments; i++) {
  // Determine the color of the segment
  let color = 'green';
  if (lifeBar.segments <= 2) {
    color = 'red';
  }

  if (dragon.collided) {
  lifeBar.segments -= 1;
  context.fillStyle = 'red';
  context.fillRect(dragon.x - 5, dragon.y - 5, dragon.width + 10, dragon.height + 10);
}
 // Draw the segment
 context.fillStyle = color;
 context.fillRect(10 + i * 35, 10, 35, 30);
}
  // Draw the "TAP TO FLY!" text
if (tapToFly.alpha > 0) {
    context.fillStyle = `rgba(255, 255, 255, ${tapToFly.alpha})`; // White text with alpha for fading
    context.font = '40px sans-serif';
    context.textAlign = 'center';
    context.fillText('TAP TO FLY!', canvas.width / 2, canvas.height / 2);
}

   // Draw black fade overlay
    context.fillStyle = `rgba(0, 0, 0, ${screenFade.alpha})`;
    context.fillRect(0, 0, canvas.width, canvas.height);

    screenFlicker();
}



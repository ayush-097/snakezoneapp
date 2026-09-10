// Food class - port of web food.js for Skia rendering
import { ArrEmoji } from './constants';

export default class Food {
  constructor(gameState, size, x, y) {
    this.gameState = gameState;
    this.size = size;
    this.value = this.size;
    this.x = x;
    this.y = y;
    this.init();
  }

  init() {
    this.emoji = ArrEmoji[Math.floor(Math.random() * 99999) % ArrEmoji.length];
  }

  draw(canvas, paint, font, offsetX, offsetY, gameW, gameH, getSize) {
    if (this.isVisible(offsetX, offsetY, gameW, gameH, getSize)) {
      const visualSize = this.size * 2.0;
      const cx = this.x - offsetX;
      const cy = this.y - offsetY;

      // Draw emoji as text using Skia font
      if (font) {
        const fontSize = visualSize;
        canvas.drawText(this.emoji, cx - fontSize / 2, cy + fontSize / 3, paint, font);
      }
    }
  }

  isVisible(offsetX, offsetY, gameW, gameH, getSize) {
    const size3 = 3 * getSize;
    const dx = this.x - offsetX;
    if (dx < -size3 || dx > gameW + size3) return false;
    const dy = this.y - offsetY;
    if (dy < -size3 || dy > gameH + size3) return false;
    return true;
  }
}

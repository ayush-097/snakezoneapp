// Snake class - port of web snake.js for Skia rendering
import { Skia } from '@shopify/react-native-skia';
import { Nball } from './constants';
import Food from './Food';

const defaultPaint = Skia.Paint();

export default class Snake {
  constructor(name, gameState, score, x, y) {
    this.name = name;
    this.gameState = gameState;
    this.score = score;
    this.x = x;
    this.y = y;
    this.dropCounter = 0;
    this.minX = x;
    this.maxX = x;
    this.minY = y;
    this.maxY = y;
    this.init();
  }

  init() {
    this.time = Math.floor(20 + Math.random() * 100);
    this.speed = 1;
    this.size = this.gameState.getSize() * 1;
    this.angle = 0;
    this.dx = Math.random() * this.gameState.maxSpeed - Math.random() * this.gameState.maxSpeed;
    this.dy = Math.random() * this.gameState.maxSpeed - Math.random() * this.gameState.maxSpeed;

    this.v = [];
    for (let i = 0; i < 50; i++) {
      this.v[i] = { x: this.x, y: this.y };
    }

    // Image indices for Skia rendering
    this.headImageKey = 'transparent-face';
    this.bodyImageIndex = Math.floor(Math.random() * 999999) % Nball;
  }

  update() {
    this.time--;
    this.angle = this.getAngle(this.dx, this.dy);

    if (this.name !== 'Youhh') {
      if (this.time > 90) {
        this.speed = 2;
      } else {
        this.speed = 1;
      }

      if (this.time <= 0) {
        this.time = Math.floor(10 + Math.random() * 20);
        this.dx = Math.random() * this.gameState.maxSpeed - Math.random() * this.gameState.maxSpeed;
        this.dy = Math.random() * this.gameState.maxSpeed - Math.random() * this.gameState.maxSpeed;

        const gameW = this.gameState.gameW;
        const gameH = this.gameState.gameH;
        let minRange = Math.sqrt(gameW * gameW + gameH * gameH);

        const FOOD = this.gameState.food;
        for (let i = 0; i < FOOD.length; i++) {
          if (FOOD[i].size > this.gameState.getSize() / 10 && this.range(this.v[0], FOOD[i]) < minRange) {
            minRange = this.range(this.v[0], FOOD[i]);
            this.dx = FOOD[i].x - this.v[0].x;
            this.dy = FOOD[i].y - this.v[0].y;
          }
        }

        if (minRange < Math.sqrt(gameW * gameW + gameH * gameH)) {
          this.time = 0;
        }

        while (
          Math.abs(this.dy) * Math.abs(this.dy) + Math.abs(this.dx) * Math.abs(this.dx) >
            this.gameState.maxSpeed * this.gameState.maxSpeed &&
          this.dx * this.dy !== 0
        ) {
          this.dx /= 1.1;
          this.dy /= 1.1;
        }
        while (
          Math.abs(this.dy) * Math.abs(this.dy) + Math.abs(this.dx) * Math.abs(this.dx) <
            this.gameState.maxSpeed * this.gameState.maxSpeed &&
          this.dx * this.dy !== 0
        ) {
          this.dx *= 1.1;
          this.dy *= 1.1;
        }
      }
      this.score += this.score / 666;
    }

    this.v[0].x += this.dx * this.speed;
    this.v[0].y += this.dy * this.speed;

    let targetDist = this.size / 5;
    if (this.speed === 2) {
      targetDist = this.size / 7.5;
    }

    this.minX = this.v[0].x;
    this.maxX = this.v[0].x;
    this.minY = this.v[0].y;
    this.maxY = this.v[0].y;

    for (let i = 1; i < this.v.length; i++) {
      const dist = this.range(this.v[i], this.v[i - 1]);
      if (dist > targetDist) {
        const ratio = targetDist / (dist || 0.001);
        this.v[i].x = this.v[i - 1].x + (this.v[i].x - this.v[i - 1].x) * ratio;
        this.v[i].y = this.v[i - 1].y + (this.v[i].y - this.v[i - 1].y) * ratio;
      }
      if (this.v[i].x < this.minX) this.minX = this.v[i].x;
      if (this.v[i].x > this.maxX) this.maxX = this.v[i].x;
      if (this.v[i].y < this.minY) this.minY = this.v[i].y;
      if (this.v[i].y > this.maxY) this.maxY = this.v[i].y;
    }

    if (this.speed === 2 && this.score > 100) {
      const lostVal = Math.max(0.5, this.score / 200);
      this.score -= lostVal;

      this.dropCounter = (this.dropCounter || 0) + 1;
      if (this.dropCounter >= 5) {
        this.dropCounter = 0;
        const tail = this.v[this.v.length - 1];
        if (tail && this.gameState.food) {
          const idx = this.gameState.foodIndex;
          this.gameState.food[idx] = new Food(
            this.gameState,
            this.gameState.getSize() / 10,
            tail.x,
            tail.y
          );
          this.gameState.food[idx].value = lostVal * 5;
          this.gameState.foodIndex++;
          if (this.gameState.foodIndex >= this.gameState.food.length) {
            this.gameState.foodIndex = 0;
          }
        }
      }
    }

    const displayScore = Math.max(100, this.score);
    const csUp = Math.pow(displayScore / 1000, 1 / 5);
    this.size = (this.gameState.getSize() / 2) * csUp;
    const N = 3 * Math.floor(50 * Math.pow(displayScore / 1000, 1 / 1));
    if (N > this.v.length) {
      this.v[this.v.length] = {
        x: this.v[this.v.length - 1].x,
        y: this.v[this.v.length - 1].y,
      };
    } else {
      this.v = this.v.slice(0, N);
    }
  }

  getDrawData(images, offsetX, offsetY) {
    this.update();

    const bodyImg = images && images.body ? images.body[this.bodyImageIndex % images.body.length] : null;
    const headImg = images ? images[this.headImageKey] : null;
    const segments = [];

    // Body segments (back to front)
    if (bodyImg) {
      for (let i = this.v.length - 1; i >= 1; i--) {
        if (this.isVisible(this.v[i].x, this.v[i].y, offsetX, offsetY)) {
          const sx = this.v[i].x - offsetX - this.size / 2;
          const sy = this.v[i].y - offsetY - this.size / 2;
          segments.push({
            img: bodyImg,
            x: sx,
            y: sy,
            size: this.size,
            isHead: false,
          });
        }
      }
    }

    // Head segment
    if (headImg) {
      const cx = this.v[0].x - offsetX;
      const cy = this.v[0].y - offsetY;
      segments.push({
        img: headImg,
        x: cx - this.size / 2,
        y: cy - this.size / 2,
        cx,
        cy,
        size: this.size,
        angle: this.angle,
        isHead: true,
      });
    }

    return segments;
  }

  draw(canvas, images, offsetX, offsetY) {
    this.update();

    const bodyImg = images.body[this.bodyImageIndex];
    const headImg = images[this.headImageKey];

    // Draw body segments (back to front)
    if (bodyImg) {
      for (let i = this.v.length - 1; i >= 1; i--) {
        if (this.isVisible(this.v[i].x, this.v[i].y, offsetX, offsetY)) {
          const sx = this.v[i].x - offsetX - this.size / 2;
          const sy = this.v[i].y - offsetY - this.size / 2;
          canvas.drawImageRect(
            bodyImg,
            Skia.XYWHRect(0, 0, bodyImg.width(), bodyImg.height()),
            Skia.XYWHRect(sx, sy, this.size, this.size),
            defaultPaint
          );
        }
      }
    }

    // Draw head with rotation
    if (headImg) {
      canvas.save();
      canvas.translate(this.v[0].x - offsetX, this.v[0].y - offsetY);
      canvas.rotate((this.angle - Math.PI / 2) * (180 / Math.PI)); // Skia uses degrees
      canvas.drawImageRect(
        headImg,
        Skia.XYWHRect(0, 0, headImg.width(), headImg.height()),
        Skia.XYWHRect(-this.size / 2, -this.size / 2, this.size, this.size),
        defaultPaint
      );
      canvas.restore();
    }
  }

  isVisible(x, y, offsetX, offsetY) {
    const size3 = 3 * this.gameState.getSize();
    const dx = x - offsetX;
    if (dx < -size3 || dx > this.gameState.gameW + size3) return false;
    const dy = y - offsetY;
    if (dy < -size3 || dy > this.gameState.gameH + size3) return false;
    return true;
  }

  getAngle(a, b) {
    const c = Math.sqrt(a * a + b * b);
    let al = Math.acos(a / c);
    if (b < 0) al += 2 * (Math.PI - al);
    return al;
  }

  range(v1, v2) {
    return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
  }
}

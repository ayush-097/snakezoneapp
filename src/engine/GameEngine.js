// GameEngine - port of web game.js core logic
// Manages game state, physics, collision detection, and the game loop
import Food from './Food';
import Snake from './Snake';
import {
  N_FOOD,
  N_SNAKE,
  SIZE_MAP,
  MIN_SCORE,
  NAMES,
  computeBaseSize,
} from './constants';

export default class GameEngine {
  constructor(width, height) {
    this.gameW = width;
    this.gameH = height;
    this.currentSize = computeBaseSize(width, height);
    this.maxSpeed = this.currentSize / 7;

    // Camera offset
    this.offsetX = 0;
    this.offsetY = 0;

    // Direction input
    this.chX = 1;
    this.chY = 1;

    // Background scroll
    this.xFocus = 0;
    this.yFocus = 0;

    // State
    this.die = false;
    this.finalScore = 0;
    this.finalRank = 1;
    this.foodIndex = 0;
    this.domUpdateCounter = 0;

    // Entities
    this.snakes = [];
    this.food = [];

    // Score tracking for UI
    this.playerScore = MIN_SCORE;
    this.playerRank = 1;
    this.leaderboard = [];

    // Callbacks
    this.onDie = null;
    this.onScoreUpdate = null;

    this.initEntities();
  }

  initEntities() {
    // Create AI snakes
    for (let i = 0; i < N_SNAKE; i++) {
      this.snakes[i] = new Snake(
        NAMES[Math.floor(Math.random() * 99999) % NAMES.length],
        this,
        Math.floor(2 * MIN_SCORE + Math.random() * 2 * MIN_SCORE),
        (Math.random() - Math.random()) * SIZE_MAP,
        (Math.random() - Math.random()) * SIZE_MAP
      );
    }

    // Player snake (index 0)
    this.snakes[0] = new Snake('Youhh', this, MIN_SCORE, this.gameW / 2, this.gameH / 2);

    // Create food
    for (let i = 0; i < N_FOOD; i++) {
      this.food[i] = new Food(
        this,
        this.getSize() / (7 + Math.random() * 10),
        (Math.random() - Math.random()) * SIZE_MAP,
        (Math.random() - Math.random()) * SIZE_MAP
      );
    }
  }

  getSize() {
    return this.currentSize;
  }

  setDirection(dx, dy) {
    this.chX = dx;
    this.chY = dy;
  }

  setBoost(boosting) {
    if (this.snakes[0]) {
      this.snakes[0].speed = boosting ? 2 : 1;
    }
  }

  update() {
    if (this.die) return;

    this.unFood();
    this.changeFood();
    this.changeSnake();
    this.updateChXY();
    this.checkDie();

    if (this.snakes[0]) {
      this.snakes[0].dx = this.chX;
      this.snakes[0].dy = this.chY;
      this.offsetX += this.chX * this.snakes[0].speed;
      this.offsetY += this.chY * this.snakes[0].speed;
      this.snakes[0].v[0].x = this.offsetX + this.gameW / 2;
      this.snakes[0].v[0].y = this.offsetY + this.gameH / 2;
    }

    // Update score display (throttled)
    this.domUpdateCounter++;
    if (this.domUpdateCounter >= 10) {
      this.domUpdateCounter = 0;
      this.updateScoreData();
    }
  }

  updateChXY() {
    while (
      Math.abs(this.chY) * Math.abs(this.chY) + Math.abs(this.chX) * Math.abs(this.chX) >
        this.maxSpeed * this.maxSpeed &&
      this.chY * this.chX !== 0
    ) {
      this.chX /= 1.1;
      this.chY /= 1.1;
    }
    while (
      Math.abs(this.chY) * Math.abs(this.chY) + Math.abs(this.chX) * Math.abs(this.chX) <
        this.maxSpeed * this.maxSpeed &&
      this.chY * this.chX !== 0
    ) {
      this.chX *= 1.1;
      this.chY *= 1.1;
    }

    if (this.snakes[0]) {
      this.xFocus += 1.5 * this.chX * this.snakes[0].speed;
      this.yFocus += 1.5 * this.chY * this.snakes[0].speed;

      // Wrap background focus (use constants since we don't have bg_im dimensions)
      const bgW = 2048; // approximate background tile width
      const bgH = 2048;
      if (this.xFocus < 0) this.xFocus = bgW / 2 + 22;
      if (this.xFocus > bgW / 2 + 22) this.xFocus = 0;
      if (this.yFocus < 0) this.yFocus = bgH / 2 + 60;
      if (this.yFocus > bgH / 2 + 60) this.yFocus = 0;
    }
  }

  changeFood() {
    if (!this.snakes[0]) return;
    const head = this.snakes[0].v[0];
    const sizeMapSq = SIZE_MAP * SIZE_MAP;
    for (let i = 0; i < this.food.length; i++) {
      const dx = head.x - this.food[i].x;
      const dy = head.y - this.food[i].y;
      if (dx * dx + dy * dy > sizeMapSq) {
        this.food[i] = new Food(
          this,
          this.getSize() / (10 + Math.random() * 10),
          (Math.random() - Math.random()) * SIZE_MAP + head.x,
          (Math.random() - Math.random()) * SIZE_MAP + head.y
        );
      }
    }
  }

  changeSnake() {
    if (!this.snakes[0]) return;
    const head = this.snakes[0].v[0];
    const sizeMapSq = SIZE_MAP * SIZE_MAP;
    for (let i = 0; i < this.snakes.length; i++) {
      const dx = head.x - this.snakes[i].v[0].x;
      const dy = head.y - this.snakes[i].v[0].y;
      if (dx * dx + dy * dy > sizeMapSq) {
        this.snakes[i].v[0].x = (head.x + this.snakes[i].v[0].x) / 2;
        this.snakes[i].v[0].y = (head.y + this.snakes[i].v[0].y) / 2;
      }
    }
  }

  unFood() {
    if (this.snakes.length <= 0) return;
    for (let i = 0; i < this.snakes.length; i++) {
      const head = this.snakes[i].v[0];
      const limit = 1.5 * this.snakes[i].size;
      const limitSq = limit * limit;
      for (let j = 0; j < this.food.length; j++) {
        const f = this.food[j];
        const dx = head.x - f.x;
        if (Math.abs(dx) < limit) {
          const dy = head.y - f.y;
          if (Math.abs(dy) < limit) {
            if (dx * dx + dy * dy < limitSq) {
              this.snakes[i].score += Math.floor(f.value);
              this.food[j] = new Food(
                this,
                this.getSize() / (5 + Math.random() * 10),
                (Math.random() - Math.random()) * 5000 + this.offsetX,
                (Math.random() - Math.random()) * 5000 + this.offsetY
              );
            }
          }
        }
      }
    }
  }

  checkDie() {
    for (let i = 0; i < this.snakes.length; i++) {
      const headX = this.snakes[i].v[0].x;
      const headY = this.snakes[i].v[0].y;
      const headSize = this.snakes[i].size;
      const headSizeSq = headSize * headSize;

      for (let j = 0; j < this.snakes.length; j++) {
        if (i !== j) {
          let kt = true;
          const otherSnake = this.snakes[j];

          // Bounding box check
          const dxB = headX - (otherSnake.minX + otherSnake.maxX) / 2;
          const dyB = headY - (otherSnake.minY + otherSnake.maxY) / 2;
          const widthB = (otherSnake.maxX - otherSnake.minX) / 2 + headSize;
          const heightB = (otherSnake.maxY - otherSnake.minY) / 2 + headSize;

          if (Math.abs(dxB) > widthB || Math.abs(dyB) > heightB) {
            continue;
          }

          for (let k = 0; k < otherSnake.v.length; k++) {
            const seg = otherSnake.v[k];
            const dx = headX - seg.x;
            if (Math.abs(dx) < headSize) {
              const dy = headY - seg.y;
              if (Math.abs(dy) < headSize) {
                if (dx * dx + dy * dy < headSizeSq) {
                  kt = false;
                  break;
                }
              }
            }
          }

          if (!kt) {
            // Drop food from dead snake
            for (let k = 0; k < this.snakes[i].v.length; k += 5) {
              this.food[this.foodIndex] = new Food(
                this,
                this.getSize() / (2 + Math.random() * 2),
                this.snakes[i].v[k].x + (Math.random() * this.snakes[i].size) / 2,
                this.snakes[i].v[k].y + (Math.random() * this.snakes[i].size) / 2
              );
              this.food[this.foodIndex].value =
                (0.4 * this.snakes[i].score) / (this.snakes[i].v.length / 5);
              this.foodIndex++;
              if (this.foodIndex >= this.food.length) this.foodIndex = 0;
            }

            if (i !== 0) {
              // Respawn AI snake
              this.snakes[i] = new Snake(
                NAMES[Math.floor(Math.random() * 99999) % NAMES.length],
                this,
                Math.max(
                  Math.floor(
                    this.snakes[0].score > 10 * MIN_SCORE
                      ? this.snakes[0].score / 10
                      : MIN_SCORE
                  ),
                  this.snakes[i].score / 10
                ),
                this.randomXY(this.offsetX),
                this.randomXY(this.offsetY)
              );
            } else {
              // Player died
              this.die = true;
              this.finalScore = Math.floor(this.snakes[i].score);

              let rank = 1;
              for (let r = 0; r < this.snakes.length; r++) {
                if (r !== i && this.snakes[r].score > this.snakes[i].score) rank++;
              }
              this.finalRank = rank;

              if (this.onDie) {
                this.onDie(this.finalScore, this.finalRank);
              }
            }
            break;
          }
        }
      }
    }
  }

  updateScoreData() {
    if (!this.snakes[0]) return;

    // Sort snakes by score
    const data = [...this.snakes].sort((a, b) => b.score - a.score);

    let playerIndex = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].name === 'Youhh') {
        playerIndex = i;
        break;
      }
    }

    this.playerScore = Math.floor(this.snakes[0].score);
    this.playerRank = playerIndex + 1;

    // Build leaderboard (top 5 for mobile)
    const limit = 5;
    this.leaderboard = [];
    for (let i = 0; i < Math.min(limit, data.length); i++) {
      this.leaderboard.push({
        rank: i + 1,
        name: data[i].name,
        score: Math.floor(data[i].score),
        isPlayer: data[i].name === 'Youhh',
      });
    }

    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.playerScore, this.playerRank, this.leaderboard);
    }
  }

  randomXY(n) {
    let ans = 0;
    while (Math.abs(ans) < 1) {
      ans = 3 * Math.random() - 3 * Math.random();
    }
    return ans * SIZE_MAP + n;
  }

  reset() {
    this.die = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.chX = 1;
    this.chY = 1;
    this.xFocus = 0;
    this.yFocus = 0;
    this.foodIndex = 0;
    this.domUpdateCounter = 0;
    this.finalScore = 0;
    this.finalRank = 1;
    this.snakes = [];
    this.food = [];
    this.initEntities();
  }
}

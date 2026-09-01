// BISCOIDINO Running Game - Endless runner with dinosaur sprite
// Uses the 3 frames (idle, walk1, walk2) for sprite animation,
// cookie sprites for obstacles/collectibles, and a scrolling background.

interface GameSprite {
  image: HTMLImageElement;
  loaded: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cookie';
  sprite: HTMLImageElement;
  collected: boolean;
}

export class RunningGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private container: HTMLElement;

  // Game state
  private running = false;
  private gameOver = false;
  private score = 0;
  private highScore = 0;
  private frameCount = 0;
  private speed = 3;

  // Dinosaur
  private dinosaur = {
    x: 80,
    y: 0,
    width: 60,
    height: 60,
    vy: 0,
    grounded: true,
    jumpPower: -10,
    gravity: 0.5,
    frame: 0,       // 0=idle, 1=walk1, 2=walk2
    frameTimer: 0,
    frameInterval: 8,
  };

  // Sprites
  private idleSprite: GameSprite = { image: new Image(), loaded: false };
  private walk1Sprite: GameSprite = { image: new Image(), loaded: false };
  private walk2Sprite: GameSprite = { image: new Image(), loaded: false };
  private cookieSprites: HTMLImageElement[] = [];

  // World
  private obstacles: Obstacle[] = [];
  private groundY = 0;
  private groundScrollX = 0;
  private canvasWidth = 0;
  private canvasHeight = 0;

  // Background decoration
  private clouds: { x: number; y: number; size: number; speed: number }[] = [];
  private groundTiles: { x: number }[] = [];
  private readonly GROUND_COLOR = '#DEB887';
  private readonly SKY_COLOR_TOP = '#87CEEB';
  private readonly SKY_COLOR_BOTTOM = '#E0F0FF';

  // Cookie spawn
  private spawnTimer = 0;
  private readonly SPAWN_INTERVAL = 80; // frames between cookie spawns
  private readonly COOKIE_SIZE = 30;

  // Callbacks
  onGameOver: ((score: number) => void) | null = null;
  onScoreChange: ((score: number) => void) | null = null;

  constructor(canvas: HTMLCanvasElement, container: HTMLElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.container = container;
    this.resize();
  }

  async loadAssets(): Promise<void> {
    const base = '/frames/';
    const images = [
      { key: 'idle', path: base + 'biscoidino_idle.png', target: this.idleSprite },
      { key: 'walk1', path: base + 'biscoidino_walk1.png', target: this.walk1Sprite },
      { key: 'walk2', path: base + 'biscoidino_walk2.png', target: this.walk2Sprite },
    ];

    const loads = images.map((img) => {
      return new Promise<void>((resolve) => {
        img.target.image.onload = () => {
          img.target.loaded = true;
          resolve();
        };
        img.target.image.onerror = () => {
          console.warn(`Failed to load ${img.key} sprite, using fallback`);
          resolve();
        };
        img.target.image.src = img.path;
      });
    });

    // Load cookie sprites
    const cookiePaths = [
      '/biscuits/biscoidino_biscuit1.png',
      '/biscuits/heart_baunilha1.png',
      '/biscuits/star_baunilha1.png',
      '/biscuits/flower_baunilha1.png',
    ];

    const cookieLoads = cookiePaths.map((path) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          this.cookieSprites.push(img);
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
        img.src = path;
      });
    });

    await Promise.all([...loads, ...cookieLoads]);
  }

  start(): void {
    if (this.running) return;

    this.resize();
    this.reset();
    this.running = true;
    this.gameOver = false;
    this.frameCount = 0;
    this.createClouds();
    this.createGroundTiles();
    this.loop();
  }

  stop(): void {
    this.running = false;
  }

  reset(): void {
    this.score = 0;
    this.obstacles = [];
    this.spawnTimer = 0;
    this.groundScrollX = 0;
    this.speed = 3;
    this.dinosaur.y = 0;
    this.dinosaur.vy = 0;
    this.dinosaur.grounded = true;
    this.dinosaur.frame = 0;
    this.dinosaur.frameTimer = 0;
  }

  jump(): void {
    if (!this.running || this.gameOver) {
      if (this.gameOver) {
        this.restart();
      }
      return;
    }
    if (this.dinosaur.grounded) {
      this.dinosaur.vy = this.dinosaur.jumpPower;
      this.dinosaur.grounded = false;
    }
  }

  restart(): void {
    this.reset();
    this.gameOver = false;
    this.createClouds();
    this.createGroundTiles();
  }

  private resize(): void {
    const rect = this.container.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;

    this.canvas.width = rect.width * pixelRatio;
    this.canvas.height = rect.height * pixelRatio;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';

    this.canvasWidth = rect.width;
    this.canvasHeight = rect.height;
    this.groundY = this.canvasHeight - 80;

    // Resize dinosaur
    this.dinosaur.width = Math.min(60, this.canvasWidth * 0.1);
    this.dinosaur.height = this.dinosaur.width;
    this.dinosaur.y = this.groundY - this.dinosaur.height;
  }

  private createClouds(): void {
    this.clouds = [];
    for (let i = 0; i < 5; i++) {
      this.clouds.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * (this.canvasHeight * 0.4),
        size: 30 + Math.random() * 50,
        speed: 0.2 + Math.random() * 0.3,
      });
    }
  }

  private createGroundTiles(): void {
    this.groundTiles = [];
    const tileWidth = 40;
    const count = Math.ceil(this.canvasWidth / tileWidth) + 4;
    for (let i = 0; i < count; i++) {
      this.groundTiles.push({ x: i * tileWidth });
    }
  }

  private loop = (): void => {
    if (!this.running) return;

    this.update();
    this.render();

    requestAnimationFrame(this.loop);
  };

  private update(): void {
    this.frameCount++;

    // Speed increases gradually
    this.speed = 3 + Math.min(this.score / 100, 5);

    // Update dinosaur physics
    if (!this.gameOver) {
      // Gravity
      this.dinosaur.vy += this.dinosaur.gravity;
      this.dinosaur.y += this.dinosaur.vy;

      // Ground collision
      const groundLevel = this.groundY - this.dinosaur.height;
      if (this.dinosaur.y >= groundLevel) {
        this.dinosaur.y = groundLevel;
        this.dinosaur.vy = 0;
        this.dinosaur.grounded = true;
      }

      // Sprite animation - only animate when grounded (running)
      if (this.dinosaur.grounded) {
        this.dinosaur.frameTimer++;
        if (this.dinosaur.frameTimer >= this.dinosaur.frameInterval) {
          this.dinosaur.frameTimer = 0;
          this.dinosaur.frame = (this.dinosaur.frame + 1) % 3;
          if (this.dinosaur.frame === 0) this.dinosaur.frame = 1; // skip idle while running (1,2,1,2...)
        }
      } else {
        // Use idle frame while in air
        this.dinosaur.frame = 0;
      }

      // Scroll ground
      this.groundScrollX -= this.speed;
      for (const tile of this.groundTiles) {
        tile.x += this.groundScrollX;
      }
      // Reset ground tiles that scrolled off
      const tileWidth = 40;
      for (const tile of this.groundTiles) {
        if (tile.x + tileWidth < 0) {
          tile.x += this.groundTiles.length * tileWidth;
        }
      }

      // Update clouds
      for (const cloud of this.clouds) {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.size < 0) {
          cloud.x = this.canvasWidth + cloud.size;
          cloud.y = Math.random() * (this.canvasHeight * 0.4);
        }
      }

      // Spawn cookies
      this.spawnTimer++;
      if (this.spawnTimer >= this.SPAWN_INTERVAL) {
        this.spawnTimer = 0;
        this.spawnCookie();
      }

      // Move obstacles
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const obs = this.obstacles[i];
        obs.x -= this.speed;

        // Remove off-screen obstacles
        if (obs.x + obs.width < 0) {
          this.obstacles.splice(i, 1);
          continue;
        }

        // Check collection (cookie collected = good)
        if (!obs.collected && this.checkCollision(obs)) {
          obs.collected = true;
          this.score += 10;
          this.onScoreChange?.(this.score);
        }
      }

      // Spawn interval decreases over time (gets harder)
      this.spawnTimer = Math.min(this.spawnTimer, Math.floor(this.SPAWN_INTERVAL * 0.6));
    }
  }

  private spawnCookie(): void {
    if (this.cookieSprites.length === 0) return;

    const sprite = this.cookieSprites[Math.floor(Math.random() * this.cookieSprites.length)];
    if (!sprite) return;

    const yBase = this.groundY - 10;
    const yOffset = -Math.random() * 70; // float above ground
    const size = this.COOKIE_SIZE;

    this.obstacles.push({
      x: this.canvasWidth + 20,
      y: yBase + yOffset,
      width: size,
      height: size,
      type: 'cookie',
      sprite,
      collected: false,
    });
  }

  private checkCollision(obs: Obstacle): boolean {
    const dino = this.dinosaur;
    const margin = 10; // forgiveness margin
    return (
      obs.x + margin < dino.x + dino.width - margin &&
      obs.x + obs.width - margin > dino.x + margin &&
      obs.y + margin < dino.y + dino.height - margin &&
      obs.y + obs.height - margin > dino.y + margin
    );
  }

  private render(): void {
    const ctx = this.ctx;
    const w = this.canvasWidth;
    const h = this.canvasHeight;

    // Clear
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Scale context back to display coordinates
    ctx.save();
    const pr = window.devicePixelRatio || 1;
    ctx.scale(pr, pr);

    // Sky gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, this.SKY_COLOR_TOP);
    gradient.addColorStop(1, this.SKY_COLOR_BOTTOM);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (const cloud of this.clouds) {
      ctx.beginPath();
      ctx.ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cloud.x - cloud.size * 0.4, cloud.y + 5, cloud.size * 0.6, cloud.size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cloud.x + cloud.size * 0.4, cloud.y + 3, cloud.size * 0.5, cloud.size * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ground
    ctx.fillStyle = this.GROUND_COLOR;
    ctx.fillRect(0, this.groundY, w, h - this.groundY);

    // Ground line
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(0, this.groundY, w, 3);

    // Ground tiles pattern
    ctx.strokeStyle = 'rgba(160, 82, 45, 0.2)';
    ctx.lineWidth = 1;
    for (const tile of this.groundTiles) {
      ctx.strokeRect(tile.x, this.groundY + 5, 40, 20);
    }

    // Cookies (obstacles)
    for (const obs of this.obstacles) {
      if (obs.collected) continue;

      ctx.save();
      // Shadow
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 2;

      if (obs.sprite.complete && obs.sprite.naturalWidth > 0) {
        ctx.drawImage(obs.sprite, obs.x, obs.y, obs.width, obs.height);
      } else {
        // Fallback: draw a circle
        ctx.fillStyle = '#D2691E';
        ctx.beginPath();
        ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
        ctx.fill();
        // "C" marking
        ctx.fillStyle = '#FFF';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🍪', obs.x + obs.width / 2, obs.y + obs.height / 2);
      }
      ctx.restore();
    }

    // Dinosaur
    ctx.save();
    // Shadow under dinosaur
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(
      this.dinosaur.x + this.dinosaur.width / 2,
      this.dinosaur.grounded ? this.groundY + 2 : this.groundY + 5,
      this.dinosaur.width * 0.35,
      4,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw the sprite
    const dino = this.dinosaur;
    const sprite = this.getCurrentSprite();

    if (sprite && sprite.loaded) {
      const img = sprite.image;
      // Maintain aspect ratio
      const scale = Math.min(dino.width / img.naturalWidth, dino.height / img.naturalHeight);
      const sw = img.naturalWidth * scale;
      const sh = img.naturalHeight * scale;
      const sx = dino.x + (dino.width - sw) / 2;
      const sy = dino.y + (dino.height - sh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh);
    } else {
      // Fallback drawing
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
      // Eye
      ctx.fillStyle = '#FFF';
      ctx.fillRect(dino.x + dino.width * 0.65, dino.y + dino.height * 0.2, 6, 6);
      ctx.fillStyle = '#000';
      ctx.fillRect(dino.x + dino.width * 0.7, dino.y + dino.height * 0.25, 3, 3);
      // Mouth
      ctx.fillStyle = '#FFF';
      ctx.fillRect(dino.x + dino.width * 0.6, dino.y + dino.height * 0.6, dino.width * 0.3, 3);
    }
    ctx.restore();

    // Score
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(w - 140, 10, 130, 35);
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 18px "M PLUS Rounded 1c", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🍪 ${this.score}`, w - 20, 28);

    // High score
    if (this.highScore > 0) {
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(w - 140, 48, 130, 24);
      ctx.fillStyle = '#FFD700';
      ctx.font = '12px "M PLUS Rounded 1c", sans-serif';
      ctx.fillText(`Best: ${this.highScore}`, w - 20, 60);
    }

    // Game over overlay
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 36px "M PLUS Rounded 1c", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GAME OVER', w / 2, h / 2 - 40);

      ctx.font = '18px "M PLUS Rounded 1c", sans-serif';
      ctx.fillText(`Score: ${this.score}`, w / 2, h / 2 + 10);

      if (this.score >= this.highScore && this.score > 0) {
        ctx.fillStyle = '#FFD700';
        ctx.font = '14px "M PLUS Rounded 1c", sans-serif';
        ctx.fillText('🏆 NEW HIGH SCORE!', w / 2, h / 2 + 40);
      }

      ctx.fillStyle = '#B0E0E6';
      ctx.font = '16px "M PLUS Rounded 1c", sans-serif';
      ctx.fillText('Press SPACE or tap to restart', w / 2, h / 2 + 75);
    }

    // Instructions (first few frames)
    if (this.frameCount < 120 && !this.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(w / 2 - 100, h / 2 - 50, 200, 40);
      ctx.fillStyle = '#FFF';
      ctx.font = '14px "M PLUS Rounded 1c", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Press SPACE or tap to jump!', w / 2, h / 2 - 30);
    }

    ctx.restore();
  }

  private getCurrentSprite(): GameSprite | null {
    if (this.dinosaur.grounded) {
      if (this.dinosaur.frame === 1) return this.walk1Sprite;
      if (this.dinosaur.frame === 2) return this.walk2Sprite;
      return this.idleSprite;
    }
    return this.idleSprite;
  }

  triggerGameOver(): void {
    this.gameOver = true;
    this.dinosaur.frame = 0; // idle on game over
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
    this.onGameOver?.(this.score);
  }
}
// Renderizador do jogo do dino: desenha o GameState no canvas em coordenadas lógicas
import type { GameState } from './engine';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GROUND_Y,
  DINO_X,
  DINO_WIDTH,
  DINO_HEIGHT,
  BISCUIT_SIZE_FACTOR,
  BISCUIT_TEXTURES,
  DINO_FRAMES,
  getDinoFrame
} from './engine';
import type { DinoFrame } from './engine';
import { getBiscuitConfig } from '../data/biscuitConfig';

export interface GameImages {
  idle: HTMLImageElement;
  walk1: HTMLImageElement;
  walk2: HTMLImageElement;
  biscuits: Record<string, HTMLImageElement>;
}

// Área opaca de cada PNG (medida nos arquivos), em fração do tamanho da imagem.
// idle é 1440×1440 com muita margem; walk1/walk2 são 500×500 quase cheios.
// Recortando só o corpo, os três frames ficam do mesmo tamanho e com os pés no chão.
const FRAME_CROP: Record<DinoFrame, { x: number; y: number; w: number; h: number }> = {
  idle: { x: 40 / 1440, y: 156 / 1440, w: 1190 / 1440, h: 1244 / 1440 },
  walk1: { x: 0 / 500, y: 53 / 500, w: 430 / 500, h: 447 / 500 },
  walk2: { x: 5 / 500, y: 49 / 500, w: 426 / 500, h: 444 / 500 }
};

const COLORS = {
  skyTop: '#ffe3e7',
  skyBottom: '#FFF8DC',
  cloud: 'rgba(255, 255, 255, 0.9)',
  hill: '#ffd6dc',
  ground: '#DEB887',
  groundLine: '#CD853F',
  grain: 'rgba(205, 133, 63, 0.55)',
  shadow: 'rgba(47, 47, 47, 0.18)'
};

const CLOUDS = [
  { x: 120, y: 60, s: 1 },
  { x: 420, y: 95, s: 0.7 },
  { x: 690, y: 50, s: 0.85 }
];

const HILLS = [
  { x: 80, r: 90 },
  { x: 380, r: 120 },
  { x: 650, r: 80 }
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    // Resolve mesmo com erro para o jogo não travar; o render pula imagens quebradas
    img.onerror = () => resolve(img);
    img.src = src;
  });
}

export async function loadGameImages(): Promise<GameImages> {
  const [idle, walk1, walk2, ...biscuitImgs] = await Promise.all([
    loadImage(DINO_FRAMES.idle),
    loadImage(DINO_FRAMES.walk1),
    loadImage(DINO_FRAMES.walk2),
    ...BISCUIT_TEXTURES.map(loadImage)
  ]);
  const biscuits: Record<string, HTMLImageElement> = {};
  BISCUIT_TEXTURES.forEach((t, i) => {
    biscuits[t] = biscuitImgs[i];
  });
  return { idle, walk1, walk2, biscuits };
}

function isReady(img: HTMLImageElement | undefined): img is HTMLImageElement {
  return !!img && img.complete && img.naturalWidth > 0;
}

// Posição x em loop para elementos de cenário em parallax, sem estado extra
function wrapX(baseX: number, offset: number, span: number): number {
  return ((((baseX - offset) % span) + span) % span) - (span - GAME_WIDTH) / 2;
}

function drawSky(ctx: CanvasRenderingContext2D): void {
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  sky.addColorStop(0, COLORS.skyTop);
  sky.addColorStop(1, COLORS.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, GAME_WIDTH, GROUND_Y);
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
  ctx.beginPath();
  ctx.arc(x, y, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 22 * s, y - 10 * s, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 46 * s, y, 18 * s, 0, Math.PI * 2);
  ctx.rect(x, y, 46 * s, 18 * s);
  ctx.fill();
}

function drawScenery(ctx: CanvasRenderingContext2D, distance: number): void {
  ctx.save();

  ctx.fillStyle = COLORS.cloud;
  const cloudSpan = GAME_WIDTH + 200;
  for (const c of CLOUDS) {
    drawCloud(ctx, wrapX(c.x, distance * 0.1, cloudSpan), c.y, c.s);
  }

  ctx.fillStyle = COLORS.hill;
  const hillSpan = GAME_WIDTH + 300;
  for (const h of HILLS) {
    ctx.beginPath();
    ctx.arc(wrapX(h.x, distance * 0.3, hillSpan), GROUND_Y + h.r * 0.45, h.r, Math.PI, 0);
    ctx.fill();
  }

  ctx.restore();
}

function drawGround(ctx: CanvasRenderingContext2D, distance: number): void {
  ctx.save();
  ctx.fillStyle = COLORS.ground;
  ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);

  ctx.strokeStyle = COLORS.groundLine;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(GAME_WIDTH, GROUND_Y);
  ctx.stroke();

  // Granulado do chão anda na mesma velocidade dos biscoitos
  ctx.fillStyle = COLORS.grain;
  const spacing = 40;
  const offset = distance % spacing;
  for (let i = 0; i <= GAME_WIDTH / spacing + 1; i++) {
    const x = i * spacing - offset;
    ctx.fillRect(x, GROUND_Y + 10, 8, 3);
    ctx.fillRect(x + 22, GROUND_Y + 24, 5, 3);
  }
  ctx.restore();
}

function drawBiscuits(ctx: CanvasRenderingContext2D, state: GameState, images: GameImages): void {
  for (const b of state.biscuits) {
    const img = images.biscuits[b.texture];
    if (!isReady(img)) continue;
    const scale = getBiscuitConfig(b.texture).scale * BISCUIT_SIZE_FACTOR;
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }
}

function drawDino(ctx: CanvasRenderingContext2D, state: GameState, images: GameImages): void {
  // Sombra encolhe conforme o dino sobe
  const lift = Math.max(0, GROUND_Y - DINO_HEIGHT - state.dino.y);
  const f = Math.max(0.35, 1 - lift / 160);
  ctx.save();
  ctx.fillStyle = COLORS.shadow;
  ctx.beginPath();
  ctx.ellipse(DINO_X + DINO_WIDTH / 2, GROUND_Y + 2, (DINO_WIDTH / 2.6) * f, 6 * f, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const frame = getDinoFrame(state);
  const img = images[frame];
  if (!isReady(img)) return;

  const c = FRAME_CROP[frame];
  const sx = c.x * img.naturalWidth;
  const sy = c.y * img.naturalHeight;
  const sw = c.w * img.naturalWidth;
  const sh = c.h * img.naturalHeight;
  // Mesma altura em todos os frames; pés na base da caixa (GROUND_Y quando no chão)
  const dh = DINO_HEIGHT;
  const dw = (sw / sh) * dh;
  const dx = DINO_X + (DINO_WIDTH - dw) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, dx, state.dino.y, dw, dh);
}

export function renderGame(ctx: CanvasRenderingContext2D, state: GameState, images: GameImages): void {
  ctx.save();
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.imageSmoothingEnabled = true;
  drawSky(ctx);
  drawScenery(ctx, state.distance);
  drawGround(ctx, state.distance);
  drawBiscuits(ctx, state, images);
  drawDino(ctx, state, images);
  ctx.restore();
}

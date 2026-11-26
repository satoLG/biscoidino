// Motor puro do jogo do dino (sem DOM/canvas).
// Não usamos Matter.js: ele é carregado de CDN (PhysicsWorld.ts) e um corredor
// estilo Chrome Dino só precisa de cinemática simples. Assim o jogo funciona
// offline e os testes ficam determinísticos.
import { getBiscuitConfig } from '../data/biscuitConfig';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 300;
export const GROUND_Y = 260;

export const DINO_X = 60;
export const DINO_WIDTH = 88;
export const DINO_HEIGHT = 88;
export const DINO_HITBOX = { offsetX: 14, offsetY: 14, width: 56, height: 70 };

export const GRAVITY = 2400;
export const JUMP_VELOCITY = -820;
export const START_SPEED = 320;
export const MAX_SPEED = 750;
export const SPEED_GAIN = 8;
export const MAX_STEP = 0.05;
export const FIRST_SPAWN_DISTANCE = 400;
export const BISCUIT_SIZE_FACTOR = 0.6;

// Só os biscoitos redondos; corações e estrelas rolando ficam estranhos
export const BISCUIT_TEXTURES: string[] = [
  '/biscuits/parmesao_biscuit1.png',
  '/biscuits/parmesao_biscuit2.png',
  '/biscuits/biscoidino_biscuit1.png',
  '/biscuits/flower_baunilha1.png',
  '/biscuits/coffee_flower_biscuit.png',
  '/biscuits/biscoidino_coffee_biscuit1.png'
];

export const DINO_FRAMES = {
  idle: '/frames/biscoidino_idle.png',
  walk1: '/frames/biscoidino_walk1.png',
  walk2: '/frames/biscoidino_walk2.png'
} as const;

export type GameStatus = 'ready' | 'running' | 'over';

export interface Dino {
  y: number; // topo da caixa de desenho
  vy: number;
  onGround: boolean;
}

export interface Biscuit {
  x: number; // centro
  y: number; // centro = GROUND_Y - radius
  radius: number;
  angle: number; // radianos
  texture: string;
}

export interface GameState {
  status: GameStatus;
  dino: Dino;
  biscuits: Biscuit[];
  speed: number;
  distance: number; // px percorridos
  nextSpawnIn: number; // px até o próximo spawn
  time: number; // segundos correndo, usado na animação
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DinoFrame = 'idle' | 'walk1' | 'walk2';

export function createGameState(): GameState {
  return {
    status: 'ready',
    dino: { y: GROUND_Y - DINO_HEIGHT, vy: 0, onGround: true },
    biscuits: [],
    speed: START_SPEED,
    distance: 0,
    nextSpawnIn: FIRST_SPAWN_DISTANCE,
    time: 0
  };
}

// Muta o mesmo objeto, pois a página guarda a referência
export function startGame(s: GameState): void {
  if (s.status === 'running') return;
  Object.assign(s, createGameState());
  s.status = 'running';
}

export function jump(s: GameState): boolean {
  if (s.status !== 'running' || !s.dino.onGround) return false;
  s.dino.vy = JUMP_VELOCITY;
  s.dino.onGround = false;
  return true;
}

export function biscuitRadius(texture: string): number {
  return Math.round(getBiscuitConfig(texture).radius * BISCUIT_SIZE_FACTOR);
}

export function spawnBiscuit(s: GameState, texture: string, x?: number): Biscuit {
  const r = biscuitRadius(texture);
  const b: Biscuit = { x: x ?? GAME_WIDTH + r, y: GROUND_Y - r, radius: r, angle: 0, texture };
  s.biscuits.push(b);
  return b;
}

// Distância em px até o próximo biscoito (sempre maior que o alcance de um pulo)
export function nextGap(speed: number, rng: () => number): number {
  return speed * (0.9 + rng() * 0.9) + 120;
}

export function getDinoHitbox(s: GameState): Rect {
  return {
    x: DINO_X + DINO_HITBOX.offsetX,
    y: s.dino.y + DINO_HITBOX.offsetY,
    width: DINO_HITBOX.width,
    height: DINO_HITBOX.height
  };
}

export function circleRectOverlap(cx: number, cy: number, r: number, rect: Rect): boolean {
  const px = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
  const py = Math.max(rect.y, Math.min(cy, rect.y + rect.height));
  const dx = cx - px;
  const dy = cy - py;
  return dx * dx + dy * dy < r * r;
}

export function step(s: GameState, dt: number, rng: () => number = Math.random): void {
  if (s.status !== 'running' || dt <= 0) return;
  dt = Math.min(dt, MAX_STEP);

  s.time += dt;
  s.speed = Math.min(MAX_SPEED, s.speed + SPEED_GAIN * dt);
  const dx = s.speed * dt;
  s.distance += dx;

  const d = s.dino;
  if (!d.onGround) {
    d.vy += GRAVITY * dt;
    d.y += d.vy * dt;
    if (d.y >= GROUND_Y - DINO_HEIGHT) {
      d.y = GROUND_Y - DINO_HEIGHT;
      d.vy = 0;
      d.onGround = true;
    }
  }

  for (const b of s.biscuits) {
    b.x -= dx;
    b.angle -= dx / b.radius; // rola para a esquerda: anti-horário no canvas
  }
  s.biscuits = s.biscuits.filter((b) => b.x + b.radius >= 0);

  s.nextSpawnIn -= dx;
  if (s.nextSpawnIn <= 0) {
    spawnBiscuit(s, BISCUIT_TEXTURES[Math.floor(rng() * BISCUIT_TEXTURES.length)]);
    s.nextSpawnIn = nextGap(s.speed, rng);
  }

  const hitbox = getDinoHitbox(s);
  if (s.biscuits.some((b) => circleRectOverlap(b.x, b.y, b.radius, hitbox))) {
    s.status = 'over';
  }
}

export function getScore(s: GameState): number {
  return Math.floor(s.distance / 10);
}

export function formatScore(score: number): string {
  return String(score).padStart(5, '0');
}

export function getDinoFrame(s: GameState): DinoFrame {
  if (s.status !== 'running') return 'idle';
  if (!s.dino.onGround) return 'walk1';
  return Math.floor(s.time * 10) % 2 === 0 ? 'walk1' : 'walk2';
}

import './game.css';
import {
  BISCUIT_TEXTURES,
  GAME_HEIGHT,
  GAME_WIDTH,
  createGameState,
  formatScore,
  getScore,
  jump,
  spawnBiscuit,
  startGame,
  step,
} from './engine';
import { loadGameImages, renderGame, type GameImages } from './render';

declare global {
  interface Window {
    __dinoGame?: unknown;
  }
}

const RESTART_LOCK_MS = 400;

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const stage = document.getElementById('game-stage') as HTMLElement;
const overlay = document.getElementById('game-overlay') as HTMLElement;
const message = document.getElementById('game-message') as HTMLElement;
const finalScore = document.getElementById('game-final-score') as HTMLElement;
const scoreEl = document.getElementById('game-score') as HTMLElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const manual = new URLSearchParams(location.search).has('manual');
const dpr = window.devicePixelRatio || 1;
canvas.width = GAME_WIDTH * dpr;
canvas.height = GAME_HEIGHT * dpr;

const state = createGameState();
let images: GameImages | null = null;

let lastStatus = '';
let lastScoreText = '';
let overSince = 0;

function syncUi(): void {
  const scoreText = formatScore(getScore(state));
  if (scoreText !== lastScoreText) {
    lastScoreText = scoreText;
    scoreEl.textContent = scoreText;
    if (state.status === 'over') {
      finalScore.textContent = `Pontos: ${scoreText} · espaço ou clique para jogar de novo`;
    }
  }
  if (state.status === lastStatus) return;
  lastStatus = state.status;
  document.body.dataset.gameStatus = state.status;
  if (state.status === 'running') {
    overlay.classList.add('is-hidden');
    return;
  }
  overlay.classList.remove('is-hidden');
  if (state.status === 'over') {
    overSince = performance.now();
    message.textContent = 'Ops! O dino trombou num biscoito.';
    finalScore.textContent = `Pontos: ${scoreText} · espaço ou clique para jogar de novo`;
    finalScore.hidden = false;
  } else {
    message.textContent = 'Aperte espaço ou clique para começar';
    finalScore.hidden = true;
  }
}

function press(): void {
  if (state.status === 'running') {
    jump(state);
  } else if (state.status === 'ready') {
    startGame(state);
  } else if (state.status === 'over' && performance.now() - overSince >= RESTART_LOCK_MS) {
    startGame(state);
  }
  syncUi();
}

function render(): void {
  if (!images) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  renderGame(ctx, state, images);
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    if (e.repeat) return;
    press();
  }
});
stage.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return;
  press();
});

window.__dinoGame = {
  state: () => state,
  step: (dt: number) => {
    step(state, dt);
    syncUi();
  },
  press,
  start: () => {
    startGame(state);
    syncUi();
  },
  spawn: (x?: number, texture = BISCUIT_TEXTURES[0]) => spawnBiscuit(state, texture, x),
  restartLockMs: RESTART_LOCK_MS,
};

syncUi();

loadGameImages().then((loaded) => {
  images = loaded;
  let last = performance.now();
  const frame = (now: number) => {
    const dt = (now - last) / 1000;
    last = now;
    if (!manual) step(state, dt);
    render();
    syncUi();
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
});

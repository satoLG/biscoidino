import { test, expect } from '@playwright/test';

const DINO_X = 60;
const DINO_WIDTH = 88;
const GROUND_Y = 260;
const DINO_HEIGHT = 88;

test.describe('Jogo do dino', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jogo.html?manual');
    await page.waitForFunction(() => !!(window as any).__dinoGame);
  });

  test('carrega pronto para jogar', async ({ page }) => {
    await expect(page.locator('#game-canvas')).toBeVisible();
    await expect(page.locator('body')).toHaveAttribute('data-game-status', 'ready');
    await expect(page.locator('#game-score')).toHaveText('00000');
    await expect(page.locator('#game-overlay')).toBeVisible();
  });

  test('espaço começa o jogo e esconde o overlay', async ({ page }) => {
    await page.keyboard.press('Space');
    await expect(page.locator('body')).toHaveAttribute('data-game-status', 'running');
    await expect(page.locator('#game-overlay')).toBeHidden();
  });

  test('clique no palco também começa', async ({ page }) => {
    await page.click('#game-stage');
    await expect(page.locator('body')).toHaveAttribute('data-game-status', 'running');
  });

  test('espaço faz o dino pular', async ({ page }) => {
    await page.keyboard.press('Space');
    const dino = await page.evaluate(() => {
      const g = (window as any).__dinoGame;
      g.state().nextSpawnIn = 1e9;
      g.press();
      g.step(0.05);
      return g.state().dino;
    });
    expect(dino.onGround).toBe(false);
    expect(dino.y).toBeLessThan(GROUND_Y - DINO_HEIGHT);
  });

  test('pontuação cresce com a distância', async ({ page }) => {
    await page.evaluate(() => {
      const g = (window as any).__dinoGame;
      g.start();
      g.state().nextSpawnIn = 1e9;
      for (let i = 0; i < 40; i++) g.step(0.05);
    });
    const score = await page.locator('#game-score').textContent();
    expect(score).not.toBe('00000');
    expect(Number(score)).toBeGreaterThan(0);
  });

  test('trombar num biscoito encerra o jogo', async ({ page }) => {
    await page.evaluate((dinoX) => {
      const g = (window as any).__dinoGame;
      g.start();
      g.state().nextSpawnIn = 1e9;
      g.spawn(dinoX + 44);
      g.step(0.016);
    }, DINO_X);
    await expect(page.locator('body')).toHaveAttribute('data-game-status', 'over');
    await expect(page.locator('#game-overlay')).toBeVisible();
    await expect(page.locator('#game-final-score')).toBeVisible();
    await expect(page.locator('#game-final-score')).toContainText('Pontos');
  });

  test('pular por cima do biscoito sobrevive', async ({ page }) => {
    const status = await page.evaluate(({ dinoX, dinoW }) => {
      const g = (window as any).__dinoGame;
      g.start();
      const s = g.state();
      s.nextSpawnIn = 1e9;
      g.spawn(600);
      for (let i = 0; i < 300; i++) {
        if (s.dino.onGround && s.biscuits.length) {
          const b = s.biscuits[0];
          if (b.x - b.radius - (dinoX + dinoW) < 40) g.press();
        }
        if (s.biscuits.length === 0 || s.status === 'over') break;
        g.step(1 / 60);
      }
      return s.status;
    }, { dinoX: DINO_X, dinoW: DINO_WIDTH });
    expect(status).toBe('running');
  });

  test('depois de perder, espaço reinicia após a trava', async ({ page }) => {
    await page.evaluate((dinoX) => {
      const g = (window as any).__dinoGame;
      g.start();
      g.state().nextSpawnIn = 1e9;
      g.spawn(dinoX + 44);
      g.step(0.016);
    }, DINO_X);
    await expect(page.locator('body')).toHaveAttribute('data-game-status', 'over');

    await page.waitForTimeout(500);
    await page.keyboard.press('Space');
    await expect(page.locator('body')).toHaveAttribute('data-game-status', 'running');
    await expect(page.locator('#game-score')).toHaveText('00000');
  });

  test('site principal não tem link para o jogo', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href*="jogo"]')).toHaveCount(0);
  });
});

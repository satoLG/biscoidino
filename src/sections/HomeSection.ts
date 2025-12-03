// Home Section - Landing page with physics canvas
import { Section } from './Section';
import { HomePhysics } from '../physics';

export class HomeSection extends Section {
  private physics: HomePhysics | null = null;

  render(): string {
    return `
      <section id="home" class="home-section active">
        <div class="home-content">
          <h2 class="trademark-name">OLÁ</h2>
          <p>Experimente os melhores <strong class="trademark-name" style="color: var(--primary-dark) !important;">biscoitos amanteigados caseiros</strong> feitos com receitas próprias e ingredientes premium.</p>
          <button class="cta-button">Ver nosso cardápio</button>
        </div>
        <div class="home-image" id="homeImageContainer">
          <canvas id="homePhysicsCanvas"></canvas>
        </div>
      </section>
    `;
  }

  init(): void {
    this.element = document.getElementById('home');
    
    // Setup CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
      ctaButton.addEventListener('click', () => {
        const menuLink = document.querySelector('a[href="#menu"]') as HTMLAnchorElement;
        menuLink?.click();
      });
    }
  }

  async initPhysics(): Promise<void> {
    this.physics = new HomePhysics();
    await this.physics.init();
  }

  cleanup(): void {
    if (this.physics) {
      this.physics.cleanup();
      this.physics = null;
    }
  }
}

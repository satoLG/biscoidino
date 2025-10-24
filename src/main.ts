import './style.css'

// BISCOIDINO - Main Application
class BiscoidinApp {
  private app: HTMLElement;
  private splashScreen: HTMLElement;

  constructor() {
    this.app = document.querySelector<HTMLDivElement>('#app')!;
    this.splashScreen = document.querySelector<HTMLDivElement>('#splash-screen')!;
    this.initializeSplashScreen();
  }

  private initializeSplashScreen(): void {
    // Show splash screen for 4 seconds then transition to main content
    setTimeout(() => {
      this.hideSplashScreen();
    }, 4000);
  }

  private hideSplashScreen(): void {
    // Add fade out animation to splash screen
    this.splashScreen.classList.add('fade-out');
    
    // After fade out animation completes, hide splash and show app
    setTimeout(() => {
      this.splashScreen.style.display = 'none';
      this.app.classList.remove('hidden');
      this.app.classList.add('visible');
      this.render();
    }, 800); // Match the CSS animation duration
  }

  private render(): void {
    this.app.innerHTML = `
      <div class="container">
        <header class="header">
          <div class="logo">
            <h1><img src="/biscoidino_logo.png" alt="BISCOIDINO" class="header-logo"> BISCOIDINO</h1>
            <p class="tagline">Biscoitos amanteigados caseiros</p>
          </div>
          <nav class="nav">
            <a href="#home" class="nav-link active">Início</a>
            <a href="#menu" class="nav-link">Cardápio</a>
            <a href="#about" class="nav-link">Sobre</a>
            <a href="#contact" class="nav-link">Contato</a>
          </nav>
        </header>

        <main class="main">
          <section id="home" class="hero active">
            <div class="hero-content">
              <h2>Bem-vindos ao BISCOIDINO</h2>
              <p>Experimente os melhores biscoitos amanteigados caseiros feitos com receitas próprias e ingredientes premium.</p>
              <button class="cta-button">Ver Nosso Cardápio</button>
            </div>
            <div class="hero-image">
              <div class="floating-biscuits">
                <img src="/biscoidino_biscuit.png" alt="BISCOIDINO" class="biscuit-placeholder main-biscuit">
                <img src="/flower_baunilha_biscuit.png" alt="Flor Baunilha" class="biscuit-placeholder flower-biscuit">
                <img src="/heart_baunilha_biscuit.png" alt="Coração Baunilha" class="biscuit-placeholder heart-biscuit">
                <img src="/parmesao_biscuit.png" alt="Parmesão" class="biscuit-placeholder parmesao-biscuit">
              </div>
            </div>
          </section>

          <section id="menu" class="menu-section">
            <h2>Nosso Delicioso Cardápio</h2>
            <div class="menu-grid" id="menuGrid">
              <!-- Menu items will be loaded here -->
            </div>
          </section>

          <section id="about" class="about-section">
            <h2>Sobre a BISCOIDINO</h2>
            <div class="about-content">
              <p>A BISCOIDINO foi criada por Micaela, uma mãe que queria fazer biscoitos de dinossauro para seu filho Lucas. Sem querer, acabou levando para outras pessoas provarem e descobriu que sua receita seria um sucesso.</p>
              <div class="features">
                <div class="feature">
                  <span class="feature-emoji">🌾</span>
                  <h3>Ingredientes Premium</h3>
                  <p>Usamos apenas os melhores ingredientes de fornecedores de confiança.</p>
                </div>
                <div class="feature">
                  <span class="feature-emoji">👨‍🍳</span>
                  <h3>Processo Artesanal</h3>
                  <p>Cada biscoito é cuidadosamente feito à mão usando métodos tradicionais.</p>
                </div>
                <div class="feature">
                  <span class="feature-emoji">📜</span>
                  <h3>Receitas Próprias</h3>
                  <p>Receitas testadas até alcançarem o sabor ideal.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" class="contact-section">
            <h2>Entre em Contato</h2>
            <div class="contact-info">
              <p><img src="/whatsapp.jpeg" alt="WhatsApp" class="contact-icon"> WhatsApp: (11) 95382-6504</p>
            </div>
          </section>
        </main>

        <footer class="footer">
          <p>&copy; 2025 BISCOIDINO. Feito com <img src="/biscoidino_biscuit.png" alt="amor" class="footer-icon"> para amantes de biscoitos em todo lugar.</p>
        </footer>
      </div>
    `;

    this.loadMenu();
    this.setupNavigation();
  }

  private loadMenu(): void {
    const menuItems = [
      {
        name: "Biscoitos de Baunilha",
        description: "Deliciosos biscoitos artesanais com sabor suave de baunilha",
        price: "R$ 12,00",
        image: "/baunilha_package.png"
      },
      {
        name: "Biscoitos de Parmesão",
        description: "Biscoitos salgados crocantes com queijo parmesão premium",
        price: "R$ 15,00",
        image: "/parmesao_package.png"
      }
    ];

    const menuGrid = document.getElementById('menuGrid');
    if (menuGrid) {
      menuGrid.innerHTML = menuItems.map(item => `
        <div class="menu-item">
          <img src="${item.image}" alt="${item.name}" class="menu-item-image">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="price">${item.price}</div>
          <button class="order-button">Adicionar ao Pedido</button>
        </div>
      `).join('');
    }
  }

  private setupNavigation(): void {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = (e.target as HTMLAnchorElement).getAttribute('href')?.substring(1);
        
        // Update active nav link
        navLinks.forEach(nav => nav.classList.remove('active'));
        (e.target as HTMLElement).classList.add('active');
        
        // Show/hide sections
        sections.forEach(section => {
          if (section.id === targetId) {
            section.classList.add('active');
          } else {
            section.classList.remove('active');
          }
        });
      });
    });

    // CTA button functionality
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
      ctaButton.addEventListener('click', () => {
        const menuLink = document.querySelector('a[href="#menu"]') as HTMLAnchorElement;
        menuLink?.click();
      });
    }
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new BiscoidinApp();
});

// Preload the logo to ensure smooth animation
const preloadLogo = new Image();
preloadLogo.src = '/biscoidino_logo.png';
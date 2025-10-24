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
            <p class="tagline">Handmade Biscuits with Love</p>
          </div>
          <nav class="nav">
            <a href="#home" class="nav-link active">Home</a>
            <a href="#menu" class="nav-link">Menu</a>
            <a href="#about" class="nav-link">About</a>
            <a href="#contact" class="nav-link">Contact</a>
          </nav>
        </header>

        <main class="main">
          <section id="home" class="hero">
            <div class="hero-content">
              <h2>Welcome to BISCOIDINO</h2>
              <p>Experience the finest handmade biscuits crafted with traditional recipes and premium ingredients.</p>
              <button class="cta-button">View Our Menu</button>
            </div>
            <div class="hero-image">
              <img src="/biscoidino_biscuit.png" alt="BISCOIDINO" class="biscuit-placeholder">
            </div>
          </section>

          <section id="menu" class="menu-section">
            <h2>Our Delicious Menu</h2>
            <div class="menu-grid" id="menuGrid">
              <!-- Menu items will be loaded here -->
            </div>
          </section>

          <section id="about" class="about-section">
            <h2>About BISCOIDINO</h2>
            <div class="about-content">
              <p>BISCOIDINO was founded with a passion for creating the perfect biscuit. Our traditional recipes have been passed down through generations, ensuring every bite is filled with authentic flavor and love.</p>
              <div class="features">
                <div class="feature">
                  <span class="feature-icon">🌾</span>
                  <h3>Premium Ingredients</h3>
                  <p>We use only the finest ingredients sourced from trusted suppliers.</p>
                </div>
                <div class="feature">
                  <span class="feature-icon">👨‍🍳</span>
                  <h3>Handmade Process</h3>
                  <p>Every biscuit is carefully crafted by hand using traditional methods.</p>
                </div>
                <div class="feature">
                  <span class="feature-icon">📜</span>
                  <h3>Traditional Recipes</h3>
                  <p>Time-tested recipes that have delighted families for generations.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" class="contact-section">
            <h2>Get In Touch</h2>
            <div class="contact-info">
              <p>📍 Address: 123 Bakery Street, Sweet City</p>
              <p>📞 Phone: +1 (555) 123-BISCUIT</p>
              <p>📧 Email: hello@biscoidino.com</p>
              <p>⏰ Hours: Mon-Sat 8AM-6PM, Sun 9AM-4PM</p>
            </div>
          </section>
        </main>

        <footer class="footer">
          <p>&copy; 2025 BISCOIDINO. Made with ❤️ for biscuit lovers everywhere.</p>
        </footer>
      </div>
    `;

    this.loadMenu();
    this.setupNavigation();
  }

  private loadMenu(): void {
    const menuItems = [
      {
        name: "Classic Butter Biscuits",
        description: "Traditional butter biscuits with a perfect golden crust",
        price: "$12.99",
        emoji: "🧈"
      },
      {
        name: "Chocolate Chip Delights",
        description: "Crispy biscuits loaded with premium chocolate chips",
        price: "$14.99",
        emoji: "🍫"
      },
      {
        name: "Oatmeal Raisin",
        description: "Hearty oatmeal biscuits with sweet raisins",
        price: "$13.99",
        emoji: "🌾"
      },
      {
        name: "Honey Almond Crunch",
        description: "Sweet honey biscuits with crunchy almonds",
        price: "$15.99",
        emoji: "🍯"
      },
      {
        name: "Double Chocolate",
        description: "Rich chocolate biscuits with dark chocolate coating",
        price: "$16.99",
        emoji: "🍫"
      },
      {
        name: "Vanilla Dream",
        description: "Delicate vanilla biscuits with a soft, melt-in-mouth texture",
        price: "$13.99",
        emoji: "🌙"
      }
    ];

    const menuGrid = document.getElementById('menuGrid');
    if (menuGrid) {
      menuGrid.innerHTML = menuItems.map(item => `
        <div class="menu-item">
          <div class="menu-item-emoji">${item.emoji}</div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="price">${item.price}</div>
          <button class="order-button">Add to Order</button>
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
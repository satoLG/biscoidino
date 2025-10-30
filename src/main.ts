import './style.css?v=2'

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
            <a href="#home" class="nav-link active">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="nav-text">Início</span>
            </a>
            <a href="#menu" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chef-hat-icon lucide-chef-hat"><path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/><path d="M6 17h12"/>
            </svg>
              <span class="nav-text">Cardápio</span>
            </a>
            <a href="#about" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-text-icon lucide-book-open-text"><path d="M12 7v14"/><path d="M16 12h2"/><path d="M16 8h2"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/><path d="M6 12h2"/><path d="M6 8h2"/>
              </svg>
              <span class="nav-text">Sobre</span>
            </a>
            <a href="#gallery" class="nav-link">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2"/>
                <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="nav-text">Galeria</span>
            </a>
            <a href="#contact" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-icon lucide-phone"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>
              </svg>
              <span class="nav-text">Contato</span>
            </a>
          </nav>
        </header>

        <main class="main">
          <section id="home" class="home active">
            <div class="home-content">
              <h2>Seja Bem-vindo(a)</h2>
              <p>Experimente os melhores biscoitos amanteigados caseiros feitos com receitas próprias e ingredientes premium.</p>
              <button class="cta-button">Ver nosso cardápio</button>
            </div>
            <div class="home-image" id="homeImageContainer">
              <canvas id="homePhysicsCanvas"></canvas>
            </div>
          </section>

          <section id="menu" class="menu-section">
            <h2>Nosso Cardápio</h2>
            <div class="menu-grid" id="menuGrid">
              <!-- Menu items will be loaded here -->
            </div>
          </section>

          <section id="about" class="about-section">
            <h2>Nossa História</h2>
            <div class="about-content">
              <p>
                A Biscoidino nasceu do amor entre mãe e filho.
              </p>
              <p>
                Tudo começou quando Micaela Gregorio, buscando tornar a alimentação do pequeno Lucas mais divertida, decidiu preparar biscoitos em formato de dinossauros.              </p>
              <p>
                O que seria apenas uma brincadeira na cozinha acabou se transformando em algo muito maior: uma receita caseira que encantou familiares, amigos e, logo, um público apaixonado pelo sabor e pela delicadeza de cada Biscoidino.              </p>
              <p>
                Hoje, a Biscoidino é uma marca que leva carinho, sabor e diversão para todas as idades.              </p>
              <p>
                Cada fornada é feita com ingredientes selecionados e um toque especial de amor — porque acreditamos que momentos simples também podem ser inesquecíveis. 💚              </p>
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

          <section id="gallery" class="gallery-section">
            <h2>Galeria</h2>
            <p class="gallery-subtitle">Veja alguns de nossos clientes satisfeitos e os bastidores dos biscoidinos!</p>
            ${this.renderGalleryCarousel()}
          </section>

          <section id="contact" class="contact-section">
            <h2>Contatos</h2>
            <div class="contact-info">
              <a href="https://wa.me/5511953826504?text=Olá,%20gostaria%20de%20encomendar%20biscoitos!" target="_blank" class="whatsapp-link">
                <img src="/whatsapp.jpeg" alt="WhatsApp" class="contact-icon">
                <span>(11) 95382-6504</span>
              </a>
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
    
    setTimeout(() => {
      initHomePhysics();
    }, 100);

    // Initialize gallery carousel after DOM is ready (backup initialization)
    setTimeout(() => {
      console.log('🚀 Initial gallery setup...');
      if (document.querySelector('.gallery-slide')) {
        updateGallerySlide(); // Ensure initial state is correct
      }
    }, 200);
  }

  private loadMenu(): void {
    const menuItems = [
      {
        name: "Biscoitos de Baunilha",
        description: "Deliciosos biscoitos artesanais com sabor suave de baunilha (150g)",
        price: "R$ 12,00",
        image: "/baunilha_package.png",
        images: [
          "/baunilha_package.png",
          "/flower_baunilha_biscuit.png", 
          "/heart_baunilha_biscuit.png",
          "/biscoidino_biscuit.png"
        ]
      },
      {
        name: "Biscoitos de Parmesão",
        description: "Biscoitos salgados crocantes com queijo parmesão premium (150g)",
        price: "R$ 15,00",
        image: "/parmesao_package.png",
        images: [
          "/parmesao_package.png",
          "/parmesao_biscuit.png"
        ]
      }
    ];

    // Armazenar os dados dos produtos globalmente para uso nos modais
    (window as any).menuItemsData = menuItems;

    const menuGrid = document.getElementById('menuGrid');
    if (menuGrid) {
      menuGrid.innerHTML = menuItems.map((item, index) => `
        <div class="menu-item">
          <div class="product-image-container">
            <img src="${item.image}" alt="${item.name}" class="menu-item-image">
            <div class="image-actions">
              <button class="action-button detail-button" onclick="openProductModal(${index})" title="Ver detalhes">
                🔍
              </button>
              <button class="action-button physics-button" onclick="openPhysicsView('${item.name.toLowerCase().includes('parmesão') ? 'parmesao' : 'baunilha'}')" title="Ver dentro do pacote">
                📦
              </button>
            </div>
          </div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="price">${item.price}</div>
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
        const currentLink = e.currentTarget as HTMLAnchorElement;
        const targetId = currentLink.getAttribute('href')?.substring(1);
        
        // Update active nav link
        navLinks.forEach(nav => nav.classList.remove('active'));
        currentLink.classList.add('active');
        
        // Show/hide sections
        sections.forEach(section => {
          if (section.id === targetId) {
            section.classList.add('active');
            
            // Initialize gallery when gallery section becomes active
            if (targetId === 'gallery') {
              setTimeout(() => {
                console.log('🎭 Gallery section activated, initializing carousel...');
                initializeGalleryCarousel();
              }, 50);
            }
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

  private renderGalleryCarousel(): string {
    // Mapear automaticamente as imagens da pasta public/gallery
    const galleryData = [
      {
        image: '/gallery/galeria1.jpeg',
        text: 'Parmesão e Baunilha!',
      },
      {
        image: '/gallery/galeria2.jpeg',
        text: 'Produção de biscoitos!',
      },
      {
        image: '/gallery/galeria3.jpeg',
        text: 'Perfeito para a hora do chá!',
      },
      {
        image: '/gallery/galeria4.jpeg',
        text: 'Pacotes de baunilha!',
      },
      {
        image: '/gallery/galeria5.jpeg',
        text: 'Biscoitos prontos para festa!',
      },
      {
        image: '/gallery/galeria6.jpeg',
        text: 'Mini biscoidinos para festa!',
      },
      {
        image: '/gallery/galeria7.jpeg',
        text: 'Hmm, parmesão, que delícia!',
      }
    ];

    return `
      <div class="gallery-carousel-container">
        <div class="gallery-carousel">
          <div class="gallery-slides-container" id="gallerySlides">
            ${galleryData.map((item, index) => `
              <div class="gallery-slide ${index === 0 ? 'active' : ''}" data-image-src="${item.image}" data-slide-index="${index}">
                <div class="gallery-slide-overlay">
                  <p class="gallery-text">"${item.text}"</p>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="gallery-nav-btn prev" onclick="galleryPrevSlide()">‹</button>
          <button class="gallery-nav-btn next" onclick="galleryNextSlide()">›</button>
          <div class="gallery-indicators" id="galleryIndicators">
            ${galleryData.map((_, index) => `
              <span class="gallery-indicator ${index === 0 ? 'active' : ''}" onclick="galleryGoToSlide(${index})"></span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new BiscoidinApp();
});

// Preload the logo to ensure smooth animation
const preloadLogo = new Image();
preloadLogo.src = '/biscoidino_logo.png';

// Global functions for modals and physics simulation
(window as any).openProductModal = function(productIndex: number) {
  const menuItems = (window as any).menuItemsData;
  const product = menuItems[productIndex];
  
  // Create modal HTML
  const modalHTML = `
    <div id="productModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>${product.name}</h2>
          <button class="close-modal" onclick="closeProductModal()">&times;</button>
        </div>
        <div class="carousel-container">
          <div class="carousel">
            <div class="carousel-images" id="carouselImages" title="Arraste para navegar ou use as setas">
              ${product.images.map((img: string, idx: number) => `
                <div class="carousel-slide ${idx === 0 ? 'active' : ''}">
                  <img src="${img}" alt="${product.name}" class="carousel-image" style="transform: scale(1) translate(0px, 0px);" />
                </div>
              `).join('')}
            </div>
            <button class="carousel-btn prev" onclick="changeCarouselImage(-1)" title="Imagem anterior">‹</button>
            <button class="carousel-btn next" onclick="changeCarouselImage(1)" title="Próxima imagem">›</button>
            <div class="zoom-controls">
              <button class="zoom-btn" onclick="zoomImage(-0.2)" title="Diminuir zoom">🔍-</button>
              <button class="zoom-btn" onclick="zoomImage(0.2)" title="Aumentar zoom">🔍+</button>
              <button class="zoom-btn" onclick="resetZoom()" title="Resetar zoom">⌂</button>
            </div>
          </div>
          <div class="carousel-dots" id="carouselDots">
            ${product.images.map((_: string, idx: number) => `
              <span class="dot ${idx === 0 ? 'active' : ''}" onclick="currentCarouselImage(${idx + 1})"></span>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Store current image index and zoom state
  (window as any).currentImageIndex = 0;
  (window as any).totalImages = product.images.length;
  (window as any).currentZoom = 1;
  (window as any).imagePosition = { x: 0, y: 0 };
  
  // Setup carousel dragging after modal is added to DOM
  setTimeout(() => setupCarouselDrag(), 50);
};

(window as any).closeProductModal = function() {
  // Cleanup carousel drag events
  if ((window as any).cleanupCarouselDrag) {
    (window as any).cleanupCarouselDrag();
    (window as any).cleanupCarouselDrag = null;
  }
  
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.remove();
  }
};

(window as any).changeCarouselImage = function(direction: number) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  
  // Remove active class from current slide and dot
  slides[(window as any).currentImageIndex].classList.remove('active');
  dots[(window as any).currentImageIndex].classList.remove('active');
  
  // Update index
  (window as any).currentImageIndex = ((window as any).currentImageIndex + direction + (window as any).totalImages) % (window as any).totalImages;
  
  // Add active class to new slide and dot
  slides[(window as any).currentImageIndex].classList.add('active');
  dots[(window as any).currentImageIndex].classList.add('active');
  
  // Reset zoom when changing images
  (window as any).resetZoom();
};

(window as any).currentCarouselImage = function(imageIndex: number) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  
  // Remove active class from current slide and dot
  slides[(window as any).currentImageIndex].classList.remove('active');
  dots[(window as any).currentImageIndex].classList.remove('active');
  
  // Update index
  (window as any).currentImageIndex = imageIndex - 1;
  
  // Add active class to new slide and dot
  slides[(window as any).currentImageIndex].classList.add('active');
  dots[(window as any).currentImageIndex].classList.add('active');
  
  // Reset zoom when changing images
  (window as any).resetZoom();
};

(window as any).openPhysicsView = function(productType: 'baunilha' | 'parmesao') {
  // Create physics modal HTML
  const modalHTML = `
    <div id="physicsModal" class="modal physics-modal">
      <div class="modal-content physics-content">
        <div class="modal-header">
          <h2>Dentro do Pacote - ${productType === 'baunilha' ? 'Baunilha' : 'Parmesão'}</h2>
          <button class="close-modal" onclick="closePhysicsModal()">&times;</button>
        </div>
        <div class="physics-container">
          <canvas id="physicsCanvas"></canvas>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Initialize physics simulation
  setTimeout(() => initPhysicsSimulation(productType), 100);
};

(window as any).closePhysicsModal = function() {
  // Cleanup interaction events
  if ((window as any).physicsCleanupInteraction) {
    (window as any).physicsCleanupInteraction();
    (window as any).physicsCleanupInteraction = null;
  }
  
  // Cleanup boundary check interval
  if ((window as any).physicsBoundaryCheckInterval) {
    clearInterval((window as any).physicsBoundaryCheckInterval);
    (window as any).physicsBoundaryCheckInterval = null;
  }
  
  // Stop physics engine
  if ((window as any).physicsEngine) {
    const Matter = (window as any).Matter;
    Matter.Render.stop((window as any).physicsRender);
    Matter.World.clear((window as any).physicsEngine.world, false);
    Matter.Engine.clear((window as any).physicsEngine);
    (window as any).physicsEngine = null;
    (window as any).physicsMouseConstraint = null;
  }
  
  const modal = document.getElementById('physicsModal');
  if (modal) {
    modal.remove();
  }
};

function initPhysicsSimulation(productType: 'baunilha' | 'parmesao') {
  // Load Matter.js if not already loaded
  if (!(window as any).Matter) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
    script.onload = () => createPhysicsWorld(productType);
    document.head.appendChild(script);
  } else {
    createPhysicsWorld(productType);
  }
}

function setupPhysicsInteraction(canvas: HTMLCanvasElement, engine: any) {
  const Matter = (window as any).Matter;
  const Mouse = Matter.Mouse;
  const MouseConstraint = Matter.MouseConstraint;
  const World = Matter.World;
  
  // Create mouse/touch input
  const mouse = Mouse.create(canvas);
  
  // Create mouse constraint for dragging
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.1, // Lower stiffness for gentler dragging
      damping: 0.9,   // Add damping to reduce violent movements
      length: 0,      // Keep constraint length at zero
      render: {
        visible: false
      }
    }
  });
  
  // Add mouse constraint to world
  World.add(engine.world, mouseConstraint);
  
  // Store mouse constraint globally for cleanup
  (window as any).physicsMouseConstraint = mouseConstraint;
  
  // Add click/touch interaction for impulse effects
  const handleInteractionStart = (event: MouseEvent | TouchEvent) => {
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Apply force to nearby biscuits
    applyForceAtPosition(x, y);
  };
  
  const handleInteractionEnd = () => {
    // End interaction (could be used for visual feedback later)
  };
  
  // Add event listeners for mouse and touch
  canvas.addEventListener('mousedown', handleInteractionStart);
  canvas.addEventListener('mouseup', handleInteractionEnd);
  canvas.addEventListener('touchstart', handleInteractionStart, { passive: true });
  canvas.addEventListener('touchend', handleInteractionEnd);
  
  // Prevent context menu on right click
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  
  // Store cleanup function
  (window as any).physicsCleanupInteraction = () => {
    canvas.removeEventListener('mousedown', handleInteractionStart);
    canvas.removeEventListener('mouseup', handleInteractionEnd);
    canvas.removeEventListener('touchstart', handleInteractionStart);
    canvas.removeEventListener('touchend', handleInteractionEnd);
    canvas.removeEventListener('contextmenu', (e) => e.preventDefault());
  };
}

function applyForceAtPosition(x: number, y: number) {
  if (!(window as any).physicsBiscuits) return;
  
  const Matter = (window as any).Matter;
  const forceRadius = 60; // Radius of effect
  const maxForce = 0.02; // Maximum force intensity
  
  (window as any).physicsBiscuits.forEach((biscuit: any) => {
    const dx = biscuit.position.x - x;
    const dy = biscuit.position.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < forceRadius && distance > 0) {
      // Calculate force based on distance (closer = stronger)
      const forceMagnitude = (forceRadius - distance) / forceRadius * maxForce;
      
      // Normalize direction and apply force
      const forceX = (dx / distance) * forceMagnitude;
      const forceY = (dy / distance) * forceMagnitude;
      
      // Add some randomness for more natural movement
      const randomX = (Math.random() - 0.5) * 0.005;
      const randomY = (Math.random() - 0.5) * 0.005;
      
      Matter.Body.applyForce(biscuit, biscuit.position, {
        x: forceX + randomX,
        y: forceY + randomY
      });
      
      // Add slight rotation for visual effect
      Matter.Body.setAngularVelocity(biscuit, (Math.random() - 0.5) * 0.1);
    }
  });
}

function setupBoundaryCheck(canvas: HTMLCanvasElement, biscuits: any[]) {
  const Matter = (window as any).Matter;
  
  // Create boundary check interval
  const boundaryCheckInterval = setInterval(() => {
    if (!(window as any).physicsEngine || !biscuits.length) {
      clearInterval(boundaryCheckInterval);
      return;
    }
    
    biscuits.forEach((biscuit: any) => {
      const pos = biscuit.position;
      const margin = 10; // Safety margin from edges
      let needsReset = false;
      let newX = pos.x;
      let newY = pos.y;
      
      // Check if biscuit is outside canvas bounds
      if (pos.x < margin) {
        newX = margin + Math.random() * 50; // Random position near left edge
        needsReset = true;
      } else if (pos.x > canvas.width - margin) {
        newX = canvas.width - margin - Math.random() * 50; // Random position near right edge
        needsReset = true;
      }
      
      if (pos.y < margin) {
        newY = margin + Math.random() * 50; // Random position near top
        needsReset = true;
      } else if (pos.y > canvas.height - margin) {
        newY = canvas.height - margin - Math.random() * 50; // Random position near bottom
        needsReset = true;
      }
      
      // Reset position and velocity if biscuit escaped
      if (needsReset) {
        Matter.Body.setPosition(biscuit, { x: newX, y: newY });
        Matter.Body.setVelocity(biscuit, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(biscuit, 0);
      }
    });
  }, 100); // Check every 100ms
  
  // Store interval for cleanup
  (window as any).physicsBoundaryCheckInterval = boundaryCheckInterval;
}

function createPhysicsWorld(productType: 'baunilha' | 'parmesao') {
  const Matter = (window as any).Matter;
  const Engine = Matter.Engine;
  const Render = Matter.Render;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  
  const canvas = document.getElementById('physicsCanvas') as HTMLCanvasElement;
  const containerRect = canvas.parentElement!.getBoundingClientRect();
  
  canvas.width = containerRect.width - 40;
  canvas.height = 400;
  
  // Create engine
  const engine = Engine.create();
  engine.world.gravity.y = 0.5;
  
  // Create renderer
  const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: canvas.width,
      height: canvas.height,
      wireframes: false,
      background: '#FFF8DC'
    }
  });
  
  // Create boundaries (thicker invisible walls to prevent escape)
  const wallThickness = 50; // Much thicker walls
  const walls = [
    // Top wall
    Bodies.rectangle(canvas.width / 2, -wallThickness/2, canvas.width + wallThickness*2, wallThickness, { isStatic: true, render: { visible: false } }),
    // Bottom wall
    Bodies.rectangle(canvas.width / 2, canvas.height + wallThickness/2, canvas.width + wallThickness*2, wallThickness, { isStatic: true, render: { visible: false } }),
    // Left wall
    Bodies.rectangle(-wallThickness/2, canvas.height / 2, wallThickness, canvas.height + wallThickness*2, { isStatic: true, render: { visible: false } }),
    // Right wall
    Bodies.rectangle(canvas.width + wallThickness/2, canvas.height / 2, wallThickness, canvas.height + wallThickness*2, { isStatic: true, render: { visible: false } })
  ];
  
  // Create biscuits based on product type
  const biscuits: any[] = [];
  
  if (productType === 'baunilha') {
    // 1 dinosaur, 6 hearts, 6 flowers
    const biscuitConfigs = [
      { count: 1, radius: 35, type: 'dinosaur', image: '/biscoidino_biscuit.png' },
      { count: 7, radius: 35, type: 'heart', image: '/heart_baunilha_biscuit.png' },
      { count: 6, radius: 35, type: 'flower', image: '/flower_baunilha_biscuit.png' }
    ];
    
    biscuitConfigs.forEach(config => {
      for (let i = 0; i < config.count; i++) {
        const x = Math.random() * (canvas.width - 100) + 50;
        const y = Math.random() * 100 + 50;
        
        const biscuit = Bodies.circle(x, y, config.radius, {
          render: {
            sprite: {
              texture: config.image,
              xScale: 0.3, // Adjust scale based on radius
              yScale: 0.3
            }
          },
          restitution: 0.3,
          friction: 0.4
        });
        
        biscuits.push(biscuit);
      }
    });
  } else {
    // 21 parmesão biscuits
    for (let i = 0; i < 21; i++) {
      const x = Math.random() * (canvas.width - 100) + 50;
      const y = Math.random() * 150 + 50;
      
      const biscuit = Bodies.circle(x, y, 30, {
        render: {
          sprite: {
            texture: '/parmesao_biscuit.png',
            xScale: 0.3, // Scale to fit the 15px radius
            yScale: 0.3
          }
        },
        restitution: 0.2,
        friction: 0.5
      });
      
      biscuits.push(biscuit);
    }
  }
  
  // Add all bodies to world
  World.add(engine.world, [...walls, ...biscuits]);
  
  // Store references globally
  (window as any).physicsEngine = engine;
  (window as any).physicsRender = render;
  (window as any).physicsBiscuits = biscuits;
  
  // Add mouse/touch interaction
  setupPhysicsInteraction(canvas, engine);
  
  // Add boundary check system
  setupBoundaryCheck(canvas, biscuits);
  
  // Start simulation
  Engine.run(engine);
  Render.run(render);
}

(window as any).shakeBiscuits = function() {
  if ((window as any).physicsBiscuits) {
    const Matter = (window as any).Matter;
    (window as any).physicsBiscuits.forEach((biscuit: any) => {
      const force = {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01
      };
      Matter.Body.applyForce(biscuit, biscuit.position, force);
    });
  }
};

(window as any).resetBiscuits = function() {
  if ((window as any).physicsBiscuits && (window as any).physicsEngine) {
    const canvas = document.getElementById('physicsCanvas') as HTMLCanvasElement;
    (window as any).physicsBiscuits.forEach((biscuit: any) => {
      const x = Math.random() * (canvas.width - 100) + 50;
      const y = Math.random() * 100 + 50;
      const Matter = (window as any).Matter;
      Matter.Body.setPosition(biscuit, { x, y });
      Matter.Body.setVelocity(biscuit, { x: 0, y: 0 });
    });
  }
};

// Zoom and carousel drag functions
(window as any).zoomImage = function(delta: number) {
  (window as any).currentZoom = Math.max(0.5, Math.min(3, (window as any).currentZoom + delta));
  updateImageTransform();
};

(window as any).resetZoom = function() {
  (window as any).currentZoom = 1;
  (window as any).imagePosition = { x: 0, y: 0 };
  updateImageTransform();
};

function updateImageTransform() {
  const activeSlide = document.querySelector('.carousel-slide.active');
  if (activeSlide) {
    const img = activeSlide.querySelector('.carousel-image') as HTMLImageElement;
    if (img) {
      const zoom = (window as any).currentZoom;
      const pos = (window as any).imagePosition;
      img.style.transform = `scale(${zoom}) translate(${pos.x}px, ${pos.y}px)`;
      img.style.cursor = zoom > 1 ? 'grab' : 'default';
    }
  }
}

function setupCarouselDrag() {
  const carouselContainer = document.getElementById('carouselImages');
  if (!carouselContainer) return;
  
  let isDragging = false;
  let isImageDrag = false;
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let initialImagePos = { x: 0, y: 0 };
  
  // Handle mouse and touch events for carousel dragging
  const handleStart = (e: MouseEvent | TouchEvent) => {
    isDragging = true;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    startX = clientX;
    startY = clientY;
    endX = clientX;
    
    // Check if we're dragging a zoomed image
    const activeImg = document.querySelector('.carousel-slide.active .carousel-image') as HTMLElement;
    if (activeImg && (window as any).currentZoom > 1) {
      isImageDrag = true;
      initialImagePos = { ...(window as any).imagePosition };
      activeImg.style.cursor = 'grabbing';
    } else {
      isImageDrag = false;
      carouselContainer.style.cursor = 'grabbing';
    }
    
    e.preventDefault();
  };
  
  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    endX = clientX; // Track current position for end calculation
    
    if (isImageDrag && (window as any).currentZoom > 1) {
      // Drag zoomed image
      const deltaX = (clientX - startX) / (window as any).currentZoom;
      const deltaY = (clientY - startY) / (window as any).currentZoom;
      
      (window as any).imagePosition = {
        x: initialImagePos.x + deltaX,
        y: initialImagePos.y + deltaY
      };
      
      updateImageTransform();
    }
    
    e.preventDefault();
  };
  
  const handleEnd = () => {
    if (!isDragging) return;
    
    isDragging = false;
    
    const activeImg = document.querySelector('.carousel-slide.active .carousel-image') as HTMLElement;
    if (activeImg) {
      activeImg.style.cursor = (window as any).currentZoom > 1 ? 'grab' : 'default';
    }
    carouselContainer.style.cursor = 'grab';
    
    // Handle carousel navigation if not dragging zoomed image
    if (!isImageDrag) {
      const dragDistance = endX - startX;
      const threshold = 50; // Minimum drag distance to change slides
      
      if (Math.abs(dragDistance) > threshold) {
        if (dragDistance > 0) {
          // Dragged right -> go to previous image
          (window as any).changeCarouselImage(-1);
        } else {
          // Dragged left -> go to next image
          (window as any).changeCarouselImage(1);
        }
      }
    }
    
    isImageDrag = false;
  };
  
  // Set initial cursor style to indicate draggable
  carouselContainer.style.cursor = 'grab';
  
  // Add event listeners
  carouselContainer.addEventListener('mousedown', handleStart);
  carouselContainer.addEventListener('touchstart', handleStart, { passive: false });
  
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('touchmove', handleMove, { passive: false });
  
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);
  
  // Prevent drag on images to avoid browser's default drag behavior
  const images = carouselContainer.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
    img.style.userSelect = 'none';
    img.style.webkitUserSelect = 'none';
  });
  
  // Store cleanup function
  (window as any).cleanupCarouselDrag = () => {
    carouselContainer.removeEventListener('mousedown', handleStart);
    carouselContainer.removeEventListener('touchstart', handleStart);
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
    
    images.forEach(img => {
      img.removeEventListener('dragstart', (e) => e.preventDefault());
    });
  };
}

// Gallery Carousel Functions
let currentGallerySlide = 0;
const totalGallerySlides = 7;

(window as any).galleryNextSlide = function() {
  currentGallerySlide = (currentGallerySlide + 1) % totalGallerySlides;
  updateGallerySlide();
};

(window as any).galleryPrevSlide = function() {
  currentGallerySlide = (currentGallerySlide - 1 + totalGallerySlides) % totalGallerySlides;
  updateGallerySlide();
};

(window as any).galleryGoToSlide = function(index: number) {
  currentGallerySlide = index;
  updateGallerySlide();
};

function updateGallerySlide() {
  const slides = document.querySelectorAll('.gallery-slide');
  const indicators = document.querySelectorAll('.gallery-indicator');
  
  if (slides.length === 0) return;
  
  // Calcular índices do carrossel infinito
  const prevSlideIndex = (currentGallerySlide - 1 + totalGallerySlides) % totalGallerySlides;
  const nextSlideIndex = (currentGallerySlide + 1) % totalGallerySlides;
  
  console.log('🎯 Updating gallery slide:', {
    current: currentGallerySlide,
    prev: prevSlideIndex,
    next: nextSlideIndex,
    totalSlides: slides.length
  });
  
  // Resetar todos os slides primeiro
  slides.forEach((slideElement) => {
    const slide = slideElement as HTMLElement;
    slide.classList.remove('active', 'prev-slide', 'next-slide');
    slide.style.display = 'none';
  });
  
  // Mostrar apenas os 3 slides necessários
  slides.forEach((slideElement, index) => {
    const slide = slideElement as HTMLElement;
    
    if (index === currentGallerySlide) {
      // Slide ativo (centro)
      slide.style.display = 'block';
      slide.classList.add('active');
    } else if (index === prevSlideIndex) {
      // Slide anterior (esquerda)
      slide.style.display = 'block';
      slide.classList.add('prev-slide');
    } else if (index === nextSlideIndex) {
      // Próximo slide (direita)
      slide.style.display = 'block';
      slide.classList.add('next-slide');
    }
  });
  
  // Atualizar indicadores
  indicators.forEach((indicator, index) => {
    if (index === currentGallerySlide) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

// Gallery Drag/Swipe Functions - COPIADO DO MODAL DOS PRODUTOS
function setupGalleryDrag() {
  const galleryContainer = document.querySelector('.gallery-slides-container') as HTMLElement;
  if (!galleryContainer) return;
  
  let isDragging = false;
  let startX = 0;
  let endX = 0;
  
  // Handle mouse and touch events for gallery dragging
  const handleStart = (e: MouseEvent | TouchEvent) => {
    isDragging = true;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    
    startX = clientX;
    endX = clientX;
    
    galleryContainer.style.cursor = 'grabbing';
    e.preventDefault();
  };
  
  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    endX = clientX; // Track current position for end calculation
    e.preventDefault();
  };
  
  const handleEnd = () => {
    if (!isDragging) return;
    
    isDragging = false;
    galleryContainer.style.cursor = 'grab';
    
    // Handle gallery navigation
    const dragDistance = endX - startX;
    const threshold = 50; // Minimum drag distance to change slides
    
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        // Dragged right -> go to previous slide
        (window as any).galleryPrevSlide();
      } else {
        // Dragged left -> go to next slide
        (window as any).galleryNextSlide();
      }
    }
  };
  
  // Set initial cursor style to indicate draggable
  galleryContainer.style.cursor = 'grab';
  
  // Add event listeners
  galleryContainer.addEventListener('mousedown', handleStart);
  galleryContainer.addEventListener('touchstart', handleStart, { passive: false });
  
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('touchmove', handleMove, { passive: false });
  
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);
  
  // Prevent drag on images to avoid browser's default drag behavior
  galleryContainer.addEventListener('dragstart', (e) => e.preventDefault());
  galleryContainer.addEventListener('selectstart', (e) => e.preventDefault());
}

// Initialize gallery carousel - will be called after navigation setup
function initializeGalleryCarousel() {
  console.log('🎮 Initializing Gallery Carousel...');
  
  const slides = document.querySelectorAll('.gallery-slide');
  const container = document.querySelector('.gallery-slides-container');
  
  console.log('📊 Gallery stats:');
  console.log('   - Slides found:', slides.length);
  console.log('   - Container found:', !!container);
  
  if (slides.length === 0) {
    console.warn('⚠️ No gallery slides found!');
    return;
  }
  
  // Force update gallery slide multiple times to ensure it takes effect
  updateGallerySlide();
  setTimeout(() => updateGallerySlide(), 10);
  setTimeout(() => updateGallerySlide(), 50);
  
  setupGalleryDrag();
  
  // Aplicar inteligência de imagem para cada slide
  setTimeout(() => applyImageIntelligence(), 100);
  
  console.log('✅ Gallery carousel initialized successfully');
}

// Inteligência para otimizar a exibição das imagens na galeria
function applyImageIntelligence() {
  console.log('🧠 Aplicando inteligência de imagem...');
  
  const slides = document.querySelectorAll('.gallery-slide[data-image-src]');
  
  slides.forEach((slide, index) => {
    const slideElement = slide as HTMLElement;
    const imageSrc = slideElement.dataset.imageSrc;
    
    if (!imageSrc) return;
    
    // Criar elemento de imagem para analisar as dimensões
    const img = new Image();
    
    img.onload = function() {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const slideAspectRatio = 0.7 / 0.5; // Aproximadamente 1.4 (width 70% / height 500px)
      
      console.log(`📸 Imagem ${index + 1}:`, {
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: aspectRatio.toFixed(2),
        slideAspectRatio: slideAspectRatio.toFixed(2)
      });
      
      // Determinar a melhor estratégia de exibição
      let backgroundSize = 'contain';
      let backgroundColor = 'var(--background)';
      
      // Se a proporção da imagem é muito similar à do slide, usar cover
      if (Math.abs(aspectRatio - slideAspectRatio) < 0.3) {
        backgroundSize = 'cover';
        console.log(`✨ Imagem ${index + 1}: Proporção ideal, usando cover`);
      } else if (aspectRatio > slideAspectRatio) {
        // Imagem mais larga - usar contain com fundo suave
        backgroundSize = 'contain';
        backgroundColor = 'linear-gradient(135deg, var(--background), var(--primary-color)15%)';
        console.log(`📐 Imagem ${index + 1}: Muito larga, usando contain com gradiente`);
      } else {
        // Imagem mais alta - usar contain com fundo neutro
        backgroundSize = 'contain';
        backgroundColor = 'var(--background)';
        console.log(`📏 Imagem ${index + 1}: Muito alta, usando contain com fundo neutro`);
      }
      
      // Aplicar estilos otimizados
      slideElement.style.backgroundImage = `url('${imageSrc}')`;
      slideElement.style.backgroundSize = backgroundSize;
      slideElement.style.background = `${backgroundColor} url('${imageSrc}') center/contain no-repeat`;
      
      // Se usar contain, adicionar uma borda sutil para definir melhor o slide
      if (backgroundSize === 'contain') {
        slideElement.style.border = '2px solid rgba(255, 182, 191, 0.2)';
      }
    };
    
    img.onerror = function() {
      console.error(`❌ Erro ao carregar imagem: ${imageSrc}`);
      // Fallback para imagem com erro
      slideElement.style.background = 'var(--background)';
      slideElement.style.display = 'flex';
      slideElement.style.alignItems = 'center';
      slideElement.style.justifyContent = 'center';
      slideElement.innerHTML = '<div style="color: var(--text-light); text-align: center;">Imagem não encontrada</div>';
    };
    
    img.src = imageSrc;
  });
}

// Home Physics Functions
function initHomePhysics() {
  console.log('🌟 Initializing Home Physics with Matter.js...');
  
  // Load Matter.js if not already loaded
  if (!(window as any).Matter) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
    script.onload = () => createHomePhysicsWorld();
    document.head.appendChild(script);
  } else {
    createHomePhysicsWorld();
  }
}

function createHomePhysicsWorld() {
  const Matter = (window as any).Matter;
  const Engine = Matter.Engine;
  const Render = Matter.Render;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  
  const canvas = document.getElementById('homePhysicsCanvas') as HTMLCanvasElement;
  const container = document.getElementById('homeImageContainer') as HTMLElement;
  
  if (!canvas || !container) {
    console.error('❌ Canvas ou container não encontrado');
    return;
  }
  
  // Get container size and set canvas dimensions properly for crisp rendering
  const containerRect = container.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Set actual canvas size (for crisp rendering)
  canvas.width = containerRect.width * pixelRatio;
  canvas.height = containerRect.height * pixelRatio;
  
  // Scale canvas back down using CSS for proper display size
  canvas.style.width = containerRect.width + 'px';
  canvas.style.height = containerRect.height + 'px';
  
  // Get the context and scale it for high DPI displays
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(pixelRatio, pixelRatio);
  }
  
  // Store initial canvas size for resize detection
  (window as any).homeLastCanvasSize = { 
    width: Math.round(containerRect.width), 
    height: Math.round(containerRect.height) 
  };

  console.log('📐 Home physics canvas:', {
    displayWidth: containerRect.width, 
    displayHeight: containerRect.height,
    actualWidth: canvas.width, 
    actualHeight: canvas.height,
    pixelRatio: pixelRatio
  });
  
  // Create engine with natural gravity
  const engine = Engine.create();
  engine.world.gravity.y = 0.6;
  
  // Create renderer with sprites (use display dimensions, not actual canvas dimensions)
  const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: containerRect.width,
      height: containerRect.height,
      wireframes: false,
      background: 'transparent',
      showAngleIndicator: false,
      showDebug: false,
      showVelocity: false,
      showIds: false,
      showShadows: false,
      showVertexNumbers: false,
      showConvexHulls: false
    }
  });
  
  // Create boundaries within the canvas area (use display dimensions)
  const wallThickness = 10;
  const displayWidth = containerRect.width;
  const displayHeight = containerRect.height;
  
  const walls = [
    // Bottom wall (floor)
    Bodies.rectangle(displayWidth / 2, displayHeight - wallThickness/2, displayWidth, wallThickness, { 
      isStatic: true, 
      render: { visible: false } 
    }),
    // Left wall
    Bodies.rectangle(wallThickness/2, displayHeight / 2, wallThickness, displayHeight, { 
      isStatic: true, 
      render: { visible: false } 
    }),
    // Right wall
    Bodies.rectangle(displayWidth - wallThickness/2, displayHeight / 2, wallThickness, displayHeight, { 
      isStatic: true, 
      render: { visible: false } 
    })
    // Não adicionar parede superior para permitir que os biscoitos caiam do topo
  ];
  
  // Create home biscuits with physics (use display dimensions)
  const homeBiscuits = createHomeBiscuits(displayWidth, displayHeight);

  // Add all bodies to world
  World.add(engine.world, [...walls, ...homeBiscuits]);  // Store references globally for interaction
  (window as any).homePhysicsEngine = engine;
  (window as any).homePhysicsRender = render;
  (window as any).homePhysicsBiscuits = homeBiscuits;

  // Setup home interaction
  setupHomePhysicsInteraction(canvas, engine);
  
  // Start simulation
  Engine.run(engine);
  Render.run(render);
  
  // Setup resize listener for responsive canvas (only once)
  if (!(window as any).homeResizeSetup) {
    setupHomeCanvasResize();
    (window as any).homeResizeSetup = true;
  }

  console.log('✅ Home physics initialized successfully');
}

function createHomeBiscuits(canvasWidth: number, canvasHeight: number) {
  const Matter = (window as any).Matter;
  const Bodies = Matter.Bodies;
  
  const centerX = canvasWidth / 2;
  
  // Check if we have saved biscuit states from resize
  const savedStates = (window as any).homeBiscuitStates;
  let useDefaultPositions = !savedStates || savedStates.length === 0;
  
  // Default positions for first load
  const defaultPositions = [
    { x: centerX, y: 50, texture: '/biscoidino_biscuit.png' },
    { x: centerX, y: 50, texture: '/biscoidino_biscuit.png' },
    { x: centerX, y: 50, texture: '/biscoidino_biscuit.png' },
    { x: centerX - 100, y: 30, texture: '/flower_baunilha_biscuit.png' },
    { x: centerX - 100, y: 30, texture: '/flower_baunilha_biscuit.png' },
    { x: centerX + 80, y: 40, texture: '/heart_baunilha_biscuit.png' },
    { x: centerX + 80, y: 40, texture: '/heart_baunilha_biscuit.png' },
    { x: centerX - 40, y: 20, texture: '/parmesao_biscuit.png' },
    { x: centerX - 40, y: 20, texture: '/parmesao_biscuit.png' },
    { x: centerX - 40, y: 20, texture: '/parmesao_biscuit.png' }
  ];
  
  const biscuits = [];
  
  for (let i = 0; i < defaultPositions.length; i++) {
    const defaultPos = defaultPositions[i];
    const savedState = savedStates && savedStates[i];
    
    // Use saved position if available, otherwise use default
    const x = savedState ? savedState.x * canvasWidth : defaultPos.x;
    const y = savedState ? savedState.y * canvasHeight : defaultPos.y;
    const radius = defaultPos.texture.includes('parmesao') ? 30 : 35;
    
    const biscuit = Bodies.circle(x, y, radius, { 
      render: { 
        sprite: {
          texture: defaultPos.texture,
          xScale: 0.3,
          yScale: 0.3
        }
      },
      restitution: 0.6,
      frictionAir: 0.01,
      density: 0.002
    });
    
    // Restore velocity and rotation if saved
    if (savedState && !useDefaultPositions) {
      Matter.Body.setVelocity(biscuit, { 
        x: savedState.velocityX * 0.8, // Dampen velocity slightly
        y: savedState.velocityY * 0.8 
      });
      Matter.Body.setAngle(biscuit, savedState.angle);
      Matter.Body.setAngularVelocity(biscuit, savedState.angularVelocity * 0.8);
    }
    
    biscuits.push(biscuit);
  }
  
  // Clear saved states after use
  (window as any).homeBiscuitStates = null;
  
  console.log(`🎯 Created ${biscuits.length} biscuits with ${savedStates ? 'restored' : 'default'} positions`);
  
  return biscuits;
}

function setupHomePhysicsInteraction(canvas: HTMLCanvasElement, engine: any) {
  const Matter = (window as any).Matter;
  const Mouse = Matter.Mouse;
  const MouseConstraint = Matter.MouseConstraint;
  const World = Matter.World;
  
  // Create mouse/touch input
  const mouse = Mouse.create(canvas);
  
  // Create mouse constraint for dragging
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.05,
      damping: 0.1,
      length: 0,
      render: { visible: false }
    }
  });
  
  // Add mouse constraint to world
  World.add(engine.world, mouseConstraint);
  
  // Store mouse constraint globally for cleanup
  (window as any).homePhysicsMouseConstraint = mouseConstraint;
  
  // State variables for drag protection
  let isDragging = false;
  let mouseDownInCanvas = false;
  
  // Function to enable drag protection (only prevent HTML interference)
  const enableDragProtection = () => {
    if (!isDragging) {
      isDragging = true;
      document.body.classList.add('drag-mode');
      console.log('🔒 Drag protection enabled');
    }
  };
  
  // Function to disable drag protection
  const disableDragProtection = () => {
    if (isDragging) {
      isDragging = false;
      document.body.classList.remove('drag-mode');
      
      // Ensure Matter.js constraint is fully released
      if (mouseConstraint.body !== null) {
        mouseConstraint.body = null;
        mouseConstraint.pointA = null;
        mouseConstraint.pointB = null;
      }
      
      console.log('🔓 Drag protection disabled');
    }
  };
  
  // Canvas mouse/touch event handlers
  const handleCanvasMouseDown = () => {
    mouseDownInCanvas = true;
    // Check if we're actually dragging an object after a short delay
    setTimeout(() => {
      if (mouseDownInCanvas && mouseConstraint.body) {
        enableDragProtection();
      }
    }, 50);
  };
  
  const handleCanvasMouseUp = () => {
    mouseDownInCanvas = false;
    
    // Force release any current drag in Matter.js
    if (mouseConstraint.body !== null) {
      mouseConstraint.body = null;
      mouseConstraint.pointA = null;
      mouseConstraint.pointB = null;
    }
    
    disableDragProtection();
  };
  
  const handleCanvasTouchStart = () => {
    mouseDownInCanvas = true;
    // Check if we're actually dragging an object after a short delay
    setTimeout(() => {
      if (mouseDownInCanvas && mouseConstraint.body) {
        enableDragProtection();
      }
    }, 50);
  };
  
  const handleCanvasTouchEnd = () => {
    mouseDownInCanvas = false;
    
    // Force release any current drag in Matter.js
    if (mouseConstraint.body !== null) {
      mouseConstraint.body = null;
      mouseConstraint.pointA = null;
      mouseConstraint.pointB = null;
    }
    
    disableDragProtection();
  };
  
  // Global event handlers for when mouse leaves canvas during drag
  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (isDragging && mouseConstraint.body) {
      // Continue updating mouse position when dragging outside canvas
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Keep mouse position updated for Matter.js
      mouse.position.x = x;
      mouse.position.y = y;
    }
  };
  
  const handleGlobalMouseUp = () => {
    mouseDownInCanvas = false;
    
    // Force release any current drag in Matter.js when mouse released anywhere
    if (mouseConstraint.body !== null) {
      mouseConstraint.body = null;
      mouseConstraint.pointA = null;
      mouseConstraint.pointB = null;
    }
    
    disableDragProtection();
  };
  
  const handleGlobalTouchMove = (e: TouchEvent) => {
    if (isDragging && mouseConstraint.body && e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      
      mouse.position.x = x;
      mouse.position.y = y;
    }
  };
  
  const handleGlobalTouchEnd = () => {
    mouseDownInCanvas = false;
    
    // Force release any current drag in Matter.js when touch ends anywhere
    if (mouseConstraint.body !== null) {
      mouseConstraint.body = null;
      mouseConstraint.pointA = null;
      mouseConstraint.pointB = null;
    }
    
    disableDragProtection();
  };
  
  // Add canvas-specific event listeners
  canvas.addEventListener('mousedown', handleCanvasMouseDown, { passive: true });
  canvas.addEventListener('mouseup', handleCanvasMouseUp, { passive: true });
  canvas.addEventListener('touchstart', handleCanvasTouchStart, { passive: true });
  canvas.addEventListener('touchend', handleCanvasTouchEnd, { passive: true });
  canvas.addEventListener('touchcancel', handleCanvasTouchEnd, { passive: true });
  
  // Add global event listeners for drag continuation outside canvas
  document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
  document.addEventListener('mouseup', handleGlobalMouseUp, { passive: true });
  document.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
  document.addEventListener('touchend', handleGlobalTouchEnd, { passive: true });
  document.addEventListener('touchcancel', handleGlobalTouchEnd, { passive: true });
  
  // Store cleanup function
  (window as any).homeDragCleanup = () => {
    // Remove canvas listeners
    canvas.removeEventListener('mousedown', handleCanvasMouseDown);
    canvas.removeEventListener('mouseup', handleCanvasMouseUp);
    canvas.removeEventListener('touchstart', handleCanvasTouchStart);
    canvas.removeEventListener('touchend', handleCanvasTouchEnd);
    canvas.removeEventListener('touchcancel', handleCanvasTouchEnd);
    
    // Remove global listeners
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    document.removeEventListener('mouseup', handleGlobalMouseUp);
    document.removeEventListener('touchmove', handleGlobalTouchMove);
    document.removeEventListener('touchend', handleGlobalTouchEnd);
    document.removeEventListener('touchcancel', handleGlobalTouchEnd);
    
    disableDragProtection();
  };
  
  // Prevent context menu on canvas
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  
  console.log('🎮 Home physics interaction setup complete');
}

// Home Canvas Resize Handler
function setupHomeCanvasResize() {
  let resizeTimeout: number;
  
  const handleResize = () => {
    // Skip resize if we're in the middle of a touch interaction
    if ((window as any).homeTouchActive) {
      console.log('📱 Skipping resize during touch interaction');
      return;
    }
    
    // Only resize if home section is active and canvas exists
    const canvas = document.getElementById('homePhysicsCanvas') as HTMLCanvasElement;
    const homeSection = document.querySelector('.home.active');
    const container = document.getElementById('homeImageContainer') as HTMLElement;
    
    if (!canvas || !homeSection || !container) {
      return;
    }
    
    // Get stored canvas size (initialized when physics world is created)
    const lastCanvasSize = (window as any).homeLastCanvasSize || { width: 0, height: 0 };
    
    // Check if size actually changed to prevent unnecessary resize on mobile interactions
    const containerRect = container.getBoundingClientRect();
    const currentWidth = Math.round(containerRect.width);
    const currentHeight = Math.round(containerRect.height);
    
    // Calculate percentage change instead of absolute pixels for better responsiveness
    const widthChange = lastCanvasSize.width > 0 ? Math.abs(currentWidth - lastCanvasSize.width) / lastCanvasSize.width : 1;
    const heightChange = lastCanvasSize.height > 0 ? Math.abs(currentHeight - lastCanvasSize.height) / lastCanvasSize.height : 1;
    
    // Only proceed if size changed by more than 5% or more than 30px (significant change)
    const significantChange = widthChange > 0.05 || heightChange > 0.05 || 
                             Math.abs(currentWidth - lastCanvasSize.width) > 30 || 
                             Math.abs(currentHeight - lastCanvasSize.height) > 30;
    
    if (!significantChange) {
      console.log('📱 Size change not significant enough, ignoring resize event', {
        widthChange: Math.round(widthChange * 100) + '%',
        heightChange: Math.round(heightChange * 100) + '%'
      });
      return;
    }
    
    console.log('📏 Size changed from', lastCanvasSize, 'to', { width: currentWidth, height: currentHeight });
    
    // Update stored size
    (window as any).homeLastCanvasSize = { width: currentWidth, height: currentHeight };
    
    // Debounce the resize to avoid too many calls (longer delay for mobile)
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const debounceDelay = isMobile ? 500 : 300; // Longer delay on mobile to avoid interaction conflicts
    
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      console.log('🔄 Resizing home physics canvas...');
      
      // Save biscuit positions before cleanup (for smoother transitions)
      let biscuitStates: any[] = [];
      if ((window as any).homePhysicsBiscuits && (window as any).homePhysicsBiscuits.length > 0) {
        biscuitStates = (window as any).homePhysicsBiscuits.map((biscuit: any) => ({
          x: biscuit.position.x / lastCanvasSize.width, // Normalize to percentage
          y: biscuit.position.y / lastCanvasSize.height,
          velocityX: biscuit.velocity.x,
          velocityY: biscuit.velocity.y,
          angle: biscuit.angle,
          angularVelocity: biscuit.angularVelocity
        }));
        console.log('💾 Saved positions of', biscuitStates.length, 'biscuits');
      }
      
      // Store for use in recreation
      (window as any).homeBiscuitStates = biscuitStates;
      
      // Cleanup existing physics world
      if ((window as any).homePhysicsEngine) {
        const Matter = (window as any).Matter;
        
        // Stop the engine
        Matter.Engine.clear((window as any).homePhysicsEngine);
        
        // Stop and cleanup renderer
        if ((window as any).homePhysicsRender) {
          Matter.Render.stop((window as any).homePhysicsRender);
          (window as any).homePhysicsRender = null;
        }
        
        // Clean up mouse constraint
        if ((window as any).homePhysicsMouseConstraint) {
          Matter.World.remove((window as any).homePhysicsEngine.world, (window as any).homePhysicsMouseConstraint);
          (window as any).homePhysicsMouseConstraint = null;
        }
        
        // Clean up drag system
        if ((window as any).homeDragCleanup) {
          (window as any).homeDragCleanup();
          (window as any).homeDragCleanup = null;
        }
        
        (window as any).homePhysicsEngine = null;
        (window as any).homePhysicsBiscuits = null;
      }
      
      // Recreate physics world with new dimensions (but don't setup resize again)
      const originalSetup = (window as any).homeResizeSetup;
      (window as any).homeResizeSetup = true; // Prevent recursive setup
      createHomePhysicsWorld();
      (window as any).homeResizeSetup = originalSetup;
      
    }, debounceDelay); // Wait longer on mobile to avoid interaction conflicts
  };
  
  // Cleanup any existing resize listener first
  if ((window as any).homeResizeCleanup) {
    (window as any).homeResizeCleanup();
  }
  
  // Add resize and orientation change listeners
  window.addEventListener('resize', handleResize);
  
  // Add orientation change listener for better mobile support
  const handleOrientationChange = () => {
    // Wait a bit for the orientation change to complete
    setTimeout(() => {
      console.log('📱 Orientation changed, triggering layout update');
      handleResize();
    }, 150);
  };
  
  // Modern browsers
  if ('onorientationchange' in window) {
    window.addEventListener('orientationchange', handleOrientationChange);
  }
  
  // Also listen for screen orientation changes (newer API)
  if (screen && screen.orientation) {
    screen.orientation.addEventListener('change', handleOrientationChange);
  }
  
  // Store cleanup function globally
  (window as any).homeResizeCleanup = () => {
    window.removeEventListener('resize', handleResize);
    if ('onorientationchange' in window) {
      window.removeEventListener('orientationchange', handleOrientationChange);
    }
    if (screen && screen.orientation) {
      screen.orientation.removeEventListener('change', handleOrientationChange);
    }
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
  };
  
  console.log('📐 Home canvas resize and orientation listeners setup complete');
}
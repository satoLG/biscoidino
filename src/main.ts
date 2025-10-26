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
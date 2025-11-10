import { inject } from '@vercel/analytics';
import './style.css?v=2'

// BISCOIDINO - Main Application
class BiscoidinApp {
  private app: HTMLElement;
  private splashScreen: HTMLElement;

  constructor() {
    inject();
    this.app = document.querySelector<HTMLDivElement>('#app')!;
    this.splashScreen = document.querySelector<HTMLDivElement>('#splash-screen')!;
    this.initializeSplashScreen();
  }

  private initializeSplashScreen(): void {
    // Show splash screen for 3 seconds then transition to main content
    setTimeout(() => {
      this.hideSplashScreen();
    }, 3000);
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

            </a>
            <a href="#menu" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chef-hat-icon lucide-chef-hat"><path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/><path d="M6 17h12"/>
            </svg>

            </a>
            <a href="#about" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-text-icon lucide-book-open-text"><path d="M12 7v14"/><path d="M16 12h2"/><path d="M16 8h2"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/><path d="M6 12h2"/><path d="M6 8h2"/>
              </svg>

            </a>
            <a href="#gallery" class="nav-link">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2"/>
                <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

            </a>
            <a href="#contact" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-icon lucide-phone"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>
              </svg>

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
            <div class="about-content" id="aboutContent">
              <div class="typewriter-text" id="typewriterText"></div>
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
          <p>&copy; 2025 BISCOIDINO. Feito com <img src="/biscuits/biscoidino_biscuit1.png" alt="amor" class="footer-icon"> para amantes de biscoitos em todo lugar.</p>
        </footer>
      </div>
    `;

    this.loadMenu();
    this.setupNavigation();
    
    setTimeout(() => {
      initHomePhysics();
    }, 100);

    // Initialize typewriter effect immediately after DOM is ready
    setTimeout(() => {
      console.log('🚀 Initializing typewriter effect...');
      this.initTypewriterEffect();
    }, 300);

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
          "/biscuits/biscoidino_biscuit1.png",
          "/biscuits/flower_baunilha1.png", 
          "/biscuits/heart_baunilha1.png",
          "/biscuits/star_baunilha1.png",
          "/biscuits/flower_baunilha2.png",
          "/biscuits/heart_baunilha2.png",
          "/products/baunilha_biscuits.png"
        ]
      },
      {
        name: "Biscoitos de Parmesão",
        description: "Biscoitos salgados crocantes com queijo parmesão premium (150g)",
        price: "R$ 12,00",
        image: "/products/parmesao_biscuit_package1.png",
        images: [
          "/products/parmesao_biscuit_package1.png",
          "/products/parmesao_biscuit_package2.png",
          "/products/parmesao_biscuits.png"
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

  private initTypewriterEffect(): void {
    const typewriterText = document.getElementById('typewriterText');
    const aboutContent = document.getElementById('aboutContent');
    
    if (!typewriterText || !aboutContent) return;
    
    // Story content with images
    const storyData = [
      { 
        text: "A Biscoidino nasceu do amor entre mãe e filho.",
        image: null
      },
      { 
        text: "Quando Micaela Gregorio decidiu fazer biscoitos em formato de dinossauro para seu filho Lucas.",
        image: "/about/mae_filho.png"
      },
      { 
        text: "O que começou como brincadeira acabou se tornando uma receita de sucesso.",
        image: "/about/estoque.png"
      },
      { 
        text: "Cada fornada é feita com amor e ingredientes especiais.",
        image: "/about/ingredientes.png"
      },
      { 
        text: "Hoje, a Biscoidino é uma marca que leva carinho e sabor para todas as idades.",
        image: "/about/fornada.png"
      }
    ];
    
    // Clear any existing content
    typewriterText.innerHTML = '';
    
    // State management
    let currentParagraph = 0;
    let currentChar = 0;
    let isWaitingForScroll = false;
    let scrollListener: (() => void) | null = null;
    let currentScrollImage: HTMLImageElement | null = null;
    let imageProgress = 0; // 0 to 1 (0 = right side, 1 = center)
    let lastScrollY = 0;
    
    // Control flags for progression
    let paragraphCompleted = false;
    let imageAtCenter = false;
    let typingStarted = false; // Flag to track if we've started typing the current paragraph
    let imageLocked = false; // Flag to prevent further image movement after reaching center
    
    const typeSpeed = 35;
    const pauseBetweenParagraphs = 800;
    
    function createScrollImage(imageSrc: string, paragraphIndex: number): HTMLImageElement {
      console.log('🎨 Creating scroll image:', imageSrc, 'for paragraph:', paragraphIndex);
      
      // Remove any existing image for this paragraph to prevent duplicates
      const existingImages = aboutContent?.querySelectorAll('.scroll-image');
      existingImages?.forEach(img => {
        const imgElement = img as HTMLImageElement;
        if (imgElement.src.includes(imageSrc.split('/').pop() || '')) {
          console.log('🗑️ Removing duplicate image');
          imgElement.remove();
        }
      });
      
      const img = document.createElement('img');
      img.src = imageSrc;
      img.className = 'scroll-image';
      img.style.opacity = '0.9';
      img.dataset.paragraph = paragraphIndex.toString(); // Track which paragraph this image belongs to
      
      // Calculate vertical position based on paragraph index (starting from second paragraph)
      const baseTopOffset = 80; // Start position in pixels from top of about-section (adjusted for larger images)
      const verticalSpacing = 400; // Space between each image (increased for larger image sizes)
      const topPosition = baseTopOffset + (paragraphIndex - 1) * verticalSpacing;
      
      img.style.top = `${topPosition}px`;
      
      // Add to about-content container for relative positioning
      if (aboutContent) {
        aboutContent.appendChild(img);
        console.log('✅ Image created and added to about-content at position:', topPosition);
      }
      
      return img;
    }
    
    function showScrollHint() {
      // Remove existing hint first
      const existingHint = document.querySelector('.scroll-hint-floating');
      if (existingHint) existingHint.remove();
      
      if (!currentScrollImage) {
        console.log('❌ No current image to show hint for');
        return;
      }
      
      // Get image position
      const imageRect = currentScrollImage.getBoundingClientRect();
      const imageTop = imageRect.top + window.scrollY;
      
      // Create floating hint at same height as image
      const scrollHint = document.createElement('div');
      scrollHint.className = 'scroll-hint-floating';
      scrollHint.innerHTML = '<span style="color: var(--primary-color); font-style: italic; font-size: 1rem; background: rgba(255,255,255,0.9);">Role para baixo para continuar a história...</span>';
      
      scrollHint.style.position = 'absolute';
      scrollHint.style.top = `${imageTop + 50}px`; // 50px below image
      scrollHint.style.left = '50%';
      scrollHint.style.transform = 'translateX(-50%)';
      scrollHint.style.textAlign = 'center';
      scrollHint.style.zIndex = '1000';
      scrollHint.style.pointerEvents = 'none';
      scrollHint.style.opacity = '0';
      scrollHint.style.transition = 'opacity 0.4s ease-in-out';
      
      document.body.appendChild(scrollHint);
      
      // Fade in after a brief moment
      setTimeout(() => {
        scrollHint.style.opacity = '1';
      }, 50);
      
      console.log('📝 Scroll hint shown at image position:', imageTop + 50);
    }
    
    function hideScrollHint() {
      const scrollHint = document.querySelector('.scroll-hint-floating') as HTMLElement;
      if (scrollHint) {
        // Fade out smoothly
        scrollHint.style.opacity = '0';
        
        // Remove after fade completes
        setTimeout(() => {
          if (scrollHint.parentNode) {
            scrollHint.remove();
          }
        }, 400); // Match the transition duration
        
        console.log('📝 Scroll hint fading out');
      }
    }
    
    let scrollTimeout: number | null = null;
    
    // Function to detect if device is mobile
    function isMobileDevice(): boolean {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
             || window.innerWidth <= 768;
    }
    
    // Function to get the appropriate center position based on device
    function getCenterPosition(): number {
      return isMobileDevice() ? 10 : 25; // Mobile: 30%, Desktop: 40%
    }
    
    function updateImagePosition(progress: number) {
      if (!currentScrollImage) return;
      
      // Move from right (120%) to center (mobile: 30%, desktop: 40%) based on progress
      const startPosition = 120;
      const centerPosition = getCenterPosition();
      const currentPosition = startPosition - (progress * (startPosition - centerPosition));
      
      currentScrollImage.style.right = `${currentPosition}%`;
      
      console.log('🖼️ Image position:', { progress, currentPosition, centerPosition, isMobile: isMobileDevice(), isAtCenter: progress >= 1 });
    }
    
    function handleScroll() {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      
      console.log('🎯 SCROLL EVENT:', { currentScrollY, scrollDelta, hasImage: !!currentScrollImage, imageProgress });
      
      // ALWAYS hide scroll hint when user starts scrolling (regardless of image state)
      hideScrollHint();
      
      // Clear any existing timeout and set a new one to show hint again if user stops
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (currentScrollImage && !imageLocked) {
          showScrollHint();
        }
      }, 2000); // Show hint again after 2 seconds of no scrolling
      
      if (currentScrollImage && !imageLocked) {
        
        // Move image based on scroll direction
        const scrollSensitivity = 0.003;
        const progressChange = scrollDelta * scrollSensitivity;
        
        const oldProgress = imageProgress;
        imageProgress = Math.max(0, Math.min(1, imageProgress + progressChange));
        
        console.log('�️ Image progress update:', { oldProgress, newProgress: imageProgress, progressChange });
        
        updateImagePosition(imageProgress);
        
        // Update imageAtCenter flag
        const wasAtCenter = imageAtCenter;
        imageAtCenter = imageProgress >= 1;
        
        // If image just reached center for the first time AND we haven't started typing yet
        if (imageAtCenter && !wasAtCenter && !typingStarted) {
          // Remove scroll hint when image reaches center
          const scrollHint = document.querySelector('.scroll-hint');
          if (scrollHint) {
            scrollHint.remove();
            console.log('📝 Scroll hint removed - image reached center');
          }
          
          typingStarted = true;
          imageLocked = true; // Lock the image at center position - no more movement
          // Force image to exact center position when locking
          if (currentScrollImage) {
            currentScrollImage.style.right = `${getCenterPosition()}%`;
          }
          console.log('🔒 Image reached center and locked - starting to type paragraph');
          setTimeout(() => typeNextChar(), pauseBetweenParagraphs);
        }
        
        // Check if both conditions are met for progression (only if we've already started typing)
        if (typingStarted) {
          checkForProgression();
        }
      }
      
      lastScrollY = currentScrollY;
    }
    
    // Handle wheel events for more precise control when image is active
    function handleWheel(e: WheelEvent) {
      // ALWAYS hide scroll hint when user wheels (regardless of image state)
      hideScrollHint();
      
      // Clear any existing timeout and set a new one to show hint again if user stops
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (currentScrollImage && !imageLocked) {
          showScrollHint();
        }
      }, 2000); // Show hint again after 2 seconds of no wheel activity
      
      if (currentScrollImage && !imageLocked) {
        // Prevent default scroll behavior when we have an active image
        e.preventDefault();
        e.stopPropagation();
        
        // Use wheel delta for image movement
        const wheelSensitivity = 0.001;
        const progressChange = e.deltaY * wheelSensitivity;
        
        const oldProgress = imageProgress;
        imageProgress = Math.max(0, Math.min(1, imageProgress + progressChange));
        
        console.log('🎡 WHEEL controlling image:', { wheelDelta: e.deltaY, progressChange, oldProgress, newProgress: imageProgress });
        
        updateImagePosition(imageProgress);
        
        // Update imageAtCenter flag
        const wasAtCenter = imageAtCenter;
        imageAtCenter = imageProgress >= 1;
        
        // If image just reached center for the first time AND we haven't started typing yet
        if (imageAtCenter && !wasAtCenter && !typingStarted) {
          typingStarted = true;
          imageLocked = true; // Lock the image at center position - no more movement
          // Force image to exact center position when locking
          if (currentScrollImage) {
            currentScrollImage.style.right = `${getCenterPosition()}%`;
          }
          console.log('🔒 Image reached center and locked - starting to type paragraph');
          setTimeout(() => typeNextChar(), pauseBetweenParagraphs);
        }
        
        // Check if both conditions are met for progression (only if we've already started typing)
        if (typingStarted) {
          checkForProgression();
        }
        
        return false;
      }
    }

    // Touch handling for mobile devices
    let touchStartY = 0;
    let touchLastY = 0;
    
    function handleTouchStart(e: TouchEvent) {
      if (currentScrollImage && !imageLocked) {
        touchStartY = e.touches[0].clientY;
        touchLastY = touchStartY;
        console.log('👆 TOUCH START:', { touchStartY });
      }
    }
    
    function handleTouchMove(e: TouchEvent) {
      // ALWAYS hide scroll hint when user starts touching (regardless of image state)
      hideScrollHint();
      
      // Clear any existing timeout and set a new one to show hint again if user stops
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (currentScrollImage && !imageLocked) {
          showScrollHint();
        }
      }, 2000); // Show hint again after 2 seconds of no touching
      
      if (currentScrollImage && !imageLocked) {
        // Prevent default scroll behavior when we have an active image
        e.preventDefault();
        e.stopPropagation();
        
        const touchCurrentY = e.touches[0].clientY;
        const touchDelta = touchLastY - touchCurrentY; // Inverted for natural scroll direction
        
        // Use touch delta for image movement (similar to wheel)
        const touchSensitivity = 0.003;
        const progressChange = touchDelta * touchSensitivity;
        
        const oldProgress = imageProgress;
        imageProgress = Math.max(0, Math.min(1, imageProgress + progressChange));
        
        console.log('👆 TOUCH controlling image:', { touchDelta, progressChange, oldProgress, newProgress: imageProgress });
        
        updateImagePosition(imageProgress);
        
        // Update imageAtCenter flag
        const wasAtCenter = imageAtCenter;
        imageAtCenter = imageProgress >= 1;
        
        // If image just reached center for the first time AND we haven't started typing yet
        if (imageAtCenter && !wasAtCenter && !typingStarted) {
          // Remove scroll hint when image reaches center
          const scrollHint = document.querySelector('.scroll-hint');
          if (scrollHint) {
            scrollHint.remove();
            console.log('📝 Scroll hint removed - image reached center');
          }
          
          typingStarted = true;
          imageLocked = true; // Lock the image at center position - no more movement
          // Force image to exact center position when locking
          if (currentScrollImage) {
            currentScrollImage.style.right = `${getCenterPosition()}%`;
          }
          console.log('🔒 Image reached center and locked - starting to type paragraph');
          setTimeout(() => typeNextChar(), pauseBetweenParagraphs);
        }
        
        // Check if both conditions are met for progression (only if we've already started typing)
        if (typingStarted) {
          checkForProgression();
        }
        
        touchLastY = touchCurrentY;
        return false;
      }
    }
    
    function handleTouchEnd(_e: TouchEvent) {
      if (currentScrollImage && !imageLocked) {
        console.log('👆 TOUCH END');
        // Reset touch tracking
        touchStartY = 0;
        touchLastY = 0;
      }
    }
    
    function checkForProgression() {
      // Only advance if BOTH conditions are true: paragraph completed AND image at center
      if (paragraphCompleted && imageAtCenter && currentParagraph < storyData.length - 1) {
        console.log('🎯 Both conditions met - advancing to next paragraph');
        console.log('   📝 Paragraph completed:', paragraphCompleted);
        console.log('   🖼️ Image at center:', imageAtCenter);
        
        // Remove scroll hint if it exists
        const scrollHint = document.querySelector('.scroll-hint');
        if (scrollHint) {
          scrollHint.remove();
          console.log('📝 Scroll hint removed - advancing to next paragraph');
        }
        
        // Lock current image at center
        if (currentScrollImage) {
          currentScrollImage.style.right = `${getCenterPosition()}%`;
          console.log('🔒 Image locked at center position');
        }
        
        // Reset flags
        paragraphCompleted = false;
        imageAtCenter = false;
        typingStarted = false; // Reset typing flag for the new paragraph
        imageLocked = false; // Unlock for the new image
        
        // Remove current scroll listener temporarily
        if (scrollListener) {
          window.removeEventListener('scroll', scrollListener);
          scrollListener = null;
        }
        
        // Advance to next paragraph
        currentParagraph++;
        currentChar = 0;
        currentScrollImage = null;
        imageProgress = 0;
        
        // Create image for the NEW current paragraph (if it has one)
        const currentStoryItem = storyData[currentParagraph];
        if (currentStoryItem && currentStoryItem.image) {
          currentScrollImage = createScrollImage(currentStoryItem.image, currentParagraph);
          imageProgress = 0;
          updateImagePosition(0);
          console.log('🖼️ Created image for current paragraph:', currentStoryItem.text.substring(0, 30) + '...');
          
          // Calculate scroll position to make the new image visible
          // Each image is positioned at: baseTopOffset + (paragraphIndex - 1) * verticalSpacing
          const baseTopOffset = 80;
          const verticalSpacing = 400;
          const imageTopPosition = baseTopOffset + (currentParagraph - 1) * verticalSpacing;
          
          // Scroll to position where image is visible (with some offset for better view)
          const targetScrollY = imageTopPosition - 100; // 100px above the image
          
          console.log('📜 Auto-scrolling to make new image visible:', { imageTopPosition, targetScrollY });
          window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
          });
          
          // Small delay to let scroll animation complete, then reactivate listeners
          setTimeout(() => {
            // Reactivate scroll listener for this new image
            scrollListener = handleScroll;
            window.addEventListener('scroll', scrollListener);
            window.addEventListener('touchstart', handleTouchStart, { passive: false });
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', handleTouchEnd, { passive: false });
            lastScrollY = window.scrollY;
            
            // Show scroll hint when scroll lock is active
            showScrollHint();
            
            console.log('🔄 Scroll and touch listeners reactivated - waiting for image to reach center before typing');
          }, 800); // Wait for smooth scroll to complete
          
          // DON'T start typing yet - the image needs to reach center first
          // The typing will be triggered by the scroll handler when imageAtCenter becomes true
        } else {
          // No image for this paragraph, start typing immediately
          setTimeout(() => typeNextChar(), pauseBetweenParagraphs);
        }
      } else {
        console.log('⏳ Waiting for conditions:', { 
          paragraphCompleted, 
          imageAtCenter, 
          canProgress: currentParagraph < storyData.length - 1 
        });
      }
    }
    
    function typeNextChar() {
      if (currentParagraph >= storyData.length) {
        // Finished typing, cleanup
        setTimeout(() => {
          const cursor = document.querySelector('.typewriter-cursor');
          if (cursor) cursor.remove();
          if (scrollListener) {
            window.removeEventListener('scroll', scrollListener);
            scrollListener = null;
          }
          // DON'T remove the last image - let it stay visible
          // Keep the last image locked at center position
          if (currentScrollImage) {
            currentScrollImage.style.right = `${getCenterPosition()}%`;
            console.log('🔒 Last image locked at center - keeping visible');
            currentScrollImage = null; // Clear reference but don't remove from DOM
          }
        }, 2000);
        return;
      }
      
      const currentStoryItem = storyData[currentParagraph];
      const currentText = currentStoryItem.text;
      
      if (currentChar === 0) {
        // Start new paragraph
        const p = document.createElement('p');
        
        // Calculate position based on paragraph index and corresponding image
        if (currentParagraph > 0) {
          // For paragraphs with images, position them below the actual image
          const positionParagraph = () => {
            let paragraphTopPosition = 0;
            
            if (currentScrollImage) {
              // Get the image's top position (from its style.top)
              const imageTop = parseInt(currentScrollImage.style.top) || 0;
              
              if (currentScrollImage.complete && currentScrollImage.naturalHeight > 0) {
                // Image is loaded, use actual height
                const imageHeight = currentScrollImage.offsetHeight;
                paragraphTopPosition = imageTop + imageHeight + 20; // 20px below the image
                
                console.log('📍 Positioning paragraph below loaded image:', {
                  imageTop,
                  imageHeight,
                  paragraphTop: paragraphTopPosition
                });
              } else {
                // Image not loaded yet, estimate height
                const estimatedImageHeight = 150; // Reasonable estimate
                paragraphTopPosition = imageTop + estimatedImageHeight + 20; // 20px below estimated image
                
                console.log('📍 Using estimated paragraph position:', {
                  imageTop,
                  estimatedHeight: estimatedImageHeight,
                  paragraphTop: paragraphTopPosition
                });
              }
            } else {
              // Fallback - no current image
              const baseTopOffset = 80;
              const verticalSpacing = 400;
              const imageTopPosition = baseTopOffset + (currentParagraph - 1) * verticalSpacing;
              paragraphTopPosition = imageTopPosition + 170; // Estimated image + spacing
              
              console.log('📍 Using fallback paragraph position:', paragraphTopPosition);
            }
            
            p.style.top = `${paragraphTopPosition}px`;
          };
          
          p.style.position = 'absolute';
          p.style.left = '50%';
          p.style.transform = 'translateX(-50%)';
          p.style.width = '80%';
          
          // Position immediately, and also when image loads (if not loaded yet)
          positionParagraph();
          
          if (currentScrollImage && !currentScrollImage.complete) {
            currentScrollImage.addEventListener('load', positionParagraph, { once: true });
          }
        }
        
        p.style.marginBottom = '1.5rem';
        p.style.fontSize = '1.2rem';
        p.style.color = 'var(--text-light)';
        p.style.lineHeight = '1.7';
        p.style.textAlign = 'center';
        if (typewriterText) typewriterText.appendChild(p);
      }
      
      if (currentChar < currentText.length) {
        // Remove previous cursor
        const existingCursor = document.querySelector('.typewriter-cursor');
        if (existingCursor) existingCursor.remove();
        
        // Add next character
        const currentP = typewriterText?.lastElementChild as HTMLParagraphElement;
        const textContent = currentText.substring(0, currentChar + 1);
        
        // Create cursor
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        cursor.textContent = '|';
        
        currentP.innerHTML = textContent + cursor.outerHTML;
        
        currentChar++;
        setTimeout(typeNextChar, typeSpeed);
      } else {
        // Finished current paragraph
        const existingCursor = document.querySelector('.typewriter-cursor');
        if (existingCursor) existingCursor.remove();
        
        console.log(`✅ Finished paragraph ${currentParagraph}: "${currentText}"`);
        
        // Handle paragraph completion
        if (currentParagraph === 0) {
          // First paragraph - show scroll hint and setup scroll listener
          isWaitingForScroll = true;
          
          const scrollHint = document.createElement('p');
          scrollHint.className = 'scroll-hint';
          scrollHint.innerHTML = '<span style="color: var(--primary-color); font-style: italic; font-size: 1rem;">Role para baixo para continuar a história...</span>';
          scrollHint.style.marginTop = '2rem';
          scrollHint.style.textAlign = 'center';
          scrollHint.style.animation = 'fadeIn 0.5s ease-in-out';
          if (typewriterText) typewriterText.appendChild(scrollHint);
          
          scrollListener = handleScroll;
          window.addEventListener('scroll', scrollListener);
          lastScrollY = window.scrollY;
          
        } else if (currentParagraph < storyData.length - 1) {
          // Middle paragraphs - set flag that paragraph is completed
          paragraphCompleted = true;
          console.log('📝 Paragraph completed, waiting for image to reach center');
          
          // Check if we can advance immediately
          checkForProgression();
        } else {
          // Last paragraph - finish and ensure image is at center
          if (currentScrollImage) {
            currentScrollImage.style.right = `${getCenterPosition()}%`;
            console.log('🔒 Final image repositioned to center');
          }
          currentParagraph = storyData.length; // Trigger completion
          setTimeout(typeNextChar, pauseBetweenParagraphs);
        }
      }
    }
    
    // Handle first scroll to start the scroll-based system
    const initialScrollListener = () => {
      if (isWaitingForScroll) {
        isWaitingForScroll = false;
        
        // Remove scroll hint
        const hint = document.querySelector('.scroll-hint');
        if (hint) hint.remove();
        
        // Move to second paragraph (first one is done)
        currentParagraph = 1; // Second paragraph
        currentChar = 0;
        
        // Reset progression flags
        paragraphCompleted = false;
        imageAtCenter = false;
        typingStarted = false; // Reset typing flag - we'll wait for image to reach center
        imageLocked = false; // Unlock for the new image
        
        // Create image for the SECOND paragraph (we're about to type it)
        const currentStoryItem = storyData[currentParagraph];
        if (currentStoryItem.image) {
          currentScrollImage = createScrollImage(currentStoryItem.image, currentParagraph);
          imageProgress = 0;
          updateImagePosition(0);
        }
        
        // Replace scroll listener with the image movement handler
        window.removeEventListener('scroll', initialScrollListener);
        scrollListener = handleScroll;
        window.addEventListener('scroll', scrollListener);
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd, { passive: false });
        lastScrollY = window.scrollY;
        
        // Show scroll hint when scroll lock is active for second paragraph
        showScrollHint();
        
        // DON'T start typing yet - wait for image to reach center first
        console.log('🖼️ Second paragraph image created, waiting for it to reach center before typing');
      }
    };
    
    // Start typing first paragraph
    setTimeout(typeNextChar, 500);
    
    // Set initial scroll listener
    window.addEventListener('scroll', initialScrollListener);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
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
      },
      {
        image: '/gallery/galeria8.jpeg',
        text: 'Biscoidinos com brinde de Halloween!',
      },
      {
        image: '/gallery/galeria9.jpeg',
        text: 'Biscoidinos assustadores de Halloween! 🎃',
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
              <button class="zoom-btn" onclick="zoomImage(-1)" title="Diminuir zoom">🔍-</button>
              <button class="zoom-btn" onclick="zoomImage(1)" title="Aumentar zoom">🔍+</button>
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
  (window as any).currentZoomLevel = 0; // 0 = normal, 1 = zoomed (same as gallery modal)
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
    // 1 dinosaur, 6 hearts, 6 flowers, 5 stars
    const biscuitConfigs = [
      { count: 1, type: 'dinosaur', image: '/biscuits/biscoidino_biscuit1.png' },
      { count: 2, type: 'flower1', image: '/biscuits/flower_baunilha1.png' },
      { count: 2, type: 'flower2', image: '/biscuits/flower_baunilha2.png' },
      { count: 2, type: 'heart1', image: '/biscuits/heart_baunilha1.png' },
      { count: 2, type: 'heart2', image: '/biscuits/heart_baunilha2.png' },
      { count: 2, type: 'star1', image: '/biscuits/star_baunilha1.png' },
      { count: 3, type: 'star2', image: '/biscuits/star_baunilha2.png' }
    ];
    
    biscuitConfigs.forEach(config => {
      for (let i = 0; i < config.count; i++) {
        const x = Math.random() * (canvas.width - 100) + 50;
        const y = Math.random() * 100 + 50;
        
        const biscuit = createStandardBiscuit(Matter, x, y, config.image, {
          restitution: 0.3,
          friction: 0.4
        });
        
        biscuits.push(biscuit);
      }
    });
  } else {
    // 21 parmesão biscuits - mix of both types
    for (let i = 0; i < 21; i++) {
      const x = Math.random() * (canvas.width - 100) + 50;
      const y = Math.random() * 150 + 50;
      
      // Alternate between the two new parmesao biscuit package types
      const biscuitType = i % 2 === 0 ? '/biscuits/parmesao_biscuit1.png' : '/biscuits/parmesao_biscuit2.png';
      
      const biscuit = createStandardBiscuit(Matter, x, y, biscuitType, {
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
(window as any).zoomImage = function(direction: number) {
  const currentLevel = (window as any).currentZoomLevel || 0;
  const newLevel = Math.max(0, Math.min(1, currentLevel + direction));
  
  (window as any).currentZoomLevel = newLevel;
  (window as any).imagePosition = { x: 0, y: 0 }; // Reset position when changing zoom
  updateImageTransform();
};

(window as any).resetZoom = function() {
  (window as any).currentZoomLevel = 0;
  (window as any).imagePosition = { x: 0, y: 0 };
  updateImageTransform();
};

function updateImageTransform() {
  const activeSlide = document.querySelector('.carousel-slide.active');
  if (activeSlide) {
    const img = activeSlide.querySelector('.carousel-image') as HTMLImageElement;
    if (img) {
      const zoomLevel = (window as any).currentZoomLevel || 0;
      const position = (window as any).imagePosition || { x: 0, y: 0 };
      
      // Simple 2-level zoom: 1x and 2x (same as gallery modal)
      const scale = zoomLevel === 0 ? 1 : 2;
      
      img.style.transform = `scale(${scale}) translate(${position.x}px, ${position.y}px)`;
      img.style.cursor = zoomLevel > 0 ? 'move' : 'zoom-in';
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
    if (activeImg && (window as any).currentZoomLevel > 0) {
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
    
    if (isImageDrag && (window as any).currentZoomLevel > 0) {
      // Drag zoomed image - use scale 2 for calculations
      const deltaX = (clientX - startX) / 2;
      const deltaY = (clientY - startY) / 2;
      
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
      activeImg.style.cursor = (window as any).currentZoomLevel > 0 ? 'move' : 'zoom-in';
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
  
  // Add pinch-to-zoom support for mobile
  let initialDistance = 0;
  
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
    }
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && initialDistance > 0) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      
      const scale = currentDistance / initialDistance;
      
      if (scale > 1.2 && (window as any).currentZoomLevel === 0) {
        // Pinch out - zoom in
        (window as any).zoomImage(1);
      } else if (scale < 0.8 && (window as any).currentZoomLevel === 1) {
        // Pinch in - zoom out
        (window as any).zoomImage(-1);
      }
    }
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (e.touches.length < 2) {
      initialDistance = 0;
    }
  };
  
  // Add pinch event listeners to carousel images
  images.forEach(img => {
    img.addEventListener('touchstart', handleTouchStart, { passive: false });
    img.addEventListener('touchmove', handleTouchMove, { passive: false });
    img.addEventListener('touchend', handleTouchEnd);
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
      img.removeEventListener('touchstart', handleTouchStart);
      img.removeEventListener('touchmove', handleTouchMove);
      img.removeEventListener('touchend', handleTouchEnd);
    });
  };
}

// Gallery Carousel Functions
let currentGallerySlide = 0;
const totalGallerySlides = 9;

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
  let startY = 0;
  let endX = 0;
  let dragStartTime = 0;
  let hasMoved = false;
  
  // Handle mouse and touch events for gallery dragging
  const handleStart = (e: MouseEvent | TouchEvent) => {
    isDragging = true;
    hasMoved = false;
    dragStartTime = Date.now();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    startX = clientX;
    startY = clientY;
    endX = clientX;
    
    galleryContainer.style.cursor = 'grabbing';
    e.preventDefault();
  };
  
  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    endX = clientX;
    
    // Check if user has moved significantly
    const moveDistance = Math.sqrt(Math.pow(clientX - startX, 2) + Math.pow(clientY - startY, 2));
    if (moveDistance > 10) {
      hasMoved = true;
    }
    
    e.preventDefault();
  };
  
  const handleEnd = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    isDragging = false;
    galleryContainer.style.cursor = 'grab';
    
    const clickDuration = Date.now() - dragStartTime;
    const dragDistance = endX - startX;
    const threshold = 50; // Minimum drag distance to change slides
    
    // If it was a quick tap/click without significant movement, open modal
    if (clickDuration < 300 && !hasMoved) {
      const target = e.target as HTMLElement;
      const slide = target.closest('.gallery-slide.active') as HTMLElement;
      if (slide && slide.dataset.imageSrc) {
        openGalleryImageModal(slide.dataset.imageSrc);
      }
      return;
    }
    
    // Handle gallery navigation only if user dragged significantly
    if (hasMoved && Math.abs(dragDistance) > threshold) {
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

// Gallery Image Modal Functions
function openGalleryImageModal(imageSrc: string) {
  const modalHTML = `
    <div id="galleryImageModal" class="modal gallery-image-modal">
      <div class="modal-content gallery-modal-content">
        <div class="modal-header">
          <h2>Galeria</h2>
          <button class="close-modal" onclick="closeGalleryImageModal()">&times;</button>
        </div>
        <div class="gallery-image-container">
          <img id="galleryModalImage" src="${imageSrc}" alt="Imagem da galeria" class="gallery-modal-image" />
          <div class="zoom-controls gallery-zoom-controls">
            <button class="zoom-btn gallery-zoom-btn" onclick="galleryZoomImage(-1)" title="Diminuir zoom">🔍-</button>
            <button class="zoom-btn gallery-zoom-btn" onclick="galleryZoomImage(1)" title="Aumentar zoom">🔍+</button>
            <button class="zoom-btn gallery-zoom-btn" onclick="galleryResetZoom()" title="Resetar zoom">⌂</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Initialize zoom state
  (window as any).galleryZoomLevel = 0; // 0 = normal, 1 = zoomed
  (window as any).galleryImagePosition = { x: 0, y: 0 };
  
  // Setup interactions
  setTimeout(() => setupGalleryModalInteractions(), 50);
}

(window as any).closeGalleryImageModal = function() {
  const modal = document.getElementById('galleryImageModal');
  if (modal) {
    document.body.removeChild(modal);
  }
  
  // Cleanup event listeners
  if ((window as any).galleryModalCleanup) {
    (window as any).galleryModalCleanup();
  }
};

(window as any).galleryZoomImage = function(direction: number) {
  const currentLevel = (window as any).galleryZoomLevel || 0;
  const newLevel = Math.max(0, Math.min(1, currentLevel + direction));
  
  (window as any).galleryZoomLevel = newLevel;
  updateGalleryImageTransform();
};

(window as any).galleryResetZoom = function() {
  (window as any).galleryZoomLevel = 0;
  (window as any).galleryImagePosition = { x: 0, y: 0 };
  updateGalleryImageTransform();
};

function updateGalleryImageTransform() {
  const image = document.getElementById('galleryModalImage') as HTMLImageElement;
  if (!image) return;
  
  const zoomLevel = (window as any).galleryZoomLevel || 0;
  const position = (window as any).galleryImagePosition || { x: 0, y: 0 };
  
  // Simple 2-level zoom: 1x and 2x
  const scale = zoomLevel === 0 ? 1 : 2;
  
  image.style.transform = `scale(${scale}) translate(${position.x}px, ${position.y}px)`;
  image.style.cursor = zoomLevel > 0 ? 'move' : 'zoom-in';
}

function setupGalleryModalInteractions() {
  const image = document.getElementById('galleryModalImage') as HTMLImageElement;
  const container = image.parentElement as HTMLElement;
  
  if (!image || !container) return;
  
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialPosition = { x: 0, y: 0 };
  
  // Desktop mouse interactions
  const handleMouseDown = (e: MouseEvent) => {
    const zoomLevel = (window as any).galleryZoomLevel || 0;
    
    if (zoomLevel === 0) {
      // Not zoomed, zoom in on click
      (window as any).galleryZoomImage(1);
      return;
    }
    
    // Zoomed in, allow dragging
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialPosition = { ...(window as any).galleryImagePosition };
    e.preventDefault();
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    const zoomLevel = (window as any).galleryZoomLevel || 0;
    if (!isDragging || zoomLevel === 0) return;
    
    const deltaX = (e.clientX - startX) / 2; // Reduce sensitivity
    const deltaY = (e.clientY - startY) / 2;
    
    (window as any).galleryImagePosition = {
      x: initialPosition.x + deltaX,
      y: initialPosition.y + deltaY
    };
    
    updateGalleryImageTransform();
  };
  
  const handleMouseUp = () => {
    isDragging = false;
  };
  
  // Touch interactions for mobile
  let initialDistance = 0;
  
  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      // Pinch gesture
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
    } else if (e.touches.length === 1) {
      // Single touch
      const zoomLevel = (window as any).galleryZoomLevel || 0;
      if (zoomLevel === 0) {
        // Not zoomed, zoom in on tap
        (window as any).galleryZoomImage(1);
      } else {
        // Zoomed in, prepare for dragging
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialPosition = { ...(window as any).galleryImagePosition };
      }
    }
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const scale = currentDistance / initialDistance;
      const newZoom = scale > 1.2 ? 1 : 0; // Simple threshold
      
      if (newZoom !== (window as any).galleryZoomLevel) {
        (window as any).galleryZoomLevel = newZoom;
        updateGalleryImageTransform();
      }
    } else if (e.touches.length === 1 && isDragging) {
      // Pan when zoomed
      const zoomLevel = (window as any).galleryZoomLevel || 0;
      if (zoomLevel > 0) {
        const deltaX = (e.touches[0].clientX - startX) / 2;
        const deltaY = (e.touches[0].clientY - startY) / 2;
        
        (window as any).galleryImagePosition = {
          x: initialPosition.x + deltaX,
          y: initialPosition.y + deltaY
        };
        
        updateGalleryImageTransform();
      }
    }
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (e.touches.length === 0) {
      isDragging = false;
    }
  };
  
  // Add event listeners
  image.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  image.addEventListener('touchstart', handleTouchStart, { passive: false });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd, { passive: false });
  
  // Prevent context menu
  image.addEventListener('contextmenu', (e) => e.preventDefault());
  
  // Store cleanup function
  (window as any).galleryModalCleanup = () => {
    image.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    image.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    
    image.removeEventListener('contextmenu', (e) => e.preventDefault());
  };
  
  // Initialize transform
  updateGalleryImageTransform();
}

// Centralized Biscuit Configuration
function getBiscuitConfig(texture: string) {
  const radiusMap: any = {
    '/biscuits/parmesao_biscuit1.png': 27,
    '/biscuits/parmesao_biscuit2.png': 27,
    '/biscuits/biscoidino_biscuit1.png': 45,
    '/biscuits/heart_baunilha1.png': 28,
    '/biscuits/star_baunilha1.png': 30,
    '/biscuits/flower_baunilha1.png': 35,
    '/biscuits/heart_baunilha2.png': 28,
    '/biscuits/star_baunilha2.png': 30,
    '/biscuits/flower_baunilha2.png': 35,
    'default': 25
  };

  const scaleMap: any = {
    '/biscuits/parmesao_biscuit1.png': 0.25,
    '/biscuits/parmesao_biscuit2.png': 0.25,
    '/biscuits/biscoidino_biscuit1.png': 0.42,
    '/biscuits/heart_baunilha1.png': 0.35,
    '/biscuits/star_baunilha1.png': 0.4,
    '/biscuits/flower_baunilha1.png': 0.35,
    '/biscuits/heart_baunilha2.png': 0.35,
    '/biscuits/star_baunilha2.png': 0.4,
    '/biscuits/flower_baunilha2.png': 0.35,
    'default': 0.3
  };

  return {
    radius: radiusMap[texture] || radiusMap['default'],
    scale: scaleMap[texture] || scaleMap['default']
  };
}

function createStandardBiscuit(Matter: any, x: number, y: number, texture: string, physicsOptions: any = {}) {
  const config = getBiscuitConfig(texture);
  const Bodies = Matter.Bodies;
  
  const defaultPhysics = {
    restitution: 0.6,
    frictionAir: 0.01,
    density: 0.002
  };

  return Bodies.circle(x, y, config.radius, { 
    ...defaultPhysics,
    ...physicsOptions,
    render: { 
      sprite: {
        texture: texture,
        xScale: config.scale,
        yScale: config.scale
      }
    }
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
  engine.world.gravity.y = 0.3;
  
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
  
  const centerX = canvasWidth / 2;
  
  // Check if we have saved biscuit states from resize
  const savedStates = (window as any).homeBiscuitStates;
  let useDefaultPositions = !savedStates || savedStates.length === 0;
  
  // Default positions for first load - distributed equally across 3 formats
  const defaultPositions = [
    { x: centerX + 100, y: 10, texture: '/biscuits/biscoidino_biscuit1.png' },
    { x: centerX - 100, y: 30, texture: '/biscuits/flower_baunilha1.png' },
    { x: centerX - 100, y: 30, texture: '/biscuits/flower_baunilha2.png' },
    { x: centerX + 80, y: 40, texture: '/biscuits/heart_baunilha1.png' },
    { x: centerX + 80, y: 40, texture: '/biscuits/heart_baunilha2.png' },
    { x: centerX - 40, y: 20, texture: '/biscuits/star_baunilha1.png' },
    { x: centerX - 40, y: 20, texture: '/biscuits/star_baunilha2.png' },
    { x: centerX + 50, y: 35, texture: '/biscuits/flower_baunilha1.png' },
    { x: centerX - 60, y: 45, texture: '/biscuits/heart_baunilha1.png' },
    { x: centerX - 40, y: 20, texture: '/biscuits/star_baunilha2.png' },
    { x: centerX + 50, y: 35, texture: '/biscuits/flower_baunilha1.png' },
    { x: centerX - 60, y: 45, texture: '/biscuits/heart_baunilha1.png' },
    { x: centerX - 40, y: 20, texture: '/biscuits/star_baunilha2.png' },
    { x: centerX + 50, y: 35, texture: '/biscuits/flower_baunilha1.png' },
  ];
  
  const biscuits = [];
  
  for (let i = 0; i < defaultPositions.length; i++) {
    const defaultPos = defaultPositions[i];
    const savedState = savedStates && savedStates[i];
    
    // Use saved position if available, otherwise use default
    const x = savedState ? savedState.x * canvasWidth : defaultPos.x;
    const y = savedState ? savedState.y * canvasHeight : defaultPos.y;

    const biscuit = createStandardBiscuit(Matter, x, y, defaultPos.texture);
    
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
      
      // Disable pointer events on home-content during drag
      const homeContent = document.querySelector('.home-content') as HTMLElement;
      if (homeContent) {
        homeContent.style.pointerEvents = 'none';
      }
      
      console.log('🔒 Drag protection enabled');
    }
  };
  
  // Function to disable drag protection
  const disableDragProtection = () => {
    if (isDragging) {
      isDragging = false;
      document.body.classList.remove('drag-mode');
      
      // Re-enable pointer events on home-content after drag
      const homeContent = document.querySelector('.home-content') as HTMLElement;
      if (homeContent) {
        homeContent.style.pointerEvents = '';
      }
      
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
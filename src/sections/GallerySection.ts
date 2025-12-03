// Gallery Section - Image carousel
import { Section } from './Section';
import { galleryData, totalGallerySlides } from '../data';

export class GallerySection extends Section {
  private currentSlide = 0;

  render(): string {
    return `
      <section id="gallery" class="gallery-section">
        <h2 class="trademark-name">GALERIA</h2>
        <p class="gallery-subtitle">Veja alguns de nossos clientes satisfeitos e os bastidores dos biscoidinos!</p>
        ${this.renderCarousel()}
      </section>
    `;
  }

  private renderCarousel(): string {
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
          <button class="gallery-nav-btn prev" id="galleryPrevBtn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-16.5 0 93 93" fill="none"><g stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.7064 48.1102C17.149 53.632 23.1985 59.3212 29.7705 64.3264C38.6199 71.0663 47.8545 77.3022 56.9606 83.7028C59.4671 85.465 60.3893 87.9492 59.0937 90.1007C57.7619 92.3106 54.8812 92.8397 52.5066 91.0623C40.8894 82.3658 29.2283 73.7159 17.7673 64.8127C12.7745 60.9344 8.23591 56.4772 3.4663 52.3075C-0.143558 49.1571 -0.122472 46.0926 3.55171 43.0531C16.0899 32.683 28.6195 22.303 41.1402 11.9132C45.2489 8.48711 49.1474 4.8116 53.2534 1.37829C54.2138 0.544365 55.4274 0.0587681 56.6979 0C58.5672 0.0656338 59.2918 2.26633 58.0047 4.03385C56.7172 5.79958 55.2582 7.4337 53.6492 8.9124C40.2941 21.1724 26.9112 33.4021 13.5004 45.6017C12.703 46.3309 11.8937 47.0457 10.7064 48.1102Z" fill="#ffffff"></path> </g></svg></button>
          <button class="gallery-nav-btn next" id="galleryNextBtn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-15 0 91 91" fill="none"><g stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M50.4346 45.4919C44.987 41.1817 40.1398 37.3172 35.2626 33.4855C27.2756 27.2103 19.1692 21.0806 11.3247 14.6347C8.05416 11.9437 5.30221 8.62145 2.3651 5.53797C1.10427 4.21414 0.00225389 2.50952 1.49805 0.913964C3.15793 -0.858149 4.96936 0.25769 6.35488 1.636C21.2597 16.4653 39.7113 26.6458 56.0863 39.5501C60.9117 43.3529 61.5404 46.5544 57.4547 51.2597C56.19 52.7677 54.8172 54.1815 53.3468 55.4898C42.6584 64.6667 32.0394 73.9329 21.1403 82.8538C17.6407 85.7181 13.3954 87.6905 9.40551 89.9187C8.72554 90.2987 6.9344 90.1445 6.82807 89.8354C6.43427 88.6973 6.00249 87.0334 6.55054 86.2097C8.70464 82.9667 10.8522 79.5598 13.6876 76.9607C20.5305 70.6887 27.7726 64.8532 34.8263 58.809C38.9743 55.2543 43.0627 51.6292 47.1936 48.0535C48.0974 47.2711 49.0701 46.5657 50.4346 45.4919Z" fill="#ffffff"></path> </g></svg></button>
          <div class="gallery-indicators" id="galleryIndicators">
            ${galleryData.map((_, index) => `
              <span class="dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  init(): void {
    this.element = document.getElementById('gallery');
    this.setupNavigation();
    this.setupDrag();
    this.applyImageIntelligence();
    this.updateSlide();
  }

  private setupNavigation(): void {
    // Navigation buttons
    document.getElementById('galleryPrevBtn')?.addEventListener('click', () => this.prevSlide());
    document.getElementById('galleryNextBtn')?.addEventListener('click', () => this.nextSlide());
    
    // Indicator dots
    document.querySelectorAll('.gallery-indicators .dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-slide') || '0');
        this.goToSlide(index);
      });
    });
  }

  private setupDrag(): void {
    const container = document.querySelector('.gallery-slides-container') as HTMLElement;
    if (!container) return;
    
    let isDragging = false;
    let startX = 0;
    let endX = 0;
    let dragStartTime = 0;
    let hasMoved = false;
    
    const handleStart = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      hasMoved = false;
      dragStartTime = Date.now();
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      startX = clientX;
      endX = clientX;
      
      container.style.cursor = 'grabbing';
      e.preventDefault();
    };
    
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      endX = clientX;
      
      const moveDistance = Math.sqrt(Math.pow(clientX - startX, 2) + Math.pow(clientY - (('touches' in e ? e.touches[0].clientY : e.clientY)), 2));
      if (moveDistance > 10) {
        hasMoved = true;
      }
      
      e.preventDefault();
    };
    
    const handleEnd = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      isDragging = false;
      container.style.cursor = 'grab';
      
      const clickDuration = Date.now() - dragStartTime;
      const dragDistance = endX - startX;
      const threshold = 50;
      
      // If quick tap without movement, open modal
      if (clickDuration < 300 && !hasMoved) {
        const target = e.target as HTMLElement;
        const slide = target.closest('.gallery-slide.active') as HTMLElement;
        if (slide?.dataset.imageSrc) {
          // Use global function like original
          (window as any).openGalleryModal?.(slide.dataset.imageSrc);
        }
        return;
      }
      
      // Handle swipe navigation
      if (hasMoved && Math.abs(dragDistance) > threshold) {
        if (dragDistance > 0) {
          this.prevSlide();
        } else {
          this.nextSlide();
        }
      }
    };
    
    container.style.cursor = 'grab';
    
    container.addEventListener('mousedown', handleStart);
    container.addEventListener('touchstart', handleStart, { passive: false });
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });
    
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
    
    container.addEventListener('dragstart', (e) => e.preventDefault());
    container.addEventListener('selectstart', (e) => e.preventDefault());
  }

  private applyImageIntelligence(): void {
    const slides = document.querySelectorAll('.gallery-slide[data-image-src]');
    
    slides.forEach((slide) => {
      const slideElement = slide as HTMLElement;
      const imageSrc = slideElement.dataset.imageSrc;
      
      if (!imageSrc) return;
      
      const img = new Image();
      
      img.onload = () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const slideAspectRatio = 0.7 / 0.5;
        
        let backgroundSize = 'contain';
        let backgroundColor = 'var(--background)';
        
        if (Math.abs(aspectRatio - slideAspectRatio) < 0.3) {
          backgroundSize = 'cover';
        } else if (aspectRatio > slideAspectRatio) {
          backgroundSize = 'contain';
          backgroundColor = 'linear-gradient(135deg, var(--background), var(--primary-color)15%)';
        }
        
        slideElement.style.background = `${backgroundColor} url('${imageSrc}') center/contain no-repeat`;
        
        if (backgroundSize === 'contain') {
          slideElement.style.border = '2px solid rgba(255, 182, 191, 0.2)';
        }
      };
      
      img.onerror = () => {
        slideElement.style.background = 'var(--background)';
        slideElement.innerHTML = '<div style="color: var(--text-light); text-align: center;">Imagem não encontrada</div>';
      };
      
      img.src = imageSrc;
    });
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % totalGallerySlides;
    this.updateSlide();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + totalGallerySlides) % totalGallerySlides;
    this.updateSlide();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.updateSlide();
  }

  private updateSlide(): void {
    const slides = document.querySelectorAll('.gallery-slide');
    const indicators = document.querySelectorAll('.gallery-indicators .dot');
    
    if (slides.length === 0) return;
    
    const prevSlideIndex = (this.currentSlide - 1 + totalGallerySlides) % totalGallerySlides;
    const nextSlideIndex = (this.currentSlide + 1) % totalGallerySlides;
    
    // Reset all slides
    slides.forEach((slideElement) => {
      const slide = slideElement as HTMLElement;
      slide.classList.remove('active', 'prev-slide', 'next-slide');
      slide.style.display = 'none';
    });
    
    // Show relevant slides
    slides.forEach((slideElement, index) => {
      const slide = slideElement as HTMLElement;
      
      if (index === this.currentSlide) {
        slide.style.display = 'block';
        slide.classList.add('active');
      } else if (index === prevSlideIndex) {
        slide.style.display = 'block';
        slide.classList.add('prev-slide');
      } else if (index === nextSlideIndex) {
        slide.style.display = 'block';
        slide.classList.add('next-slide');
      }
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentSlide);
    });
  }
}

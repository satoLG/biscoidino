// Gallery Image Modal - Full screen gallery image with zoom
export class GalleryModal {
  private modalElement: HTMLElement | null = null;
  private zoomLevel = 0;
  private imagePosition = { x: 0, y: 0 };
  private cleanupFn: (() => void) | null = null;
  private originalBodyOverflow: string = '';
  private originalBodyPosition: string = '';
  private scrollPosition: number = 0;
  private escapeKeyHandler: ((e: KeyboardEvent) => void) | null = null;

  open(imageSrc: string): void {
    // Block body scroll
    this.blockBodyScroll();
    
    // Add escape key handler
    this.setupEscapeKeyHandler();
    
    this.createModalHTML(imageSrc);
    this.setupInteractions();
  }

  private createModalHTML(imageSrc: string): void {
    const modalHTML = `
      <div id="galleryImageModal" class="modal gallery-image-modal">
        <div class="modal-content gallery-modal-content">
          <div class="modal-header">
            <h2 class="trademark-name">GALERIA</h2>
            <button class="close-modal" id="closeGalleryModal">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1.5 130 130" fill="none"><g stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip-close)"> <path d="M62.3649 76.0626C51.1451 86.1072 40.1732 95.8365 29.311 105.687C23.0183 111.394 16.9509 117.348 10.6729 123.069C9.0008 124.632 7.07937 125.903 4.98785 126.828C3.95649 127.261 1.72933 126.828 1.22143 126.035C0.549397 124.982 0.748089 123.114 1.11261 121.74C1.37779 120.738 2.45753 119.908 3.27208 119.104C18.7627 103.852 34.2604 88.6091 49.7649 73.3765C51.5045 71.6681 53.2942 70.0117 55.293 68.1144C48.5175 60.6052 41.7314 53.3593 35.2529 45.844C24.9134 33.8442 14.7813 21.6659 4.56355 9.56215C4.19212 9.12226 3.87261 8.64079 3.49773 8.20091C1.70969 6.08722 0.449103 3.80904 2.48505 1.24507C4.00964 -0.674661 7.65428 -0.387934 10.1921 2.22366C16.5124 8.7258 22.6693 15.3855 28.7745 22.0963C39.9226 34.3429 50.9837 46.6692 62.092 58.9522C62.5675 59.399 63.0731 59.8124 63.6053 60.1895C72.1948 51.9798 80.6892 43.7969 89.2545 35.6841C99.1881 26.2803 109.157 16.9135 119.16 7.58361C122.912 4.07666 125.921 3.44455 128.224 5.49071C130.61 7.61046 130.388 11.1519 126.582 14.9489C116.293 25.2161 105.755 35.2339 95.2268 45.2629C87.2065 52.9054 79.0583 60.4164 70.5224 68.3992C77.4586 75.5733 84.0927 82.724 91.0479 89.5439C97.7284 96.0945 104.782 102.265 111.594 108.681C114.257 111.095 116.751 113.69 119.058 116.449C120.918 118.763 121.193 121.636 118.906 123.919C116.652 126.17 114.043 125.375 111.869 123.67C107.71 120.58 103.724 117.264 99.9275 113.736C88.3069 102.355 76.8913 90.7657 65.4012 79.2517C64.4925 78.3424 63.6243 77.3883 62.3649 76.0626Z" fill="#ffffff"></path> </g> <defs> <clipPath id="clip-close"> <rect width="129" height="127" fill="white" transform="translate(0.777344)"></rect> </clipPath> </defs> </g>
              </svg>
            </button>
          </div>
          <div class="gallery-image-container">
            <img id="galleryModalImage" src="${imageSrc}" alt="Imagem da galeria" class="gallery-modal-image" />
            <div class="zoom-controls">
              <button class="zoom-btn" id="galleryZoomIn" title="Aumentar zoom">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -2.5 159 159" fill="none"><g stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip-zoom-in)"> <path d="M14.5584 89.0236C18.4681 93.6319 23.5945 97.0394 29.3482 98.8536C34.6977 100.546 40.2627 101.455 45.8709 101.552C54.1115 101.739 62.3897 100.355 71.1899 97.3279C77.2152 95.2655 82.9732 92.487 88.3413 89.0516C88.4689 89.3108 88.6249 89.5558 88.8062 89.7806C98.6488 101.542 109.39 112.293 118.602 121.262C127.92 130.332 137.524 139.404 146.562 147.919C147.982 149.195 149.492 150.368 151.078 151.428C151.532 151.749 151.991 152.069 152.442 152.396C153.183 152.982 154.089 153.318 155.032 153.359C155.728 153.357 156.402 153.119 156.946 152.684C158.44 151.526 158.732 149.642 157.689 147.883L157.16 146.983C156.104 145 154.817 143.151 153.326 141.473C147.01 134.934 140.206 128.106 133.102 121.18C125.232 113.508 117.189 105.75 109.411 98.2487C105.177 94.166 100.946 90.0815 96.7192 85.9936C96.1603 85.453 95.6391 84.8598 95.1353 84.286C95.011 84.1437 94.8873 84.0033 94.7649 83.8656L94.9656 83.6434C95.2557 83.3185 95.5484 82.9975 95.8554 82.6953C103.119 75.6263 107.098 66.7872 107.68 56.4243C108.692 38.4186 102.638 23.1455 89.6882 11.0282C83.3403 4.94621 75.1088 1.22828 66.3631 0.493103C57.8576 -0.323972 49.2761 0.660071 41.1736 3.38146C28.8548 7.59665 18.375 15.6449 10.0269 27.3015C2.58018 37.6942 -0.35512 49.0752 1.29352 61.1269C2.63393 70.9822 6.97568 80.1072 14.5584 89.0236ZM53.5404 12.2042C54.8614 12.0795 56.1823 11.9565 57.5033 11.8352C77.2088 11.0633 88.9506 24.6094 93.3707 37.5369C96.3915 46.3741 97.0319 53.8414 95.3872 61.0456C94.3058 66.0536 91.8672 70.6638 88.3407 74.3696C84.2411 78.6452 79.334 82.0585 73.9057 84.4095C61.8295 89.8287 50.0896 91.6046 38.0182 89.8365C30.2788 88.7039 24.3965 85.2938 20.0353 79.4119C15.5524 73.3689 12.7304 67.6261 11.4075 61.8637C9.48402 53.9318 10.2635 45.582 13.6214 38.1464C17.4814 29.5504 22.6028 23.2111 29.2783 18.7672C34.5797 15.2375 39.4531 13.4045 44.6153 13.0003C47.594 12.7644 50.6167 12.4791 53.5404 12.2042Z" fill="#ffffff"></path> <path d="M20.9158 50.6481C20.8311 51.3752 21.0303 52.107 21.4715 52.6899C21.9128 53.2729 22.5619 53.6617 23.2826 53.7749C24.5126 54.0906 25.7779 54.246 27.0474 54.2375C31.9092 54.0497 36.8486 53.8061 41.6255 53.5709L46.3046 53.3421C47.1069 53.3031 47.9092 53.2603 48.8158 53.2122L49.6356 53.1692L49.6673 53.4513C49.7198 53.9126 49.7586 54.2519 49.7884 54.5924C49.9132 56.0219 50.0364 57.4513 50.1581 58.8808C50.4664 62.4826 50.7856 66.2053 51.1456 69.8656C51.1769 71.095 51.5271 72.2945 52.1616 73.3465C52.954 74.4213 54.0921 75.188 55.3832 75.5168C55.5466 75.5486 55.7127 75.5649 55.8792 75.5655C57.1924 75.5655 58.3295 74.535 58.7394 72.9014C59.0875 71.6688 59.2465 70.39 59.2108 69.1092C59.0411 66.5276 58.7808 63.9149 58.5283 61.3885C58.4311 60.4142 58.3357 59.4395 58.242 58.4645L57.6762 52.5454L57.9176 52.5181C58.3644 52.4661 58.705 52.4272 59.0463 52.3934L63.8012 51.921C68.0971 51.4967 72.5386 51.058 76.9043 50.5824C78.1165 50.5183 79.2944 50.1579 80.3363 49.5324C80.8025 49.1734 81.1794 48.7107 81.4364 48.1808C81.6942 47.6508 81.8263 47.0681 81.8211 46.4784C81.6987 45.4244 80.6691 44.3756 79.7638 43.8473C78.8398 43.4262 77.818 43.2671 76.8104 43.3873C73.7728 43.5036 70.1725 43.6602 66.5048 43.9357C64.1606 44.1118 61.8637 44.3465 59.4329 44.5954C58.5928 44.682 57.7452 44.7685 56.89 44.8552L56.8583 44.3783C56.8123 43.6922 56.7741 43.119 56.7418 42.5452L56.4762 37.8018C56.2988 34.6113 56.1171 31.4212 55.931 28.2317C55.8222 26.4123 54.8716 25.2731 53.2534 25.0184C52.9221 24.9655 52.5836 24.9802 52.2581 25.0615C51.9325 25.1428 51.6267 25.289 51.3587 25.4914C50.9638 25.8099 50.6353 26.2033 50.3922 26.6494C50.1491 27.0954 49.9961 27.5851 49.9419 28.0906C49.7698 29.4454 49.6965 30.8111 49.7224 32.1765C49.7062 35.5372 49.7088 38.8986 49.7113 42.3509V45.7571C48.7569 45.8604 47.8283 45.963 46.9179 46.0631C44.5511 46.323 42.3158 46.572 40.0759 46.7779C34.6178 47.2763 29.0587 47.7331 23.8647 48.1522C21.6158 48.3348 21.0182 49.6104 20.9158 50.6481Z" fill="#ffffff"></path> </g> <defs> <clipPath id="clip-zoom-in"> <rect width="158" height="154" fill="white" transform="translate(0.777344)"></rect> </clipPath> </defs> </g>
                </svg>
              </button>
              <button class="zoom-btn" id="galleryResetZoom" title="Resetar zoom">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -14 179 179" fill="none"><g stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip-reset-zoom)"> <path d="M150.623 103.636C148.858 103.225 146.502 103.451 145.306 106.835C143.604 111.644 140.529 115.536 137.746 118.709C129.821 127.745 119.481 134.093 107.019 137.576C97.6028 140.207 86.4064 142.551 74.7526 139.977C57.3729 136.137 43.2279 126.557 32.7116 111.499C28.0394 104.808 25.3576 98.4163 24.5131 91.9506C23.0129 80.9426 23.5155 69.7536 25.9964 58.9252C26.6187 56.2632 27.4517 53.5879 28.3417 50.7319C28.4747 50.3071 28.6088 49.8765 28.7439 49.44C29.3377 50.5601 29.8483 51.4998 30.4226 52.4416L30.5691 52.6794C31.6685 54.5713 32.894 56.3867 34.238 58.1129C36.1174 60.4195 38.8158 61.116 40.9551 59.8468C42.6441 58.8432 43.9679 56.448 42.1249 53.0003C40.0396 49.1023 37.2479 43.9922 34.1472 39.0294C31.8455 35.3442 28.9669 34.3466 24.8144 35.7973C17.8114 38.2446 11.0957 40.874 5.44972 43.1208C3.84767 43.7529 2.46897 44.8481 1.48974 46.267C0.658856 47.5688 0.824715 49.7167 1.45421 50.9534C2.30264 52.6274 4.13638 53.0919 6.36073 52.197C10.7231 50.4396 15.1553 48.7847 19.6891 47.1042C20.3621 46.8542 21.0836 46.6486 21.8073 46.4533C17.8666 55.5888 15.6889 65.892 15.1575 77.8952C14.526 92.1361 16.6833 102.696 22.1493 112.134C31.6008 128.45 45.6482 140.213 63.9023 147.096C69.345 149.134 75.0676 150.324 80.8702 150.628C82.3462 150.71 83.8475 150.751 85.3325 150.751C93.9006 150.706 102.417 149.416 110.615 146.922C124.527 142.821 135.611 136.141 144.5 126.489C148.832 121.787 151.581 117.339 153.149 112.489C153.606 111.221 153.879 109.894 153.962 108.549C154.048 105.143 152.195 103.997 150.623 103.636Z" fill="#ffffff"></path> <path d="M177.792 69.6636C176.872 68.453 175.276 67.9323 173.413 68.2349C171.382 68.5604 169.467 69.8738 168.216 70.9165C166.111 72.6738 164.098 74.5665 161.967 76.5679L161.895 76.6337C161.741 76.7788 161.585 76.9233 161.429 77.0704C162.249 70.0606 162.18 62.9755 161.226 55.9828C159.312 41.5989 152.548 28.3021 142.057 18.2977C131.583 8.35446 118.029 2.27283 102.858 0.708808C87.2457 -0.89752 71.5953 1.70918 56.3439 8.46511C51.5366 10.596 45.9876 13.378 41.3154 17.8559C40.0522 19.1485 39.0501 20.6734 38.3642 22.3468C37.8646 23.4826 38.512 25.7965 39.7567 26.368C40.3876 26.5925 41.06 26.6758 41.7265 26.6124C42.393 26.5489 43.0377 26.3404 43.6152 26.0009C44.3559 25.5452 45.0484 25.0154 45.6827 24.4198C46.1211 24.014 46.5877 23.6394 47.0784 23.2989C66.3073 10.7223 86.8228 6.45397 108.052 10.6071C121.053 13.1539 131.664 19.4434 139.587 29.2994C148.726 40.666 152.958 54.1844 152.168 69.4787C151.972 72.2859 151.63 75.0814 151.144 77.8527C151.044 78.4906 150.945 79.1284 150.847 79.7669C150.05 78.8765 149.231 77.9569 148.458 77.0196C146.787 74.9889 145.124 72.9498 143.47 70.9015L143.37 70.7779C142.189 69.3206 141.007 67.8633 139.8 66.3865C139.28 65.7076 138.694 65.0819 138.05 64.5194C136.334 63.1044 134.342 63.0029 132.723 64.2473C131.965 64.8024 131.438 65.6185 131.244 66.5388C131.05 67.4591 131.202 68.4185 131.67 69.2334C132.309 70.4915 133.059 71.6897 133.911 72.8131C138.747 79.0438 143.495 85.0767 147.503 90.156C149.192 92.296 150.781 93.2508 152.656 93.2508C153.962 93.1942 155.238 92.8356 156.382 92.2023C163.569 88.549 170.083 83.6975 175.645 77.856C176.612 76.8758 177.406 75.7381 177.993 74.4923C178.821 72.6797 178.747 70.9165 177.792 69.6636Z" fill="#ffffff"></path> </g> <defs> <clipPath id="clip-reset-zoom"> <rect width="178" height="151" fill="white" transform="translate(0.777344)"></rect> </clipPath> </defs> </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modalElement = document.getElementById('galleryImageModal');
  }

  private setupInteractions(): void {
    const closeBtn = document.getElementById('closeGalleryModal');
    const zoomInBtn = document.getElementById('galleryZoomIn');
    const resetZoomBtn = document.getElementById('galleryResetZoom');
    const image = document.getElementById('galleryModalImage') as HTMLImageElement;

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => this.zoom(1));
    }

    if (resetZoomBtn) {
      resetZoomBtn.addEventListener('click', () => this.resetZoom());
    }

    // Close on backdrop click
    this.modalElement?.addEventListener('click', (e) => {
      if (e.target === this.modalElement) {
        this.close();
      }
    });

    // Setup image interactions
    if (image) {
      this.setupImageDragAndZoom(image);
    }
  }

  private setupImageDragAndZoom(image: HTMLImageElement): void {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialPosition = { x: 0, y: 0 };

    // Mouse interactions
    const handleMouseDown = (e: MouseEvent) => {
      if (this.zoomLevel === 0) {
        this.zoom(1);
        return;
      }

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialPosition = { ...this.imagePosition };
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || this.zoomLevel === 0) return;

      const deltaX = (e.clientX - startX) / 2;
      const deltaY = (e.clientY - startY) / 2;

      this.imagePosition = {
        x: initialPosition.x + deltaX,
        y: initialPosition.y + deltaY
      };

      this.updateImageTransform(image);
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch interactions
    let initialDistance = 0;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
      } else if (e.touches.length === 1) {
        if (this.zoomLevel === 0) {
          this.zoom(1);
        } else {
          isDragging = true;
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          initialPosition = { ...this.imagePosition };
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );

        const scale = currentDistance / initialDistance;
        const newZoom = scale > 1.2 ? 1 : 0;

        if (newZoom !== this.zoomLevel) {
          this.zoomLevel = newZoom;
          this.updateImageTransform(image);
        }
      } else if (e.touches.length === 1 && isDragging && this.zoomLevel > 0) {
        const deltaX = (e.touches[0].clientX - startX) / 2;
        const deltaY = (e.touches[0].clientY - startY) / 2;

        this.imagePosition = {
          x: initialPosition.x + deltaX,
          y: initialPosition.y + deltaY
        };

        this.updateImageTransform(image);
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

    image.addEventListener('contextmenu', (e) => e.preventDefault());

    // Store cleanup function
    this.cleanupFn = () => {
      image.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      image.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    // Initialize transform
    this.updateImageTransform(image);
  }

  private zoom(direction: number): void {
    this.zoomLevel = Math.max(0, Math.min(1, this.zoomLevel + direction));
    const image = document.getElementById('galleryModalImage') as HTMLImageElement;
    if (image) {
      this.updateImageTransform(image);
    }
  }

  private resetZoom(): void {
    this.zoomLevel = 0;
    this.imagePosition = { x: 0, y: 0 };
    const image = document.getElementById('galleryModalImage') as HTMLImageElement;
    if (image) {
      this.updateImageTransform(image);
    }
  }

  private updateImageTransform(image: HTMLImageElement): void {
    const scale = this.zoomLevel === 0 ? 1 : 2;
    image.style.transform = `scale(${scale}) translate(${this.imagePosition.x}px, ${this.imagePosition.y}px)`;
    image.style.cursor = this.zoomLevel > 0 ? 'move' : 'zoom-in';
  }

  private blockBodyScroll(): void {
    // Save current scroll position and body styles
    this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.originalBodyOverflow = document.body.style.overflow;
    this.originalBodyPosition = document.body.style.position;
    
    // Apply scroll blocking styles
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';
    
    // Prevent touch scrolling on mobile
    document.body.addEventListener('touchmove', this.preventScroll, { passive: false });
  }

  private restoreBodyScroll(): void {
    // Remove touch scroll prevention
    document.body.removeEventListener('touchmove', this.preventScroll);
    
    // Restore original body styles
    document.body.style.overflow = this.originalBodyOverflow;
    document.body.style.position = this.originalBodyPosition;
    document.body.style.top = '';
    document.body.style.width = '';
    
    // Restore scroll position
    window.scrollTo(0, this.scrollPosition);
  }

  private setupEscapeKeyHandler(): void {
    this.escapeKeyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.close();
      }
    };
    document.addEventListener('keydown', this.escapeKeyHandler);
  }

  private removeEscapeKeyHandler(): void {
    if (this.escapeKeyHandler) {
      document.removeEventListener('keydown', this.escapeKeyHandler);
      this.escapeKeyHandler = null;
    }
  }

  // Prevent scroll outside modal
  private preventScroll = (e: TouchEvent): void => {
    const target = e.target as Element;
    if (!target.closest('.modal-content')) {
      e.preventDefault();
    }
  };

  close(): void {
    // Restore body scroll
    this.restoreBodyScroll();
    
    // Remove escape key handler
    this.removeEscapeKeyHandler();
    
    if (this.cleanupFn) {
      this.cleanupFn();
    }

    if (this.modalElement) {
      document.body.removeChild(this.modalElement);
    }

    this.modalElement = null;
    this.zoomLevel = 0;
    this.imagePosition = { x: 0, y: 0 };
  }
}

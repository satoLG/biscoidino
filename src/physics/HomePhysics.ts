// Home Physics - Physics simulation for the home page
import { biscuitTextures } from '../data/biscuitConfig';
import { 
  loadMatter, 
  getMatter, 
  createBiscuitBody,
  animateBiscuitSpawn 
} from './PhysicsWorld';

export class HomePhysics {
  private canvas: HTMLCanvasElement | null = null;
  private container: HTMLElement | null = null;
  private engine: any = null;
  private render: any = null;
  private biscuits: any[] = [];
  private mouseConstraint: any = null;
  private resizeCleanup: (() => void) | null = null;
  private dragCleanup: (() => void) | null = null;
  private lastCanvasSize = { width: 0, height: 0 };
  private biscuitStates: any[] | null = null;
  private resizeSetup = false;

  async init(): Promise<void> {
    console.log('🌟 Initializing Home Physics with Matter.js...');
    
    await loadMatter();
    this.createWorld();
  }

  private createWorld(): void {
    const Matter = getMatter();
    
    this.canvas = document.getElementById('homePhysicsCanvas') as HTMLCanvasElement;
    this.container = document.getElementById('homeImageContainer') as HTMLElement;
    
    if (!this.canvas || !this.container) {
      console.error('❌ Canvas or container not found');
      return;
    }
    
    // Get container size and set canvas dimensions for crisp rendering
    const containerRect = this.container.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    
    this.canvas.width = containerRect.width * pixelRatio;
    this.canvas.height = containerRect.height * pixelRatio;
    this.canvas.style.width = containerRect.width + 'px';
    this.canvas.style.height = containerRect.height + 'px';
    
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.scale(pixelRatio, pixelRatio);
    }
    
    this.lastCanvasSize = { 
      width: Math.round(containerRect.width), 
      height: Math.round(containerRect.height) 
    };

    console.log('📐 Home physics canvas:', {
      displayWidth: containerRect.width, 
      displayHeight: containerRect.height,
      pixelRatio
    });
    
    // Create engine
    this.engine = Matter.Engine.create();
    this.engine.world.gravity.y = 0.3;
    
    // Create renderer
    this.render = Matter.Render.create({
      canvas: this.canvas,
      engine: this.engine,
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
    
    // Create boundaries within the canvas area (use display dimensions) - exactly as original
    const wallThickness = 10;
    const displayWidth = containerRect.width;
    const displayHeight = containerRect.height;
    
    const walls = [
      // Bottom wall (floor)
      Matter.Bodies.rectangle(displayWidth / 2, (displayHeight - wallThickness/2) - 20, displayWidth, wallThickness, { 
        isStatic: true, 
        render: { visible: false } 
      }),
      // Left wall
      Matter.Bodies.rectangle(wallThickness/2 + 20, displayHeight / 2, wallThickness, displayHeight, { 
        isStatic: true, 
        render: { visible: false } 
      }),
      // Right wall
      Matter.Bodies.rectangle((displayWidth - wallThickness/2) - 20, displayHeight / 2, wallThickness, displayHeight, { 
        isStatic: true, 
        render: { visible: false } 
      }),
      // Top wall
      Matter.Bodies.rectangle(displayWidth / 2, 20, displayWidth, wallThickness, { 
        isStatic: true, 
        render: { visible: false } 
      }),
    ];
    
    // Create biscuits
    this.biscuits = this.createBiscuits(containerRect.width, containerRect.height);
    
    // Add all bodies to world
    Matter.World.add(this.engine.world, [...walls, ...this.biscuits]);
    
    // Setup interaction
    this.setupInteraction();
    
    // Start simulation
    Matter.Engine.run(this.engine);
    Matter.Render.run(this.render);
    
    // Setup resize listener
    if (!this.resizeSetup) {
      this.setupResize();
      this.resizeSetup = true;
    }

    console.log('✅ Home physics initialized successfully');
  }

  private createBiscuits(canvasWidth: number, canvasHeight: number): any[] {
    const useDefaultPositions = !this.biscuitStates || this.biscuitStates.length === 0;
    const Matter = getMatter();
    
    // Calculate biscuit count based on canvas area
    const canvasArea = canvasWidth * canvasHeight;
    const baseArea = 200000; // Mobile reference
    const areaRatio = canvasArea / baseArea;
    
    const baseCount = 4;
    const scaledCount = Math.max(baseCount, Math.floor(baseCount * areaRatio));
    
    const { flowers, hearts, stars, dinosaur } = biscuitTextures.baunilha;
    
    const biscuitPositions: { x: number, y: number, texture: string }[] = [];
    
    // Always add 1 dinosaur
    biscuitPositions.push({
      x: Math.random() * (canvasWidth - 100) + 50,
      y: Math.random() * 100 + 30,
      texture: dinosaur
    });
    
    // Add scaled amount of each type
    for (let i = 0; i < scaledCount; i++) {
      biscuitPositions.push({
        x: Math.random() * (canvasWidth - 100) + 50,
        y: Math.random() * 100 + 30,
        texture: flowers[i % flowers.length]
      });
      
      biscuitPositions.push({
        x: Math.random() * (canvasWidth - 100) + 50,
        y: Math.random() * 100 + 30,
        texture: hearts[i % hearts.length]
      });
      
      biscuitPositions.push({
        x: Math.random() * (canvasWidth - 100) + 50,
        y: Math.random() * 100 + 30,
        texture: stars[i % stars.length]
      });
    }
    
    const biscuits: any[] = [];
    
    for (let i = 0; i < biscuitPositions.length; i++) {
      const pos = biscuitPositions[i];
      const savedState = this.biscuitStates && this.biscuitStates[i];
      
      const x = savedState ? savedState.x * canvasWidth : pos.x;
      const y = savedState ? savedState.y * canvasHeight : pos.y;

      const biscuit = createBiscuitBody(x, y, pos.texture);
      
      if (savedState && !useDefaultPositions) {
        Matter.Body.setVelocity(biscuit, { 
          x: savedState.velocityX * 0.8,
          y: savedState.velocityY * 0.8 
        });
        Matter.Body.setAngle(biscuit, savedState.angle);
        Matter.Body.setAngularVelocity(biscuit, savedState.angularVelocity * 0.8);
      }
      
      biscuits.push(biscuit);
    }
    
    this.biscuitStates = null;
    
    if (useDefaultPositions) {
      animateBiscuitSpawn(biscuits);
    }
    
    console.log(`🎯 Created ${biscuits.length} biscuits for canvas ${canvasWidth}x${canvasHeight}`);
    
    return biscuits;
  }

  private setupInteraction(): void {
    if (!this.canvas || !this.engine) return;
    
    const Matter = getMatter();
    const mouse = Matter.Mouse.create(this.canvas);
    
    this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse,
      constraint: {
        stiffness: 0.05,
        damping: 0.1,
        length: 0,
        render: { visible: false }
      }
    });
    
    Matter.World.add(this.engine.world, this.mouseConstraint);
    
    // Disable wheel scrolling on mouse
    const canvas = this.canvas;
    let scrollTimeout: ReturnType<typeof setTimeout>;
    
    const handleScroll = () => {
      canvas.style.pointerEvents = "none";
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        canvas.style.pointerEvents = "auto";
      }, 200);
    };
    
    canvas.addEventListener("wheel", handleScroll);
    this.mouseConstraint.mouse.element.removeEventListener('wheel', this.mouseConstraint.mouse.mousewheel);
    this.mouseConstraint.mouse.element.removeEventListener('DOMMouseScroll', this.mouseConstraint.mouse.mousewheel);
    
    // Setup drag protection
    this.setupDragProtection();
    
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    console.log('🎮 Home physics interaction setup complete');
  }

  private setupDragProtection(): void {
    if (!this.canvas) return;
    
    const canvas = this.canvas;
    const mouseConstraint = this.mouseConstraint;
    const mouse = mouseConstraint.mouse;
    
    let isDragging = false;
    let mouseDownInCanvas = false;
    
    const enableDragProtection = () => {
      if (!isDragging) {
        isDragging = true;
        document.body.classList.add('drag-mode');
        
        const homeContent = document.querySelector('.home-content') as HTMLElement;
        if (homeContent) {
          homeContent.style.pointerEvents = 'none';
        }
      }
    };
    
    const disableDragProtection = () => {
      if (isDragging) {
        isDragging = false;
        document.body.classList.remove('drag-mode');
        
        const homeContent = document.querySelector('.home-content') as HTMLElement;
        if (homeContent) {
          homeContent.style.pointerEvents = '';
        }
        
        if (mouseConstraint.body !== null) {
          mouseConstraint.body = null;
          mouseConstraint.pointA = null;
          mouseConstraint.pointB = null;
        }
      }
    };
    
    const handleCanvasMouseDown = () => {
      mouseDownInCanvas = true;
      setTimeout(() => {
        if (mouseDownInCanvas && mouseConstraint.body) {
          enableDragProtection();
        }
      }, 50);
    };
    
    const handleCanvasMouseUp = () => {
      mouseDownInCanvas = false;
      if (mouseConstraint.body !== null) {
        mouseConstraint.body = null;
        mouseConstraint.pointA = null;
        mouseConstraint.pointB = null;
      }
      disableDragProtection();
    };
    
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !mouseConstraint.body) return;
      
      const rect = canvas.getBoundingClientRect();
      mouse.position.x = e.clientX - rect.left;
      mouse.position.y = e.clientY - rect.top;
    };
    
    const handleGlobalMouseUp = () => {
      mouseDownInCanvas = false;
      if (mouseConstraint.body !== null) {
        mouseConstraint.body = null;
        mouseConstraint.pointA = null;
        mouseConstraint.pointB = null;
      }
      disableDragProtection();
    };
    
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDragging || !mouseConstraint.body || e.touches.length === 0) return;
      
      const rect = canvas.getBoundingClientRect();
      mouse.position.x = e.touches[0].clientX - rect.left;
      mouse.position.y = e.touches[0].clientY - rect.top;
    };
    
    // Add event listeners
    canvas.addEventListener('mousedown', handleCanvasMouseDown, { passive: true });
    canvas.addEventListener('mouseup', handleCanvasMouseUp, { passive: true });
    canvas.addEventListener('touchstart', handleCanvasMouseDown, { passive: true });
    canvas.addEventListener('touchend', handleCanvasMouseUp, { passive: true });
    canvas.addEventListener('touchcancel', handleCanvasMouseUp, { passive: true });
    
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    document.addEventListener('mouseup', handleGlobalMouseUp, { passive: true });
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
    document.addEventListener('touchend', handleGlobalMouseUp, { passive: true });
    document.addEventListener('touchcancel', handleGlobalMouseUp, { passive: true });
    
    this.dragCleanup = () => {
      canvas.removeEventListener('mousedown', handleCanvasMouseDown);
      canvas.removeEventListener('mouseup', handleCanvasMouseUp);
      canvas.removeEventListener('touchstart', handleCanvasMouseDown);
      canvas.removeEventListener('touchend', handleCanvasMouseUp);
      canvas.removeEventListener('touchcancel', handleCanvasMouseUp);
      
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalMouseUp);
      document.removeEventListener('touchcancel', handleGlobalMouseUp);
      
      disableDragProtection();
    };
  }

  private setupResize(): void {
    let resizeTimeout: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      if (!this.canvas || !this.container) return;
      
      const homeSection = document.querySelector('.home-section.active');
      if (!homeSection) return;
      
      const containerRect = this.container.getBoundingClientRect();
      const currentWidth = Math.round(containerRect.width);
      const currentHeight = Math.round(containerRect.height);
      
      const widthChange = this.lastCanvasSize.width > 0 
        ? Math.abs(currentWidth - this.lastCanvasSize.width) / this.lastCanvasSize.width 
        : 1;
      const heightChange = this.lastCanvasSize.height > 0 
        ? Math.abs(currentHeight - this.lastCanvasSize.height) / this.lastCanvasSize.height 
        : 1;
      
      const significantChange = widthChange > 0.05 || heightChange > 0.05 || 
                               Math.abs(currentWidth - this.lastCanvasSize.width) > 30 || 
                               Math.abs(currentHeight - this.lastCanvasSize.height) > 30;
      
      if (!significantChange) return;
      
      this.lastCanvasSize = { width: currentWidth, height: currentHeight };
      
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const debounceDelay = isMobile ? 500 : 300;
      
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.rebuildWorld();
      }, debounceDelay);
    };
    
    const handleOrientationChange = () => {
      setTimeout(() => handleResize(), 150);
    };
    
    window.addEventListener('resize', handleResize);
    
    if ('onorientationchange' in window) {
      window.addEventListener('orientationchange', handleOrientationChange);
    }
    
    if (screen?.orientation) {
      screen.orientation.addEventListener('change', handleOrientationChange);
    }
    
    this.resizeCleanup = () => {
      window.removeEventListener('resize', handleResize);
      if ('onorientationchange' in window) {
        window.removeEventListener('orientationchange', handleOrientationChange);
      }
      if (screen?.orientation) {
        screen.orientation.removeEventListener('change', handleOrientationChange);
      }
      clearTimeout(resizeTimeout);
    };
    
    console.log('📐 Home canvas resize listeners setup complete');
  }

  private rebuildWorld(): void {
    console.log('🔄 Resizing home physics canvas...');
    
    // Save biscuit positions
    if (this.biscuits.length > 0) {
      this.biscuitStates = this.biscuits.map((biscuit: any) => ({
        x: biscuit.position.x / this.lastCanvasSize.width,
        y: biscuit.position.y / this.lastCanvasSize.height,
        velocityX: biscuit.velocity.x,
        velocityY: biscuit.velocity.y,
        angle: biscuit.angle,
        angularVelocity: biscuit.angularVelocity
      }));
    }
    
    this.cleanup(false);
    this.createWorld();
  }

  cleanup(full = true): void {
    const Matter = getMatter();
    
    if (this.engine) {
      Matter.Engine.clear(this.engine);
    }
    
    if (this.render) {
      Matter.Render.stop(this.render);
      this.render = null;
    }
    
    if (this.mouseConstraint && this.engine) {
      Matter.World.remove(this.engine.world, this.mouseConstraint);
      this.mouseConstraint = null;
    }
    
    if (this.dragCleanup) {
      this.dragCleanup();
      this.dragCleanup = null;
    }
    
    this.engine = null;
    this.biscuits = [];
    
    if (full && this.resizeCleanup) {
      this.resizeCleanup();
      this.resizeCleanup = null;
      this.resizeSetup = false;
    }
  }
}

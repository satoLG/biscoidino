// Modal Physics - Physics simulation for product modal
import { modalBiscuitConfigs } from '../data/biscuitConfig';
import { 
  loadMatter, 
  getMatter, 
  createBiscuitBody, 
  createWalls, 
  applyForceAtPosition 
} from './PhysicsWorld';

export class ModalPhysics {
  private canvas: HTMLCanvasElement | null = null;
  private engine: any = null;
  private render: any = null;
  private biscuits: any[] = [];
  private mouseConstraint: any = null;
  private boundaryCheckInterval: ReturnType<typeof setInterval> | null = null;
  private interactionCleanup: (() => void) | null = null;

  async init(productType: 'baunilha' | 'parmesao'): Promise<void> {
    await loadMatter();
    this.createWorld(productType);
  }

  private createWorld(productType: 'baunilha' | 'parmesao'): void {
    const Matter = getMatter();
    
    this.canvas = document.getElementById('physicsCanvas') as HTMLCanvasElement;
    if (!this.canvas || !this.canvas.parentElement) return;
    
    const containerRect = this.canvas.parentElement.getBoundingClientRect();
    
    this.canvas.width = containerRect.width - 40;
    this.canvas.height = 305;
    
    // Create engine
    this.engine = Matter.Engine.create();
    this.engine.world.gravity.y = 0.5;
    
    // Create renderer
    this.render = Matter.Render.create({
      canvas: this.canvas,
      engine: this.engine,
      options: {
        width: this.canvas.width,
        height: this.canvas.height,
        wireframes: false,
        background: '#fff8dc00'
      }
    });
    
    // Create walls
    const walls = createWalls(this.canvas.width, this.canvas.height, 100, {
      top: 0, bottom: 5, left: 5, right: 5
    });
    
    // Create biscuits
    this.biscuits = this.createBiscuits(productType);
    
    // Add to world
    Matter.World.add(this.engine.world, [...walls, ...this.biscuits]);
    
    // Setup interaction
    this.setupInteraction();
    
    // Setup boundary check
    this.setupBoundaryCheck();
    
    // Start simulation
    Matter.Engine.run(this.engine);
    Matter.Render.run(this.render);
  }

  private createBiscuits(productType: 'baunilha' | 'parmesao'): any[] {
    if (!this.canvas) return [];
    
    const biscuits: any[] = [];
    const canvasWidth = this.canvas.width;
    
    if (productType === 'baunilha') {
      const configs = modalBiscuitConfigs.baunilha;
      
      configs.forEach(config => {
        for (let i = 0; i < config.count; i++) {
          const x = Math.random() * (canvasWidth - 100) + 50;
          const y = Math.random() * 100 + 50;
          
          const biscuit = createBiscuitBody(x, y, config.image, {
            restitution: 0.3,
            friction: 0.4
          });
          
          biscuits.push(biscuit);
        }
      });
    } else {
      const configs = modalBiscuitConfigs.parmesao;
      
      configs.forEach(config => {
        for (let i = 0; i < config.count; i++) {
          const x = Math.random() * (canvasWidth - 100) + 50;
          const y = Math.random() * 150 + 50;
          
          const biscuit = createBiscuitBody(x, y, config.image, {
            restitution: 0.2,
            friction: 0.5
          });
          
          biscuits.push(biscuit);
        }
      });
    }
    
    return biscuits;
  }

  private setupInteraction(): void {
    if (!this.canvas || !this.engine) return;
    
    const Matter = getMatter();
    const canvas = this.canvas;
    const biscuits = this.biscuits;
    
    // Create mouse constraint for dragging
    const mouse = Matter.Mouse.create(canvas);
    
    this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse,
      constraint: {
        stiffness: 0.1,
        damping: 0.9,
        length: 0,
        render: { visible: false }
      }
    });
    
    Matter.World.add(this.engine.world, this.mouseConstraint);
    
    // Disable scroll wheel on canvas
    this.mouseConstraint.mouse.element.removeEventListener('wheel', this.mouseConstraint.mouse.mousewheel);
    this.mouseConstraint.mouse.element.removeEventListener('DOMMouseScroll', this.mouseConstraint.mouse.mousewheel);
    
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      canvas.style.pointerEvents = "none";
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        canvas.style.pointerEvents = "auto";
      }, 200);
    };
    
    canvas.addEventListener("wheel", handleScroll);
    
    // Click/touch interaction for impulse effects
    const handleInteractionStart = (event: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      
      let clientX: number, clientY: number;
      if ('touches' in event) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }
      
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      applyForceAtPosition(biscuits, x, y);
    };
    
    canvas.addEventListener('mousedown', handleInteractionStart);
    canvas.addEventListener('touchstart', handleInteractionStart, { passive: true });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    this.interactionCleanup = () => {
      canvas.removeEventListener('mousedown', handleInteractionStart);
      canvas.removeEventListener('touchstart', handleInteractionStart);
      canvas.removeEventListener('wheel', handleScroll);
    };
  }

  private setupBoundaryCheck(): void {
    if (!this.canvas) return;
    
    const Matter = getMatter();
    const canvas = this.canvas;
    const biscuits = this.biscuits;
    
    this.boundaryCheckInterval = setInterval(() => {
      if (!this.engine || !biscuits.length) {
        if (this.boundaryCheckInterval) {
          clearInterval(this.boundaryCheckInterval);
        }
        return;
      }
      
      biscuits.forEach((biscuit: any) => {
        const pos = biscuit.position;
        const margin = 10;
        let needsReset = false;
        let newX = pos.x;
        let newY = pos.y;
        
        if (pos.x < margin) {
          newX = margin + Math.random() * 50;
          needsReset = true;
        } else if (pos.x > canvas.width - margin) {
          newX = canvas.width - margin - Math.random() * 50;
          needsReset = true;
        }
        
        if (pos.y < margin) {
          newY = margin + Math.random() * 50;
          needsReset = true;
        } else if (pos.y > canvas.height - margin) {
          newY = canvas.height - margin - Math.random() * 50;
          needsReset = true;
        }
        
        if (needsReset) {
          Matter.Body.setPosition(biscuit, { x: newX, y: newY });
          Matter.Body.setVelocity(biscuit, { x: 0, y: 0 });
          Matter.Body.setAngularVelocity(biscuit, 0);
        }
      });
    }, 100);
  }

  shake(): void {
    const Matter = getMatter();
    
    this.biscuits.forEach((biscuit: any) => {
      Matter.Body.applyForce(biscuit, biscuit.position, {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01
      });
    });
  }

  reset(): void {
    if (!this.canvas) return;
    
    const Matter = getMatter();
    
    this.biscuits.forEach((biscuit: any) => {
      const x = Math.random() * (this.canvas!.width - 100) + 50;
      const y = Math.random() * 100 + 50;
      Matter.Body.setPosition(biscuit, { x, y });
      Matter.Body.setVelocity(biscuit, { x: 0, y: 0 });
    });
  }

  cleanup(): void {
    if (this.boundaryCheckInterval) {
      clearInterval(this.boundaryCheckInterval);
      this.boundaryCheckInterval = null;
    }
    
    if (this.interactionCleanup) {
      this.interactionCleanup();
      this.interactionCleanup = null;
    }
    
    if (this.engine) {
      const Matter = getMatter();
      Matter.Engine.clear(this.engine);
      
      if (this.render) {
        Matter.Render.stop(this.render);
      }
    }
    
    this.engine = null;
    this.render = null;
    this.biscuits = [];
    this.mouseConstraint = null;
    this.canvas = null;
  }
}

// Base Physics World - Shared physics utilities
import { getBiscuitConfig } from '../data/biscuitConfig';

declare const Matter: any;

export interface PhysicsOptions {
  restitution?: number;
  friction?: number;
  frictionAir?: number;
  density?: number;
}

// Check if Matter.js is loaded
export function isMatterLoaded(): boolean {
  return typeof (window as any).Matter !== 'undefined';
}

// Load Matter.js dynamically
export function loadMatter(): Promise<void> {
  return new Promise((resolve) => {
    if (isMatterLoaded()) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

// Get Matter.js instance
export function getMatter(): any {
  return (window as any).Matter;
}

// Create a standard biscuit body with sprite
export function createBiscuitBody(
  x: number, 
  y: number, 
  texture: string, 
  options: PhysicsOptions = {}
): any {
  const Matter = getMatter();
  const config = getBiscuitConfig(texture);
  
  const defaultPhysics: PhysicsOptions = {
    restitution: 0.6,
    frictionAir: 0.01,
    density: 0.002
  };

  return Matter.Bodies.circle(x, y, config.radius, { 
    ...defaultPhysics,
    ...options,
    render: { 
      sprite: {
        texture: texture,
        xScale: config.scale,
        yScale: config.scale
      }
    }
  });
}

// Create invisible walls
export function createWalls(
  width: number, 
  height: number, 
  thickness: number = 100,
  offsets = { top: 0, bottom: 5, left: 5, right: 5 }
): any[] {
  const Matter = getMatter();
  const Bodies = Matter.Bodies;
  
  return [
    // Top wall
    Bodies.rectangle(
      width / 2, 
      -thickness/2 + offsets.top, 
      width + thickness*2, 
      thickness, 
      { isStatic: true, render: { visible: false } }
    ),
    // Bottom wall
    Bodies.rectangle(
      width / 2, 
      height + thickness/2 + offsets.bottom, 
      width + thickness*2, 
      thickness, 
      { isStatic: true, render: { visible: false } }
    ),
    // Left wall
    Bodies.rectangle(
      -thickness/2 + offsets.left, 
      height / 2, 
      thickness, 
      height + thickness*2, 
      { isStatic: true, render: { visible: false } }
    ),
    // Right wall
    Bodies.rectangle(
      width + thickness/2 - offsets.right, 
      height / 2, 
      thickness, 
      height + thickness*2, 
      { isStatic: true, render: { visible: false } }
    )
  ];
}

// Apply force at a position (affects nearby biscuits)
export function applyForceAtPosition(
  biscuits: any[], 
  x: number, 
  y: number, 
  forceRadius: number = 60, 
  maxForce: number = 0.02
): void {
  const Matter = getMatter();
  
  biscuits.forEach((biscuit: any) => {
    const dx = biscuit.position.x - x;
    const dy = biscuit.position.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < forceRadius && distance > 0) {
      const forceMagnitude = (forceRadius - distance) / forceRadius * maxForce;
      const forceX = (dx / distance) * forceMagnitude;
      const forceY = (dy / distance) * forceMagnitude;
      
      const randomX = (Math.random() - 0.5) * 0.005;
      const randomY = (Math.random() - 0.5) * 0.005;
      
      Matter.Body.applyForce(biscuit, biscuit.position, {
        x: forceX + randomX,
        y: forceY + randomY
      });
      
      Matter.Body.setAngularVelocity(biscuit, (Math.random() - 0.5) * 0.1);
    }
  });
}

// Animate biscuits popping in
export function animateBiscuitSpawn(biscuits: any[]): void {
  biscuits.forEach((biscuit, index) => {
    const targetScale = biscuit.render.sprite.xScale;
    
    // Start at scale 0
    biscuit.render.sprite.xScale = 0;
    biscuit.render.sprite.yScale = 0;
    
    // Stagger the animation for each biscuit
    const delay = index * 40;
    
    setTimeout(() => {
      const duration = 250;
      const startTime = performance.now();
      
      function animate() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out-back for bouncy pop effect
        const eased = 1 + 2.70158 * Math.pow(progress - 1, 3) + 1.70158 * Math.pow(progress - 1, 2);
        
        const currentScale = targetScale * eased;
        biscuit.render.sprite.xScale = currentScale;
        biscuit.render.sprite.yScale = currentScale;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }
      
      requestAnimationFrame(animate);
    }, delay);
  });
}

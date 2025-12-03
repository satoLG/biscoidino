// Biscuit Configuration - Physics and rendering settings
export interface BiscuitRenderConfig {
  radius: number;
  scale: number;
}

// Radius configuration for each biscuit type
const radiusMap: Record<string, number> = {
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

// Scale configuration for each biscuit type
const scaleMap: Record<string, number> = {
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

export function getBiscuitConfig(texture: string): BiscuitRenderConfig {
  return {
    radius: radiusMap[texture] || radiusMap['default'],
    scale: scaleMap[texture] || scaleMap['default']
  };
}

// Biscuit textures organized by type
export const biscuitTextures = {
  baunilha: {
    dinosaur: '/biscuits/biscoidino_biscuit1.png',
    flowers: ['/biscuits/flower_baunilha1.png', '/biscuits/flower_baunilha2.png'],
    hearts: ['/biscuits/heart_baunilha1.png', '/biscuits/heart_baunilha2.png'],
    stars: ['/biscuits/star_baunilha1.png', '/biscuits/star_baunilha2.png']
  },
  parmesao: {
    biscuits: ['/biscuits/parmesao_biscuit1.png', '/biscuits/parmesao_biscuit2.png']
  }
};

// Modal physics biscuit configurations
export interface ModalBiscuitConfig {
  count: number;
  type: string;
  image: string;
}

export const modalBiscuitConfigs: Record<'baunilha' | 'parmesao', ModalBiscuitConfig[]> = {
  baunilha: [
    { count: 1, type: 'dinosaur', image: '/biscuits/biscoidino_biscuit1.png' },
    { count: 2, type: 'flower1', image: '/biscuits/flower_baunilha1.png' },
    { count: 2, type: 'flower2', image: '/biscuits/flower_baunilha2.png' },
    { count: 2, type: 'heart1', image: '/biscuits/heart_baunilha1.png' },
    { count: 2, type: 'heart2', image: '/biscuits/heart_baunilha2.png' },
    { count: 2, type: 'star1', image: '/biscuits/star_baunilha1.png' },
    { count: 3, type: 'star2', image: '/biscuits/star_baunilha2.png' }
  ],
  parmesao: [
    { count: 11, type: 'parmesao1', image: '/biscuits/parmesao_biscuit1.png' },
    { count: 10, type: 'parmesao2', image: '/biscuits/parmesao_biscuit2.png' }
  ]
};

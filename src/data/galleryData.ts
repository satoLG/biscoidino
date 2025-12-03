// Gallery Data - Images and descriptions for the gallery section
export interface GalleryItem {
  image: string;
  text: string;
}

export const galleryData: GalleryItem[] = [
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

export const totalGallerySlides = galleryData.length;

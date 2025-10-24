# BISCOIDINO - Biscuit Business Website

A modern, responsive website for BISCOIDINO, a premium biscuit business, built with Vite and TypeScript.

## Features

- **Modern Design**: Clean, responsive design with a warm color palette perfect for a bakery business
- **Menu Showcase**: Interactive menu section displaying various biscuit offerings
- **About Section**: Information about the business and what makes it special
- **Contact Information**: Easy-to-find contact details and business hours
- **Mobile Responsive**: Optimized for all device sizes
- **TypeScript**: Type-safe development with full TypeScript support
- **Fast Development**: Powered by Vite for lightning-fast development and builds

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 16 or higher) installed on your system
  - Download from: https://nodejs.org/
  - This includes npm (Node Package Manager)

## Getting Started

### 1. Install Node.js (if not already installed)
1. Visit https://nodejs.org/
2. Download and install the LTS (Long Term Support) version
3. Restart your terminal/VS Code after installation

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The website will be available at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

## Project Structure

```
biscoidino/
├── public/
│   └── biscuit.svg          # Favicon
├── src/
│   ├── main.ts              # Main TypeScript file
│   └── style.css            # Styles
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md               # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies Used

- **Vite** - Build tool and development server
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **HTML5** - Semantic markup

## Customization

### Colors
The website uses a warm, bakery-inspired color palette defined in CSS custom properties:
- Primary: `#D2691E` (Chocolate/Orange)
- Secondary: `#DEB887` (Burlywood)
- Accent: `#CD853F` (Peru)
- Background: `#FFF8DC` (Cornsilk)

### Menu Items
Menu items can be customized in the `loadMenu()` method in `src/main.ts`.

### Contact Information
Update contact details in the contact section of `src/main.ts`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions about this project, please contact the development team.

---

**BISCOIDINO** - Made with ❤️ for biscuit lovers everywhere!
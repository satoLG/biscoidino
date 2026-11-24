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

## API (biscoidino_api)

O site lê preços e disponibilidade de [`biscoidino_api`](https://github.com/satoLG/biscoidino_api).
Configure `VITE_API_URL` (ver `.env.example`; na Vercel em *Settings → Environment Variables*).
Sem a variável, ou com a API fora, valem os preços de `src/data/products.ts` e a encomenda pelo
WhatsApp continua funcionando. A API só aceita chamadas do `SITE_URL` configurado nela (CORS).

- `src/api/client.ts` - `fetch` com timeout (60 s: a API dorme no plano free do Render) e `ApiError`
- `src/api/catalog.ts` - `GET /products`; textos e imagens continuam em `src/data`
- `src/api/checkout.ts` - CEP, frete, vaga de produção, `POST /orders` e `POST /orders/{id}/payment`
- `src/checkout/` - formulário do checkout; o "Finalizar pedido" do carrinho só liga com a API
  configurada e o catálogo carregado. A `Idempotency-Key` é reaproveitada enquanto o pedido não muda,
  então duplo clique ou retentativa não criam dois pedidos. O id do último pedido fica em
  `localStorage['biscoidino-last-order']`.
- `src/order/` - página `/pedido/{id}` (volta do Mercado Pago e link direto; rewrite em `vercel.json`):
  status, botão de pagar, refazer pedido expirado e rastreio. Aguardando pagamento, consulta de novo
  a cada 5 s por 1 min (o webhook pode chegar depois do cliente).

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
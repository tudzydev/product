# Frontend Client - Nexus Engine UI

Modern catalog dashboard built with Next.js 16 (App Router), React 19, and Tailwind CSS v4.

## 🌟 Highlights

- **React 19 & Next.js 16**: Utilizing the App Router with Turbopack fast builds.
- **Glassmorphic UI**: Ambient glow backgrounds, responsive cards, and clean typography.
- **Product Management**:
  - Modal-driven CRUD forms with instant validation.
  - Live inventory metrics (Item count, Average price, Top price).
  - Client-side search and multi-option sorting.
  - One-click sample data seeding.
- **Interactive OpenAPI Link**: Direct quick-access button to the backend Swagger UI.
- **Toast Notifications**: Automatic non-intrusive feedback for all API operations.

## 🛠 Tech Stack

- **Framework**: [Next.js 16.2.11](https://nextjs.org)
- **UI Library**: [React 19.2.4](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + `@tailwindcss/postcss`
- **Language**: TypeScript 5

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` based on `.env.example`:

```bash
cp .env.example .env.local
```

Ensure the backend URL matches your running Express API:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📦 Build for Production

```bash
npm run build
npm start
```

## 📂 Architecture

- `src/app/page.tsx`: Main dashboard component containing UI state, modals, and search/sort filtering.
- `src/services/productService.ts`: Centralized typed API service communicating with the Express backend.
- `src/types/productType.ts`: TypeScript interfaces for the product entity.

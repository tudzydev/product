# Nexus Engine - Full-Stack Product Catalog & Inventory Platform

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2F7-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Backend-Express%205-000000?style=flat&logo=express)](https://expressjs.com/)
[![Sequelize](https://img.shields.io/badge/ORM-Sequelize%206-52B0E7?style=flat&logo=sequelize)](https://sequelize.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2015-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Neon](https://img.shields.io/badge/Cloud%20DB-Neon%20Serverless-00E599?style=flat&logo=neon)](https://neon.tech/)
[![OpenAPI](https://img.shields.io/badge/Docs-OpenAPI%203.0%20%2F%20Swagger-85EA2D?style=flat&logo=swagger)](http://localhost:5001/api/docs)
[![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?style=flat&logo=docker)](https://www.docker.com/)

An enterprise-grade, full-stack product catalog and inventory management application built with modern web technologies. Nexus Engine provides high-performance CRUD workflows, real-time analytics, OpenAPI 3.0 / Swagger UI documentation, and flexible database support for both local Docker PostgreSQL and cloud serverless Neon PostgreSQL.

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Database Setup](#2-database-setup)
  - [3. Backend Configuration & Launch](#3-backend-configuration--launch)
  - [4. Frontend Configuration & Launch](#4-frontend-configuration--launch)
- [API Reference](#-api-reference)
  - [Interactive Documentation (Swagger UI)](#interactive-documentation-swagger-ui)
  - [Endpoint Summary](#endpoint-summary)
- [Environment Variables Guide](#-environment-variables-guide)
- [Available Scripts](#-available-scripts)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🏛 System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Client (Next.js 16 + React 19)"]
        UI["Glassmorphism Dashboard\n(Tailwind CSS v4)"]
        Service["Product Service Client\n(TypeScript Fetch API)"]
        UI --> Service
    end

    subgraph Server["Backend API (Express 5 + TypeScript)"]
        Router["Express REST Router\n& CORS Middleware"]
        Swagger["OpenAPI 3.0 / Swagger UI\n(/api/docs)"]
        ORM["Sequelize ORM\n(Data Modeling & Sync)"]
        Router --> ORM
        Router --> Swagger
    end

    subgraph Storage["Database Layer"]
        LocalDB[("Local PostgreSQL 15\n(Docker Compose :5433)")]
        CloudDB[("Neon Serverless Postgres\n(@neondatabase/serverless + ws)")]
    end

    Service -->|"HTTP / JSON REST API\n(:5001)"| Router
    ORM -.->|"Local Dialect"| LocalDB
    ORM -.->|"SSL / WebSocket Dialect"| CloudDB
```

---

## ✨ Key Features

- **Full Lifecycle Product CRUD**:
  - **Create**: Add items with instant validation for name and positive price.
  - **Read**: View all inventory items in responsive grid cards with formatted pricing.
  - **Update**: Modal-based editing with automatic state synchronization.
  - **Delete**: Protected deletion flow with confirmation modal dialog.
- **Real-Time Analytics & Stats**:
  - Automatically calculates **Total Inventory Items**, **Average Price**, and **Highest Priced Item**.
  - Visual system health badge reporting live backend connectivity status.
- **Search & Advanced Sorting**:
  - Instant client-side search filtering by product name.
  - Multi-directional sorting: Name (A to Z / Z to A) and Price (Low to High / High to Low).
- **One-Click Demo Seeding**:
  - Integrated `🔋 Seed Sample Data` button to instantly populate realistic tech gear catalog data.
- **OpenAPI 3.0 & Swagger UI Integration**:
  - Fully documented REST API accessible at `/api/docs` and machine-readable JSON at `/api/docs.json`.
- **Hybrid Database Architecture**:
  - Plug-and-play local PostgreSQL support via Docker Compose (`port 5433`).
  - Native serverless support for **Neon PostgreSQL** using `@neondatabase/serverless` over WebSockets with automatic SSL mode switching.
- **Contemporary UI / UX**:
  - Tailwind CSS v4 design with ambient glow effects, responsive card grids, shimmer loading states, and sliding toast notifications.

---

## 📁 Project Structure

```text
product/
├── backend/                        # Express 5 + Sequelize API Service
│   ├── dist/                       # Compiled JavaScript output (tsc)
│   ├── src/
│   │   ├── db.ts                   # Sequelize DB connection & Product model
│   │   ├── index.ts                # Express server entry point & REST endpoints
│   │   └── openapi.ts              # Complete OpenAPI 3.0.3 specification
│   ├── .env.example                # Backend environment template
│   ├── docker-compose.yaml         # Local PostgreSQL container definition
│   ├── package.json                # Backend dependencies & scripts
│   ├── tsconfig.json               # Backend TypeScript configuration
│   └── README.md                   # Backend specific documentation
│
├── frontend/                       # Next.js 16 + React 19 Client Dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css         # Global styles, fonts, and custom utilities
│   │   │   ├── layout.tsx          # Root HTML layout and metadata
│   │   │   └── page.tsx            # Nexus Engine interactive dashboard UI
│   │   ├── services/
│   │   │   └── productService.ts   # Typed API client functions
│   │   └── types/
│   │       └── productType.ts      # Product TypeScript interface
│   ├── .env.example                # Frontend environment template
│   ├── eslint.config.mjs           # ESLint configuration
│   ├── next.config.ts              # Next.js build configuration
│   ├── package.json                # Frontend dependencies & scripts
│   ├── postcss.config.mjs          # PostCSS configuration for Tailwind
│   └── tsconfig.json               # Frontend TypeScript configuration
│
├── README.md                       # Repository master documentation
└── REPORT.md                       # Comprehensive engineering technical report
```

---

## ⚙️ Prerequisites

Ensure you have the following installed on your host machine:

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or higher (or pnpm/yarn)
- **Docker & Docker Compose**: (Optional, if running local PostgreSQL)
- **Git**: For version control

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/tudzydev/product.git
cd product
```

---

### 2. Database Setup

Choose **Option A (Local Docker)** or **Option B (Cloud Neon / Remote Postgres)**:

#### Option A: Local PostgreSQL via Docker (Recommended for offline development)

From the `backend/` folder, run Docker Compose:

```bash
cd backend
docker compose up -d
```

This launches a PostgreSQL 15 container accessible at `localhost:5433` with database `product_db`, user `postgres`, and password `postgres`.

#### Option B: Cloud PostgreSQL (Neon / Supabase / RDS)

Create a free PostgreSQL instance on [Neon](https://neon.tech) and copy your connection string:
```text
postgresql://user:password@ep-sample-12345.region.neon.tech/neondb?sslmode=require
```

---

### 3. Backend Configuration & Launch

1. Navigate to `backend/` and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables:
   ```bash
   # Copy sample environment configuration
   cp .env.example .env
   ```

   Edit `.env` based on your database selection:
   ```env
   PORT=5001

   # If using Local Docker PostgreSQL:
   DB_HOST=localhost
   DB_PORT=5433
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=product_db

   # If using Neon / Cloud PostgreSQL (uncomment and fill):
   # DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
   ```

3. Run the backend development server:
   ```bash
   npm run dev
   ```
   *The server starts at `http://localhost:5001`.*

---

### 4. Frontend Configuration & Launch

1. Open a new terminal tab, navigate to `frontend/` and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Configure frontend environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Ensure `NEXT_PUBLIC_API_URL` points to your backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) in your web browser.*

---

## 📡 API Reference

### Interactive Documentation (Swagger UI)

Nexus Engine includes self-documenting OpenAPI 3.0 specification:
- **Interactive UI**: [http://localhost:5001/api/docs](http://localhost:5001/api/docs)
- **JSON Specification**: [http://localhost:5001/api/docs.json](http://localhost:5001/api/docs.json)

### Endpoint Summary

| Method | Endpoint | Description | Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Root service status | None | `200 OK` `{ status, message }` |
| `GET` | `/api/health` | Health & uptime diagnostics | None | `200 OK` `{ status, uptime, timestamp }` |
| `GET` | `/api/docs` | Swagger UI documentation | None | `200 OK` (HTML) |
| `GET` | `/api/docs.json` | OpenAPI 3.0 spec JSON | None | `200 OK` (JSON) |
| `GET` | `/api/products` | Retrieve all products | None | `200 OK` `{ message, products: [...] }` |
| `GET` | `/api/products/:id` | Retrieve single product | None | `200 OK` `{ message, product: {...} }` |
| `POST` | `/api/products` | Create a new product | `{"name": string, "price": number}` | `201 Created` `{ message, product }` |
| `POST` | `/api/products/seed` | Bulk seed sample items | `{"products": [{"name", "price"}]}` | `201 Created` `{ message, count, products }` |
| `PUT` | `/api/products/:id` | Update product by ID | `{"name"?: string, "price"?: number}` | `200 OK` `{ message, product }` |
| `DELETE` | `/api/products/:id` | Delete product by ID | None | `200 OK` `{ message }` |

---

## 🔧 Environment Variables Guide

### Backend (`backend/.env`)

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | `5001` | HTTP port where Express server listens |
| `DATABASE_URL` | String | - | Full connection URI for Cloud PostgreSQL (e.g. Neon) |
| `DATABASE_URL_UNPOOLED` | String | - | Direct unpooled connection URI (useful for migrations/serverless) |
| `DB_HOST` | String | `localhost` | Database server hostname |
| `DB_PORT` | Number | `5433` | Database server port (5433 for local Docker Compose) |
| `DB_USER` | String | `postgres` | Database username |
| `DB_PASSWORD` | String | `postgres` | Database user password |
| `DB_NAME` | String | `product_db` | Database schema name |

### Frontend (`frontend/.env.local`)

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | String | `http://localhost:5001` | Base URL of the Express backend service |

---

## 📜 Available Scripts

### Backend (`backend/package.json`)

```bash
# Start development server with live watch mode (tsx)
npm run dev

# Compile TypeScript into JavaScript (dist/)
npm run build

# Start production compiled server
npm start
```

### Frontend (`frontend/package.json`)

```bash
# Start Next.js development server with Turbopack
npm run dev

# Build production optimized Next.js package
npm run build

# Start Next.js production server
npm start

# Run ESLint validation
npm run lint
```

---

## 🔍 Troubleshooting

<details>
<summary><b>1. Backend fails to connect to database</b></summary>

- If using Docker: verify that the container is active with `docker ps`. If not running, run `docker compose up -d` inside `backend/`.
- Verify port matching: Docker binds to host port `5433`, so ensure `DB_PORT=5433` in `backend/.env`.
- If using Neon: make sure `DATABASE_URL` contains `sslmode=require`.
</details>

<details>
<summary><b>2. Frontend shows "BACKEND OFFLINE"</b></summary>

- Confirm the backend server is running on `http://localhost:5001`.
- Verify that `NEXT_PUBLIC_API_URL` in `frontend/.env.local` is set to `http://localhost:5001`.
- Check browser developer console (`F12`) for any CORS or network refusal errors.
</details>

<details>
<summary><b>3. Windows PowerShell Script Execution Policy warning</b></summary>

If you encounter `npm.ps1 cannot be loaded because running scripts is disabled on this system`, use `npm.cmd` directly:
```powershell
npm.cmd run dev
```
Or run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
</details>

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

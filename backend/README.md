# Backend Service - Product API

Express 5 + TypeScript + Sequelize backend service with OpenAPI 3.0 (Swagger) interactive documentation.

## 📖 OpenAPI Documentation

Interactive Swagger UI and raw OpenAPI 3.0 specification endpoints are built-in:

- **Swagger UI (Interactive)**: [http://localhost:5001/api/docs](http://localhost:5001/api/docs) or [http://localhost:5001/docs](http://localhost:5001/docs)
- **OpenAPI JSON Specification**: [http://localhost:5001/api/docs.json](http://localhost:5001/api/docs.json)

You can import `http://localhost:5001/api/docs.json` directly into Postman, Insomnia, Redoc, or OpenAPI code generators.

## 🚀 Running the Backend

### Development Mode (with hot-reload)
```bash
npm run dev
```

### Production Build & Run
```bash
npm run build
npm start
```

## 🛠 Available Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root API status |
| `GET` | `/api/health` | Service uptime and timestamp |
| `GET` | `/api/docs` | Swagger UI interactive documentation |
| `GET` | `/api/docs.json` | OpenAPI 3.0 JSON specification |
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/:id` | Get single product by ID |
| `POST` | `/api/products` | Create a new product |
| `POST` | `/api/products/seed` | Seed multiple sample products |
| `PUT` | `/api/products/:id` | Update product by ID |
| `DELETE` | `/api/products/:id` | Delete product by ID |

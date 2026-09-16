import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { connectDB, Product } from "./db.js";
import { openapiSpec } from "./openapi.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// OpenAPI Documentation routes
app.get("/api/docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.json(openapiSpec);
});

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(openapiSpec, {
    customSiteTitle: "Product API Docs - OpenAPI",
  })
);

app.get("/docs", (req: Request, res: Response) => {
  res.redirect("/api/docs");
});

// Root & health check routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Product API is up and running",
  });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/products", async (req: Request, res: Response): Promise<any> => {
  try {
    const products = await Product.findAll();

    return res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/api/products/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/api/products", async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    const newProduct = await Product.create({
      name,
      price: Number(price),
    });

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/api/products/seed", async (req: Request, res: Response): Promise<any> => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Products array is required for seeding",
      });
    }

    const created = await Product.bulkCreate(
      products.map((p: { name: string; price: number }) => ({
        name: p.name,
        price: Number(p.price),
      }))
    );

    return res.status(201).json({
      message: "Products seeded successfully",
      count: created.length,
      products: created,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.put("/api/products/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const { name, price } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.update({
      name: name ?? product.name,
      price: price ?? product.price,
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.delete("/api/products/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.destroy();

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect database:", error);
  }
};

startServer();

import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB, Product } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

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

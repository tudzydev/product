import { Product } from "@/types/productType";

const BACKEND_URL = "http://localhost:5001/api/products";

export const productService = {
  async getProducts(): Promise<Product[]> {
    const res = await fetch(BACKEND_URL);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to fetch products from server");
    }
    const data = await res.json();
    return data.products || [];
  },

  async getProduct(id: number): Promise<Product> {
    const res = await fetch(`${BACKEND_URL}/${id}`);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Product not found");
    }
    const data = await res.json();
    return data.product;
  },

  async createProduct(name: string, price: number): Promise<Product> {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to create product");
    }

    const data = await res.json();
    return data.product;
  },

  async updateProduct(id: number, name: string, price: number): Promise<Product> {
    const res = await fetch(`${BACKEND_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to update product details");
    }

    const data = await res.json();
    return data.product;
  },

  async deleteProduct(id: number): Promise<void> {
    const res = await fetch(`${BACKEND_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to delete product record");
    }
  },

  async seedProducts(sampleProducts: Omit<Product, "id">[]): Promise<number> {
    let successCount = 0;
    for (const item of sampleProducts) {
      try {
        await this.createProduct(item.name, item.price);
        successCount++;
      } catch (err) {
        console.error("Failed to seed product:", item.name, err);
      }
    }
    if (successCount === 0) {
      throw new Error("Failed to seed any sample items");
    }
    return successCount;
  }
};

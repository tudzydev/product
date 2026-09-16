"use client";

import { useEffect, useState } from "react";
import { productService, Product } from "@/services/productService";

interface Toast {
  id: string;
  type: "success" | "error";
  message: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Toasts state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Show Toast helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
      setIsConnected(true);
    } catch (err: any) {
      console.error("Backend connection error:", err);
      setIsConnected(false);
      showToast("Could not connect to database backend.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Create Product
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Product name is required", "error");
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      showToast("Please enter a valid price greater than 0", "error");
      return;
    }

    try {
      setSubmitting(true);
      await productService.createProduct(name.trim(), numPrice);
      showToast("Product created successfully");
      setIsCreateOpen(false);
      setName("");
      setPrice("");
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || "Error creating product", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setIsEditOpen(true);
  };

  // Handle Edit Product
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!name.trim()) {
      showToast("Product name is required", "error");
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      showToast("Please enter a valid price greater than 0", "error");
      return;
    }

    try {
      setSubmitting(true);
      await productService.updateProduct(selectedProduct.id, name.trim(), numPrice);
      showToast("Product updated successfully");
      setIsEditOpen(false);
      setSelectedProduct(null);
      setName("");
      setPrice("");
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || "Error updating product", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Confirm Modal
  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  // Handle Delete Product
  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      setSubmitting(true);
      await productService.deleteProduct(selectedProduct.id);
      showToast("Product deleted successfully");
      setIsDeleteOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || "Error deleting product", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Seed Sample Data helper
  const handleSeedData = async () => {
    const sampleProducts = [
      { name: "Orion Cyber-Keyboard V2", price: 189.99 },
      { name: "Quantum Fusion Gaming Mouse", price: 89.5 },
      { name: "Nebula 34\" Ultrawide OLED", price: 899.0 },
      { name: "Starlight Pro Condenser Mic", price: 149.0 },
      { name: "Aether ANC Wireless Buds", price: 129.99 },
    ];

    try {
      setLoading(true);
      const count = await productService.seedProducts(sampleProducts);
      showToast(`Successfully seeded ${count} items`);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || "Error seeding database", "error");
      setLoading(false);
    }
  };

  // Filter and Sort logic
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "name_asc":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Calculate statistics
  const totalCount = products.length;
  const averagePrice =
    totalCount > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / totalCount
      : 0;
  const maxPrice =
    totalCount > 0 ? Math.max(...products.map((p) => p.price)) : 0;

  // Inline SVGs for beautiful custom UI
  const Icons = {
    Search: () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    Plus: () => (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M12 5v14" />
      </svg>
    ),
    Edit: () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
    Trash: () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
      </svg>
    ),
    Close: () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    ),
    Database: () => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
      </svg>
    ),
    ProductIcon: () => (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
      </svg>
    ),
    Spinner: () => (
      <svg
        className="animate-spin"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    ),
    Sparkles: () => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
        <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5Z" />
        <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
      </svg>
    ),
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 pb-20 relative z-10 font-sans">
      {/* Background ambient lights */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-[380px] w-[calc(100%-48px)] pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl shadow-md border flex items-center justify-between gap-3 pointer-events-auto animate-[slideInRight_0.3s_cubic-bezier(0.16,1,0.3,1)] backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-50/95 border-emerald-500/20 text-emerald-800"
                : "bg-rose-50/95 border-rose-500/20 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-2.5 text-sm font-semibold">
              <span className="text-base">
                {toast.type === "success" ? "✓" : "⚠"}
              </span>
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="p-1 rounded-full text-current hover:bg-black/5 cursor-pointer transition-all duration-200"
            >
              <Icons.Close />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 animate-fade-in">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <Icons.Database /> NEXUS ENGINE
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Enterprise-grade catalog management powered by Express & Sequelize
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full bg-black/5 border border-black/5 text-slate-600">
          <span
            className={`w-2 h-2 rounded-full relative ${
              isConnected
                ? "bg-emerald-500 shadow-[0_0_10px_#10b981]"
                : "bg-rose-500 shadow-[0_0_10px_#f43f5e]"
            }`}
          />
          {isConnected ? "BACKEND ONLINE" : "BACKEND OFFLINE"}
        </div>
      </header>

      {/* Stats Board */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 animate-fade-in">
        <div className="rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-black/15 glass before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500 before:to-purple-500">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
            Total Inventory
            <span className="text-lg opacity-80">📦</span>
          </div>
          <div className="text-3xl font-bold tracking-tight text-slate-900">
            {loading ? "..." : totalCount}
          </div>
        </div>

        <div className="rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-black/15 glass before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-emerald-500 before:to-teal-500">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
            Average Price
            <span className="text-lg opacity-80">📊</span>
          </div>
          <div className="text-3xl font-bold tracking-tight text-slate-900">
            {loading ? "..." : `$${averagePrice.toFixed(2)}`}
          </div>
        </div>

        <div className="rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-black/15 glass before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-rose-500 before:to-red-500">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
            Highest Value
            <span className="text-lg opacity-80">🔥</span>
          </div>
          <div className="text-3xl font-bold tracking-tight text-slate-900">
            {loading ? "..." : `$${maxPrice.toFixed(2)}`}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8 bg-white/60 border border-black/5 p-4 rounded-2xl backdrop-blur-md shadow-xs animate-fade-in">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-[600px]">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">
              <Icons.Search />
            </span>
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 bg-white border border-black/10 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10 transition-all duration-300"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-2.5 px-4 bg-white border border-black/10 rounded-lg text-sm text-slate-900 outline-none cursor-pointer focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10 transition-all duration-300 min-w-[160px]"
          >
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
        <button
          onClick={() => {
            setName("");
            setPrice("");
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 hover:opacity-95 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
          disabled={!isConnected}
        >
          <Icons.Plus /> Add Product
        </button>
      </section>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="rounded-2xl overflow-hidden h-[310px] glass shimmer flex flex-col"
            >
              <div className="h-[140px]" />
              <div className="p-5 flex-1 flex flex-col">
                <div className="h-5 w-4/5 rounded bg-black/5 mb-3" />
                <div className="h-5 w-2/5 rounded bg-black/5 mb-3" />
                <div className="h-7 w-3/5 rounded bg-black/5 mt-auto mb-6" />
                <div className="flex gap-3 border-t border-black/5 pt-4">
                  <div className="h-[38px] flex-1 rounded bg-black/5" />
                  <div className="h-[38px] w-[38px] rounded bg-black/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {sortedProducts.map((product) => (
            <article
              key={product.id}
              className="group rounded-2xl overflow-hidden transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col h-full glass hover:-translate-y-1.5 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="h-[140px] bg-gradient-to-br from-indigo-500/3 to-purple-500/3 border-b border-black/5 flex items-center justify-center relative">
                <div className="w-16 h-16 rounded-full bg-black/3 border border-black/3 flex items-center justify-center text-indigo-600 text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-5 group-hover:text-purple-600 group-hover:bg-white group-hover:border-purple-200">
                  <Icons.ProductIcon />
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-bold text-slate-800 mb-2 line-clamp-2 leading-snug">
                  {product.name}
                </h3>
                <div className="text-2xl font-extrabold text-slate-900 mt-auto mb-5 flex items-baseline gap-0.5">
                  <span className="text-sm font-medium text-slate-500">$</span>
                  {product.price.toFixed(2)}
                </div>
                <div className="flex gap-2.5 border-t border-black/5 pt-4">
                  <button
                    onClick={() => openEditModal(product)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-white text-slate-800 border border-black/10 hover:bg-black/5 hover:border-black/15 shadow-xs active:scale-98 flex-1"
                  >
                    <Icons.Edit /> Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(product)}
                    className="p-2.5 rounded-lg bg-black/5 border border-black/5 text-slate-500 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 cursor-pointer transition-all duration-200 active:scale-98"
                    aria-label="Delete product"
                  >
                    <Icons.Trash />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl p-10 py-14 text-center flex flex-col items-center justify-center max-w-[500px] mx-auto border-2 border-dashed border-black/10 glass animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-600 text-3xl mb-6">
            {searchQuery ? <Icons.Search /> : <Icons.Sparkles />}
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {searchQuery ? "No products found" : "Database is empty"}
          </h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            {searchQuery
              ? `We couldn't find any products matching "${searchQuery}". Try refining your query.`
              : "Nexus Database is initialized and connected, but holds no records yet. Build the catalog or seed default tech gear."}
          </p>
          <div className="flex gap-3">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-white text-slate-800 border border-black/10 hover:bg-black/5 hover:border-black/15 shadow-xs active:scale-98"
              >
                Clear Search
              </button>
            ) : (
              <>
                <button
                  onClick={handleSeedData}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-white text-slate-800 border border-black/10 hover:bg-black/5 hover:border-black/15 shadow-xs active:scale-98"
                >
                  🔋 Seed Sample Data
                </button>
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 hover:opacity-95 active:scale-98"
                >
                  <Icons.Plus /> Add First Product
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-[100] flex items-center justify-center p-5">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl glass animate-[scaleIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
            <div className="p-6 pb-4 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">New Product Entry</h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-black/5 hover:text-slate-800 transition-all duration-200 cursor-pointer"
              >
                <Icons.Close />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="p-6">
                <div className="mb-5">
                  <label htmlFor="prod-name" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Product Name
                  </label>
                  <input
                    id="prod-name"
                    type="text"
                    required
                    placeholder="e.g. Mechanical Gaming Keyboard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-2.5 px-4 bg-white border border-black/10 rounded-lg text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10 transition-all duration-300"
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="prod-price" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Price (USD)
                  </label>
                  <input
                    id="prod-price"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full py-2.5 px-4 bg-white border border-black/10 rounded-lg text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="p-6 pt-4 border-t border-black/5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-white text-slate-800 border border-black/10 hover:bg-black/5 hover:border-black/15 shadow-xs active:scale-98"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 hover:opacity-95 active:scale-98 min-w-[140px]"
                  disabled={submitting}
                >
                  {submitting ? <Icons.Spinner /> : "Register Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-[100] flex items-center justify-center p-5">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl glass animate-[scaleIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
            <div className="p-6 pb-4 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Modify Product Specification</h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-black/5 hover:text-slate-800 transition-all duration-200 cursor-pointer"
              >
                <Icons.Close />
              </button>
            </div>
            <form onSubmit={handleEdit}>
              <div className="p-6">
                <div className="mb-5">
                  <label htmlFor="edit-name" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Product Name
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-2.5 px-4 bg-white border border-black/10 rounded-lg text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10 transition-all duration-300"
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="edit-price" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Price (USD)
                  </label>
                  <input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full py-2.5 px-4 bg-white border border-black/10 rounded-lg text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="p-6 pt-4 border-t border-black/5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-white text-slate-800 border border-black/10 hover:bg-black/5 hover:border-black/15 shadow-xs active:scale-98"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 hover:opacity-95 active:scale-98 min-w-[140px]"
                  disabled={submitting}
                >
                  {submitting ? <Icons.Spinner /> : "Update Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-[100] flex items-center justify-center p-5">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl glass animate-[scaleIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
            <div className="p-6 pb-4 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Terminate Record</h2>
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-black/5 hover:text-slate-800 transition-all duration-200 cursor-pointer"
              >
                <Icons.Close />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <strong className="text-slate-900">
                  {selectedProduct.name}
                </strong>
                ? This action is irreversible.
              </p>
            </div>
            <div className="p-6 pt-4 border-t border-black/5 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-white text-slate-800 border border-black/10 hover:bg-black/5 hover:border-black/15 shadow-xs active:scale-98"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-md shadow-rose-600/10 hover:shadow-lg hover:shadow-rose-600/20 hover:opacity-95 active:scale-98"
                disabled={submitting}
              >
                {submitting ? <Icons.Spinner /> : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  hero_image: string;
  description?: string;
  created_at?: string;
}

interface Order {
  id: number;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "",
    brand: "Apple",
    category: "",
    price: "",
    stock: "",
    hero_image: "",
    description: "",
  });

  const [editProduct, setEditProduct] = useState({
    title: "",
    brand: "Apple",
    category: "",
    price: "",
    stock: "",
    hero_image: "",
    description: "",
  });

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error.message);
        alert("Error fetching products: " + error.message);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Add new product to Supabase
  const handleAddProduct = async () => {
    if (
      !newProduct.title ||
      !newProduct.category ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.hero_image
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            title: newProduct.title,
            brand: newProduct.brand,
            category: newProduct.category,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock),
            hero_image: newProduct.hero_image,
            description: newProduct.description,
          },
        ])
        .select();

      if (error) {
        console.error("Error adding product:", error);
        alert("Error adding product: " + error.message);
      } else {
        // Reset form
        setNewProduct({
          title: "",
          brand: "Apple",
          category: "",
          price: "",
          stock: "",
          hero_image: "",
          description: "",
        });
        setShowAddProduct(false);
        // Refresh products list
        fetchProducts();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  // Delete product from Supabase
  const handleDeleteProduct = async (
    productId: number,
    productTitle: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete "${productTitle}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product: " + error.message);
      } else {
        // Refresh products list
        fetchProducts();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting product");
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditProduct({
      title: product.title,
      brand: product.brand,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      hero_image: product.hero_image,
      description: product.description || "",
    });
    setShowEditProduct(true);
  };

  // Save edited product to Supabase
  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    if (
      !editProduct.title ||
      !editProduct.category ||
      !editProduct.price ||
      !editProduct.stock ||
      !editProduct.hero_image
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from("products")
        .update({
          title: editProduct.title,
          brand: editProduct.brand,
          category: editProduct.category,
          price: parseFloat(editProduct.price),
          stock: parseInt(editProduct.stock),
          hero_image: editProduct.hero_image,
          description: editProduct.description,
        })
        .eq("id", editingProduct.id);

      if (error) {
        console.error("Error updating product:", error);
        alert("Error updating product: " + error.message);
      } else {
        setShowEditProduct(false);
        setEditingProduct(null);
        // Refresh products list
        fetchProducts();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditProduct(false);
    setEditingProduct(null);
  };

  const tabs = [
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "sales", label: "Sales", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            iPhone Store Admin
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="lg:hidden">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex space-x-2 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}>
                      <Icon size={18} />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-64 bg-white rounded-lg shadow-sm p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}>
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1">
            {activeTab === "products" && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 sm:p-6 border-b">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      iPhone Products
                    </h2>
                    <button
                      onClick={() => setShowAddProduct(true)}
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto">
                      <Plus size={16} />
                      {loading ? "Loading..." : "Add iPhone"}
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-600">Loading products...</div>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <Package
                        size={48}
                        className="mx-auto text-gray-400 mb-4"
                      />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No iPhones yet
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        Add your first iPhone product
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                              Product
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                              Category
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                              Price
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                              Stock
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr
                              key={product.id}
                              className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={product.hero_image}
                                    alt={product.title}
                                    className="w-12 h-12 rounded-md object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "https://via.placeholder.com/48x48?text=IMG";
                                    }}
                                  />
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {product.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {product.brand}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {product.category}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="text-lg font-semibold text-gray-900">
                                  ${product.price}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      product.stock === 0
                                        ? "bg-red-500"
                                        : product.stock <= 5
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                    }`}></div>
                                  <span
                                    className={`${
                                      product.stock === 0
                                        ? "text-red-600 font-medium"
                                        : "text-gray-900"
                                    }`}>
                                    {product.stock}{" "}
                                    {product.stock === 0
                                      ? "(Out of Stock)"
                                      : ""}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEditProduct(product)}
                                    disabled={loading}
                                    className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded disabled:opacity-50"
                                    title="Edit Product">
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteProduct(
                                        product.id,
                                        product.title
                                      )
                                    }
                                    disabled={loading}
                                    className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded disabled:opacity-50"
                                    title="Delete Product">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                        <span>Total Models: {products.length}</span>
                        <span>
                          Total In Stock:{" "}
                          {products.reduce((total, p) => total + p.stock, 0)}{" "}
                          units
                        </span>
                        <span>
                          Total Inventory Value: $
                          {products
                            .reduce((total, p) => total + p.price * p.stock, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  Orders
                </h2>
                <div className="text-gray-700">{orders.length} orders</div>
              </div>
            )}

            {activeTab === "sales" && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  Sales
                </h2>
                <div className="text-gray-700">Sales analytics</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add iPhone Product
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Basic Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      iPhone Title *
                    </label>
                    <input
                      type="text"
                      value={newProduct.title}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, title: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                      placeholder="iPhone 15 Pro Max 256GB - Natural Titanium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Category *
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      required>
                      <option value="">Select iPhone category</option>
                      <option value="iPhone 16 Series">iPhone 16 Series</option>
                      <option value="iPhone 15 Series">iPhone 15 Series</option>
                      <option value="iPhone 14 Series">iPhone 14 Series</option>
                      <option value="iPhone 13 Series">iPhone 13 Series</option>
                      <option value="iPhone 12 Series">iPhone 12 Series</option>
                      <option value="iPhone 11 Series">iPhone 11 Series</option>
                      <option value="iPhone X Series">iPhone X Series</option>
                      <option value="iPhone SE">iPhone SE</option>
                      <option value="Refurbished iPhones">
                        Refurbished iPhones
                      </option>
                      <option value="iPhone Accessories">
                        iPhone Accessories
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                      placeholder="iPhone description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="text"
                          value={newProduct.price}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
                              setNewProduct({ ...newProduct, price: value });
                            }
                          }}
                          className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                          placeholder="999.00"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Stock *
                      </label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            stock: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                        placeholder="10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      iPhone Image *
                    </label>
                    <input
                      type="url"
                      value={newProduct.hero_image}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          hero_image: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                      placeholder="https://example.com/iphone-image.jpg"
                      required
                    />

                    {newProduct.hero_image && (
                      <div className="mt-3 border border-gray-300 p-2">
                        <img
                          src={newProduct.hero_image}
                          alt="iPhone preview"
                          className="w-32 h-32 object-cover rounded-md mx-auto"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/128x128?text=Preview";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAddProduct(false)}
                  disabled={loading}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50">
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                  {loading ? "Adding..." : "Add iPhone"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit iPhone Product
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Basic Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      iPhone Title *
                    </label>
                    <input
                      type="text"
                      value={editProduct.title}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          title: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                      placeholder="iPhone 15 Pro Max 256GB - Natural Titanium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Category *
                    </label>
                    <select
                      value={editProduct.category}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      required>
                      <option value="">Select iPhone category</option>
                      <option value="iPhone 16 Series">iPhone 16 Series</option>
                      <option value="iPhone 15 Series">iPhone 15 Series</option>
                      <option value="iPhone 14 Series">iPhone 14 Series</option>
                      <option value="iPhone 13 Series">iPhone 13 Series</option>
                      <option value="iPhone 12 Series">iPhone 12 Series</option>
                      <option value="iPhone 11 Series">iPhone 11 Series</option>
                      <option value="iPhone X Series">iPhone X Series</option>
                      <option value="iPhone SE">iPhone SE</option>
                      <option value="Refurbished iPhones">
                        Refurbished iPhones
                      </option>
                      <option value="iPhone Accessories">
                        iPhone Accessories
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editProduct.description}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          description: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                      placeholder="iPhone description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="text"
                          value={editProduct.price}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
                              setEditProduct({ ...editProduct, price: value });
                            }
                          }}
                          className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                          placeholder="999.00"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1">
                        Stock *
                      </label>
                      <input
                        type="number"
                        value={editProduct.stock}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            stock: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                        placeholder="10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      iPhone Image *
                    </label>
                    <input
                      type="url"
                      value={editProduct.hero_image}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          hero_image: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                      placeholder="https://example.com/iphone-image.jpg"
                      required
                    />

                    {editProduct.hero_image && (
                      <div className="mt-3 border border-gray-300 p-2">
                        <img
                          src={editProduct.hero_image}
                          alt="iPhone preview"
                          className="w-32 h-32 object-cover rounded-md mx-auto"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/128x128?text=Preview";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4">
              <div className="flex gap-4">
                <button
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50">
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

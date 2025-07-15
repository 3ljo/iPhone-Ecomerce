"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/components/CartContext";
import {
  Search,
  Grid3X3,
  List,
  ShoppingCart,
  Heart,
  Star,
  X,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  hero_image: string;
  description?: string;
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [addedToCart, setAddedToCart] = useState<number[]>([]);

  // Cart and Wishlist hooks
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useCart();

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: false });

        if (error) {
          console.error("Error fetching products:", error);
        } else {
          setProducts(data || []);
          setFilteredProducts(data || []);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch all categories separately
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("category")
          .not("category", "is", null);

        if (error) {
          console.error("Error fetching categories:", error);
        } else {
          // Extract unique categories from all products
          const uniqueCategories = [
            ...new Set(data?.map((p) => p.category) || []),
          ]
            .filter(Boolean)
            .sort();
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCategories();
  }, []);

  // Filter and search products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max
    );

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setPriceRange({ min: 0, max: 2000 });
    setSortBy("newest");
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1);
    setAddedToCart((prev) => [...prev, product.id]);

    setTimeout(() => {
      setAddedToCart((prev) => prev.filter((id) => id !== product.id));
    }, 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              iPhone Collection
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Discover our complete range of premium iPhones with cutting-edge
            technology
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span>{filteredProducts.length} Products</span>
            <span>•</span>
            <span>Free Shipping Over $500</span>
            <span>•</span>
            <span>1 Year Warranty</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search iPhones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>

              <div className="flex bg-gray-900 border border-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}>
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}>
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="All">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            min: Number(e.target.value),
                          })
                        }
                        className="w-1/2 bg-black border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            max: Number(e.target.value),
                          })
                        }
                        className="w-1/2 bg-black border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="text-xs text-gray-400">
                      ${priceRange.min} - ${priceRange.max}
                    </div>
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 animate-pulse rounded-2xl h-96"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-105 relative">
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleWishlistToggle(e, product)}
                      className={`absolute top-4 left-4 w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors z-20 ${
                        isInWishlist(product.id)
                          ? "bg-pink-600 text-white"
                          : "bg-black/50 text-white hover:bg-black/70"
                      }`}>
                      <Heart
                        className={`h-4 w-4 ${
                          isInWishlist(product.id) ? "fill-current" : ""
                        }`}
                      />
                    </button>

                    {/* Stock indicators */}
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold z-10">
                        Low Stock
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold z-10">
                        Sold Out
                      </span>
                    )}

                    {/* Product Image - Clickable */}
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="aspect-square p-6 relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-800 to-gray-900">
                        <img
                          src={product.hero_image}
                          alt={product.title}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692845702501";
                          }}
                        />
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="p-6 space-y-3">
                      <span className="text-blue-400 text-sm font-semibold">
                        {product.category}
                      </span>

                      <Link href={`/products/${product.id}`} className="block">
                        <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 hover:text-blue-100 transition-colors cursor-pointer">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="text-sm text-gray-400 ml-1">
                          (4.8)
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-white">
                          ${product.price}
                        </span>
                        <span className="text-sm text-gray-400">
                          Stock: {product.stock}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        disabled={
                          product.stock === 0 ||
                          addedToCart.includes(product.id)
                        }>
                        {addedToCart.includes(product.id) ? (
                          <>
                            <Check className="h-4 w-4" />
                            Added!
                          </>
                        ) : product.stock === 0 ? (
                          "Sold Out"
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-gradient-to-r from-gray-900 to-black rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 p-6 relative">
                    {/* Wishlist button for list view */}
                    <button
                      onClick={(e) => handleWishlistToggle(e, product)}
                      className={`absolute top-6 right-6 w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors z-20 ${
                        isInWishlist(product.id)
                          ? "bg-pink-600 text-white"
                          : "bg-black/50 text-white hover:bg-black/70"
                      }`}>
                      <Heart
                        className={`h-4 w-4 ${
                          isInWishlist(product.id) ? "fill-current" : ""
                        }`}
                      />
                    </button>

                    <div className="flex flex-col md:flex-row gap-6">
                      <Link
                        href={`/products/${product.id}`}
                        className="w-full md:w-48 h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 flex-shrink-0 relative block">
                        <img
                          src={product.hero_image}
                          alt={product.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692845702501";
                          }}
                        />
                      </Link>

                      <div className="flex-1 space-y-4">
                        <div>
                          <span className="text-blue-400 text-sm font-semibold">
                            {product.category}
                          </span>
                          <Link
                            href={`/products/${product.id}`}
                            className="block">
                            <h3 className="font-bold text-white text-xl mt-1 hover:text-blue-100 transition-colors cursor-pointer">
                              {product.title}
                            </h3>
                          </Link>
                          <p className="text-gray-400 mt-2">
                            {product.description ||
                              "Premium iPhone with latest technology and features."}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                          <span className="text-sm text-gray-400 ml-1">
                            (4.8)
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl font-black text-white">
                              ${product.price}
                            </span>
                            <span className="text-sm text-gray-400">
                              Stock: {product.stock}
                            </span>
                            {product.stock <= 5 && product.stock > 0 && (
                              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                Low Stock
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            disabled={
                              product.stock === 0 ||
                              addedToCart.includes(product.id)
                            }>
                            {addedToCart.includes(product.id) ? (
                              <>
                                <Check className="h-4 w-4" />
                                Added!
                              </>
                            ) : product.stock === 0 ? (
                              "Sold Out"
                            ) : (
                              <>
                                <ShoppingCart className="h-4 w-4" />
                                Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

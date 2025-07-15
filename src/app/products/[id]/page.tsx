"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/components/CartContext";
import {
  ShoppingCart,
  Heart,
  Star,
  ArrowLeft,
  Plus,
  Minus,
  Check,
  Truck,
  Shield,
  RefreshCw,
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
  gallery_images?: string[];
  gallery_videos?: string[];
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useCart();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (error) {
          console.error("Error fetching product:", error);
          router.push("/products");
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error("Error:", error);
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product, quantity);
    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-800 rounded-2xl"></div>
              <div className="space-y-6">
                <div className="h-4 bg-gray-800 rounded w-24"></div>
                <div className="h-8 bg-gray-800 rounded w-3/4"></div>
                <div className="h-20 bg-gray-800 rounded"></div>
                <div className="h-12 bg-gray-800 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Combine hero image with gallery images
  const allImages = [
    product.hero_image,
    ...(product.gallery_images || []),
  ].filter(Boolean);

  const allVideos = product.gallery_videos || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images & Videos */}
          <div className="flex gap-4">
            {/* Vertical Thumbnails */}
            <div className="flex flex-col gap-2">
              {allImages.map((image, index) => (
                <button
                  key={`img-${index}`}
                  onClick={() => {
                    setActiveTab("images");
                    setSelectedImage(index);
                  }}
                  className={`w-16 h-16 bg-gray-800 rounded-lg p-1 border-2 transition-all duration-200 flex-shrink-0 ${
                    activeTab === "images" && selectedImage === index
                      ? "border-blue-500 ring-2 ring-blue-500/30"
                      : "border-gray-700 hover:border-gray-600"
                  }`}>
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-contain rounded"
                  />
                </button>
              ))}

              {allVideos.map((video, index) => (
                <button
                  key={`vid-${index}`}
                  onClick={() => {
                    setActiveTab("videos");
                    setSelectedImage(index);
                  }}
                  className={`w-16 h-16 bg-gray-800 rounded-lg p-1 border-2 transition-all duration-200 flex-shrink-0 relative ${
                    activeTab === "videos" && selectedImage === index
                      ? "border-blue-500 ring-2 ring-blue-500/30"
                      : "border-gray-700 hover:border-gray-600"
                  }`}>
                  <video
                    src={video}
                    className="w-full h-full object-contain rounded"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 bg-black/70 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[4px] border-l-white border-y-[2px] border-y-transparent ml-0.5"></div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Main Display Area */}
            <div className="flex-1 aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 relative overflow-hidden">
              {activeTab === "images" ? (
                <img
                  src={allImages[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692845702501";
                  }}
                />
              ) : allVideos.length > 0 && selectedImage < allVideos.length ? (
                <video
                  src={allVideos[selectedImage]}
                  className="w-full h-full object-contain"
                  controls
                  playsInline
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <p>No video available</p>
                </div>
              )}

              {/* Stock indicators */}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="absolute top-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                  Only {product.stock} left!
                </span>
              )}
              {product.stock === 0 && (
                <span className="absolute top-6 right-6 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                  Sold Out
                </span>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <span className="text-blue-400 text-sm font-semibold uppercase tracking-wide">
                {product.category}
              </span>
              <h1 className="text-4xl font-black text-white mt-2 leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-gray-400">(4.8) • 156 reviews</span>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-lg leading-relaxed">
              {product.description ||
                "Experience the latest in mobile technology with this premium iPhone. Featuring cutting-edge performance, stunning camera capabilities, and sleek design that sets the standard for smartphones."}
            </p>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black text-white">
                ${product.price}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-white font-semibold">Quantity:</span>
              <div className="flex items-center border border-gray-700 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-white font-semibold min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-gray-400 text-sm">
                {product.stock} available
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addedToCart}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {addedToCart ? (
                  <>
                    <Check className="h-5 w-5" />
                    Added to Cart!
                  </>
                ) : product.stock === 0 ? (
                  "Sold Out"
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart • ${(product.price * quantity).toFixed(2)}
                  </>
                )}
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`p-4 rounded-xl border-2 transition-colors flex items-center justify-center ${
                  isInWishlist(product.id)
                    ? "bg-pink-600 border-pink-600 text-white"
                    : "border-gray-700 text-gray-400 hover:border-pink-500 hover:text-pink-500"
                }`}>
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlist(product.id) ? "fill-current" : ""
                  }`}
                />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800">
              <div className="text-center">
                <Truck className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">
                  Free Shipping
                </p>
                <p className="text-xs text-gray-400">On orders over $500</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">
                  1 Year Warranty
                </p>
                <p className="text-xs text-gray-400">Full protection</p>
              </div>
              <div className="text-center">
                <RefreshCw className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">
                  30-Day Returns
                </p>
                <p className="text-xs text-gray-400">Easy returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

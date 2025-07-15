"use client";
import { useCart } from "@/components/CartContext";
import {
  Heart,
  ShoppingCart,
  ArrowLeft,
  Share2,
  Trash2,
  ShoppingBag,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist, addToCart } =
    useCart();

  const [addedItems, setAddedItems] = useState<number[]>([]);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setAddedItems((prev) => [...prev, product.id]);

    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== product.id));
    }, 2000);
  };

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Wishlist - Eljo Store",
        text: "Check out my wishlist at Eljo Store",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-400 mb-8">
              Save your favorite items to your wishlist so you can easily find
              them later.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
              <ShoppingBag className="h-5 w-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">My Wishlist</h1>
            <p className="text-gray-400">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
              <div className="flex items-start gap-4">
                <Link
                  href={`/products/${product.id}`}
                  className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-800 rounded-xl p-2">
                    <img
                      src={product.hero_image}
                      alt={product.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692845702501";
                      }}
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-bold text-white text-lg hover:text-blue-100 transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-gray-400 text-sm">
                        {product.category}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors p-2">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        ${product.price}
                      </div>
                      <div className="text-sm text-gray-400">
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={
                        product.stock === 0 || addedItems.includes(product.id)
                      }
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                      {addedItems.includes(product.id) ? (
                        <>
                          <Check className="h-4 w-4" />
                          Added!
                        </>
                      ) : product.stock === 0 ? (
                        "Out of Stock"
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>

                  {product.stock <= 5 && product.stock > 0 && (
                    <p className="text-orange-400 text-sm mt-2">
                      Only {product.stock} left in stock
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

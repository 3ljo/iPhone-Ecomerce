"use client";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  Gift,
  Truck,
} from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal - discount + shipping + tax;

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(subtotal * 0.1);
      setPromoApplied(true);
    } else if (promoCode.toLowerCase() === "welcome20") {
      setDiscount(subtotal * 0.2);
      setPromoApplied(true);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-400 mb-8">
              Looks like you haven't added anything to your cart yet. Start
              shopping to fill it up!
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

        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Shopping Cart</h1>
          <p className="text-gray-400">
            {getCartItemsCount()} {getCartItemsCount() === 1 ? "item" : "items"}{" "}
            in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-gray-800 rounded-xl p-2 flex-shrink-0">
                    <img
                      src={item.hero_image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692845702501";
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-white text-lg">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{item.category}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors p-2">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-gray-800 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2 text-gray-400 hover:text-white transition-colors">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 text-white font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">
                          ${item.price} each
                        </div>
                      </div>
                    </div>

                    {item.quantity >= item.stock && (
                      <p className="text-orange-400 text-sm mt-2">
                        Maximum quantity reached
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
              Clear entire cart
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Promo Code</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={handlePromoCode}
                    disabled={promoApplied}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-green-400 text-sm">Promo code applied!</p>
                )}
                <div className="text-xs text-gray-400">
                  Try: SAVE10 or WELCOME20
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-white text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-white font-semibold">Free Shipping</p>
                  <p className="text-gray-400 text-sm">
                    {subtotal >= 500
                      ? "Congratulations! You qualify for free shipping."
                      : `Add $${(500 - subtotal).toFixed(
                          2
                        )} more for free shipping.`}
                  </p>
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2">
              <CreditCard className="h-5 w-5" />
              Proceed to Checkout
            </button>

            <div className="text-center">
              <button className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 mx-auto">
                <Gift className="h-4 w-4" />
                Add a gift message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

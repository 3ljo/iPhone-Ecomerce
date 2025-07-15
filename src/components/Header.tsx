"use client";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  ShoppingCart,
  Heart,
  Menu,
  User,
  LogOut,
  Settings,
  Package,
} from "lucide-react";
import Link from "next/link";
import AuthModal from "./AuthModal";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const { getCartItemsCount, wishlistItems } = useCart();
  const { user, profile, signOut } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">(
    "login"
  );

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut();
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-500 shadow-2xl shadow-purple-500/25">
                <span className="text-white font-black text-xl">E</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-all duration-500"></div>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-500">
              Eljo Store
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-400 hover:text-white transition-colors">
              Products
            </Link>
            <Link
              href="/support"
              className="text-gray-400 hover:text-white transition-colors">
              Support
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Wishlist Icon */}
            <Link href="/wishlist" className="relative">
              <Heart className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {wishlistItems.length}
              </span>
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {getCartItemsCount()}
              </span>
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                {user && (
                  <span className="hidden sm:block text-sm font-medium">
                    {profile?.full_name?.split(" ")[0] || "User"}
                  </span>
                )}
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                  {user ? (
                    <>
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white font-medium">
                          {profile?.full_name || "User"}
                        </p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors w-full text-left">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Not logged in */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white font-medium">Welcome!</p>
                        <p className="text-gray-400 text-sm">
                          Sign in to your account
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setAuthModalTab("login");
                          setAuthModalOpen(true);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full text-left">
                        <User className="h-4 w-4" />
                        Login
                      </button>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setAuthModalTab("register");
                          setAuthModalOpen(true);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full text-left">
                        <User className="h-4 w-4" />
                        Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 bg-black/90 backdrop-blur-xl">
            <nav className="flex flex-col space-y-4 px-6">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-400 hover:text-white transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}>
                Products
              </Link>
              <Link
                href="/support"
                className="text-gray-400 hover:text-white transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}>
                Support
              </Link>

              {/* Mobile User Section */}
              <div className="border-t border-white/10 pt-4 mt-4">
                {user ? (
                  <>
                    <div className="pb-2">
                      <p className="text-white font-medium">
                        {profile?.full_name || "User"}
                      </p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors font-medium mt-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setAuthModalTab("login");
                        setAuthModalOpen(true);
                      }}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium">
                      <User className="h-4 w-4" />
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setAuthModalTab("register");
                        setAuthModalOpen(true);
                      }}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium mt-2">
                      <User className="h-4 w-4" />
                      Register
                    </button>
                  </>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 mt-4">
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}>
                  <ShoppingCart className="h-4 w-4" />
                  Cart ({getCartItemsCount()})
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium mt-2"
                  onClick={() => setMobileMenuOpen(false)}>
                  <Heart className="h-4 w-4" />
                  Wishlist ({wishlistItems.length})
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </header>
  );
}

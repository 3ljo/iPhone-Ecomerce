"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialTab = "login",
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 p-4"
      onClick={onClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {activeTab === "login" ? "Sign In" : "Create Account"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "login"
                ? "text-blue-400 border-b-2 border-blue-400 bg-gray-800/50"
                : "text-gray-400 hover:text-white hover:bg-gray-800/30"
            }`}>
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "register"
                ? "text-blue-400 border-b-2 border-blue-400 bg-gray-800/50"
                : "text-gray-400 hover:text-white hover:bg-gray-800/30"
            }`}>
            Register
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "login" ? (
            <LoginForm onClose={onClose} />
          ) : (
            <RegisterForm
              onClose={onClose}
              onSwitchToLogin={() => setActiveTab("login")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

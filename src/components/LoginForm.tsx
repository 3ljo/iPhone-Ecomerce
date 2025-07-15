"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onClose: () => void;
}

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm({ onClose }: LoginFormProps) {
  const { signIn, resetPassword } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        setError(error.message);
      } else {
        // Success - close modal
        onClose();
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (): Promise<void> => {
    if (!formData.email) {
      setError("Please enter your email address first");
      return;
    }

    setIsResetting(true);
    setError("");
    setMessage("");

    try {
      const { error } = await resetPassword(formData.email);

      if (error) {
        setError(error.message);
      } else {
        setMessage("Password reset email sent! Check your inbox.");
      }
    } catch (err: any) {
      setError("Failed to send reset email");
    } finally {
      setIsResetting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="p-3 bg-green-900/50 border border-green-700 rounded text-green-200 text-sm">
          {message}
        </div>
      )}

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="Enter your email"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300">
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center text-gray-300">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
          />
          <span className="ml-2">Remember me</span>
        </label>
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={isResetting}
          className="text-blue-400 hover:text-blue-300 disabled:opacity-50">
          {isResetting ? "Sending..." : "Forgot password?"}
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded transition-colors flex items-center justify-center">
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}

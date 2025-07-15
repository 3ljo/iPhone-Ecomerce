"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface RegisterFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm({
  onClose,
  onSwitchToLogin,
}: RegisterFormProps) {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Success - user actually created
        alert(
          "Registration successful! Please check your email to verify your account."
        );
        onSwitchToLogin();
      } else {
        // No user returned = registration failed (likely duplicate email)
        setError("User already exists with this email address.");
      }
    } catch (err: any) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
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

      {/* Full Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="Enter your full name"
          />
        </div>
      </div>

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
            placeholder="Create a password"
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

      {/* Confirm Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300">
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start">
        <input
          type="checkbox"
          required
          className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 mt-1"
        />
        <label className="ml-2 text-sm text-gray-300">
          I agree to the{" "}
          <button type="button" className="text-blue-400 hover:text-blue-300">
            Terms of Service
          </button>{" "}
          and{" "}
          <button type="button" className="text-blue-400 hover:text-blue-300">
            Privacy Policy
          </button>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded transition-colors flex items-center justify-center">
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </button>

      {/* Already have account */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
}

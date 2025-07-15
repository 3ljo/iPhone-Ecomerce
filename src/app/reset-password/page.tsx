"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session);

      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
        setError(""); // Clear any previous errors
      }

      if (event === "SIGNED_IN" && session) {
        // User is signed in, allow password reset
        setIsPasswordRecovery(true);
      }
    });

    // Check if user is already signed in (in case they refreshed the page)
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setIsPasswordRecovery(true);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Validate password strength
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      // Check if we're in a password recovery session
      if (!isPasswordRecovery) {
        setError(
          "No valid password recovery session. Please use the reset link from your email."
        );
        return;
      }

      // Update the user's password
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Clear form
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      console.error("Password update error:", err);
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Password Updated!</h1>
          <p className="text-gray-400 mb-6">
            Your password has been successfully updated. You can now login with
            your new password.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Go to Home & Login
          </button>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Reset Your Password</h1>
          <p className="text-gray-400">
            {isPasswordRecovery
              ? "Enter your new password below"
              : "Please click the reset link from your email first"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded text-red-200 p-3 text-sm">
              {error}
            </div>
          )}

          {!isPasswordRecovery && (
            <div className="bg-yellow-900/50 border border-yellow-700 rounded text-yellow-200 p-3 text-sm">
              <p className="font-medium mb-2">Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Check your email for a password reset link</li>
                <li>Click the link in the email</li>
                <li>You'll be redirected here to set a new password</li>
              </ol>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={!isPasswordRecovery}
                className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 disabled:opacity-50"
                disabled={!isPasswordRecovery}>
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={!isPasswordRecovery}
                className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 disabled:opacity-50"
                disabled={!isPasswordRecovery}>
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isPasswordRecovery}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded transition-colors flex items-center justify-center">
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

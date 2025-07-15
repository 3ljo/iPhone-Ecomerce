"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, Shield } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Get current session directly from Supabase
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        console.log("Session check:", {
          session: !!session,
          error: sessionError,
        });
        setDebugInfo(`Session: ${session ? "yes" : "no"}`);

        if (!session) {
          setDebugInfo("No session - redirecting to home");
          router.push("/?error=login_required");
          return;
        }

        // Get user profile directly from database
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, email")
          .eq("id", session.user.id)
          .single();

        console.log("Profile check:", { profile, error: profileError });
        setDebugInfo(
          `User: ${session.user.email}, Role: ${profile?.role || "none"}`
        );

        if (!profile) {
          setDebugInfo("No profile found");
          router.push("/?error=no_profile");
          return;
        }

        if (profile.role !== "admin") {
          setDebugInfo(`Not admin, role: ${profile.role}`);
          router.push("/?error=access_denied");
          return;
        }

        // Success!
        setDebugInfo(`Admin access granted for ${session.user.email}`);
        setIsAdmin(true);
        setIsChecking(false);
      } catch (error: any) {
        console.error("Admin check error:", error);
        setDebugInfo(`Error: ${error.message}`);
        router.push("/?error=check_failed");
      }
    };

    checkAccess();
  }, [router]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 mb-2">Checking admin access...</p>
          <p className="text-xs text-gray-500">{debugInfo}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 hover:text-blue-800 text-sm">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Shield className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">Admin access required.</p>
          <p className="text-xs text-gray-500 mb-6">Debug: {debugInfo}</p>
          <div className="space-y-2">
            <button
              onClick={() => router.push("/")}
              className="block w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Go to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="block w-full bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is admin, show the admin content
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">{children}</div>
  );
}

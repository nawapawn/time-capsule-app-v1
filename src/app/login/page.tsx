// src/app/login/page.tsx
"use client";
import React from "react";
import Image from "next/image";

const MOCK_USER_SESSION_KEY = "mockAppUserId";
const generateMockUserId = (type: "google" | "apple") =>
  `${type}-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;

const GOOGLE_LOGO_URL = "https://img.icons8.com/color/512/google-logo.png";
const APPLE_LOGO_URL = "https://img.icons8.com/ios11/200/FFFFFF/mac-os.png";

export default function LoginPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSignIn = (type: "google" | "apple") => {
    setLoading(true);
    setError(null);
    try {
      const newUserId = generateMockUserId(type);
      localStorage.setItem(MOCK_USER_SESSION_KEY, newUserId);
      window.location.href = "/home";
    } catch (e) {
      console.error("Sign In error:", e);
      setError("Sign In Failed: Could not save session data.");
    } finally {
      setLoading(false);
    }
  };

  const buttonClass = (bgColor: string, textColor: string, borderColor = "") =>
    `w-full py-3 px-4 font-semibold rounded-xl transition duration-300 transform hover:scale-[1.01]
     focus:outline-none focus:ring-4 ${bgColor} focus:ring-opacity-70 flex items-center justify-center space-x-3
     disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-md hover:shadow-lg ${textColor} ${borderColor}`;

  const customBgClasses =
    "bg-white bg-[radial-gradient(at_83%_91%,_#E0E0FF_0px,_transparent_50%),radial-gradient(at_31%_0%,_#FFF2F5_0px,_transparent_50%)]";

  return (
    <div
      className={`min-h-screen flex flex-col md:grid md:grid-cols-2 font-sans ${customBgClasses}`}
    >
      {/* ============================= */}
      {/* Left Panel (Desktop Only)     */}
      {/* ============================= */}
      <div className="hidden md:flex flex-col justify-center p-8 md:p-16 lg:p-24 text-gray-900">
        <div className="max-w-xl text-center md:text-left">
          {/* Animated & Lazy Loaded Image */}
          <Image
            src="/export-removebg-preview.png"
            alt="Memory Capsule Logo"
            width={120}
            height={120}
            className="mx-auto md:mx-0 mb-6 animate-float"
            loading="lazy" // Lazy loading
          />
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-gray-900">
            Memory Capsule
          </h1>
          <p className="text-xl text-gray-700">
            Sign in with Google & Apple. Countdown to open your capsule and discover moments worth waiting for. Share the excitement with a community feed and enjoy a new experience together.
          </p>
        </div>
      </div>

      {/* ============================= */}
      {/* Right Panel (Sign In Form)    */}
      {/* ============================= */}
      <div className="flex flex-col md:justify-center items-center flex-grow p-6 sm:p-12">
        <div className="w-full max-w-sm md:max-w-md">
          {/* Mobile Logo + Title Section */}
          <div className="md:hidden flex flex-col justify-start items-center mt-0 mb-4 p-4">
            <Image
              src="/export-removebg-preview.png"
              alt="Memory Capsule Logo"
              width={80}
              height={80}
              className="w-20 h-20 mb-2 animate-float"
              loading="lazy"
            />
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight text-gray-900">
              Memory Capsule
            </h1>
            <p className="text-md text-gray-600 text-center">
              Sign in with Google & Apple. Countdown to open your capsule and discover moments worth waiting for. Share the excitement with a community feed and enjoy a new experience together.
            </p>
          </div>

          {/* Sign In Card */}
          <div className="p-6 sm:p-10 rounded-3xl w-full bg-transparent md:bg-white md:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)] md:border md:border-gray-100">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mt-0 md:mt-0">Sign In</h2>
            </div>

            <p className="text-center text-gray-500 mb-6">
              Please sign in with a trusted account (Google or Apple)
            </p>

            <button
              onClick={() => handleSignIn("google")}
              disabled={loading}
              className={buttonClass(
                "bg-white",
                "text-gray-700",
                "border border-gray-300 hover:bg-gray-50 focus:ring-gray-200"
              )}
            >
              <Image
                src={GOOGLE_LOGO_URL}
                alt="Google Logo"
                width={20}
                height={20}
              />
              Sign in with Google
              {loading && (
                <span className="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-700"></span>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">
                  OR
                </span>
              </div>
            </div>

            <button
              onClick={() => handleSignIn("apple")}
              disabled={loading}
              className={buttonClass(
                "bg-black",
                "text-white",
                "focus:ring-gray-400 hover:bg-gray-700"
              )}
            >
              <Image
                src={APPLE_LOGO_URL}
                alt="Apple Logo"
                width={20}
                height={20}
              />
              Sign in with Apple
              {loading && (
                <span className="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
              )}
            </button>

            {error && (
              <div className="mt-6 p-3 bg-red-100 border border-red-400 rounded-xl">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================= */}
      {/* Animation Keyframes Tailwind */}
      {/* ============================= */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

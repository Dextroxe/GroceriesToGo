"use client";

import { useEffect, useState } from "react";

export default function ConfirmationPage() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 overflow-hidden">
        <div className="flex flex-col items-center text-center space-y-6">
          <div
            className={`transform transition-all duration-1000 ${
              animate ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <div className="relative">
              <svg
                className="h-24 w-24 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2l4-4" />
              </svg>

              <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-5000 ${
                  animate ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="h-12 w-12 rounded-full bg-green-100" />
              </span>
            </div>
          </div>

          <div
            className={`space-y-3 transition-all duration-700 delay-500 ${
              animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <h1 className="text-2xl font-bold text-gray-900">
              Registration Successful!
            </h1>
            <p className="text-gray-500">
              Your account has been created successfully.
            </p>
            <p className="text-gray-500">
              Will be able to login after admin approval
            </p>
          </div>

          <div
            className={`w-full transition-all duration-700 delay-1000 ${
              animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <button
              className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-black font-medium rounded-lg transition"
              onClick={() => (window.location.href = "/")}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function AccessDenied({ role }) {
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
                className="h-24 w-24 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>

              <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-5000 ${
                  animate ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="h-12 w-12 rounded-full bg-red-100" />
              </span>
            </div>
          </div>

          <div
            className={`space-y-3 transition-all duration-700 delay-500 ${
              animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <h1 className="text-2xl font-bold text-gray-900">Access Denied!</h1>
            <p className="text-gray-500">
              Required proper role, current role is:{" "}
              <span className="text-green-700/50">{role.toUpperCase()}</span>
            </p>
            <p className="text-gray-500">Please try again later!</p>
          </div>

          <div
            className={`w-full transition-all duration-700 delay-1000 ${
              animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <button
              className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-black font-medium rounded-lg transition"
              onClick={() => (window.location.href = `${role}Dashboard`)}
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

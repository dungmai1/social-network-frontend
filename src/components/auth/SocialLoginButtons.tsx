"use client";
import React from "react";

export default function SocialLoginButtons() {
  const handleLoginFacebook = () => {
    // Implement Facebook login
    console.log("Login with Facebook");
  };

  const handleLoginGoogle = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="space-y-3">
      {/* Facebook Button */}
      <button
        onClick={handleLoginFacebook}
        className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-gray-50 focus:outline-none transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Log in with Facebook
      </button>
    </div>
  );
}

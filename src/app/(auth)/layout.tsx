import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}

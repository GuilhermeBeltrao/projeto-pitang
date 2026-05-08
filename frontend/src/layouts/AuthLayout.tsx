import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card-surface p-8 shadow-xl">
        {children}
      </div>
    </div>
  );
}

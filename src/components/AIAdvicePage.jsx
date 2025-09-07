/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Construction } from "lucide-react";

export default function AIAdvicePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <Construction className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        🚧 Page Under Development 🚧
      </h1>
      <p className="text-gray-600 text-lg">
        This page is still under development by <br />
        <span className="font-semibold text-indigo-600">StratifyDevs Team</span>.
      </p>
    </div>
  );
}

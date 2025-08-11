// src/components/ui/button.jsx
import React from 'react';

export const Button = ({ children, variant = 'default', ...props }) => {
  const base = "px-4 py-2 rounded-lg font-semibold transition";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100",
  };
  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};

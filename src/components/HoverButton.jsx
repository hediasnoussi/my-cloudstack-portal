import React from 'react';

const HoverButton = ({ 
  children, 
  variant = "primary", // primary, secondary, success, danger
  size = "medium", // small, medium, large
  className = "",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left", // left, right
  onClick,
  ...props 
}) => {
  const baseClasses = "font-bold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-500 hover:bg-gray-700 text-white focus:ring-gray-500",
    success: "bg-green-500 hover:bg-green-700 text-white focus:ring-green-500",
    danger: "bg-red-500 hover:bg-red-700 text-white focus:ring-red-500"
  };
  
  const sizeClasses = {
    small: "py-1 px-3 text-sm",
    medium: "py-2 px-4 text-base",
    large: "py-3 px-6 text-lg"
  };
  
  const hoverClasses = "hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none";
  
  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${hoverClasses} ${className}`;
  
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconClasses = "transition-all duration-300 group-hover:scale-110";
    
    if (iconPosition === "left") {
      return <span className={`mr-2 ${iconClasses}`}>{icon}</span>;
    } else {
      return <span className={`ml-2 ${iconClasses}`}>{icon}</span>;
    }
  };
  
  return (
    <button
      className={finalClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      <div className="flex items-center justify-center">
        {iconPosition === "left" && renderIcon()}
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          children
        )}
        {iconPosition === "right" && renderIcon()}
      </div>
    </button>
  );
};

export default HoverButton;

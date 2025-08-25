import React from 'react';

const HoverCard = ({ 
  children, 
  className = "", 
  hoverScale = true, 
  hoverShadow = true, 
  hoverLift = true,
  animationDelay = 0,
  ...props 
}) => {
  const baseClasses = "transition-all duration-300 ease-in-out cursor-pointer";
  const hoverClasses = [
    hoverScale && "hover:scale-105",
    hoverShadow && "hover:shadow-2xl",
    hoverLift && "hover:-translate-y-1"
  ].filter(Boolean).join(" ");
  
  const finalClasses = `${baseClasses} ${hoverClasses} ${className}`;
  
  return (
    <div 
      className={finalClasses}
      style={{ animationDelay: `${animationDelay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
};

export default HoverCard;

import React from "react";

type IconWrapProps = {
  children: React.ReactNode;
  gradient: string; // Accepts Tailwind gradient classes like "from-blue-500 to-indigo-600"
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * A reusable wrapper for icons that applies a consistent 
 * gradient background, rounded corners, and centering.
 */
export default function IconWrap({ 
  children, 
  gradient, 
  size = "md", 
  className = "" 
}: IconWrapProps) {
  
  // Define dimensions based on the size prop
  const sizeClasses = {
    sm: "h-6 w-6 rounded-md",    // Used in tables or small lists
    md: "h-9 w-9 rounded-lg",    // Default for section headers
    lg: "h-12 w-12 rounded-xl",  // Used for hero sections or main stats
  };

  return (
    <div
      className={`
        flex flex-shrink-0 items-center justify-center 
        bg-gradient-to-br text-white shadow-sm
        transition-transform duration-200 hover:scale-105
        ${sizeClasses[size]} 
        ${gradient} 
        ${className}
      `}
    >
      {/* Clone the child to ensure the icon inside scales 
          correctly with the wrapper size 
      */}
      {React.isValidElement(children) 
        ? React.cloneElement(children as React.ReactElement<any>, { 
            size: size === "sm" ? 12 : size === "lg" ? 20 : 16,
            strokeWidth: 2.5 
          }) 
        : children}
    </div>
  );
}
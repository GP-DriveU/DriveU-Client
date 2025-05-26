import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  color?: "primary" | "secondary";
  size?: "big" | "medium" | "small";
}

function Button({
  onClick,
  children,
  className,
  disabled,
  color = "primary",
  size = "medium",
}: ButtonProps) {
  const colorStyle = {
    primary: "bg-primary_light text-primary",
    secondary: "bg-secondary text-white",
  };

  const sizeStyle = {
    big: "w-full py-4 text-lg",
    medium: "w-full py-3 text-base",
    small: "w-full py-2 text-sm",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${sizeStyle[size]} rounded-[15px] font-semibold ${
        colorStyle[color]
      }
        ${disabled && "bg-gray-300 text-font-color cursor-not-allowed"}
        ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;

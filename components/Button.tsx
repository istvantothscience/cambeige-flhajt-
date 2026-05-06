import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "success";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  let baseStyles =
    "px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg border backdrop-blur-md ";

  const variants = {
    primary: "bg-white/20 border-white/40 text-white hover:bg-white/30",
    danger: "bg-red-500/40 border-red-400/50 text-white hover:bg-red-500/60",
    success:
      "bg-green-500/40 border-green-400/50 text-white hover:bg-green-500/60",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

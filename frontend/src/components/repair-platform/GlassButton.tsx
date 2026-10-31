import React from "react";
import { Loader2 } from "lucide-react";

export type GlassButtonVariant = "primary" | "glass" | "verified" | "destructive";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GlassButtonVariant;
  icon?: React.ElementType;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = "glass",
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  loadingText,
  disabled,
  className = "",
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "glass-btn-primary text-white";
      case "verified":
        return "glass-btn-verified";
      case "destructive":
        return "glass-btn-destructive";
      case "glass":
      default:
        return "glass-btn-action text-[#f0eeea]";
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-mono text-xs font-semibold select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090f] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95 ${getVariantStyles()} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-purple-300 shrink-0" />
          <span>{loadingText || "Processing..."}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
          )}
          <span>{children}</span>
          {Icon && iconPosition === "right" && (
            <Icon className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </>
      )}
    </button>
  );
};

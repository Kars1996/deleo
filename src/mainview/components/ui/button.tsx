import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "ghost" | "stop";
  size?: "default" | "full";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "default", 
  disabled = false, 
  onClick,
  className,
  icon
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-[7px] rounded-[7px] font-mono text-[11px] font-medium cursor-pointer border-none transition-all duration-[130ms] whitespace-nowrap";
  
  const variants = {
    primary: cn(
      "bg-gradient-orange text-white",
      "shadow-[0_1px_0_rgba(0,0,0,0.4),0_3px_10px_rgba(237,112,20,0.26),inset_0_1px_0_rgba(255,255,255,0.12)]",
      "hover:brightness-[1.08] hover:shadow-[0_1px_0_rgba(0,0,0,0.4),0_5px_16px_rgba(237,112,20,0.4),inset_0_1px_0_rgba(255,255,255,0.12)]",
      "active:brightness-[0.93] active:translate-y-px"
    ),
    ghost: cn(
      "bg-white/[0.04] text-[var(--muted)] border border-[var(--border)]",
      "hover:bg-white/[0.07] hover:text-white/[0.58] hover:border-white/[0.1]"
    ),
    stop: cn(
      "bg-[var(--err-bg)] text-[var(--err)] border border-[var(--err-bd)]",
      "hover:bg-[rgba(192,130,111,0.14)]"
    )
  };

  const sizes = {
    default: "px-4 py-2",
    full: "w-full px-4 py-2"
  };

  const disabledStyles = disabled ? "opacity-[0.26] cursor-not-allowed pointer-events-none" : "";

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], disabledStyles, className)}
    >
      {icon}
      {children}
    </button>
  );
}

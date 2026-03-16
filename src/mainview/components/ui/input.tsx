import { cn } from "@/lib/utils";

interface InputProps {
  type?: "text" | "password";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Input({ 
  type = "text", 
  placeholder, 
  value, 
  onChange,
  className 
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        "w-full rounded-[7px] text-[12px] px-3 py-2 outline-none font-mono transition-all duration-[140ms]",
        "placeholder:text-[var(--dim)]",
        className
      )}
      style={{
        background: 'var(--surf2)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
        boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.4)'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--o-border)';
        e.target.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.4), 0 0 0 3px var(--o-faint)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--border)';
        e.target.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.4)';
      }}
    />
  );
}

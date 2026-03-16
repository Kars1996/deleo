import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <div
      onClick={() => onChange?.(!checked)}
      className={cn(
        "w-[15px] h-[15px] rounded flex items-center justify-center transition-all duration-100 cursor-pointer",
        checked 
          ? "bg-[var(--o)] border-[var(--o)]" 
          : "border border-white/[0.12]"
      )}
    >
      {checked && (
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5l2.5 2.5 4.5-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

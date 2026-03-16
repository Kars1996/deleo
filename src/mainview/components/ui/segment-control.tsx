import { cn } from "@/lib/utils";

interface SegmentControlProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentControl({ options, value, onChange }: SegmentControlProps) {
  return (
    <div 
      className="flex gap-0.5 rounded-[7px] p-0.5"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
    >
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            "flex-1 px-2 py-1.5 rounded-[5px] border-none cursor-pointer font-mono text-[10px] transition-all duration-100",
            value === option 
              ? "bg-white/[0.09] text-[var(--text)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]"
              : "bg-transparent text-[var(--muted)] hover:text-white/[0.58]"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

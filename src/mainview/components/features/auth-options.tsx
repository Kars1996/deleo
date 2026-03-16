import { cn } from "@/lib/utils";

interface AuthOption {
  id: "auto" | "manual";
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface AuthOptionsProps {
  selected: "auto" | "manual";
  onSelect: (mode: "auto" | "manual") => void;
}

export function AuthOptions({ selected, onSelect }: AuthOptionsProps) {
  const options: AuthOption[] = [
    {
      id: "auto",
      title: "Auto-detect token",
      subtitle: "Reads from ~/.deleo_cached_token",
      icon: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <path d="M8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2z" stroke="rgba(237,112,20,0.65)" strokeWidth="1.2"/>
          <path d="M5.5 8l2 2 3.5-3.5" stroke="rgba(237,112,20,0.85)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "manual",
      title: "Enter token manually",
      subtitle: "Paste your Discord user token directly",
      icon: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <div
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all duration-[130ms]",
            selected === option.id
              ? "border-[var(--o-border)] bg-[var(--o-faint)]"
              : "border-[var(--border)] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.035]"
          )}
        >
          <div
            className={cn(
              "w-[34px] h-[34px] rounded-lg flex items-center justify-center border transition-all duration-[130ms]",
              selected === option.id
                ? "bg-[rgba(237,112,20,0.1)] border-[var(--o-border)]"
                : "bg-white/[0.04] border-[var(--border)]"
            )}
          >
            {option.icon}
          </div>
          
          <div className="flex-1">
            <div className="text-[12px] font-medium text-white/[0.7] mb-0.5">{option.title}</div>
            <div className="text-[10px] text-[var(--muted)]">{option.subtitle}</div>
          </div>
          
          <div
            className={cn(
              "w-[15px] h-[15px] rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-100",
              selected === option.id
                ? "border-[var(--o)]"
                : "border-white/[0.13]"
            )}
          >
            {selected === option.id && (
              <div className="w-[7px] h-[7px] rounded-full bg-[var(--o)]" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  isActive?: boolean;
}

export function ProgressBar({ progress, isActive = true }: ProgressBarProps) {
  return (
    <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-200 ease-out",
          isActive ? "animate-shimmer" : "bg-gradient-progress"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

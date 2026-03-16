import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div 
      className={cn(
        "w-full max-w-[480px] rounded-xl overflow-hidden animate-fade-up",
        className
      )}
      style={{
        background: 'var(--surf)',
        border: '1px solid var(--border)',
        borderTopColor: 'var(--border-t)',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.45), 0 20px 60px rgba(0,0,0,0.52), 0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)'
      }}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title?: ReactNode;
  subtitle?: string;
  children?: ReactNode;
}

export function CardHeader({ title, subtitle, children }: CardHeaderProps) {
  return (
    <div 
      className="px-[22px] py-[18px] flex items-start justify-between gap-3"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div>
        {title && (
          <div className="text-[13px] font-semibold text-white/[0.84] mb-[3px]">
            {title}
          </div>
        )}
        {subtitle && (
          <div className="text-[11px] text-[var(--muted)]">
            {subtitle}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return (
    <div className={cn("px-[22px] py-[18px]", className)}>
      {children}
    </div>
  );
}

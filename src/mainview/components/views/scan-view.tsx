import { CardBody } from "@/mainview/components/ui/card";

interface ScanViewProps {
  title: string;
  subtitle: string;
}

export function ScanView({ title, subtitle }: ScanViewProps) {
  return (
    <CardBody className="py-12 flex flex-col items-center gap-4 text-center animate-view-in">
      <div 
        className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center"
        style={{ background: 'var(--o-faint)', border: '1px solid var(--o-border)' }}
      >
        <svg className="animate-spin-slow" width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="rgba(237,112,20,0.14)" strokeWidth="2"/>
          <path d="M12 3a9 9 0 0 1 9 9" stroke="var(--o)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      
      <div>
        <div className="text-[13px] text-white/[0.8] mb-1.5 font-medium">{title}</div>
        <div className="text-[11px] text-[var(--muted)] animate-scan">{subtitle}</div>
      </div>
    </CardBody>
  );
}

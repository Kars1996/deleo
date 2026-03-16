import { CardBody } from "@/mainview/components/ui/card";
import { Button } from "@/mainview/components/ui/button";
import { StatsPanel } from "@/mainview/components/features/stats-panel";

interface DoneViewProps {
  deleted: number;
  failed: number;
  channels: number;
  wasStopped: boolean;
  onRestart: () => void;
}

export function DoneView({ deleted, failed, channels, wasStopped, onRestart }: DoneViewProps) {
  return (
    <CardBody className="py-8 px-6 flex flex-col gap-4 items-center animate-view-in animate-done-glow">
      <div className="flex flex-col items-center gap-2.5 text-center">
        <div
          className="w-[52px] h-[52px] rounded-[15px] flex items-center justify-center"
          style={{
            background: wasStopped ? "var(--err-bg)" : "var(--ok-bg)",
            border: wasStopped ? "1px solid var(--err-bd)" : "1px solid var(--ok-bd)",
          }}
        >
          {wasStopped ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="6" width="12" height="12" rx="2" stroke="var(--err)" strokeWidth="2" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 12l6 6 10-10" stroke="var(--ok)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div>
          <div className="text-[16px] font-semibold text-white/[0.87] tracking-[-0.4px] mb-1">
            {wasStopped ? "Stopped." : "All done."}
          </div>
          <div className="text-[11px] text-[var(--muted)]">
            {deleted.toLocaleString()} message{deleted !== 1 ? "s" : ""} erased across {channels} channel
            {channels !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="w-full">
        <StatsPanel deleted={deleted} failed={failed} queued={0} />
      </div>

      <Button variant="ghost" size="full" onClick={onRestart}>
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" className="mr-1">
          <path
            d="M3 8A5 5 0 1 1 5.5 12.5M3 8V4M3 8H7"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Start over
      </Button>
    </CardBody>
  );
}

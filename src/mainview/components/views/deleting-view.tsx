import { CardHeader, CardBody } from "@/mainview/components/ui/card";
import { Button } from "@/mainview/components/ui/button";
import { Badge } from "@/mainview/components/ui/badge";
import { ProgressBar } from "@/mainview/components/ui/progress-bar";
import { StatsPanel } from "@/mainview/components/features/stats-panel";
import { FeedTable } from "@/mainview/components/features/feed-table";
import { FeedEntry } from "@/mainview/components/features/feed-row";

interface DeletingViewProps {
  currentChannel: string;
  moreChannels: number;
  progress: number;
  current: number;
  total: number;
  percentage: number;
  eta: string;
  deleted: number;
  failed: number;
  queued: number;
  entries: FeedEntry[];
  status: "scanning" | "deleting" | "stopped";
  onStop: () => void;
}

export function DeletingView({
  currentChannel,
  moreChannels,
  progress,
  current,
  total,
  percentage,
  eta,
  deleted,
  failed,
  queued,
  entries,
  status,
  onStop,
}: DeletingViewProps) {
  const badgeVariant = status === "scanning" ? "orange" : status === "deleting" ? "red" : "red";

  return (
    <div className="animate-view-in">
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <span>Deleting messages</span>
            <Badge text={status} variant={badgeVariant} />
          </div>
        }
        subtitle="Starting…"
      >
        <Button variant="stop" onClick={onStop} disabled={status === "stopped"}>
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" className="mr-1">
            <rect x="1.5" y="1.5" width="7" height="7" rx="1" fill="currentColor" />
          </svg>
          Stop
        </Button>
      </CardHeader>

      <CardBody className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-white/[0.68] font-medium">{currentChannel}</span>
              {moreChannels > 0 && (
                <span className="text-[9px] text-[var(--dim)]">+{moreChannels} more</span>
              )}
            </div>
            <span className="text-[10px] text-[var(--muted)]">
              {current} / ~{total}
            </span>
          </div>

          <ProgressBar progress={progress} isActive={status !== "stopped"} />

          <div className="flex justify-between">
            <span className="text-[10px] text-[var(--dim)]">{eta}</span>
            <span className="text-[10px] text-[var(--o)] font-semibold">{percentage}%</span>
          </div>
        </div>

        <StatsPanel deleted={deleted} failed={failed} queued={queued} />

        <FeedTable entries={entries} />
      </CardBody>
    </div>
  );
}

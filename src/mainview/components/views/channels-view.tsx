import { useState } from "react";
import { CardHeader, CardBody } from "@/mainview/components/ui/card";
import { Button } from "@/mainview/components/ui/button";
import { SegmentControl } from "@/mainview/components/ui/segment-control";
import { TokenChip } from "@/mainview/components/ui/token-chip";
import { ChannelList } from "@/mainview/components/features/channel-list";
import { Channel } from "@/mainview/components/features/channel-item";

interface ChannelsViewProps {
  token: string;
  channels: Channel[];
  selectedChannels: string[];
  onToggleChannel: (id: string) => void;
  onStartDelete: (delay: number, batchSize: number) => void;
}

const DELAY_MAP: Record<string, number> = {
  "500ms": 500,
  "1s": 1000,
  "2s": 2000,
  "3s": 3000
};

export function ChannelsView({ 
  token, 
  channels, 
  selectedChannels, 
  onToggleChannel, 
  onStartDelete 
}: ChannelsViewProps) {
  const [filter, setFilter] = useState<"all" | "dm" | "group" | "server">("all");
  const [delay, setDelay] = useState("1s");
  const [batchSize, setBatchSize] = useState("100");

  return (
    <div className="animate-view-in">
      <CardHeader
        title="Select channels to erase"
        subtitle="Choose where to wipe your messages from"
      >
        <TokenChip token={token} />
      </CardHeader>
      
      <CardBody className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2.5">
          <SegmentControl
            options={["All", "DMs", "Groups", "Servers"]}
            value={filter === "all" ? "All" : filter === "dm" ? "DMs" : filter === "group" ? "Groups" : "Servers"}
            onChange={(v) => setFilter(v.toLowerCase().replace("s", "") as any)}
          />
          <span className="text-[10px] text-[var(--dim)] whitespace-nowrap">
            {selectedChannels.length} selected
          </span>
        </div>

        <ChannelList
          channels={channels}
          selectedIds={selectedChannels}
          filter={filter}
          onToggle={onToggleChannel}
        />

        <div className="h-px" style={{ background: 'var(--border)' }} />

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[9px] uppercase tracking-[0.1em] text-[var(--dim)] font-medium mb-1 block">
              Delete delay
            </label>
            <SegmentControl
              options={["500ms", "1s", "2s", "3s"]}
              value={delay}
              onChange={setDelay}
            />
          </div>
          <div className="flex-1">
            <label className="text-[9px] uppercase tracking-[0.1em] text-[var(--dim)] font-medium mb-1 block">
              Batch size
            </label>
            <SegmentControl
              options={["25", "50", "100"]}
              value={batchSize}
              onChange={setBatchSize}
            />
          </div>
        </div>

        <Button
          size="full"
          disabled={selectedChannels.length === 0}
          onClick={() => onStartDelete(DELAY_MAP[delay], parseInt(batchSize))}
          icon={
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 4h10M6 4V2.5h4V4M6.5 7v4M9.5 7v4M4 4l.8 9.5h6.4L12 4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        >
          Delete Selected
        </Button>
      </CardBody>
    </div>
  );
}

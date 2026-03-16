import { cn } from "@/lib/utils";
import { Checkbox } from "@/mainview/components/ui/checkbox";

export interface Channel {
  id: string;
  type: "dm" | "group" | "server";
  label: string;
  sub: string;
  msgs: number;
  avatarColor: string;
  avatarText: string;
  isSquare?: boolean;
}

interface ChannelItemProps {
  channel: Channel;
  selected: boolean;
  onToggle: () => void;
}

export function ChannelItem({ channel, selected, onToggle }: ChannelItemProps) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer border border-transparent transition-all duration-100",
        selected ? "bg-[var(--o-faint)] border-[var(--o-border)]" : "hover:bg-white/[0.028]"
      )}
    >
      <div
        className={cn(
          "w-[30px] h-[30px] flex items-center justify-center text-[10px] font-semibold flex-shrink-0",
          channel.isSquare ? "rounded-lg" : "rounded-full"
        )}
        style={{ 
          background: channel.avatarColor,
          color: channel.avatarColor.includes('#1c1c1c') ? 'rgba(255,255,255,0.26)' : undefined
        }}
      >
        {channel.type === "group" || channel.type === "server" ? (
          channel.isSquare ? channel.avatarText : channel.avatarText
        ) : (
          channel.avatarText
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-white/[0.7] truncate">{channel.label}</div>
        <div className="text-[10px] text-[var(--muted)] mt-px">{channel.sub}</div>
      </div>
      
      <div className="text-[10px] text-[var(--dim)] flex-shrink-0">
        {channel.msgs.toLocaleString()}
      </div>
      
      <Checkbox checked={selected} />
    </div>
  );
}

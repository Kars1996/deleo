export interface FeedEntry {
  id: string;
  timestamp: string;
  channel: string;
  message: string;
  messageId: string;
  status: "ok" | "error" | "info";
  errorType?: string;
}

interface FeedRowProps {
  entry: FeedEntry;
}

export function FeedRow({ entry }: FeedRowProps) {
  const statusIcons = {
    ok: (
      <span className="inline-flex items-center justify-center w-4 h-3.5 rounded text-[9px] bg-[var(--ok-bg)] text-[var(--ok)] border border-[var(--ok-bd)]">
        ✓
      </span>
    ),
    error: (
      <span className="inline-flex items-center justify-center w-4 h-3.5 rounded text-[9px] bg-[var(--err-bg)] text-[var(--err)] border border-[var(--err-bd)]">
        ✕
      </span>
    ),
    info: (
      <span className="inline-flex items-center justify-center w-4 h-3.5 rounded text-[9px] bg-white/[0.04] text-[var(--dim)] border border-white/[0.07]">
        ℹ
      </span>
    )
  };

  const messageClasses = {
    ok: "text-white/[0.42] line-through",
    error: "text-[rgba(192,130,111,0.55)] line-through",
    info: "text-white/[0.45]"
  };

  return (
    <div 
      className="grid items-center px-3.5 py-1 border-b animate-row-in"
      style={{ 
        gridTemplateColumns: '60px 36px 90px 1fr 64px',
        borderColor: 'rgba(255,255,255,0.028)'
      }}
    >
      <span className="text-[9px] text-[var(--dim)] whitespace-nowrap">{entry.timestamp}</span>
      <span className="text-[9px]">{statusIcons[entry.status]}</span>
      <span className="text-[10px] text-[var(--muted)] truncate pr-2">{entry.channel}</span>
      <span className={messageClasses[entry.status]}>
        <span className="text-[10px] truncate block pr-2">{entry.message}</span>
      </span>
      <span className="text-[9px] text-[var(--dim)] text-right truncate">
        {entry.status === "error" && entry.errorType ? (
          <span style={{ color: 'var(--err)', opacity: 0.7 }}>{entry.errorType}</span>
        ) : (
          entry.messageId
        )}
      </span>
    </div>
  );
}

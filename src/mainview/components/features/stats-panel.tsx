interface StatsPanelProps {
  deleted: number;
  failed: number;
  queued: number;
}

export function StatsPanel({ deleted, failed, queued }: StatsPanelProps) {
  return (
    <div className="flex gap-2">
      <div 
        className="flex-1 py-2.5 px-3 rounded-lg flex flex-col items-center gap-0.5"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)' }}
      >
        <div className="text-[18px] font-semibold tracking-[-0.5px] text-[var(--ok)]">{deleted}</div>
        <div className="text-[9px] text-[var(--muted)] uppercase tracking-[0.06em]">deleted</div>
      </div>
      
      <div 
        className="flex-1 py-2.5 px-3 rounded-lg flex flex-col items-center gap-0.5"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)' }}
      >
        <div className="text-[18px] font-semibold tracking-[-0.5px] text-[var(--err)]">{failed}</div>
        <div className="text-[9px] text-[var(--muted)] uppercase tracking-[0.06em]">failed</div>
      </div>
      
      <div 
        className="flex-1 py-2.5 px-3 rounded-lg flex flex-col items-center gap-0.5"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)' }}
      >
        <div className="text-[18px] font-semibold tracking-[-0.5px] text-[var(--muted)]">{queued}</div>
        <div className="text-[9px] text-[var(--muted)] uppercase tracking-[0.06em]">queued</div>
      </div>
    </div>
  );
}

import { FeedEntry, FeedRow } from "./feed-row";

interface FeedTableProps {
  entries: FeedEntry[];
  placeholder?: string;
}

export function FeedTable({ entries, placeholder = "waiting…" }: FeedTableProps) {
  return (
    <div 
      className="rounded-lg overflow-hidden"
      style={{ background: 'var(--surf2)', border: '1px solid var(--border)' }}
    >
      <div 
        className="grid px-3.5 py-1.5 text-[9px] uppercase tracking-[0.08em] text-[var(--dim)]"
        style={{ 
          gridTemplateColumns: '60px 36px 90px 1fr 64px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(255,255,255,0.015)'
        }}
      >
        <span>time</span>
        <span></span>
        <span>channel</span>
        <span>message</span>
        <span className="text-right">id</span>
      </div>
      
      <div className="scrollable max-h-[182px] flex flex-col-reverse">
        {entries.length === 0 ? (
          <div className="py-5 text-center text-[10px] text-[var(--dim)]">
            {placeholder}
          </div>
        ) : (
          entries.map(entry => (
            <FeedRow key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}

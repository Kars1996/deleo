interface TokenChipProps {
  token: string;
}

export function TokenChip({ token }: TokenChipProps) {
  const truncated = token.length > 10 
    ? `${token.slice(0, 3)}…${token.slice(-4)}` 
    : token;

  return (
    <div 
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] flex-shrink-0"
      style={{ 
        background: 'var(--o-faint)', 
        border: '1px solid var(--o-border)', 
        color: 'var(--o)' 
      }}
    >
      <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
        <path d="M8 2c0 0-3 3-3 6.5a3 3 0 0 0 6 0C11 7 9.5 5.5 9.5 4 9 5 8.5 5.5 7 6.5 6.5 5 7 3.5 8 2z" fill="currentColor"/>
      </svg>
      {truncated}
    </div>
  );
}

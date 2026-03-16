interface StatusBarProps {
  status?: string;
  user?: string | null;
  isConnected?: boolean;
}

export function StatusBar({
  status = "idle",
  user = null,
  isConnected = false,
}: StatusBarProps) {
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <footer
      className="h-6 flex items-center justify-between shrink-0 px-3.5 text-[9px]"
      style={{
        background: "var(--bar)",
        borderTop: "1px solid var(--border)",
        color: "var(--dim)",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-[5px]">
          <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2c0 0-3 3-3 6.5a3 3 0 0 0 6 0C11 7 9.5 5.5 9.5 4 9 5 8.5 5.5 7 6.5 6.5 5 7 3.5 8 2z"
              fill="rgba(237,112,20,0.45)"
            />
          </svg>
          <span>deleo · discord message eraser</span>
        </div>
        <div className="w-px h-2.5" style={{ background: "var(--border)" }} />
        <span style={{ color: "var(--dim)" }}>{status}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-[5px]">
          <div
            className={`w-[5px] h-[5px] rounded-full flex-shrink-0 transition-colors ${isConnected ? "bg-[var(--ok)]" : "bg-[var(--dim)]"}`}
          />
          <span>{user || "not connected"}</span>
        </div>
        <div className="w-px h-2.5" style={{ background: "var(--border)" }} />
        <div className="flex items-center gap-[5px]">
          <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2z"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1.2"
            />
            <path
              d="M8 5v3l2 2"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
          <span>{currentTime}</span>
        </div>
      </div>
    </footer>
  );
}

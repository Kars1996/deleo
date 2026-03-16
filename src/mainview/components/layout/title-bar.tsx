import { electrobun } from "@/mainview/electrobun";

interface TitleBarProps {
  title?: string;
  version?: string;
}

function WindowsControls() {
  return (
    <div className="electrobun-webkit-app-region-no-drag flex items-stretch h-[40px]">
      <button
        onClick={() => electrobun.rpc!.send.minimizeWindow({})}
        className="flex items-center justify-center w-11 h-full border-none cursor-pointer transition-colors bg-transparent hover:bg-white/[0.06] active:bg-white/[0.03] text-white/40 hover:text-white/70"
        aria-label="minimize"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <line
            x1="1"
            y1="7"
            x2="9"
            y2="7"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        onClick={() => electrobun.rpc!.send.closeWindow({})}
        className="flex items-center justify-center w-11 h-full border-none cursor-pointer transition-colors active:opacity-80 hover:bg-[#c42b1c] hover:text-white bg-transparent text-white/40"
        aria-label="close"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <line
            x1="1.5"
            y1="1.5"
            x2="8.5"
            y2="8.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1="8.5"
            y1="1.5"
            x2="1.5"
            y2="8.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export function TitleBar({
  title = "Authentication",
  version = "v1.0.0",
}: TitleBarProps) {
  return (
    <header
      className="electrobun-webkit-app-region-drag flex items-center justify-between !opacity-100 border-b shrink-0 relative select-none"
      style={{ background: "var(--bar)", borderColor: "var(--border)", height: "40px" }}
    >
      <div className="flex items-center pl-3.5 gap-2.5">
        <div className="flex items-center gap-2 ml-2">
          <span className="text-[12px] font-semibold text-white/[0.72] tracking-[-0.3px]">
            deleo
          </span>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[7px] pointer-events-none">
        <span className="text-[11px] text-white/30">{title}</span>
        <span
          className="text-[9px] px-1.5 py-0.5 rounded"
          style={{
            background: "var(--o-faint)",
            color: "var(--o)",
            border: "1px solid var(--o-border)",
          }}
        >
          {version}
        </span>
      </div>

      <WindowsControls />
    </header>
  );
}

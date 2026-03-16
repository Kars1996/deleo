import { ReactNode } from "react";
import { TitleBar } from "./title-bar";
import { StatusBar } from "./status-bar";

interface AppShellProps {
  children: ReactNode;
  titleBarProps?: {
    title?: string;
    version?: string;
  };
  statusBarProps?: {
    status?: string;
    user?: string | null;
    isConnected?: boolean;
  };
}

export function AppShell({
  children,
  titleBarProps,
  statusBarProps,
}: AppShellProps) {
  return (
    <div className="h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <TitleBar {...titleBarProps} />

      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div
            className="absolute w-[110%] h-[70%] top-0 left-1/2 -translate-x-1/2"
            style={{
              background:
                "radial-gradient(ellipse 55% 35% at 50% 0%, rgba(237,112,20,0.055) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute w-[60%] h-[50%] bottom-0 right-0"
            style={{
              background:
                "radial-gradient(ellipse 30% 25% at 85% 90%, rgba(237,112,20,0.03) 0%, transparent 50%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full h-full flex items-center justify-center p-7 px-5">
          {children}
        </div>
      </main>

      <StatusBar {...statusBarProps} />
    </div>
  );
}

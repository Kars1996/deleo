import { useState } from "react";
import { CardHeader, CardBody } from "@/mainview/components/ui/card";
import { Button } from "@/mainview/components/ui/button";
import { Input } from "@/mainview/components/ui/input";
import { AuthOptions } from "@/mainview/components/features/auth-options";

interface AuthViewProps {
  onAuth: (mode: "auto" | "manual", token?: string) => void;
  error?: string | null;
}

export function AuthView({ onAuth, error }: AuthViewProps) {
  const [authMode, setAuthMode] = useState<"auto" | "manual">("auto");
  const [token, setToken] = useState("");

  return (
    <div className="animate-view-in">
      <CardHeader
        title="Connect your account"
        subtitle="Choose how to authenticate with Discord"
      />
      <CardBody className="flex flex-col gap-2">
        <AuthOptions selected={authMode} onSelect={setAuthMode} />
        
        {authMode === "manual" && (
          <div className="flex flex-col gap-1.5 pt-0.5 animate-view-in">
            <label className="text-[9px] uppercase tracking-[0.1em] text-[var(--dim)] font-medium px-px">
              Discord Token
            </label>
            <Input
              type="password"
              placeholder="NzE4NDI0…"
              value={token}
              onChange={setToken}
            />
            <p className="text-[10px] text-[var(--dim)] m-0">
              DevTools → Network → any Discord request → <code className="text-[rgba(237,112,20,0.55)]">authorization</code> header
            </p>
          </div>
        )}
        
        <div className="h-[3px]" />
        
        {error && (
          <div className="px-3 py-2 rounded-lg text-[11px]" style={{ 
            background: 'var(--err-bg)', 
            border: '1px solid var(--err-bd)', 
            color: 'var(--err)' 
          }}>
            {error}
          </div>
        )}
        
        <Button 
          size="full" 
          onClick={() => onAuth(authMode, authMode === "manual" ? token : undefined)}
          icon={
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        >
          Continue
        </Button>
      </CardBody>
    </div>
  );
}

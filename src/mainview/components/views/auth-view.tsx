import { useState } from "react";
import { CardHeader, CardBody } from "@/mainview/components/ui/card";
import { Button } from "@/mainview/components/ui/button";
import { Input } from "@/mainview/components/ui/input";
import { Checkbox } from "@/mainview/components/ui/checkbox";
import { AuthOptions } from "@/mainview/components/features/auth-options";

interface AuthViewProps {
  onAuth: (mode: "auto" | "manual", token?: string, saveToCache?: boolean) => void;
  error?: string | null;
  showSaveOption?: boolean;
}

export function AuthView({ onAuth, error, showSaveOption = true }: AuthViewProps) {
  const [authMode, setAuthMode] = useState<"auto" | "manual">("auto");
  const [token, setToken] = useState("");
  const [saveToCache, setSaveToCache] = useState(false);

  const handleSubmit = () => {
    onAuth(authMode, authMode === "manual" ? token : undefined, saveToCache);
  };

  return (
    <div className="animate-view-in">
      <CardHeader
        title="Connect your account"
        subtitle="Choose how to authenticate with Discord"
      />
      <CardBody className="flex flex-col gap-3">
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
            
            <div 
              className="mt-2 px-3 py-2 rounded-lg text-[10px]"
              style={{ 
                background: 'var(--o-faint)', 
                border: '1px solid var(--o-border)', 
                color: 'var(--muted)'
              }}
            >
              <span style={{ color: 'var(--o)' }}>💡 Tip:</span> Use the{" "}
              <code className="text-[rgba(237,112,20,0.7)]">token-helper.py</code>{" "}
              script to fetch your token automatically from Discord or your browser.
              See <code className="text-[rgba(237,112,20,0.7)]">scripts/README.md</code>
            </div>
            
            {showSaveOption && (
              <div className="flex items-center gap-2 mt-1">
                <Checkbox 
                  checked={saveToCache} 
                  onChange={setSaveToCache}
                />
                <span className="text-[10px] text-[var(--muted)]">
                  Save token for faster login next time
                </span>
              </div>
            )}
          </div>
        )}
        
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
          onClick={handleSubmit}
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

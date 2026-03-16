import { useState, useCallback } from "react";
import { AppShell } from "@/mainview/components/layout/app-shell";
import { Card } from "@/mainview/components/ui/card";
import { StepIndicator } from "@/mainview/components/ui/step-indicator";
import { AuthView } from "@/mainview/components/views/auth-view";
import { ScanView } from "@/mainview/components/views/scan-view";
import { ChannelsView } from "@/mainview/components/views/channels-view";
import { DeletingView } from "@/mainview/components/views/deleting-view";
import { DoneView } from "@/mainview/components/views/done-view";
import { Channel } from "@/mainview/components/features/channel-item";
import { useDiscordAuth } from "@/mainview/hooks/useDiscordAuth";
import { useDeletion } from "@/mainview/hooks/useDeletion";
import { formatDiscordUsername } from "@/types";

type ViewState = "auth" | "scan" | "channels" | "deleting" | "done";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>("auth");
  const [currentStep, setCurrentStep] = useState(0);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // auth hook
  const { 
    user, 
    isConnected, 
    scanText, 
    authenticate 
  } = useDiscordAuth(
    (loadedChannels) => {
      setChannels(loadedChannels);
      setCurrentStep(1);
      setCurrentView("channels");
    },
    (err) => {
      setError(err);
      setCurrentView("auth");
    }
  );

  // deletion hook
  const {
    state: deletionState,
    wasStopped,
    start: startDeletion,
    stop: stopDeletion,
    reset: resetDeletion
  } = useDeletion(
    selectedChannels,
    user?.id || "",
    () => {
      setCurrentStep(3);
      setCurrentView("done");
    },
    (err) => {
      setError(err);
      setCurrentView("channels");
    }
  );

  const handleAuth = useCallback(async (
    mode: "auto" | "manual", 
    manualToken?: string,
    saveToCache?: boolean
  ) => {
    setError(null);
    setCurrentView("scan");
    await authenticate(mode, manualToken, saveToCache);
  }, [authenticate]);

  const handleToggleChannel = useCallback((id: string) => {
    setSelectedChannels(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  }, []);

  const handleStartDelete = useCallback(async (delay: number) => {
    setCurrentStep(2);
    setCurrentView("deleting");
    await startDeletion(delay);
  }, [startDeletion]);

  const handleStop = useCallback(async () => {
    await stopDeletion();
    setTimeout(() => {
      setCurrentStep(3);
      setCurrentView("done");
    }, 650);
  }, [stopDeletion]);

  const handleRestart = useCallback(() => {
    resetDeletion();
    setCurrentStep(1);
    setCurrentView("channels");
    setSelectedChannels([]);
  }, [resetDeletion]);

  const getViewTitle = () => {
    switch (currentView) {
      case "auth": return "Authentication";
      case "scan": return "Authenticating…";
      case "channels": return "Select Channels";
      case "deleting": return "Deleting";
      case "done": return "Complete";
    }
  };

  const getUserDisplayName = () => {
    if (!user) return null;
    return formatDiscordUsername(user);
  };

  return (
    <AppShell
      titleBarProps={{ title: getViewTitle(), version: "v1.0.0" }}
      statusBarProps={{ 
        status: currentView === "deleting" 
          ? "deleting…" 
          : currentView === "done" 
            ? (wasStopped ? "stopped" : "done") 
            : isConnected 
              ? "connected" 
              : "idle", 
        user: getUserDisplayName(), 
        isConnected 
      }}
    >
      <div className="flex flex-col items-center gap-4 w-full max-w-[480px]">
        {currentView !== "auth" && currentView !== "scan" && (
          <StepIndicator currentStep={currentStep} />
        )}

        <Card>
          {currentView === "auth" && (
            <AuthView onAuth={handleAuth} error={error} />
          )}
          
          {currentView === "scan" && (
            <ScanView title={scanText.title} subtitle={scanText.subtitle} />
          )}
          
          {currentView === "channels" && (
            <ChannelsView
              token={user?.id || ""}
              channels={channels}
              selectedChannels={selectedChannels}
              onToggleChannel={handleToggleChannel}
              onStartDelete={handleStartDelete}
            />
          )}
          
          {currentView === "deleting" && (
            <DeletingView {...deletionState} onStop={handleStop} />
          )}
          
          {currentView === "done" && (
            <DoneView
              deleted={deletionState.deleted}
              failed={deletionState.failed}
              channels={selectedChannels.length}
              wasStopped={wasStopped}
              onRestart={handleRestart}
            />
          )}
        </Card>
      </div>
    </AppShell>
  );
}

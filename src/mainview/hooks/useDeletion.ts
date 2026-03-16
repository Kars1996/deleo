import { useState, useCallback, useRef } from "react";
import { startDeletion, stopDeletion } from "@/mainview/electrobun";
import { FeedEntry } from "@/mainview/components/features/feed-row";

export interface DeletionState {
  currentChannel: string;
  moreChannels: number;
  progress: number;
  current: number;
  total: number;
  percentage: number;
  eta: string;
  deleted: number;
  failed: number;
  queued: number;
  entries: FeedEntry[];
  status: "scanning" | "deleting" | "stopped";
}

const initialState: DeletionState = {
  currentChannel: "—",
  moreChannels: 0,
  progress: 0,
  current: 0,
  total: 0,
  percentage: 0,
  eta: "eta —",
  deleted: 0,
  failed: 0,
  queued: 0,
  entries: [],
  status: "scanning"
};

export function useDeletion(
  selectedChannels: string[],
  userId: string,
  onComplete: (wasStopped: boolean) => void,
  onError: (error: string) => void
) {
  const [state, setState] = useState<DeletionState>(initialState);
  const [wasStopped, setWasStopped] = useState(false);
  const stoppedRef = useRef(false);

  const reset = useCallback(() => {
    stoppedRef.current = false;
    setState(initialState);
    setWasStopped(false);
  }, []);

  const handleDeletionEvent = useCallback((data: any) => {
    setState(prev => ({
      ...prev,
      entries: [{
        id: String(Date.now()),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        channel: data.channelId,
        message: data.messageContent || data.type,
        messageId: data.messageId || "",
        status: data.type === "message_deleted" ? "ok" as const : data.type === "message_failed" ? "error" as const : "info" as const,
        errorType: data.error,
      }, ...prev.entries].slice(0, 65)
    }));
  }, []);

  const handleDeletionProgress = useCallback((data: any) => {
    setState(prev => ({
      ...prev,
      currentChannel: data.channelName || prev.currentChannel,
      deleted: data.deleted,
      failed: data.failed,
      total: data.total,
      current: data.current,
      percentage: data.percentage,
    }));
  }, []);

  const start = useCallback(async (delay: number) => {
    stoppedRef.current = false;
    setWasStopped(false);
    
    try {
      const result = await startDeletion(selectedChannels, delay, userId);
      
      if (!result.success) {
        onError("Failed to start deletion: " + (result.error || "Unknown error"));
        return false;
      }

      // listen for messages from backednd
      const handleMessage = (event: MessageEvent) => {
        const { message, data } = event.data;
        
        if (message === "deletionEvent") {
          handleDeletionEvent(data);
        } else if (message === "deletionProgress") {
          handleDeletionProgress(data);
        } else if (message === "deletionComplete") {
          setWasStopped(data.stopped);
          onComplete(data.stopped);
        }
      };
      
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      onError("Deletion failed: " + message);
      return false;
    }
  }, [selectedChannels, userId, onComplete, onError, handleDeletionEvent, handleDeletionProgress]);

  const stop = useCallback(async () => {
    stoppedRef.current = true;
    setWasStopped(true);
    setState(prev => ({ ...prev, status: "stopped" }));
    await stopDeletion();
  }, []);

  return {
    state,
    wasStopped,
    start,
    stop,
    reset
  };
}

// auth hook - handles token validation and user session

import { useState, useCallback } from "react";
import { loadCachedToken, validateToken, saveToken, getChannels } from "@/mainview/electrobun";
import { DiscordUser, ChannelInfo } from "@/types";
import { getAvatarColor, getInitials } from "@/mainview/utils/avatar";
import { Channel } from "@/mainview/components/features/channel-item";

type AuthMode = "auto" | "manual";

export function useDiscordAuth(
  onChannelsLoaded: (channels: Channel[]) => void,
  onError: (error: string) => void
) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [scanText, setScanText] = useState({ 
    title: "Looking for cached token…", 
    subtitle: "Checking ~/.deleo_cached_token" 
  });

  const convertChannels = (channelInfos: ChannelInfo[]): Channel[] => {
    return channelInfos.map(ch => ({
      id: ch.id,
      type: ch.type,
      label: ch.label,
      sub: ch.sub,
      msgs: ch.msgs,
      avatarColor: getAvatarColor(ch.label),
      avatarText: getInitials(ch.label),
      isSquare: ch.type === "group" || ch.type === "server"
    }));
  };

  const authenticate = useCallback(async (
    mode: AuthMode, 
    manualToken?: string,
    saveToCache?: boolean
  ) => {
    try {
      if (mode === "auto") {
        setScanText({ title: "Looking for cached token…", subtitle: "Checking ~/.deleo_cached_token" });
        const cached = await loadCachedToken();
        
        if (!cached) {
          onError("No cached token found");
          return null;
        }

        setScanText({ title: "Validating cached token…", subtitle: "Connecting to Discord" });
        const result = await validateToken(cached);
        
        if (!result.success || !result.user) {
          onError(result.error || "Invalid cached token");
          return null;
        }

        setToken(cached);
        setUser(result.user);
        setIsConnected(true);
        
        // load channels after successful auth
        setScanText({ title: "Loading channels…", subtitle: "Fetching your conversations" });
        const channelsResult = await getChannels();
        if (channelsResult.success && channelsResult.channels) {
          const converted = convertChannels(channelsResult.channels);
          onChannelsLoaded(converted);
        }
        
        return result.user;
      } else if (mode === "manual" && manualToken) {
        setScanText({ title: "Validating token…", subtitle: "Connecting to Discord" });
        const result = await validateToken(manualToken);
        
        if (!result.success || !result.user) {
          onError(result.error || "Invalid token");
          return null;
        }

        setToken(manualToken);
        setUser(result.user);
        setIsConnected(true);
        
        // save to cache if requested
        if (saveToCache) {
          await saveToken(manualToken);
        }
        
        // load channels after successful auth
        setScanText({ title: "Loading channels…", subtitle: "Fetching your conversations" });
        const channelsResult = await getChannels();
        if (channelsResult.success && channelsResult.channels) {
          const converted = convertChannels(channelsResult.channels);
          onChannelsLoaded(converted);
        }
        
        return result.user;
      }
      
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      onError(message);
      return null;
    }
  }, [onChannelsLoaded, onError]);

  return {
    token,
    user,
    isConnected,
    scanText,
    authenticate
  };
}

import type { RPCSchema } from "electrobun/bun";

export interface DiscordUser {
  id: string;
  username: string;
  discriminator?: string;
  avatar: string | null;
  global_name: string | null;
}

// Helper to format Discord username (handles both old #1234 and new username format)
export function formatDiscordUsername(user: DiscordUser): string {
  if (user.global_name) {
    return user.global_name;
  }
  if (user.discriminator && user.discriminator !== "0") {
    return `${user.username}#${user.discriminator}`;
  }
  return user.username;
}

export interface DiscordChannel {
  id: string;
  type: number;
  name?: string;
  recipients?: DiscordUser[];
  icon?: string | null;
  guild_id?: string;
}

export interface ChannelInfo {
  id: string;
  type: "dm" | "group" | "server";
  label: string;
  sub: string;
  msgs: number;
}

export interface FeedEntry {
  id: string;
  timestamp: string;
  channel: string;
  message: string;
  messageId: string;
  status: "ok" | "error" | "info";
  errorType?: string;
}

export interface DeletionProgress {
  channelId: string;
  channelName: string;
  deleted: number;
  failed: number;
  total: number;
  current: number;
  percentage: number;
}

export type WindowRPCType = {
  bun: RPCSchema<{
    requests: {
      getPlatform: {
        params: {};
        response: NodeJS.Platform;
      };
      // Auth
      loadCachedToken: {
        params: {};
        response: { token: string | null };
      };
      validateToken: {
        params: { token: string };
        response: { success: boolean; user?: DiscordUser; error?: string };
      };
      saveToken: {
        params: { token: string };
        response: { success: boolean };
      };
      // Channels
      getChannels: {
        params: {};
        response: { success: boolean; channels?: ChannelInfo[]; error?: string };
      };
      searchMessages: {
        params: { channelId: string; authorId: string };
        response: { success: boolean; count?: number; error?: string };
      };
      // Deletion
      startDeletion: {
        params: { 
          channelIds: string[]; 
          deleteDelay: number;
          authorId: string;
        };
        response: { success: boolean; error?: string };
      };
      stopDeletion: {
        params: {};
        response: { success: boolean };
      };
    };
    messages: {
      closeWindow: {};
      minimizeWindow: {};
      // Deletion progress
      deletionProgress: {
        channelId: string;
        channelName: string;
        deleted: number;
        failed: number;
        total: number;
        current: number;
        percentage: number;
      };
      deletionEvent: {
        type: "message_deleted" | "message_failed" | "channel_complete" | "stopped";
        channelId: string;
        channelName?: string;
        messageId?: string;
        messageContent?: string;
        error?: string;
        deleted?: number;
        failed?: number;
      };
      deletionComplete: {
        totalDeleted: number;
        totalFailed: number;
        stopped: boolean;
      };
    };
  }>;
  webview: RPCSchema<{
    requests: {};
    messages: {};
  }>;
};

import { authManager } from "../../lib/core/auth-manager";
import { MessageSearcher } from "../../lib/core/message-searcher";
import { MessageDeleter, DeletionEvent } from "../../lib/core/message-deleter";
import { convertChannel } from "../channel-utils";
import { sendToWebview, truncate } from "../webview-utils";

let currentDeleter: MessageDeleter | null = null;

export function getCurrentDeleter() {
  return currentDeleter;
}

export function clearCurrentDeleter() {
  currentDeleter = null;
}

// load cached token from ~/.deleo_cached_token
export function handleLoadCachedToken() {
  const token = authManager.loadCachedToken();
  return { token };
}

// validate token with discord api
export async function handleValidateToken({ token }: { token: string }) {
  const result = await authManager.validateToken(token);
  if (result.isOk()) {
    const user = result.unwrap();
    authManager.saveToken(token);
    return { success: true, user };
  } else {
    const error = result.unwrapErr();
    return { success: false, error: error.message };
  }
}

// save token to cache file
export function handleSaveToken({ token }: { token: string }) {
  authManager.saveToken(token);
  return { success: true };
}

// fetch user's dm channels from discord
export async function handleGetChannels() {
  const token = authManager.getToken();
  if (!token) {
    return { success: false, error: "No token available" };
  }
  
  const searcher = new MessageSearcher(token);
  const result = await searcher.getUserChannels();
  
  if (result.isErr()) {
    return { success: false, error: result.unwrapErr().message };
  }
  
  const channels = result.unwrap();
  const channelInfos = channels.map(convertChannel);
  
  return { success: true, channels: channelInfos };
}

// count messages in a channel for a user
export async function handleSearchMessages({ channelId, authorId }: { channelId: string; authorId: string }) {
  const token = authManager.getToken();
  if (!token) {
    return { success: false, error: "No token available" };
  }
  
  const searcher = new MessageSearcher(token);
  const result = await searcher.searchChannelMessages(channelId, authorId);
  
  if (result.isErr()) {
    return { success: false, error: result.unwrapErr().message };
  }
  
  const messages = result.unwrap();
  return { success: true, count: messages.length };
}

// start deletion process (bg)
export async function handleStartDeletion({ 
  channelIds, 
  deleteDelay, 
  authorId 
}: { 
  channelIds: string[]; 
  deleteDelay: number; 
  authorId: string 
}) {
  const token = authManager.getToken();
  if (!token) {
    return { success: false, error: "No token available" };
  }
  
  currentDeleter = new MessageDeleter(token, deleteDelay);
  runDeletionProcess(channelIds, authorId);
  
  return { success: true };
}

export function handleStopDeletion() {
  currentDeleter?.stop();
  return { success: true };
}

async function runDeletionProcess(channelIds: string[], authorId: string) {
  const token = authManager.getToken();
  if (!token) return;
  
  const searcher = new MessageSearcher(token);
  const user = authManager.getUser();
  
  let totalDeletedCount = 0;
  let totalFailedCount = 0;
  
  for (const channelId of channelIds) {
    if (currentDeleter?.isStopped()) break;
    
    const searchResult = await searcher.searchChannelMessages(
      channelId, 
      authorId || user?.id || ""
    );
    
    if (searchResult.isErr()) {
      sendToWebview("deletionEvent", {
        type: "error",
        channelId,
        error: searchResult.unwrapErr().message
      });
      continue;
    }
    
    const messages = searchResult.unwrap();
    
    await currentDeleter?.deleteMessages(
      channelId,
      messages,
      (event: DeletionEvent) => {
        if (event.deleted !== undefined) totalDeletedCount = event.deleted;
        if (event.failed !== undefined) totalFailedCount = event.failed;
        
        sendToWebview("deletionEvent", {
          type: event.type,
          channelId: event.channelId,
          messageId: event.messageId,
          messageContent: event.messageContent ? truncate(event.messageContent, 50) : undefined,
          error: event.error,
          deleted: event.deleted,
          failed: event.failed
        });
        
        if (event.deleted !== undefined && event.failed !== undefined) {
          sendToWebview("deletionProgress", {
            channelId: event.channelId,
            channelName: "",
            deleted: event.deleted,
            failed: event.failed,
            total: messages.length,
            current: event.deleted + event.failed,
            percentage: Math.round(((event.deleted + event.failed) / messages.length) * 100)
          });
        }
      }
    );
    
    sendToWebview("deletionEvent", {
      type: "channel_complete",
      channelId
    });
  }
  
  sendToWebview("deletionComplete", {
    totalDeleted: totalDeletedCount,
    totalFailed: totalFailedCount,
    stopped: currentDeleter?.isStopped() || false
  });
  
  currentDeleter = null;
}

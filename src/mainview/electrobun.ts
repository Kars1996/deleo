import type { WindowRPCType } from "@/types";
import { Electroview } from "electrobun/view";

const rpc = Electroview.defineRPC<WindowRPCType>({
  handlers: {
    requests: {},
    messages: {},
  },
});

export const electrobun = new Electroview({ rpc });

export async function loadCachedToken(): Promise<string | null> {
  const result = await electrobun.rpc!.request("loadCachedToken", {});
  return result.token;
}

export async function validateToken(token: string) {
  return await electrobun.rpc!.request("validateToken", { token });
}

export async function saveToken(token: string) {
  return await electrobun.rpc!.request("saveToken", { token });
}

export async function getChannels() {
  return await electrobun.rpc!.request("getChannels", {});
}

export async function searchMessages(channelId: string, authorId: string) {
  return await electrobun.rpc!.request("searchMessages", { channelId, authorId });
}

export async function startDeletion(channelIds: string[], deleteDelay: number, authorId: string) {
  return await electrobun.rpc!.request("startDeletion", { channelIds, deleteDelay, authorId });
}

export async function stopDeletion() {
  return await electrobun.rpc!.request("stopDeletion", {});
}

// msg listened FROM bun TO webview
export function onMessage<T>(message: string, callback: (data: T) => void) {
  // Electrobun handles messages via the handlers object
  // For runtime subscriptions, we need to add to window
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail && customEvent.detail.message === message) {
      callback(customEvent.detail.data);
    }
  };
  window.addEventListener("electrobun-message", handler);
  return () => window.removeEventListener("electrobun-message", handler);
}

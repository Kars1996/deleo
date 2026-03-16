import type { WindowRPCType } from "../types";
import { BrowserView } from "electrobun/bun";
import { getMainViewUrl, createMainWindow } from "./window";
import { setMainView } from "./webview-utils";
import {
  handleLoadCachedToken,
  handleValidateToken,
  handleSaveToken,
  handleGetChannels,
  handleSearchMessages,
  handleStartDeletion,
  handleStopDeletion
} from "./handlers/rpc-handlers";

// check for dev mode ssl bypass
if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") {
  console.warn("⚠️  WARNING: SSL certificate verification is disabled (NODE_TLS_REJECT_UNAUTHORIZED=0)");
  console.warn("   This should only be used in development!");
}

const url = await getMainViewUrl();

export const rpc = BrowserView.defineRPC<WindowRPCType>({
  handlers: {
    requests: {
      getPlatform: () => process.platform,
      loadCachedToken: handleLoadCachedToken,
      validateToken: handleValidateToken,
      saveToken: handleSaveToken,
      getChannels: handleGetChannels,
      searchMessages: handleSearchMessages,
      startDeletion: handleStartDeletion,
      stopDeletion: handleStopDeletion
    },
    messages: {
      closeWindow: () => mainWindow.close(),
      minimizeWindow: () => mainWindow.minimize(),
    },
  },
});

const mainWindow = createMainWindow(url, rpc);

setMainView(mainWindow.webview);

console.log("Deleo started!");

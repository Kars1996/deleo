import { BrowserView } from "electrobun/bun";

let mainView: BrowserView | null = null;

export function setMainView(view: BrowserView) {
  mainView = view;
}

export function sendToWebview(message: string, data: any) {
  if (mainView && mainView.sendMessageToWebviewViaExecute) {
    mainView.sendMessageToWebviewViaExecute({ message, data });
  }
}

// text truncation for ui display
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + "…";
}

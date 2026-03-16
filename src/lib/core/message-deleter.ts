import { DiscordClient, DiscordMessage } from "./discord-client";

export interface DeletionProgress {
  channelId: string;
  channelName: string;
  deleted: number;
  failed: number;
  total: number;
  current: number;
  percentage: number;
}

export interface DeletionEvent {
  type: "message_deleted" | "message_failed" | "channel_complete" | "error";
  channelId: string;
  messageId?: string;
  messageContent?: string;
  error?: string;
  deleted?: number;
  failed?: number;
}

export class MessageDeleter {
  private client: DiscordClient;
  private stopped = false;
  private deleteDelay: number;

  constructor(token: string, deleteDelay = 1000) {
    const devMode = process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0";
    this.client = new DiscordClient(token, devMode);
    this.deleteDelay = deleteDelay;
  }

  stop(): void {
    this.stopped = true;
  }

  isStopped(): boolean {
    return this.stopped;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async deleteMessages(
    channelId: string,
    messages: DiscordMessage[],
    onEvent: (event: DeletionEvent) => void
  ): Promise<{ deleted: number; failed: number }> {
    let deleted = 0;
    let failed = 0;

    for (const message of messages) {
      if (this.stopped) {
        break;
      }

      const result = await this.client.deleteMessage(channelId, message.id);

      if (result.isErr()) {
        const error = result.unwrapErr();
        failed++;

        if (error.message.includes("RATELIMIT")) {
          onEvent({
            type: "message_failed",
            channelId,
            messageId: message.id,
            messageContent: message.content,
            error: "ratelimit",
            deleted,
            failed,
          });

          // longer wait  when rate limit
          await this.sleep(5000);
        } else {
          onEvent({
            type: "message_failed",
            channelId,
            messageId: message.id,
            messageContent: message.content,
            error: "unknown",
            deleted,
            failed,
          });
        }
      } else {
        deleted++;
        onEvent({
          type: "message_deleted",
          channelId,
          messageId: message.id,
          messageContent: message.content,
          deleted,
          failed,
        });

        // ratelimit protection
        await this.sleep(this.deleteDelay);
      }
    }

    return { deleted, failed };
  }
}

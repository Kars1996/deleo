import {
  DiscordClient,
  DiscordMessage,
  DiscordChannel,
} from "./discord-client";
import { Result } from "@sapphire/result";

export interface MessageSearchResult {
  channelId: string;
  messages: DiscordMessage[];
  totalFound: number;
}

export class MessageSearcher {
  private client: DiscordClient;

  constructor(token: string) {
    const devMode = process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0";
    this.client = new DiscordClient(token, devMode);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async searchChannelMessages(
    channelId: string,
    authorId: string,
    onProgress?: (found: number, total: number) => void,
  ): Promise<Result<DiscordMessage[], Error>> {
    const messages: DiscordMessage[] = [];
    let offset = 0;
    const limit = 25;

    while (true) {
      const result = await this.client.searchMessages(
        channelId,
        authorId,
        offset,
      );
      if (result.isErr()) {
        const err = result.unwrapErr();
        if (err.message === "RATELIMIT") {
          await this.sleep(3000); // will retry l8er
          continue;
        }
        return Result.err(err);
      }

      const data = result.unwrap();
      const before = messages.length;

      for (const group of data.messages) {
        for (const message of group) {
          // dedupe by id in case of overlapping pages
          if (
            message.author.id === authorId &&
            !messages.find((m) => m.id === message.id)
          ) {
            messages.push(message);
          }
        }
      }

      onProgress?.(messages.length, data.total_results);

      // verify none left
      if (data.messages.length === 0 || messages.length === before) break;
      if (messages.length >= data.total_results) break;

      offset += limit;
      await this.sleep(500);
    }

    return Result.ok(messages);
  }

  async getUserChannels(): Promise<Result<DiscordChannel[], Error>> {
    return this.client.getDMs();
  }
}

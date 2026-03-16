import { DiscordClient, DiscordMessage, DiscordChannel } from "./discord-client";
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
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async searchChannelMessages(
    channelId: string,
    authorId: string,
    onProgress?: (found: number) => void
  ): Promise<Result<DiscordMessage[], Error>> {
    const messages: DiscordMessage[] = [];
    let offset = 0;
    const limit = 25;

    while (true) {
      const result = await this.client.searchMessages(channelId, authorId, offset);

      if (result.isErr()) {
        return Result.err(result.unwrapErr());
      }

      const data = result.unwrap();

      // flat message groups
      for (const group of data.messages) {
        for (const message of group) {
          if (message.author.id === authorId) {
            messages.push(message);
          }
        }
      }

      onProgress?.(messages.length);

      // verify none left
      if (data.messages.length === 0 || messages.length >= data.total_results) {
        break;
      }

      offset += limit;
      await this.sleep(250);
    }

    return Result.ok(messages);
  }

  async getUserChannels(): Promise<Result<DiscordChannel[], Error>> {
    return this.client.getDMs();
  }
}

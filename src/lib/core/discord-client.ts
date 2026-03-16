import { Result } from "@sapphire/result";

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name: string | null;
}

export interface DiscordChannel {
  id: string;
  type: number;
  name?: string;
  recipients?: DiscordUser[];
  icon?: string | null;
  guild_id?: string;
}

export interface DiscordMessage {
  id: string;
  channel_id: string;
  author: DiscordUser;
  content: string;
  timestamp: string;
}

export interface SearchResult {
  messages: DiscordMessage[][];
  total_results: number;
}

export class DiscordClient {
  private token: string;
  private baseUrl = "https://discord.com/api/v9";

  constructor(token: string, _devMode = false) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Result<T, Error>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const fetchOptions: RequestInit = {
        ...options,
        headers: {
          Authorization: this.token,
          "Content-Type": "application/json",
          ...options.headers,
        },
      };
      
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const text = await response.text();
        return Result.err(new Error(`HTTP ${response.status}: ${text}`));
      }

      const data = await response.json();
      return Result.ok(data);
    } catch (error) {
      return Result.err(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  async getCurrentUser(): Promise<Result<DiscordUser, Error>> {
    return this.request<DiscordUser>("/users/@me");
  }

  async getDMs(): Promise<Result<DiscordChannel[], Error>> {
    return this.request<DiscordChannel[]>("/users/@me/channels");
  }

  async searchMessages(
    channelId: string,
    authorId: string,
    offset = 0
  ): Promise<Result<SearchResult, Error>> {
    const endpoint = `/channels/${channelId}/messages/search?author_id=${authorId}&offset=${offset}`;
    return this.request<SearchResult>(endpoint);
  }

  async deleteMessage(
    channelId: string,
    messageId: string
  ): Promise<Result<void, Error>> {
    const endpoint = `/channels/${channelId}/messages/${messageId}`;
    const result = await this.request<void>(endpoint, {
      method: "DELETE",
    });

    if (result.isErr()) {
      const error = result.unwrapErr();
      // rate limiting error
      if (error.message.includes("429")) {
        return Result.err(new Error("RATELIMIT"));
      }
      return result;
    }

    return Result.ok(undefined);
  }

  async getGuildChannels(guildId: string): Promise<Result<DiscordChannel[], Error>> {
    return this.request<DiscordChannel[]>(`/guilds/${guildId}/channels`);
  }
}

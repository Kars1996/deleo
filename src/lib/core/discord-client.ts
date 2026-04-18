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
  private xSuper: string | null = null;

  constructor(token: string, _devMode = false) {
    this.token = token;
  }

  private async ensureXSuper(): Promise<void> {
    if (this.xSuper !== null) return;
    await this.init();
  }
  async init(): Promise<void> {
    try {
      const res = await fetch("https://api.sockets.lol/discord/build");
      const data = await res.json();
      this.xSuper = data.clients.Discord.encoded;
    } catch {
      console.warn(
        "Failed to fetch x-super-properties, requests may be blocked",
      );
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Result<T, Error>> {
    await this.ensureXSuper();
    try {
      const url = `${this.baseUrl}${endpoint}`;

      const headers: Record<string, string> = {
        Authorization: this.token,
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) ?? {}),
      };

      if (this.xSuper) {
        headers["x-super-properties"] = this.xSuper;
      }

      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        const text = await response.text();
        return Result.err(new Error(`HTTP ${response.status}: ${text}`));
      }

      if (response.status === 204) {
        return Result.ok(undefined as T);
      }

      const data = await response.json();
      return Result.ok(data);
    } catch (error) {
      return Result.err(
        error instanceof Error ? error : new Error(String(error)),
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
    offset = 0,
  ): Promise<Result<SearchResult, Error>> {
    const endpoint = `/channels/${channelId}/messages/search?author_id=${authorId}&include_nsfw=true&offset=${offset}`;
    const result = await this.request<SearchResult>(endpoint);

    if (result.isErr()) return result;

    const data = result.unwrap();
    if (!data || !Array.isArray(data.messages)) {
      return Result.err(new Error("RATELIMIT"));
    }

    return Result.ok(data);
  }

  async deleteMessage(
    channelId: string,
    messageId: string,
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

  async getGuildChannels(
    guildId: string,
  ): Promise<Result<DiscordChannel[], Error>> {
    return this.request<DiscordChannel[]>(`/guilds/${guildId}/channels`);
  }
}

export function getDiscordAvatarUrl(
  userId: string,
  avatarHash: string | null,
): string | null {
  if (!avatarHash) return null;
  const ext = avatarHash.startsWith("a_") ? "gif" : "webp";
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${ext}?size=64`;
}

export function getGroupIconUrl(
  channelId: string,
  iconHash: string | null,
): string | null {
  if (!iconHash) return null;
  return `https://cdn.discordapp.com/channel-icons/${channelId}/${iconHash}.webp?size=64`;
}

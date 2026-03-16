import { DiscordClient, DiscordUser } from "./discord-client";
import { Result } from "@sapphire/result";
import { homedir } from "os";
import { join } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";

const TOKEN_FILE = join(homedir(), ".deleo_cached_token");

export class AuthManager {
  private token: string | null = null;
  private user: DiscordUser | null = null;

  getToken(): string | null {
    return this.token;
  }

  getUser(): DiscordUser | null {
    return this.user;
  }

  loadCachedToken(): string | null {
    try {
      if (existsSync(TOKEN_FILE)) {
        const token = readFileSync(TOKEN_FILE, "utf-8").trim();
        this.token = token;
        return token;
      }
    } catch (error) {
      console.error("Failed to load cached token:", error);
    }
    return null;
  }

  saveToken(token: string): void {
    try {
      writeFileSync(TOKEN_FILE, token);
      this.token = token;
    } catch (error) {
      console.error("Failed to save token:", error);
    }
  }

  async validateToken(token: string): Promise<Result<DiscordUser, Error>> {
    const devMode = process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0";
    const client = new DiscordClient(token, devMode);
    const result = await client.getCurrentUser();

    if (result.isOk()) {
      this.user = result.unwrap();
      this.token = token;
    }

    return result;
  }

  setToken(token: string): void {
    this.token = token;
  }

  clear(): void {
    this.token = null;
    this.user = null;
  }
}

// single instance
export const authManager = new AuthManager();

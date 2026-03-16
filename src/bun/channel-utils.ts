import { DiscordChannel } from "../lib/core/discord-client";

export type ChannelType = "dm" | "group" | "server";

export function getChannelType(channel: DiscordChannel): ChannelType {
  if (channel.guild_id) return "server";
  if (channel.recipients && channel.recipients.length > 1) return "group";
  return "dm";
}

export function getChannelLabel(channel: DiscordChannel): string {
  if (channel.name) return channel.name;
  if (channel.recipients) {
    return channel.recipients.map(r => r.global_name || r.username).join(", ");
  }
  return "Unknown";
}

export function getChannelSub(channel: DiscordChannel): string {
  if (channel.guild_id) return "#general";
  if (channel.recipients) {
    const count = channel.recipients.length;
    return count > 1 ? `${count} members` : `@${channel.recipients[0]?.username || "unknown"}`;
  }
  return "";
}

export function getAvatarColor(label: string): string {
  const colors = [
    "#1a3a5c", "#3a1a1a", "#1a3a1a", "#1c1c1c", 
    "#2a1a0a", "#0a1a2a", "#1a0a2a", "#0a2a1a", "#1a1a2a"
  ];
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function getInitials(label: string): string {
  return label
    .split(/[\s_\-]+/)
    .map(w => w[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2);
}

export interface ChannelInfo {
  id: string;
  type: ChannelType;
  label: string;
  sub: string;
  msgs: number;
  avatarColor: string;
  avatarText: string;
}

export function convertChannel(channel: DiscordChannel): ChannelInfo {
  const label = getChannelLabel(channel);
  return {
    id: channel.id,
    type: getChannelType(channel),
    label,
    sub: getChannelSub(channel),
    msgs: 0,
    avatarColor: getAvatarColor(label),
    avatarText: getInitials(label)
  };
}

const COLORS = [
  "#1a3a5c", "#3a1a1a", "#1a3a1a", "#1c1c1c", 
  "#2a1a0a", "#0a1a2a", "#1a0a2a", "#0a2a1a",
];

export function getAvatarColor(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function getInitials(label: string): string {
  return label
    .split(/[\s_\-]+/)
    .map(w => w[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2);
}

import { Channel, ChannelItem } from "./channel-item";

interface ChannelListProps {
  channels: Channel[];
  selectedIds: string[];
  filter: "all" | "dm" | "group" | "server";
  onToggle: (id: string) => void;
}

export function ChannelList({ channels, selectedIds, filter, onToggle }: ChannelListProps) {
  const filteredChannels = filter === "all" 
    ? channels 
    : channels.filter(c => c.type === filter);

  const dms = filteredChannels.filter(c => c.type === "dm");
  const groups = filteredChannels.filter(c => c.type === "group");
  const servers = filteredChannels.filter(c => c.type === "server");

  return (
    <div className="scrollable max-h-[248px]">
      {dms.length > 0 && (
        <>
          <div className="text-[9px] uppercase tracking-[0.1em] text-[var(--dim)] font-medium px-3 py-1">
            Direct Messages
          </div>
          {dms.map(channel => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              selected={selectedIds.includes(channel.id)}
              onToggle={() => onToggle(channel.id)}
            />
          ))}
        </>
      )}
      
      {groups.length > 0 && (
        <>
          <div className="text-[9px] uppercase tracking-[0.1em] text-[var(--dim)] font-medium px-3 py-2 pt-3">
            Group DMs
          </div>
          {groups.map(channel => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              selected={selectedIds.includes(channel.id)}
              onToggle={() => onToggle(channel.id)}
            />
          ))}
        </>
      )}
      
      {servers.length > 0 && (
        <>
          <div className="text-[9px] uppercase tracking-[0.1em] text-[var(--dim)] font-medium px-3 py-2 pt-3">
            Servers
          </div>
          {servers.map(channel => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              selected={selectedIds.includes(channel.id)}
              onToggle={() => onToggle(channel.id)}
            />
          ))}
        </>
      )}
    </div>
  );
}

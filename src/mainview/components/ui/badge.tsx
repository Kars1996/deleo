interface BadgeProps {
  text: string;
  variant?: "orange" | "red" | "green";
}

export function Badge({ text, variant = "orange" }: BadgeProps) {
  const variants = {
    orange: {
      bg: 'var(--o-faint)',
      color: 'var(--o)',
      border: 'var(--o-border)'
    },
    red: {
      bg: 'var(--err-bg)',
      color: 'var(--err)',
      border: 'var(--err-bd)'
    },
    green: {
      bg: 'var(--ok-bg)',
      color: 'var(--ok)',
      border: 'var(--ok-bd)'
    }
  };

  const style = variants[variant];

  return (
    <span 
      className="inline-flex items-center px-[7px] py-[2px] rounded text-[9px] font-medium uppercase tracking-[0.05em]"
      style={{ 
        background: style.bg, 
        color: style.color, 
        border: `1px solid ${style.border}` 
      }}
    >
      {text}
    </span>
  );
}

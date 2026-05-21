import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ children, active, onClick, className }: ChipProps) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "px-3 py-1 border border-chip-border rounded-full font-label-caps text-[10px] tracking-widest whitespace-nowrap transition-colors",
        active
          ? "border-primary text-primary bg-primary-container/20"
          : "text-on-surface-variant border-outline-variant hover:bg-surface-variant/50",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

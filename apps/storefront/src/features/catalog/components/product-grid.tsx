import { cn } from "@/lib/utils";

interface ProductGridProps {
  children: React.ReactNode;
  className?: string;
}

/** 1 column on mobile, max 3 on desktop */
export function ProductGrid({ children, className }: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-gutter lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

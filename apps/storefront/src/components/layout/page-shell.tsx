import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export function PageShell({ children, className, narrow }: PageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop",
        narrow && "max-w-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

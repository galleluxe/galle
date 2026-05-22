import { cn } from "@/lib/utils";

interface DisplayProps {
  children: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
}

export function Display({ children, as: Tag = "h1", className }: DisplayProps) {
  return (
    <Tag
      className={cn(
        "font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Headline({
  children,
  size = "md",
  className,
}: {
  children: React.ReactNode;
  size?: "md" | "sm";
  className?: string;
}) {
  const sizeClass =
    size === "sm"
      ? "font-headline-sm text-headline-sm"
      : "font-headline-md text-headline-md";
  return (
    <h2 className={cn(sizeClass, "text-on-surface", className)}>{children}</h2>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-label-caps text-label-caps text-text-muted uppercase tracking-widest font-semibold",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function BodyText({
  children,
  size = "md",
  className,
}: {
  children: React.ReactNode;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <p
      className={cn(
        size === "lg"
          ? "font-body-lg text-body-lg text-on-surface font-medium"
          : "font-body-md text-body-md text-on-surface",
        className,
      )}
    >
      {children}
    </p>
  );
}

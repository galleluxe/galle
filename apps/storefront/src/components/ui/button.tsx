import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-label-caps text-label-caps uppercase tracking-widest transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-tertiary text-on-tertiary px-8 py-3 rounded-full hover:bg-tertiary/90",
        secondary:
          "border border-secondary-fixed-dim text-primary px-6 py-3 hover:bg-primary-container",
        ghost:
          "border border-secondary-fixed-dim/50 text-primary px-6 py-3 hover:bg-surface-container",
        icon: "rounded-full bg-primary text-on-primary w-12 h-12 hover:bg-primary/90",
      },
      size: {
        default: "",
        sm: "px-4 py-2 text-[10px]",
        lg: "px-10 py-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-label-caps text-label-caps uppercase tracking-widest font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-on-primary px-8 py-3 rounded-none border-2 border-primary shadow-sm hover:bg-primary/90 hover:border-primary/90",
        secondary:
          "border-2 border-primary bg-surface text-on-surface px-6 py-3 rounded-none hover:bg-primary-container",
        ghost:
          "border-2 border-primary/70 bg-transparent text-on-surface px-6 py-3 rounded-none hover:bg-surface-container hover:border-primary",
        icon: "rounded-none bg-primary text-on-primary w-12 h-12 border-2 border-primary hover:bg-primary/90",
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

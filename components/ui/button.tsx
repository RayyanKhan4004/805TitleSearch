import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.25 whitespace-nowrap rounded-lg text-[11px] font-semibold cursor-pointer transition-all duration-150 border outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white border-brand hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]",
        secondary: "bg-white text-text-secondary border-border hover:bg-hover active:bg-[var(--bg-card-header)]",
        destructive: "bg-status-error-dark text-white border-status-error-dark hover:bg-[#b91c1c] active:bg-[#991b1b]",
        outline: "bg-transparent text-text-secondary border-border-input hover:bg-hover hover:text-text",
        ghost: "bg-transparent text-text-secondary border-transparent hover:bg-hover hover:text-text",
        link: "bg-transparent text-ui-link border-transparent underline-offset-4 hover:underline p-0 h-auto rounded-none",
        success: "bg-status-success-dark text-white border-status-success-dark hover:bg-[var(--status-success-emerald-dark)]",
        info: "bg-status-info-blue text-white border-status-info-blue hover:bg-[var(--status-info-blue)]",
      },
      size: {
        sm: "px-2.5 py-1 text-[10px]",
        md: "px-3.5 py-1.5 text-[11px]",
        lg: "px-5 py-2.5 text-[12px]",
        icon: "h-7 w-7 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: never;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

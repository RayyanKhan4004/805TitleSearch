import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const badgeVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full text-[10px] font-bold px-2.5 py-0.5",
  {
    variants: {
      variant: {
        success: "bg-status-success-bg text-status-success-text",
        warning: "bg-status-warning-bg text-status-warning-text",
        error: "bg-status-error-bg text-status-error-text",
        info: "bg-status-info-bg text-status-info-text",
        neutral: "bg-status-neutral-bg text-status-neutral-text",
        brand: "bg-brand-primary-subtle text-brand",
        outline: "bg-transparent border border-border text-text-secondary",
      },
      size: {
        sm: "text-[9px] px-2 py-0.25",
        md: "text-[10px] px-2.5 py-0.5",
        lg: "text-[11px] px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {dot && (
          <span className="w-1.25 h-1.25 rounded-full bg-current flex-shrink-0" />
        )}
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };

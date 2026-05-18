import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const tooltipVariants = cva(
  "absolute z-50 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-white bg-header shadow-[var(--shadow-card)] whitespace-nowrap pointer-events-none",
  {
    variants: {
      side: {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
        left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
        right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
      },
    },
    defaultVariants: {
      side: "top",
    },
  }
);

export interface TooltipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipVariants> {
  content: string;
  open?: boolean;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, side, content, open, ...props }, ref) => {
    if (!open) return null;
    return (
      <div
        ref={ref}
        className={cn(tooltipVariants({ side, className }))}
        {...props}
      >
        {content}
        <div
          className={cn(
            "absolute w-1.5 h-1.5 bg-header rotate-45",
            side === "top" && "left-1/2 -translate-x-1/2 -bottom-0.75",
            side === "bottom" && "left-1/2 -translate-x-1/2 -top-0.75",
            side === "left" && "top-1/2 -translate-y-1/2 -right-0.75",
            side === "right" && "top-1/2 -translate-y-1/2 -left-0.75"
          )}
        />
      </div>
    );
  }
);
Tooltip.displayName = "Tooltip";

export interface TooltipWrapperProps {
  content: string;
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
}

function TooltipWrapper({ content, side = "top", children, className }: TooltipWrapperProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      <Tooltip content={content} side={side} open={open} />
    </div>
  );
}

export { Tooltip, tooltipVariants, TooltipWrapper };

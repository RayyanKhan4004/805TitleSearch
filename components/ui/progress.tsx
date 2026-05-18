import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const progressVariants = cva(
  "w-full bg-ui-progress-bg rounded-full overflow-hidden",
  {
    variants: {
      size: {
        sm: "h-1",
        md: "h-1.5",
        lg: "h-2.5",
      },
      color: {
        default: "[&>div]:bg-ui-progress-fill",
        brand: "[&>div]:bg-brand",
        success: "[&>div]:bg-status-success-dark",
        error: "[&>div]:bg-status-error-dark",
        info: "[&>div]:bg-status-info-blue",
      },
    },
    defaultVariants: {
      size: "md",
      color: "default",
    },
  }
);

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof progressVariants> {
  value: number;
  max?: number;
  showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, size, color, value, max = 100, showLabel, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    return (
      <div className="w-full">
        <div
          ref={ref}
          className={cn(progressVariants({ size, color, className }))}
          {...props}
        >
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="text-[10px] text-text-muted mt-0.5 text-right">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress, progressVariants };

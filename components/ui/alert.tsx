import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";
import Icon from "@/components/common/icon";

const alertVariants = cva(
  "w-full rounded-lg border p-3.5 flex gap-2.5",
  {
    variants: {
      variant: {
        info: "bg-status-info-subtle border-status-info-blue-border text-status-info-blue-text",
        success: "bg-status-success-subtle border-status-success-border text-status-success-text",
        warning: "bg-status-warning-subtle border-status-warning-border text-status-warning-text",
        error: "bg-status-error-bg border-status-error-border text-status-error-text",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, className }))}
      {...props}
    >
      <div className="flex-shrink-0 mt-0.5">
        {variant === "info" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )}
        {variant === "success" && (
          <Icon name="checkCircle" size={14} />
        )}
        {variant === "warning" && (
          <Icon name="alertTri" size={14} />
        )}
        {variant === "error" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )}
      </div>
      <div>
        {title && (
          <h5 className="text-[11px] font-bold mb-0.5">{title}</h5>
        )}
        <div className="text-[10px] opacity-90">{children}</div>
      </div>
    </div>
  )
);
Alert.displayName = "Alert";

export { Alert, alertVariants };

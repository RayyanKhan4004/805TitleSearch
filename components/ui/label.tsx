import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const labelVariants = cva(
  "text-[9px] font-bold uppercase tracking-[0.07em] select-none",
  {
    variants: {
      variant: {
        default: "text-text-muted",
        required: "text-text-secondary after:content-['*'] after:text-status-error-dark after:ml-0.5",
        error: "text-status-error-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export { Label, labelVariants };

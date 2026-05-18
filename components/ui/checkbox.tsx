import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const checkboxVariants = cva(
  "appearance-none border rounded-[4px] cursor-pointer transition-all duration-150 flex-shrink-0 checked:bg-ui-checkbox-accent checked:border-ui-checkbox-accent hover:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20 disabled:opacity-40 disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        sm: "w-3.5 h-3.5",
        md: "w-4 h-4",
        lg: "w-4.5 h-4.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size">,
    VariantProps<typeof checkboxVariants> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-1.5 cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          className={cn(checkboxVariants({ size, className }))}
          {...props}
        />
        {label && (
          <span className="text-[11px] text-text-secondary select-none">{label}</span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };

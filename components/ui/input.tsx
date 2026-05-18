import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const inputVariants = cva(
  "w-full rounded-lg text-text bg-white box-border outline-none transition-all duration-150 placeholder:text-text-disabled",
  {
    variants: {
      size: {
        sm: "px-1.5 py-1 text-[10px] border border-border-input rounded-[5px]",
        md: "px-2.5 py-1.5 text-[11px] border border-border-input",
        lg: "px-[11px] py-2 text-[12px] border border-border-input",
      },
      state: {
        default: "border-border-input focus:border-brand focus:ring-1 focus:ring-brand/20",
        error: "border-status-error-border focus:border-status-error-dark focus:ring-1 focus:ring-status-error-dark/20",
        success: "border-status-success-border focus:border-status-success-dark focus:ring-1 focus:ring-status-success-dark/20",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, state, label, error, icon, type = "text", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-0.5 block">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ size, state, className }),
              icon && "pl-7.5"
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[10px] text-status-error-text mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };

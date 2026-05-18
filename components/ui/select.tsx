import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const selectVariants = cva(
  "w-full bg-white box-border outline-none transition-all duration-150 appearance-none cursor-pointer",
  {
    variants: {
      size: {
        sm: "px-1.5 py-1 text-[10px] border border-border-input rounded-[5px]",
        md: "px-2.5 py-1.5 text-[11px] border border-border-input rounded-lg",
        lg: "px-[11px] py-2 text-[12px] border border-border-input rounded-lg",
      },
      state: {
        default: "border-border-input focus:border-brand focus:ring-1 focus:ring-brand/20",
        error: "border-status-error-border focus:border-status-error-dark focus:ring-1 focus:ring-status-error-dark/20",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  }
);

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  label?: string;
  error?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size, state, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-0.5 block">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              selectVariants({ size, state, className }),
              "pr-7.5"
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-[10px] text-status-error-text mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select, selectVariants };

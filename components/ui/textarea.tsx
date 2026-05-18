import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const textareaVariants = cva(
  "w-full bg-white box-border outline-none resize-none transition-all duration-150 placeholder:text-text-disabled",
  {
    variants: {
      size: {
        sm: "px-2 py-1.5 text-[10px] border border-border-input rounded-[5px]",
        md: "px-2.5 py-1.5 text-[11px] border border-border-input rounded-lg",
        lg: "px-3 py-2.5 text-[12px] border border-border-input rounded-lg",
        mono: "px-3 py-2.5 text-[11px] border border-border-input rounded-lg font-mono leading-[1.6]",
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

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, state, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-0.5 block">
            {label}
          </label>
        )}
        <textarea
          className={cn(textareaVariants({ size, state, className }))}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-[10px] text-status-error-text mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-md text-[10px] font-medium px-2 py-0.5 transition-colors duration-150",
  {
    variants: {
      variant: {
        default: "bg-hover text-text-secondary border border-border",
        brand: "bg-brand-primary-subtle text-brand border border-brand/20",
        success: "bg-status-success-subtle text-status-success-text border border-status-success-border",
        warning: "bg-status-warning-subtle text-status-warning-text border border-status-warning-border",
        error: "bg-status-error-bg text-status-error-text border border-status-error-border",
        info: "bg-status-info-subtle text-status-info-blue-text border border-status-info-blue-border",
        outline: "bg-transparent text-text-secondary border border-border-input",
      },
      closable: {
        true: "pr-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  onClose?: () => void;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, closable, onClose, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(tagVariants({ variant, closable, className }))}
      {...props}
    >
      {children}
      {closable && onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="ml-0.5 flex items-center justify-center w-3 h-3 rounded-sm hover:bg-black/10 transition-colors"
          tabIndex={-1}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  )
);
Tag.displayName = "Tag";

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  variant?: "default" | "brand" | "success" | "warning" | "error" | "info";
  className?: string;
  maxTags?: number;
}

function TagInput({ value, onChange, placeholder = "Add tag...", variant = "default", className, maxTags }: TagInputProps) {
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (maxTags && value.length >= maxTags) return;
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()]);
      }
      setInput("");
    }
    if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 w-full min-h-[32px] p-1.5 border border-border-input rounded-lg bg-white cursor-text",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, i) => (
        <Tag key={i} variant={variant} closable onClose={() => removeTag(i)}>
          {tag}
        </Tag>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : undefined}
        className="flex-1 min-w-[80px] text-[11px] text-text outline-none bg-transparent placeholder:text-text-disabled"
      />
    </div>
  );
}

export { Tag, TagInput, tagVariants };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      size: {
        sm: "h-3.5 w-6 data-[state=checked]:bg-status-success-dark",
        md: "h-4.5 w-8 data-[state=checked]:bg-status-success-dark",
        lg: "h-5.5 w-10 data-[state=checked]:bg-status-success-dark",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-transform duration-200",
  {
    variants: {
      size: {
        sm: "h-2.5 w-2.5 data-[state=checked]:translate-x-2.5 data-[state=unchecked]:translate-x-0",
        md: "h-3.5 w-3.5 data-[state=checked]:translate-x-3.5 data-[state=unchecked]:translate-x-0",
        lg: "h-4.5 w-4.5 data-[state=checked]:translate-x-4.5 data-[state=unchecked]:translate-x-0",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange">,
    VariantProps<typeof switchVariants> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, size, label, checked, onCheckedChange, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(checked || false);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalChecked(e.target.checked);
      }
      onCheckedChange?.(e.target.checked);
    };

    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            role="switch"
            ref={ref as React.Ref<HTMLInputElement>}
            checked={isChecked}
            onChange={handleChange}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              switchVariants({ size, className }),
              isChecked ? "bg-status-success-dark" : "bg-border"
            )}
            data-state={isChecked ? "checked" : "unchecked"}
          >
            <span
              className={cn(switchThumbVariants({ size }))}
              data-state={isChecked ? "checked" : "unchecked"}
            />
          </div>
        </div>
        {label && (
          <span className="text-[11px] text-text-secondary select-none">{label}</span>
        )}
      </label>
    );
  }
);
Switch.displayName = "Switch";

export { Switch, switchVariants, switchThumbVariants };

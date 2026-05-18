import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-solid border-r-transparent",
  {
    variants: {
      size: {
        xs: "w-3 h-3 border-[1.5px]",
        sm: "w-4 h-4 border-2",
        md: "w-5 h-5 border-2",
        lg: "w-7 h-7 border-[2.5px]",
        xl: "w-9 h-9 border-3",
      },
      variant: {
        default: "border-brand",
        white: "border-white",
        muted: "border-text-muted",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(spinnerVariants({ size, variant, className }))}
      {...props}
    />
  )
);
Spinner.displayName = "Spinner";

const loaderVariants = cva(
  "inline-flex items-center gap-2 text-[11px] font-medium",
  {
    variants: {
      variant: {
        default: "text-text-secondary",
        brand: "text-brand",
        white: "text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
  label?: string;
  spinnerSize?: "xs" | "sm" | "md" | "lg";
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, variant, label = "Loading...", spinnerSize = "sm", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(loaderVariants({ variant, className }))}
      {...props}
    >
      <Spinner size={spinnerSize} variant={variant === "white" ? "white" : "default"} />
      {label}
    </div>
  )
);
Loader.displayName = "Loader";

export { Spinner, Loader, spinnerVariants, loaderVariants };

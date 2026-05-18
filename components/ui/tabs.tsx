import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const tabsListVariants = cva(
  "inline-flex items-center gap-1.5 p-1 rounded-lg bg-hover",
  {
    variants: {
      size: {
        sm: "gap-1 p-0.5",
        md: "gap-1.5 p-1",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(tabsListVariants({ size, className }))}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-[11px] font-medium cursor-pointer transition-all duration-150 border-none outline-none disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      size: {
        sm: "px-2 py-1 text-[10px]",
        md: "px-3 py-1.5 text-[11px]",
        lg: "px-4 py-2 text-[12px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabsTriggerVariants> {
  active?: boolean;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, size, active, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        tabsTriggerVariants({ size, className }),
        active
          ? "bg-white text-text shadow-card"
          : "bg-transparent text-text-muted hover:text-text-secondary"
      )}
      {...props}
    />
  )
);
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mt-2.5 text-[11px] text-text-secondary", className)}
      {...props}
    />
  )
);
TabsContent.displayName = "TabsContent";

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

function Tabs({ value, onValueChange, children, className, size = "md" }: TabsProps) {
  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        if (child.type === TabsList) {
          return React.cloneElement(child, { size } as Partial<TabsListProps>);
        }
        if (child.type === TabsTrigger) {
          const childProps = child.props as { value?: string };
          return React.cloneElement(child, {
            active: childProps.value === value,
            onClick: () => childProps.value && onValueChange(childProps.value),
            size,
          } as Partial<TabsTriggerProps>);
        }
        return child;
      })}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants };

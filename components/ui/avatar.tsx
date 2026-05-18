import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const avatarVariants = cva(
  "inline-flex items-center justify-center rounded-full font-bold select-none",
  {
    variants: {
      size: {
        xs: "w-5 h-5 text-[8px]",
        sm: "w-6 h-6 text-[9px]",
        md: "w-7 h-7 text-[10px]",
        lg: "w-8 h-8 text-[11px]",
        xl: "w-10 h-10 text-[13px]",
      },
      variant: {
        default: "bg-ui-avatar text-ui-avatar-text",
        brand: "bg-brand text-white",
        success: "bg-status-success-dark text-white",
        muted: "bg-border text-text-muted",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  initials?: string;
  src?: string;
  alt?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, variant, initials, src, alt, ...props }, ref) => {
    if (src) {
      return (
        <div
          ref={ref}
          className={cn(avatarVariants({ size, variant, className }))}
          {...props}
        >
          <img src={src} alt={alt || initials} className="w-full h-full rounded-full object-cover" />
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, variant, className }))}
        {...props}
      >
        {initials}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };

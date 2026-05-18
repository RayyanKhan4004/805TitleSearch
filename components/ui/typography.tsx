import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const headingVariants = cva("font-bold text-text", {
  variants: {
    level: {
      h1: "text-[16px] tracking-tight",
      h2: "text-[15px] tracking-tight",
      h3: "text-[14px] tracking-tight",
      h4: "text-[13px] tracking-tight",
      h5: "text-[12px] tracking-tight",
      h6: "text-[11px] tracking-tight",
    },
    muted: {
      true: "text-text-secondary",
    },
  },
  defaultVariants: {
    level: "h3",
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = "h3", muted, ...props }, ref) => {
    const Tag = level;
    return (
      <Tag
        ref={ref}
        className={cn(headingVariants({ level, muted, className }))}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

const textVariants = cva("text-text", {
  variants: {
    size: {
      xs: "text-[9px]",
      sm: "text-[10px]",
      md: "text-[11px]",
      lg: "text-[12px]",
      xl: "text-[13px]",
      "2xl": "text-[14px]",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    muted: {
      true: "text-text-secondary",
    },
    tertiary: {
      true: "text-text-tertiary",
    },
    disabled: {
      true: "text-text-disabled",
    },
    mono: {
      true: "font-mono text-ui-code",
    },
  },
  defaultVariants: {
    size: "md",
    weight: "normal",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, weight, muted, tertiary, disabled, mono, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(textVariants({ size, weight, muted, tertiary, disabled, mono, className }))}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

const linkVariants = cva(
  "text-ui-link hover:underline underline-offset-4 cursor-pointer transition-colors duration-150",
  {
    variants: {
      size: {
        sm: "text-[10px]",
        md: "text-[11px]",
        lg: "text-[12px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(linkVariants({ size, className }))}
        {...props}
      />
    );
  }
);
Link.displayName = "Link";

export { headingVariants, textVariants, linkVariants };

export { Heading, Text, Link };

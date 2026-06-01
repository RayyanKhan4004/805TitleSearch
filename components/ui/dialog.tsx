import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib";

const dialogOverlay = "fixed inset-0 z-[999] backdrop-blur-[2px]";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div
      className={cn(dialogOverlay)}
      style={{ background: "var(--modal-overlay)" }}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="flex items-center justify-center min-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

const dialogContentVariants = cva(
  "bg-white w-full rounded-[18px] overflow-hidden flex flex-col",
  {
    variants: {
      size: {
        sm: "max-w-[480px] max-h-[80vh]",
        md: "max-w-[680px] max-h-[90vh]",
        lg: "max-w-[960px] max-h-[92vh]",
        xl: "max-w-[1120px] max-h-[95vh]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface DialogContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogContentVariants> {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
}

const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-t border-border px-[22px] py-2.75 flex justify-between items-center shrink-0",
      className,
    )}
    {...props}
  />
));
DialogFooter.displayName = "DialogFooter";

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, size, title, subtitle, onClose, children, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const footerChildren = childArray.filter(
      (child) => React.isValidElement(child) && child.type === DialogFooter,
    );
    const bodyChildren = childArray.filter(
      (child) => !(React.isValidElement(child) && child.type === DialogFooter),
    );

    return (
      <div
        ref={ref}
        className={cn(dialogContentVariants({ size, className }))}
        style={{ boxShadow: "var(--shadow-card)" }}
        {...props}
      >
        {(title || onClose) && (
          <div className="bg-header px-[22px] py-[14px] flex items-center justify-between flex-shrink-0">
            <div>
              {title && (
                <div className="text-[14px] font-bold text-white">
                  {title}
                </div>
              )}
              {subtitle && (
                <div className="text-[10px] text-text-muted mt-0.5">
                  {subtitle}
                </div>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="bg-transparent border-none text-text-muted text-[22px] cursor-pointer leading-none hover:text-white transition-colors"
              >
                &times;
              </button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{bodyChildren}</div>
        {footerChildren}
      </div>
    );
  },
);
DialogContent.displayName = "DialogContent";

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-[22px] pt-[18px] pb-[14px]", className)}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

const DialogBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-[22px] py-[18px] flex-1 overflow-y-auto", className)}
    {...props}
  />
));
DialogBody.displayName = "DialogBody";

const DialogTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-[15px] font-bold text-text", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-[11px] text-text-secondary mt-0.5", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  dialogContentVariants,
};

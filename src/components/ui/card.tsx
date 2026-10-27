import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-xl border border-border shadow-sm bg-card text-card-foreground",
  {
    variants: {
      variant: {
        default: "bg-card",
        elevated: "bg-card shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof cardVariants>["variant"];
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cardVariants({ variant, className })}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card, cardVariants };

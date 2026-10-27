import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md",
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

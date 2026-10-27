import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 ease-out",
  {
    variants: {
      variant: {
        default: "bg-card",
        elevated: "bg-card shadow-md",
        interactive: "bg-card hover:-translate-y-0.5 hover:shadow-md",
      },
      interactive: {
        true: "hover:-translate-y-0.5 hover:shadow-md",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof cardVariants>["variant"];
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cardVariants({ variant, interactive, className })}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card, cardVariants };

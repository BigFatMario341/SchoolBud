import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-pill px-2 py-0.5 text-xs font-medium tracking-wide uppercase",
  {
    variants: {
      tone: {
        test: "bg-cal text-cal-fg",
        homework: "bg-primary/20 text-primary",
        project: "bg-elevated text-fg border border-border",
        study: "bg-fg/10 text-muted",
      },
    },
    defaultVariants: { tone: "homework" },
  },
);

function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge, badgeVariants };

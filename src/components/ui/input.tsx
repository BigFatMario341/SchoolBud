import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-pill border border-border bg-elevated px-4 text-sm text-fg scheme-dark",
        "placeholder:text-subtle",
        "transition-[border-color,box-shadow] duration-(--motion-quick) ease-(--ease-out)",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/40",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

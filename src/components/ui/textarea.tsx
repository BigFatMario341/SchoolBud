import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-24 w-full rounded-lg border border-border bg-elevated px-4 py-3 text-sm text-fg",
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

export { Textarea };

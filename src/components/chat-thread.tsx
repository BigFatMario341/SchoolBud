import { useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ChatTurn } from "@/lib/store";

export function ChatThread({
  turns,
  streaming,
  error,
  empty,
  paper,
  onSend,
  placeholder,
  disabled,
  footer,
}: {
  turns: ChatTurn[];
  streaming?: boolean;
  error?: string | null;
  empty?: ReactNode;
  paper?: boolean;
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  footer?: ReactNode;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [turns, streaming]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? "";
    if (!value || disabled) return;
    onSend(value);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={scroller}
        className={cn(
          "min-h-0 flex-1 space-y-3 overflow-y-auto px-1 py-2",
          paper ? "text-chat-ink" : "text-fg",
        )}
      >
        {turns.length === 0 && empty}
        {turns.map((turn) => (
          <Bubble key={turn.id} turn={turn} paper={paper} />
        ))}
        {streaming && turns.at(-1)?.role === "assistant" && !turns.at(-1)?.content ? (
          <p className="text-muted px-1 text-sm">Thinking…</p>
        ) : null}
      </div>

      {error ? (
        <p className="text-cal mb-2 px-1 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      {footer}

      <form onSubmit={handleSubmit} className="relative mt-2">
        <input
          ref={inputRef}
          disabled={disabled}
          placeholder={placeholder ?? "Ask SchoolBud"}
          className={cn(
            "h-12 w-full rounded-pill border pr-12 pl-4 text-sm",
            "focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:outline-none",
            paper
              ? "border-black/10 bg-white text-chat-ink placeholder:text-black/40"
              : "border-border bg-elevated text-fg placeholder:text-subtle",
          )}
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled}
          className="absolute top-0.5 right-0.5 size-11"
          aria-label="Send"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}

function Bubble({ turn, paper }: { turn: ChatTurn; paper?: boolean }) {
  const mine = turn.role === "user";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-sm rounded-lg px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
          mine
            ? "bg-primary text-primary-fg rounded-br-sm"
            : paper
              ? "rounded-bl-sm bg-black/5 text-chat-ink"
              : "bg-elevated text-fg rounded-bl-sm",
        )}
      >
        {turn.content}
      </div>
    </div>
  );
}

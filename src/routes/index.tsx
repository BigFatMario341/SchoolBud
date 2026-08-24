import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CalendarDays, MessageCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatPrettyDate } from "@/lib/utils";
import { EVENT_LABEL, upcomingEvents, useSchool } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const name = useSchool((s) => s.name);
  const setName = useSchool((s) => s.setName);
  const events = useSchool((s) => s.events);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [mounted, setMounted] = useState(false);
  const upcoming = upcomingEvents(events, 3);

  useEffect(() => {
    setDraft(name);
  }, [name]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-6 sm:py-12">
      <div className="stagger-in flex w-full max-w-xl flex-col items-center text-center">
        <p className="text-muted mb-3 text-xs tracking-widest uppercase">
          Your study buddy
        </p>
        <h1
          className="font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl"
          suppressHydrationWarning
        >
          Welcome Back, {name}
        </h1>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-muted hover:text-fg mt-3 inline-flex items-center gap-1.5 text-sm"
        >
          <Pencil className="size-3.5" />
          Not {name}? Change name
        </button>

        <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="pill" className="w-full sm:w-auto">
            <Link to="/homework">Homework Helper</Link>
          </Button>
          <Button asChild size="pill" className="w-full sm:w-auto">
            <Link to="/calendar">Calendar</Link>
          </Button>
          <Button asChild size="pill" className="w-full sm:w-auto">
            <Link to="/chatbot">Chatbot</Link>
          </Button>
        </div>

        <p className="text-muted mt-8 max-w-md text-sm leading-relaxed">
          SchoolBud will not hand you answers. It explains the idea in tiny
          steps — then helps you plan around tests and due dates.
        </p>
      </div>

      <div className="mt-14 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
        <Feature
          icon={BookOpen}
          title="Homework Helper"
          body="Point the camera at a problem. SchoolBud teaches the method like you are three — and never blurts the answer."
        />
        <Feature
          icon={CalendarDays}
          title="Calendar"
          body="Drop in tests and due dates. The tutor reads them and builds study times that actually fit."
        />
        <Feature
          icon={MessageCircle}
          title="Chatbot"
          body="Ask anything about school. The only thing it will not do is give you the answer to copy."
        />
      </div>

      {mounted && upcoming.length > 0 ? (
        <div className="border-border bg-surface mt-10 w-full max-w-4xl rounded-xl border p-5">
          <h2 className="font-display mb-3 text-sm font-semibold tracking-tight">
            Coming up
          </h2>
          <ul className="space-y-2">
            {upcoming.map((event) => (
              <li
                key={event.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Badge tone={event.type}>{EVENT_LABEL[event.type]}</Badge>
                  <span className="truncate">{event.title}</span>
                </span>
                <span className="text-muted shrink-0 tabular-nums">
                  {formatPrettyDate(event.date)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What should we call you?</DialogTitle>
            <DialogDescription>
              SchoolBud uses this name in greetings. It stays on this device.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setName(draft);
              setEditing(false);
            }}
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={24}
              autoFocus
              aria-label="Your name"
            />
            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof BookOpen;
  title: string;
  body: string;
}) {
  return (
    <div className="border-border bg-surface rounded-xl border p-5 text-left">
      <Icon className="text-primary mb-3 size-5" />
      <h2 className="font-display mb-1.5 font-semibold">{title}</h2>
      <p className="text-muted text-sm leading-relaxed">{body}</p>
    </div>
  );
}

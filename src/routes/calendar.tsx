import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChatThread } from "@/components/chat-thread";
import { useTutor } from "@/components/use-tutor";
import { calendarSystem } from "@/lib/prompts";
import {
  EVENT_LABEL,
  calendarContext,
  eventsOnDate,
  toIsoDate,
  upcomingEvents,
  useSchool,
  type CalEvent,
  type EventType,
} from "@/lib/store";
import { cn, formatPrettyDate } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({ component: CalendarPage });

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarPage() {
  const name = useSchool((s) => s.name);
  const events = useSchool((s) => s.events);
  const addEvent = useSchool((s) => s.addEvent);
  const updateEvent = useSchool((s) => s.updateEvent);
  const removeEvent = useSchool((s) => s.removeEvent);
  const turns = useSchool((s) => s.calendarChat);
  const setTurns = useSchool((s) => s.setCalendarChat);
  const { busy, error, needsSignIn, ask, connect } = useTutor();

  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selected, setSelected] = useState(toIsoDate(today));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CalEvent | null>(null);
  const [pendingStudies, setPendingStudies] = useState<
    { date: string; title: string; notes?: string }[]
  >([]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthName = cursor.toLocaleString(undefined, { month: "long" });
  const cells = useMemo(() => buildCells(year, month), [year, month]);
  const dayEvents = eventsOnDate(events, selected);
  const upcoming = upcomingEvents(events, 8);

  function openAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(event: CalEvent) {
    setEditing(event);
    setDialogOpen(true);
    setSelected(event.date);
    const d = new Date(`${event.date}T12:00:00`);
    if (!Number.isNaN(d.getTime())) {
      setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }

  async function send(text: string) {
    const result = await ask({
      system: calendarSystem(name, calendarContext(events)),
      history: turns,
      userText: text,
      setTurns,
    });
    if (result.studies.length) setPendingStudies(result.studies);
  }

  function addStudies() {
    for (const study of pendingStudies) {
      addEvent({
        title: study.title,
        type: "study",
        date: study.date,
        notes: study.notes,
      });
    }
    setPendingStudies([]);
  }

  return (
    <div className="grid flex-1 gap-5 lg:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.4fr)]">
      <section className="bg-chat-paper text-chat-ink order-2 flex min-h-96 flex-col rounded-xl p-4 sm:p-5 lg:order-1">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="font-display text-xl font-semibold">Chatbot</h1>
          {turns.length > 0 ? (
            <button
              type="button"
              className="text-xs text-black/50 hover:text-black"
              onClick={() => setTurns([])}
            >
              Clear
            </button>
          ) : null}
        </div>
        <p className="mb-3 text-xs leading-relaxed text-black/55">
          I can see your tests and due dates. Ask me to schedule study time. I
          still will not give homework answers.
        </p>
        {needsSignIn ? (
          <Button type="button" className="mb-3" onClick={() => void connect()}>
            Connect Puter
          </Button>
        ) : null}
        <ChatThread
          paper
          turns={turns}
          streaming={busy}
          error={error}
          disabled={busy}
          onSend={(text) => void send(text)}
          placeholder="Plan my week around the science test"
          empty={
            <p className="px-1 py-6 text-sm text-black/50">
              Add a test or due date on the calendar, then ask me to build study
              sessions.
            </p>
          }
          footer={
            pendingStudies.length > 0 ? (
              <div className="border-black/10 mb-2 rounded-lg border bg-white p-3">
                <p className="mb-2 text-xs font-medium">
                  {pendingStudies.length} study session
                  {pendingStudies.length === 1 ? "" : "s"} suggested
                </p>
                <ul className="mb-3 space-y-1 text-xs">
                  {pendingStudies.map((s, i) => (
                    <li key={`${s.date}-${i}`}>
                      {formatPrettyDate(s.date)} — {s.title}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={addStudies}>
                    Add to calendar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-chat-ink"
                    onClick={() => setPendingStudies([])}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-2 flex flex-wrap gap-1.5">
                <Quick
                  onClick={() =>
                    void send(
                      "Look at my calendar and suggest study times for the next 7 days. Work backwards from tests.",
                    )
                  }
                >
                  Plan my week
                </Quick>
                <Quick
                  onClick={() =>
                    void send(
                      "What should I study first, based on what is due soonest?",
                    )
                  }
                >
                  What is due soon?
                </Quick>
              </div>
            )
          }
        />
      </section>

      <section className="order-1 flex min-w-0 flex-col gap-4 lg:order-2">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="bg-cal text-cal-fg flex items-center justify-between px-3 py-3 sm:px-4">
            <button
              type="button"
              className="rounded-md p-2 hover:bg-white/10"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="size-5" />
            </button>
            <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
              {monthName} {year}
            </h2>
            <button
              type="button"
              className="rounded-md p-2 hover:bg-white/10"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              aria-label="Next month"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="bg-bg grid grid-cols-7 border-t border-border">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="text-muted border-border border-b py-2 text-center text-xs font-medium tracking-wide uppercase"
              >
                {d}
              </div>
            ))}
            {cells.map((cell, i) => {
              if (!cell) {
                return (
                  <div
                    key={`pad-${i}`}
                    className="border-border min-h-16 border-b border-r bg-bg sm:min-h-20"
                  />
                );
              }
              const iso = toIsoDate(cell);
              const isToday = iso === toIsoDate(today);
              const isSelected = iso === selected;
              const marks = eventsOnDate(events, iso);
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelected(iso)}
                  className={cn(
                    "border-border min-h-16 border-b border-r p-1.5 text-left sm:min-h-20",
                    isSelected ? "bg-elevated" : "bg-bg hover:bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-full text-xs tabular-nums",
                      isToday && "bg-cal text-cal-fg",
                      isSelected && !isToday && "bg-primary text-primary-fg",
                    )}
                  >
                    {cell.getDate()}
                  </span>
                  {marks[0] ? (
                    <p className="mt-1 hidden truncate text-xs leading-tight text-muted sm:block">
                      {marks[0].title}
                    </p>
                  ) : (
                    <div className="mt-1 flex flex-wrap gap-0.5 sm:hidden">
                      {marks.slice(0, 3).map((m) => (
                        <span
                          key={m.id}
                          className={cn(
                            "block h-1.5 w-1.5 rounded-full",
                            m.type === "test" && "bg-cal",
                            m.type === "homework" && "bg-primary",
                            m.type === "project" && "bg-fg",
                            m.type === "study" && "bg-muted",
                          )}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-border bg-surface rounded-xl border p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-display font-semibold">
              {formatPrettyDate(selected)}
            </h3>
            <Button type="button" size="sm" onClick={openAdd}>
              <Plus className="size-4" />
              Add
            </Button>
          </div>
          {dayEvents.length === 0 ? (
            <p className="text-muted text-sm">
              Nothing on this day. Add a test, due date, or project so the
              chatbot can plan around it.
            </p>
          ) : (
            <ul className="space-y-2">
              {dayEvents.map((event) => (
                <EventRow
                  key={event.id}
                  event={event}
                  onEdit={() => openEdit(event)}
                  onRemove={() => removeEvent(event.id)}
                />
              ))}
            </ul>
          )}
        </div>

        {upcoming.length > 0 ? (
          <div className="border-border rounded-xl border p-4">
            <h3 className="font-display mb-3 text-sm font-semibold">Upcoming</h3>
            <ul className="space-y-2">
              {upcoming.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 text-left hover:opacity-90"
                    onClick={() => openEdit(event)}
                  >
                    <Badge tone={event.type}>{EVENT_LABEL[event.type]}</Badge>
                    <span className="truncate">{event.title}</span>
                  </button>
                  <span className="text-muted shrink-0 tabular-nums">
                    {formatPrettyDate(event.date)}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEdit(event)}
                    className="text-muted hover:text-fg rounded-md p-1.5"
                    aria-label={`Edit ${event.title}`}
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <EventDialog
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) setEditing(null);
        }}
        defaultDate={selected}
        event={editing}
        onSave={(payload) => {
          if (editing) {
            updateEvent(editing.id, payload);
            setSelected(payload.date);
          } else {
            const created = addEvent(payload);
            setSelected(created.date);
          }
        }}
      />
    </div>
  );
}

function EventRow({
  event,
  onEdit,
  onRemove,
}: {
  event: CalEvent;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-start justify-between gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="min-w-0 flex-1 rounded-md text-left hover:opacity-90"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={event.type}>{EVENT_LABEL[event.type]}</Badge>
          <span className="text-sm font-medium">{event.title}</span>
          {event.time ? (
            <span className="text-muted text-xs tabular-nums">{event.time}</span>
          ) : null}
        </div>
        {event.notes ? (
          <p className="text-muted mt-1 text-xs">{event.notes}</p>
        ) : null}
      </button>
      <div className="flex shrink-0 items-center">
        <button
          type="button"
          onClick={onEdit}
          className="text-muted hover:text-fg rounded-md p-2"
          aria-label={`Edit ${event.title}`}
        >
          <Pencil className="size-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-muted hover:text-cal rounded-md p-2"
          aria-label={`Remove ${event.title}`}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </li>
  );
}

function Quick({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-pill border border-black/10 bg-white px-3 py-1.5 text-xs text-black/70 hover:bg-black/5"
    >
      {children}
    </button>
  );
}

function EventDialog({
  open,
  onOpenChange,
  defaultDate,
  event,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultDate: string;
  event: CalEvent | null;
  onSave: (data: Omit<CalEvent, "id">) => void;
}) {
  const isEdit = !!event;
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("test");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    if (event) {
      setTitle(event.title);
      setType(event.type);
      setDate(event.date);
      setTime(event.time ?? "");
      setNotes(event.notes ?? "");
    } else {
      setTitle("");
      setType("test");
      setDate(defaultDate);
      setTime("");
      setNotes("");
    }
  }, [open, defaultDate, event]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit calendar item" : "Add to calendar"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Change the title, type, date, time, or notes for this item."
              : "Tests and due dates are what the chatbot uses to schedule study time."}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            onSave({
              title: title.trim(),
              type,
              date,
              time: time || undefined,
              notes: notes.trim() || undefined,
            });
            onOpenChange(false);
          }}
        >
          <label className="block text-sm">
            <span className="text-muted mb-1 block text-xs">Title</span>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Chapter 4 test"
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="text-muted mb-1 block text-xs">Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="border-border bg-elevated text-fg h-11 w-full rounded-pill border px-3 text-sm scheme-dark"
              >
                <option value="test">Test</option>
                <option value="homework">Homework due</option>
                <option value="project">Project</option>
                <option value="study">Study session</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-muted mb-1 block text-xs">Date</span>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="text-muted mb-1 block text-xs">Time (optional)</span>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted mb-1 block text-xs">Notes</span>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Chapters 3–4, bring a calculator"
              rows={3}
            />
          </label>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {isEdit ? "Save changes" : "Save"}
            </Button>
            {isEdit ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function buildCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "./utils";

export type EventType = "test" | "homework" | "project" | "study";

export type CalEvent = {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time?: string;
  notes?: string;
};

export type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type SchoolState = {
  name: string;
  setName: (name: string) => void;
  events: CalEvent[];
  addEvent: (event: Omit<CalEvent, "id">) => CalEvent;
  updateEvent: (id: string, patch: Partial<CalEvent>) => void;
  removeEvent: (id: string) => void;
  chatbot: ChatTurn[];
  setChatbot: (turns: ChatTurn[]) => void;
  calendarChat: ChatTurn[];
  setCalendarChat: (turns: ChatTurn[]) => void;
  homeworkChat: ChatTurn[];
  setHomeworkChat: (turns: ChatTurn[]) => void;
};

export const EVENT_LABEL: Record<EventType, string> = {
  test: "Test",
  homework: "Due",
  project: "Project",
  study: "Study",
};

export const useSchool = create<SchoolState>()(
  persist(
    (set, get) => ({
      name: "Ben",
      setName: (name) => set({ name: name.trim() || "Ben" }),
      events: [],
      addEvent: (event) => {
        const next: CalEvent = { ...event, id: uid() };
        set({ events: [...get().events, next] });
        return next;
      },
      updateEvent: (id, patch) =>
        set({
          events: get().events.map((item) =>
            item.id === id ? { ...item, ...patch } : item,
          ),
        }),
      removeEvent: (id) =>
        set({ events: get().events.filter((item) => item.id !== id) }),
      chatbot: [],
      setChatbot: (chatbot) => set({ chatbot }),
      calendarChat: [],
      setCalendarChat: (calendarChat) => set({ calendarChat }),
      homeworkChat: [],
      setHomeworkChat: (homeworkChat) => set({ homeworkChat }),
    }),
    { name: "schoolbud-v1" },
  ),
);

export function upcomingEvents(events: CalEvent[], limit = 12): CalEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = toIsoDate(today);
  return [...events]
    .filter((event) => event.date >= todayIso)
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export function eventsOnDate(events: CalEvent[], iso: string) {
  return events
    .filter((event) => event.date === iso)
    .sort((a, b) => (a.time || "").localeCompare(b.time || "") || a.title.localeCompare(b.title));
}

export function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function calendarContext(events: CalEvent[]) {
  if (events.length === 0) {
    return "The student has not added any tests, due dates, or study sessions yet.";
  }
  const lines = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((event) => {
      const bits = [
        `${EVENT_LABEL[event.type]}: ${event.title}`,
        `on ${event.date}`,
      ];
      if (event.time) bits.push(`at ${event.time}`);
      if (event.notes) bits.push(`notes: ${event.notes}`);
      return `- ${bits.join(" ")}`;
    });
  return `Here is the student's calendar (tests, due dates, projects, study sessions):\n${lines.join("\n")}`;
}

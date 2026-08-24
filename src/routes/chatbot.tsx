import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChatThread } from "@/components/chat-thread";
import { useTutor } from "@/components/use-tutor";
import { chatbotSystem } from "@/lib/prompts";
import { calendarContext, useSchool } from "@/lib/store";

export const Route = createFileRoute("/chatbot")({ component: ChatbotPage });

const STARTERS = [
  "Explain fractions like I am three",
  "Help me plan study time this week",
  "Quiz me — don't give the answers",
  "What should I study first?",
];

function ChatbotPage() {
  const name = useSchool((s) => s.name);
  const events = useSchool((s) => s.events);
  const turns = useSchool((s) => s.chatbot);
  const setTurns = useSchool((s) => s.setChatbot);
  const { busy, error, needsSignIn, ask, connect } = useTutor();
  const [pendingStudies, setPendingStudies] = useState<
    { date: string; title: string; notes?: string }[]
  >([]);
  const addEvent = useSchool((s) => s.addEvent);

  async function send(text: string) {
    const result = await ask({
      system: chatbotSystem(name, calendarContext(events)),
      history: turns,
      userText: text,
      setTurns,
    });
    if (result.studies.length) setPendingStudies(result.studies);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Chatbot
          </h1>
          <p className="text-muted mt-1 text-sm">
            Ask about school, studying, or your calendar. The only thing I will
            not do is give you the answer.
          </p>
        </div>
        {turns.length > 0 ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => setTurns([])}>
            Clear
          </Button>
        ) : null}
      </div>

      {needsSignIn ? (
        <div className="mb-3">
          <Button type="button" onClick={() => void connect()}>
            Connect Puter
          </Button>
        </div>
      ) : null}

      <div className="border-border bg-surface flex min-h-96 flex-1 flex-col rounded-xl border p-4 sm:p-5">
        <ChatThread
          turns={turns}
          streaming={busy}
          error={error}
          disabled={busy}
          onSend={(text) => void send(text)}
          placeholder="Ask SchoolBud anything except the answer"
          empty={
            <div className="flex flex-col gap-4 py-6">
              <p className="text-muted text-sm">
                I can explain ideas, quiz you, and schedule around your tests. I
                will not finish the worksheet for you.
              </p>
              <div className="flex flex-wrap gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="border-border hover:bg-elevated rounded-pill border px-3 py-2 text-left text-xs"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          }
          footer={
            pendingStudies.length > 0 ? (
              <div className="border-border bg-elevated mb-2 rounded-lg border p-3">
                <p className="mb-2 text-xs font-medium">
                  Add {pendingStudies.length} suggested study session
                  {pendingStudies.length === 1 ? "" : "s"}?
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      for (const s of pendingStudies) {
                        addEvent({
                          title: s.title,
                          type: "study",
                          date: s.date,
                          notes: s.notes,
                        });
                      }
                      setPendingStudies([]);
                    }}
                  >
                    Add to calendar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setPendingStudies([])}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            ) : null
          }
        />
      </div>
    </div>
  );
}

import { useCallback, useState } from "react";
import {
  looksLikeAuthError,
  parseStudyLines,
  signInPuter,
  streamChat,
  stripStudyLines,
  type ChatMessage,
} from "@/lib/puter";
import { uid } from "@/lib/utils";
import type { ChatTurn } from "@/lib/store";

export function useTutor() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsSignIn, setNeedsSignIn] = useState(false);

  const ask = useCallback(
    async (opts: {
      system: string;
      history: ChatTurn[];
      userText: string;
      media?: string | File;
      setTurns: (turns: ChatTurn[]) => void;
    }) => {
      const { system, history, userText, media, setTurns } = opts;
      setBusy(true);
      setError(null);

      const userTurn: ChatTurn = { id: uid(), role: "user", content: userText };
      const assistantTurn: ChatTurn = { id: uid(), role: "assistant", content: "" };
      const next = [...history, userTurn, assistantTurn];
      setTurns(next);

      const messages: ChatMessage[] = [
        { role: "system", content: system },
        ...[...history, userTurn].map((t) => ({
          role: t.role,
          content: t.content,
        })),
      ];

      try {
        const full = await streamChat({
          messages,
          media,
          onDelta: (chunk) => {
            assistantTurn.content += chunk;
            setTurns([...next.slice(0, -1), { ...assistantTurn }]);
          },
        });
        const cleaned = stripStudyLines(full) || full;
        assistantTurn.content = cleaned;
        setTurns([...next.slice(0, -1), { ...assistantTurn }]);
        return { text: full, studies: parseStudyLines(full) };
      } catch (err) {
        const auth = looksLikeAuthError(err);
        setNeedsSignIn(auth);
        const message = auth
          ? "Connect Puter to talk with SchoolBud. One tap — no API keys."
          : err instanceof Error
            ? err.message
            : "The tutor could not reply. Try again.";
        setError(message);
        setTurns(history);
        return { text: "", studies: [] };
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  const connect = useCallback(async () => {
    try {
      await signInPuter();
      setNeedsSignIn(false);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not open Puter sign-in. Allow popups and try again.",
      );
    }
  }, []);

  return { busy, error, needsSignIn, ask, connect, setError };
}

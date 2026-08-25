export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type PuterUser = {
  uuid?: string;
  username?: string;
  email?: string;
  [key: string]: unknown;
};

type PuterChatOpts = {
  model?: string;
  stream?: boolean;
};

type PuterAPI = {
  ai: {
    chat: (
      prompt: string | ChatMessage[],
      mediaOrOpts?: string | File | PuterChatOpts | boolean,
      maybeOpts?: PuterChatOpts | boolean,
      maybeOpts2?: PuterChatOpts,
    ) => Promise<unknown>;
  };
  auth?: {
    signIn: (options?: {
      attempt_temp_user_creation?: boolean;
      request_auth?: boolean;
    }) => Promise<unknown>;
    signOut?: () => Promise<void> | void;
    isSignedIn?: () => boolean;
    getUser?: () => Promise<PuterUser>;
  };
  kv?: {
    set: (key: string, value: unknown) => Promise<boolean>;
    get: (key: string) => Promise<unknown>;
    del?: (key: string) => Promise<boolean>;
  };
};

declare global {
  interface Window {
    puter?: PuterAPI;
  }
}

const SCRIPT_SRC = "https://js.puter.com/v2/";
const MODEL = "gpt-5.6-luna";

let loading: Promise<PuterAPI> | null = null;

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      if (window.puter) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Puter failed to load")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Puter failed to load"));
    document.head.appendChild(script);
  });
}

export async function ensurePuter(): Promise<PuterAPI> {
  if (typeof window === "undefined") {
    throw new Error("SchoolBud's tutor only runs in the browser.");
  }
  if (window.puter) return window.puter;
  if (!loading) {
    loading = (async () => {
      await loadScript();
      const started = Date.now();
      while (!window.puter && Date.now() - started < 8000) {
        await new Promise((r) => setTimeout(r, 50));
      }
      if (!window.puter) {
        loading = null;
        throw new Error("Puter did not start. Check your connection and try again.");
      }
      return window.puter;
    })();
  }
  return loading;
}

export function extractText(res: unknown): string {
  if (res == null) return "";
  if (typeof res === "string") return res;
  if (typeof res !== "object") return String(res);

  const rec = res as Record<string, unknown>;
  const message = rec.message as Record<string, unknown> | undefined;
  const content = message?.content ?? rec.content ?? rec.text;

  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object") {
          const p = part as Record<string, unknown>;
          if (typeof p.text === "string") return p.text;
          if (typeof p.content === "string") return p.content;
        }
        return "";
      })
      .join("");
  }
  if (typeof rec.toString === "function" && rec.toString !== Object.prototype.toString) {
    const s = String(res);
    if (s && s !== "[object Object]") return s;
  }
  return "";
}

function chunkText(part: unknown): string {
  if (part == null) return "";
  if (typeof part === "string") return part;
  if (typeof part !== "object") return "";
  const rec = part as Record<string, unknown>;
  if (typeof rec.text === "string") return rec.text;
  if (rec.type === "text" && typeof rec.text === "string") return rec.text;
  if (typeof rec.delta === "string") return rec.delta;
  const delta = rec.delta as Record<string, unknown> | undefined;
  if (delta && typeof delta.content === "string") return delta.content;
  return extractText(part);
}

async function consumeStream(resp: unknown, onDelta: (chunk: string) => void) {
  let full = "";
  if (resp && typeof resp === "object" && Symbol.asyncIterator in (resp as object)) {
    for await (const part of resp as AsyncIterable<unknown>) {
      const t = chunkText(part);
      if (t) {
        full += t;
        onDelta(t);
      }
    }
    if (full) return full;
  }
  full = extractText(resp);
  if (full) onDelta(full);
  return full;
}

export async function streamChat(options: {
  messages: ChatMessage[];
  media?: string | File;
  onDelta: (chunk: string) => void;
}): Promise<string> {
  const puter = await ensurePuter();
  const { messages, media, onDelta } = options;

  const tryCall = async (model?: string) => {
    const opts: PuterChatOpts = { stream: true };
    if (model) opts.model = model;

    if (media) {
      const system = messages.find((m) => m.role === "system")?.content ?? "";
      const lastUser =
        [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
      const prompt = system ? `${system}\n\n---\nStudent: ${lastUser}` : lastUser;
      return puter.ai.chat(prompt, media, opts);
    }
    return puter.ai.chat(messages, opts);
  };

  try {
    const resp = await tryCall(MODEL);
    const text = await consumeStream(resp, onDelta);
    if (text.trim()) return text;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/model|not found|unsupported/i.test(msg)) {
      const resp = await tryCall(undefined);
      const text = await consumeStream(resp, onDelta);
      if (text.trim()) return text;
    } else {
      throw err;
    }
  }

  const fallback = await puter.ai.chat(messages);
  const text = extractText(fallback);
  if (text) onDelta(text);
  return text;
}

export async function signInPuter() {
  const puter = await ensurePuter();
  if (!puter.auth?.signIn) {
    throw new Error("Puter sign-in is not available.");
  }
  await puter.auth.signIn();
}

export async function signOutPuter() {
  const puter = await ensurePuter();
  if (puter.auth?.signOut) {
    await puter.auth.signOut();
  }
}

export function isPuterSignedIn(): boolean {
  if (typeof window === "undefined" || !window.puter?.auth?.isSignedIn) {
    return false;
  }
  try {
    return !!window.puter.auth.isSignedIn();
  } catch {
    return false;
  }
}

export async function getPuterUser(): Promise<PuterUser | null> {
  const puter = await ensurePuter();
  if (!puter.auth?.getUser) return null;
  try {
    return await puter.auth.getUser();
  } catch {
    return null;
  }
}

export async function kvSet(key: string, value: unknown): Promise<boolean> {
  const puter = await ensurePuter();
  if (!puter.kv?.set) {
    throw new Error("Puter key-value store is not available.");
  }
  return puter.kv.set(key, value);
}

export async function kvGet<T = unknown>(key: string): Promise<T | null> {
  const puter = await ensurePuter();
  if (!puter.kv?.get) {
    throw new Error("Puter key-value store is not available.");
  }
  const value = await puter.kv.get(key);
  return (value as T) ?? null;
}

export function looksLikeAuthError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  return /sign\s*in|auth|login|not signed|permission|unauthorized/i.test(msg);
}

export function parseStudyLines(text: string) {
  const lines = text.split("\n");
  const found: { date: string; title: string; notes?: string }[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(
      /^STUDY\|(\d{4}-\d{2}-\d{2})\|([^|]+)(?:\|(.*))?$/i,
    );
    if (match) {
      found.push({
        date: match[1],
        title: match[2].trim(),
        notes: match[3]?.trim() || undefined,
      });
    }
  }
  return found;
}

export function stripStudyLines(text: string) {
  return text
    .split("\n")
    .filter((line) => !/^\s*STUDY\|\d{4}-\d{2}-\d{2}\|/i.test(line))
    .join("\n")
    .trim();
}

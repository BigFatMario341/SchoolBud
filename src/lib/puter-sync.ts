import {
  ensurePuter,
  isPuterSignedIn,
  kvGet,
  kvSet,
  type PuterUser,
} from "./puter";
import type { CalEvent, ChatTurn } from "./store";
import { useSchool } from "./store";

const KEYS = {
  name: "schoolbud:name",
  events: "schoolbud:events",
  chatbot: "schoolbud:chatbot",
  calendarChat: "schoolbud:calendarChat",
  homeworkChat: "schoolbud:homeworkChat",
} as const;

export type CloudSnapshot = {
  name: string;
  events: CalEvent[];
  chatbot: ChatTurn[];
  calendarChat: ChatTurn[];
  homeworkChat: ChatTurn[];
};

function snapshotFromStore(): CloudSnapshot {
  const s = useSchool.getState();
  return {
    name: s.name,
    events: s.events,
    chatbot: s.chatbot,
    calendarChat: s.calendarChat,
    homeworkChat: s.homeworkChat,
  };
}

/** Push current local SchoolBud data to this user's Puter KV. */
export async function pushSchoolBudToCloud(): Promise<void> {
  if (!isPuterSignedIn()) return;
  await ensurePuter();
  const data = snapshotFromStore();
  await Promise.all([
    kvSet(KEYS.name, data.name),
    kvSet(KEYS.events, data.events),
    kvSet(KEYS.chatbot, data.chatbot),
    kvSet(KEYS.calendarChat, data.calendarChat),
    kvSet(KEYS.homeworkChat, data.homeworkChat),
  ]);
}

/** Load cloud data into the local store (keeps local if cloud is empty). */
export async function pullSchoolBudFromCloud(): Promise<CloudSnapshot | null> {
  if (!isPuterSignedIn()) return null;
  await ensurePuter();

  const [name, events, chatbot, calendarChat, homeworkChat] = await Promise.all([
    kvGet<string>(KEYS.name),
    kvGet<CalEvent[]>(KEYS.events),
    kvGet<ChatTurn[]>(KEYS.chatbot),
    kvGet<ChatTurn[]>(KEYS.calendarChat),
    kvGet<ChatTurn[]>(KEYS.homeworkChat),
  ]);

  const local = snapshotFromStore();
  const cloudEmpty =
    !name &&
    (!events || events.length === 0) &&
    (!chatbot || chatbot.length === 0) &&
    (!calendarChat || calendarChat.length === 0) &&
    (!homeworkChat || homeworkChat.length === 0);

  // First sign-in: seed cloud from whatever is already on this device.
  if (cloudEmpty) {
    await pushSchoolBudToCloud();
    return local;
  }

  useSchool.setState({
    name: typeof name === "string" && name.trim() ? name.trim() : local.name,
    events: Array.isArray(events) ? events : local.events,
    chatbot: Array.isArray(chatbot) ? chatbot : local.chatbot,
    calendarChat: Array.isArray(calendarChat) ? calendarChat : local.calendarChat,
    homeworkChat: Array.isArray(homeworkChat) ? homeworkChat : local.homeworkChat,
  });

  return snapshotFromStore();
}

let syncTimer: ReturnType<typeof setTimeout> | null = null;

/** Debounced save so rapid calendar edits do not spam KV writes. */
export function scheduleCloudSave(delayMs = 600) {
  if (typeof window === "undefined") return;
  if (!isPuterSignedIn()) return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    void pushSchoolBudToCloud().catch(() => {
      /* non-fatal: localStorage still holds a copy */
    });
  }, delayMs);
}

export async function hydratePuterSession(): Promise<{
  signedIn: boolean;
  user: PuterUser | null;
}> {
  try {
    await ensurePuter();
    if (!isPuterSignedIn()) {
      return { signedIn: false, user: null };
    }
    const { getPuterUser } = await import("./puter");
    const user = await getPuterUser();
    await pullSchoolBudFromCloud();
    return { signedIn: true, user };
  } catch {
    return { signedIn: false, user: null };
  }
}

import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as uid, n as cn } from "./router-B-ko8w9D.mjs";
import { l as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[opacity,transform,background-color,color,box-shadow] duration-(--motion-quick) ease-(--ease-out) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:bg-primary-hover shadow-[0_8px_24px_-12px_rgba(124,107,255,0.8)]",
			ghost: "bg-transparent text-muted hover:text-fg hover:bg-elevated",
			outline: "border border-border bg-transparent text-fg hover:bg-elevated",
			cal: "bg-cal text-cal-fg hover:opacity-90",
			dark: "bg-elevated text-fg hover:bg-surface border border-border"
		},
		size: {
			default: "h-11 px-5 text-sm rounded-pill",
			sm: "h-9 px-3.5 text-sm rounded-pill",
			lg: "h-12 px-7 text-base rounded-pill",
			icon: "size-11 rounded-pill",
			pill: "h-12 px-8 text-sm rounded-pill"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
var EVENT_LABEL = {
	test: "Test",
	homework: "Due",
	project: "Project",
	study: "Study"
};
var useSchool = create()(persist((set, get) => ({
	name: "Ben",
	setName: (name) => set({ name: name.trim() || "Ben" }),
	events: [],
	addEvent: (event) => {
		const next = {
			...event,
			id: uid()
		};
		set({ events: [...get().events, next] });
		return next;
	},
	updateEvent: (id, patch) => set({ events: get().events.map((item) => item.id === id ? {
		...item,
		...patch
	} : item) }),
	removeEvent: (id) => set({ events: get().events.filter((item) => item.id !== id) }),
	chatbot: [],
	setChatbot: (chatbot) => set({ chatbot }),
	calendarChat: [],
	setCalendarChat: (calendarChat) => set({ calendarChat }),
	homeworkChat: [],
	setHomeworkChat: (homeworkChat) => set({ homeworkChat })
}), { name: "schoolbud-v1" }));
function upcomingEvents(events, limit = 12) {
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const todayIso = toIsoDate(today);
	return [...events].filter((event) => event.date >= todayIso).sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title)).slice(0, limit);
}
function eventsOnDate(events, iso) {
	return events.filter((event) => event.date === iso).sort((a, b) => (a.time || "").localeCompare(b.time || "") || a.title.localeCompare(b.title));
}
function toIsoDate(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function calendarContext(events) {
	if (events.length === 0) return "The student has not added any tests, due dates, or study sessions yet.";
	return `Here is the student's calendar (tests, due dates, projects, study sessions):\n${[...events].sort((a, b) => a.date.localeCompare(b.date)).map((event) => {
		const bits = [`${EVENT_LABEL[event.type]}: ${event.title}`, `on ${event.date}`];
		if (event.time) bits.push(`at ${event.time}`);
		if (event.notes) bits.push(`notes: ${event.notes}`);
		return `- ${bits.join(" ")}`;
	}).join("\n")}`;
}
//#endregion
export { toIsoDate as a, eventsOnDate as i, EVENT_LABEL as n, upcomingEvents as o, calendarContext as r, useSchool as s, Button as t };

import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as calendarContext, s as useSchool, t as Button } from "./store-CHY4C4dz.mjs";
import { a as useTutor, r as chatbotSystem, t as ChatThread } from "./prompts-0-uLY2fJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chatbot-CwrTaXsx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STARTERS = [
	"Explain fractions like I am three",
	"Help me plan study time this week",
	"Quiz me — don't give the answers",
	"What should I study first?"
];
function ChatbotPage() {
	const name = useSchool((s) => s.name);
	const events = useSchool((s) => s.events);
	const turns = useSchool((s) => s.chatbot);
	const setTurns = useSchool((s) => s.setChatbot);
	const { busy, error, needsSignIn, ask, connect } = useTutor();
	const [pendingStudies, setPendingStudies] = (0, import_react.useState)([]);
	const addEvent = useSchool((s) => s.addEvent);
	async function send(text) {
		const result = await ask({
			system: chatbotSystem(name, calendarContext(events)),
			history: turns,
			userText: text,
			setTurns
		});
		if (result.studies.length) setPendingStudies(result.studies);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-2xl flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold tracking-tight",
					children: "Chatbot"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mt-1 text-sm",
					children: "Ask about school, studying, or your calendar. The only thing I will not do is give you the answer."
				})] }), turns.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					onClick: () => setTurns([]),
					children: "Clear"
				}) : null]
			}),
			needsSignIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: () => void connect(),
					children: "Connect Puter"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-border bg-surface flex min-h-96 flex-1 flex-col rounded-xl border p-4 sm:p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatThread, {
					turns,
					streaming: busy,
					error,
					disabled: busy,
					onSend: (text) => void send(text),
					placeholder: "Ask SchoolBud anything except the answer",
					empty: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 py-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted text-sm",
							children: "I can explain ideas, quiz you, and schedule around your tests. I will not finish the worksheet for you."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: STARTERS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void send(s),
								className: "border-border hover:bg-elevated rounded-pill border px-3 py-2 text-left text-xs",
								children: s
							}, s))
						})]
					}),
					footer: pendingStudies.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-border bg-elevated mb-2 rounded-lg border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-2 text-xs font-medium",
							children: [
								"Add ",
								pendingStudies.length,
								" suggested study session",
								pendingStudies.length === 1 ? "" : "s",
								"?"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								onClick: () => {
									for (const s of pendingStudies) addEvent({
										title: s.title,
										type: "study",
										date: s.date,
										notes: s.notes
									});
									setPendingStudies([]);
								},
								children: "Add to calendar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "ghost",
								onClick: () => setPendingStudies([]),
								children: "Dismiss"
							})]
						})]
					}) : null
				})
			})
		]
	});
}
//#endregion
export { ChatbotPage as component };

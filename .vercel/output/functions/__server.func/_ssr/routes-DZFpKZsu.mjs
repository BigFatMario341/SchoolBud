import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Pencil, g as BookOpen, h as CalendarDays, l as MessageCircle } from "../_libs/lucide-react.mjs";
import { r as formatPrettyDate } from "./router-B-ko8w9D.mjs";
import { n as EVENT_LABEL, o as upcomingEvents, s as useSchool, t as Button } from "./store-CHY4C4dz.mjs";
import { a as DialogHeader, i as DialogDescription, n as Dialog, o as DialogTitle, r as DialogContent, s as Input, t as Badge } from "./dialog-BuW0n4Gy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DZFpKZsu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const name = useSchool((s) => s.name);
	const setName = useSchool((s) => s.setName);
	const events = useSchool((s) => s.events);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(name);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const upcoming = upcomingEvents(events, 3);
	(0, import_react.useEffect)(() => {
		setDraft(name);
	}, [name]);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col items-center justify-center py-6 sm:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stagger-in flex w-full max-w-xl flex-col items-center text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted mb-3 text-xs tracking-widest uppercase",
						children: "Your study buddy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl",
						suppressHydrationWarning: true,
						children: ["Welcome Back, ", name]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setEditing(true),
						className: "text-muted hover:text-fg mt-3 inline-flex items-center gap-1.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" }),
							"Not ",
							name,
							"? Change name"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "pill",
								className: "w-full sm:w-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/homework",
									children: "Homework Helper"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "pill",
								className: "w-full sm:w-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/calendar",
									children: "Calendar"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "pill",
								className: "w-full sm:w-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/chatbot",
									children: "Chatbot"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted mt-8 max-w-md text-sm leading-relaxed",
						children: "SchoolBud will not hand you answers. It explains the idea in tiny steps — then helps you plan around tests and due dates."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-14 grid w-full max-w-4xl gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
						icon: BookOpen,
						title: "Homework Helper",
						body: "Point the camera at a problem. SchoolBud teaches the method like you are three — and never blurts the answer."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
						icon: CalendarDays,
						title: "Calendar",
						body: "Drop in tests and due dates. The tutor reads them and builds study times that actually fit."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
						icon: MessageCircle,
						title: "Chatbot",
						body: "Ask anything about school. The only thing it will not do is give you the answer to copy."
					})
				]
			}),
			mounted && upcoming.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-border bg-surface mt-10 w-full max-w-4xl rounded-xl border p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mb-3 text-sm font-semibold tracking-tight",
					children: "Coming up"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: upcoming.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex min-w-0 items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: event.type,
								children: EVENT_LABEL[event.type]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: event.title
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted shrink-0 tabular-nums",
							children: formatPrettyDate(event.date)
						})]
					}, event.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editing,
				onOpenChange: setEditing,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "What should we call you?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "SchoolBud uses this name in greetings. It stays on this device." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: (e) => {
						e.preventDefault();
						setName(draft);
						setEditing(false);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						maxLength: 24,
						autoFocus: true,
						"aria-label": "Your name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: "Save"
					})]
				})] })
			})
		]
	});
}
function Feature({ icon: Icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-border bg-surface rounded-xl border p-5 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "text-primary mb-3 size-5" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mb-1.5 font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted text-sm leading-relaxed",
				children: body
			})
		]
	});
}
//#endregion
export { Home as component };

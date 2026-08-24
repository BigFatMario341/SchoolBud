import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { f as ChevronRight, i as Trash2, p as ChevronLeft, s as Plus } from "../_libs/lucide-react.mjs";
import { n as cn, r as formatPrettyDate } from "./router-B-ko8w9D.mjs";
import { a as toIsoDate, i as eventsOnDate, n as EVENT_LABEL, o as upcomingEvents, r as calendarContext, s as useSchool, t as Button } from "./store-CHY4C4dz.mjs";
import { a as DialogHeader, i as DialogDescription, n as Dialog, o as DialogTitle, r as DialogContent, s as Input, t as Badge } from "./dialog-BuW0n4Gy.mjs";
import { a as useTutor, n as calendarSystem, t as ChatThread } from "./prompts-0-uLY2fJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-6xn05icW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		"data-slot": "textarea",
		className: cn("min-h-24 w-full rounded-lg border border-border bg-elevated px-4 py-3 text-sm text-fg", "placeholder:text-subtle", "transition-[border-color,box-shadow] duration-(--motion-quick) ease-(--ease-out)", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/40", "disabled:opacity-50", className),
		...props
	});
}
var WEEKDAYS = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
function CalendarPage() {
	const name = useSchool((s) => s.name);
	const events = useSchool((s) => s.events);
	const addEvent = useSchool((s) => s.addEvent);
	const removeEvent = useSchool((s) => s.removeEvent);
	const turns = useSchool((s) => s.calendarChat);
	const setTurns = useSchool((s) => s.setCalendarChat);
	const { busy, error, needsSignIn, ask, connect } = useTutor();
	const today = (0, import_react.useMemo)(() => /* @__PURE__ */ new Date(), []);
	const [cursor, setCursor] = (0, import_react.useState)(() => new Date(today.getFullYear(), today.getMonth(), 1));
	const [selected, setSelected] = (0, import_react.useState)(toIsoDate(today));
	const [open, setOpen] = (0, import_react.useState)(false);
	const [pendingStudies, setPendingStudies] = (0, import_react.useState)([]);
	const year = cursor.getFullYear();
	const month = cursor.getMonth();
	const monthName = cursor.toLocaleString(void 0, { month: "long" });
	const cells = (0, import_react.useMemo)(() => buildCells(year, month), [year, month]);
	const dayEvents = eventsOnDate(events, selected);
	const upcoming = upcomingEvents(events, 8);
	async function send(text) {
		const result = await ask({
			system: calendarSystem(name, calendarContext(events)),
			history: turns,
			userText: text,
			setTurns
		});
		if (result.studies.length) setPendingStudies(result.studies);
	}
	function addStudies() {
		for (const study of pendingStudies) addEvent({
			title: study.title,
			type: "study",
			date: study.date,
			notes: study.notes
		});
		setPendingStudies([]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid flex-1 gap-5 lg:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.4fr)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "bg-chat-paper text-chat-ink order-2 flex min-h-96 flex-col rounded-xl p-4 sm:p-5 lg:order-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-xl font-semibold",
							children: "Chatbot"
						}), turns.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-xs text-black/50 hover:text-black",
							onClick: () => setTurns([]),
							children: "Clear"
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-xs leading-relaxed text-black/55",
						children: "I can see your tests and due dates. Ask me to schedule study time. I still will not give homework answers."
					}),
					needsSignIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						className: "mb-3",
						onClick: () => void connect(),
						children: "Connect Puter"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatThread, {
						paper: true,
						turns,
						streaming: busy,
						error,
						disabled: busy,
						onSend: (text) => void send(text),
						placeholder: "Plan my week around the science test",
						empty: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-1 py-6 text-sm text-black/50",
							children: "Add a test or due date on the calendar, then ask me to build study sessions."
						}),
						footer: pendingStudies.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-black/10 mb-2 rounded-lg border bg-white p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mb-2 text-xs font-medium",
									children: [
										pendingStudies.length,
										" study session",
										pendingStudies.length === 1 ? "" : "s",
										" suggested"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mb-3 space-y-1 text-xs",
									children: pendingStudies.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										formatPrettyDate(s.date),
										" — ",
										s.title
									] }, `${s.date}-${i}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										onClick: addStudies,
										children: "Add to calendar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										variant: "ghost",
										className: "text-chat-ink",
										onClick: () => setPendingStudies([]),
										children: "Dismiss"
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex flex-wrap gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quick, {
								onClick: () => void send("Look at my calendar and suggest study times for the next 7 days. Work backwards from tests."),
								children: "Plan my week"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quick, {
								onClick: () => void send("What should I study first, based on what is due soonest?"),
								children: "What is due soon?"
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "order-1 flex min-w-0 flex-col gap-4 lg:order-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-xl border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-cal text-cal-fg flex items-center justify-between px-3 py-3 sm:px-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded-md p-2 hover:bg-white/10",
									onClick: () => setCursor(new Date(year, month - 1, 1)),
									"aria-label": "Previous month",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-display text-xl font-semibold tracking-tight sm:text-2xl",
									children: [
										monthName,
										" ",
										year
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded-md p-2 hover:bg-white/10",
									onClick: () => setCursor(new Date(year, month + 1, 1)),
									"aria-label": "Next month",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-bg grid grid-cols-7 border-t border-border",
							children: [WEEKDAYS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted border-border border-b py-2 text-center text-xs font-medium tracking-wide uppercase",
								children: d
							}, d)), cells.map((cell, i) => {
								if (!cell) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-border min-h-16 border-b border-r bg-bg sm:min-h-20" }, `pad-${i}`);
								const iso = toIsoDate(cell);
								const isToday = iso === toIsoDate(today);
								const isSelected = iso === selected;
								const marks = eventsOnDate(events, iso);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSelected(iso),
									className: cn("border-border min-h-16 border-b border-r p-1.5 text-left sm:min-h-20", isSelected ? "bg-elevated" : "bg-bg hover:bg-surface"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("inline-flex size-6 items-center justify-center rounded-full text-xs tabular-nums", isToday && "bg-cal text-cal-fg", isSelected && !isToday && "bg-primary text-primary-fg"),
										children: cell.getDate()
									}), marks[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 hidden truncate text-xs leading-tight text-muted sm:block",
										children: marks[0].title
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 flex flex-wrap gap-0.5 sm:hidden",
										children: marks.slice(0, 3).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("block h-1.5 w-1.5 rounded-full", m.type === "test" && "bg-cal", m.type === "homework" && "bg-primary", m.type === "project" && "bg-fg", m.type === "study" && "bg-muted") }, m.id))
									})]
								}, iso);
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-border bg-surface rounded-xl border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display font-semibold",
								children: formatPrettyDate(selected)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								onClick: () => setOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add"]
							})]
						}), dayEvents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted text-sm",
							children: "Nothing on this day. Add a test, due date, or project so the chatbot can plan around it."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: dayEvents.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventRow, {
								event,
								onRemove: () => removeEvent(event.id)
							}, event.id))
						})]
					}),
					upcoming.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-border rounded-xl border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display mb-3 text-sm font-semibold",
							children: "Upcoming"
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
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddEventDialog, {
				open,
				onOpenChange: setOpen,
				defaultDate: selected,
				onSave: (event) => {
					addEvent(event);
					setSelected(event.date);
				}
			})
		]
	});
}
function EventRow({ event, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-start justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: event.type,
						children: EVENT_LABEL[event.type]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: event.title
					}),
					event.time ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted text-xs tabular-nums",
						children: event.time
					}) : null
				]
			}), event.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted mt-1 text-xs",
				children: event.notes
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onRemove,
			className: "text-muted hover:text-cal rounded-md p-2",
			"aria-label": `Remove ${event.title}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
		})]
	});
}
function Quick({ children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: "rounded-pill border border-black/10 bg-white px-3 py-1.5 text-xs text-black/70 hover:bg-black/5",
		children
	});
}
function AddEventDialog({ open, onOpenChange, defaultDate, onSave }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("test");
	const [date, setDate] = (0, import_react.useState)(defaultDate);
	const [time, setTime] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setTitle("");
		setType("test");
		setDate(defaultDate);
		setTime("");
		setNotes("");
	}, [open, defaultDate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add to calendar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Tests and due dates are what the chatbot uses to schedule study time." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: (e) => {
				e.preventDefault();
				if (!title.trim()) return;
				onSave({
					title: title.trim(),
					type,
					date,
					time: time || void 0,
					notes: notes.trim() || void 0
				});
				onOpenChange(false);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted mb-1 block text-xs",
						children: "Title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Chapter 4 test",
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted mb-1 block text-xs",
							children: "Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: type,
							onChange: (e) => setType(e.target.value),
							className: "border-border bg-elevated text-fg h-11 w-full rounded-pill border px-3 text-sm scheme-dark",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "test",
									children: "Test"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "homework",
									children: "Homework due"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "project",
									children: "Project"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "study",
									children: "Study session"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted mb-1 block text-xs",
							children: "Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value),
							required: true
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted mb-1 block text-xs",
						children: "Time (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "time",
						value: time,
						onChange: (e) => setTime(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted mb-1 block text-xs",
						children: "Notes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						placeholder: "Chapters 3–4, bring a calculator",
						rows: 3
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					children: "Save"
				})
			]
		})] })
	});
}
function buildCells(year, month) {
	const startPad = new Date(year, month, 1).getDay();
	const days = new Date(year, month + 1, 0).getDate();
	const cells = [];
	for (let i = 0; i < startPad; i++) cells.push(null);
	for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
	while (cells.length % 7 !== 0) cells.push(null);
	return cells;
}
//#endregion
export { CalendarPage as component };

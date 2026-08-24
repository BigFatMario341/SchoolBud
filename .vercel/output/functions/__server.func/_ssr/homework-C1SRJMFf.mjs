import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { m as Camera, n as Upload, o as RefreshCw, u as ImagePlus } from "../_libs/lucide-react.mjs";
import { n as cn } from "./router-B-ko8w9D.mjs";
import { s as useSchool, t as Button } from "./store-CHY4C4dz.mjs";
import { a as useTutor, i as homeworkSystem, t as ChatThread } from "./prompts-0-uLY2fJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/homework-C1SRJMFf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HomeworkPage() {
	const name = useSchool((s) => s.name);
	const turns = useSchool((s) => s.homeworkChat);
	const setTurns = useSchool((s) => s.setHomeworkChat);
	const { busy, error, needsSignIn, ask, connect } = useTutor();
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const [camOn, setCamOn] = (0, import_react.useState)(false);
	const [camError, setCamError] = (0, import_react.useState)(null);
	const [snapshot, setSnapshot] = (0, import_react.useState)(null);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		return () => {
			streamRef.current?.getTracks().forEach((t) => t.stop());
		};
	}, []);
	async function startCamera() {
		setCamError(null);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: { ideal: "environment" },
					width: { ideal: 1280 }
				},
				audio: false
			});
			streamRef.current = stream;
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				await videoRef.current.play();
			}
			setCamOn(true);
			setSnapshot(null);
		} catch {
			setCamError("Camera is blocked in this window. Upload a photo of the page instead.");
		}
	}
	function stopCamera() {
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
		if (videoRef.current) videoRef.current.srcObject = null;
		setCamOn(false);
	}
	function captureFrame() {
		const video = videoRef.current;
		if (!video || !video.videoWidth) return;
		const canvas = document.createElement("canvas");
		const scale = Math.min(1, 1280 / Math.max(video.videoWidth, video.videoHeight));
		canvas.width = Math.round(video.videoWidth * scale);
		canvas.height = Math.round(video.videoHeight * scale);
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		setSnapshot(canvas.toDataURL("image/jpeg", .82));
	}
	function onFile(file) {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") setSnapshot(reader.result);
		};
		reader.readAsDataURL(file);
	}
	async function respond(text) {
		const spoken = (text ?? prompt).trim() || (snapshot ? "Please look at my homework photo. Teach me the idea. Do not give the answer." : "I need help with homework. Teach me, do not give the answer.");
		setPrompt("");
		await ask({
			system: homeworkSystem(name),
			history: turns,
			userText: spoken,
			media: snapshot ?? void 0,
			setTurns
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold tracking-tight",
					children: "Homework Helper"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted mt-1 max-w-lg text-sm leading-relaxed",
					children: "Show a problem. SchoolBud explains it like you are three — and will not tell you the answer."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-border bg-surface relative mt-5 overflow-hidden rounded-xl border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-camera relative h-52 w-full sm:h-auto sm:aspect-video",
						children: [
							snapshot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: snapshot,
								alt: "Captured homework",
								className: "h-full w-full object-contain"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								ref: videoRef,
								playsInline: true,
								muted: true,
								className: cn("h-full w-full object-cover", camOn ? "opacity-100" : "opacity-0")
							}),
							!camOn && !snapshot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraMark, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-fg/90 text-sm font-medium",
										children: "Live camera feed would be here"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted max-w-xs text-xs leading-relaxed",
										children: "Point it at a worksheet, or upload a photo if the camera is not available."
									})
								]
							}) : null,
							camOn && !snapshot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: captureFrame,
								className: "border-fg/80 absolute top-1/2 right-4 size-12 -translate-y-1/2 rounded-full border-4 bg-white/90 shadow-lg",
								"aria-label": "Capture photo"
							}) : null
						]
					})
				}),
				camError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-cal mt-2 text-sm",
					role: "alert",
					children: camError
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [
						!camOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							onClick: startCamera,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), "Start camera"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: stopCamera,
							children: "Stop camera"
						}),
						snapshot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => {
								setSnapshot(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "Retake"]
						}) : camOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: captureFrame,
							children: "Capture"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "sr-only",
										onChange: (e) => {
											onFile(e.target.files?.[0]);
											e.target.value = "";
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
									"Upload photo"
								]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 flex flex-col gap-3 sm:flex-row",
					onSubmit: (e) => {
						e.preventDefault();
						respond();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: prompt,
						onChange: (e) => setPrompt(e.target.value),
						placeholder: "What are you stuck on?",
						className: "border-border bg-elevated focus-visible:ring-primary/50 h-12 flex-1 rounded-pill border px-4 text-sm focus-visible:ring-2 focus-visible:outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "pill",
						disabled: busy,
						className: "sm:min-w-40",
						children: busy ? "Teaching…" : "Response"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "border-border bg-surface flex min-h-96 flex-col rounded-xl border p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display font-semibold",
						children: "Tutor"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted text-xs",
						children: "Explains. Never answers."
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatThread, {
					turns,
					streaming: busy,
					error,
					disabled: busy,
					onSend: (text) => void respond(text),
					placeholder: "Ask a follow-up — not for the answer",
					empty: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-muted flex h-full flex-col items-center justify-center gap-2 px-4 py-10 text-center text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-8 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Capture or upload a problem, then tap Response. SchoolBud will walk you through the idea in tiny steps." })]
					})
				})
			]
		})]
	});
}
function CameraMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 88 64",
		className: "h-16 w-20 text-fg/80",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "8",
				y: "16",
				width: "72",
				height: "42",
				rx: "8",
				fill: "currentColor",
				opacity: "0.18"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "8",
				y: "16",
				width: "72",
				height: "42",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: "8",
				width: "18",
				height: "10",
				rx: "3",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "44",
				cy: "37",
				r: "12",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "44",
				cy: "37",
				r: "5",
				fill: "currentColor"
			})
		]
	});
}
//#endregion
export { HomeworkPage as component };

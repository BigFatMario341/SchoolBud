import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, ImagePlus, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatThread } from "@/components/chat-thread";
import { useTutor } from "@/components/use-tutor";
import { homeworkSystem } from "@/lib/prompts";
import { useSchool } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/homework")({ component: HomeworkPage });

function HomeworkPage() {
  const name = useSchool((s) => s.name);
  const turns = useSchool((s) => s.homeworkChat);
  const setTurns = useSchool((s) => s.setHomeworkChat);
  const { busy, error, needsSignIn, ask, connect } = useTutor();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camOn, setCamOn] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function startCamera() {
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamOn(true);
      setSnapshot(null);
    } catch {
      setCamError(
        "Camera is blocked in this window. Upload a photo of the page instead.",
      );
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
    const max = 1280;
    const scale = Math.min(1, max / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setSnapshot(canvas.toDataURL("image/jpeg", 0.82));
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setSnapshot(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function respond(text?: string) {
    const spoken =
      (text ?? prompt).trim() ||
      (snapshot
        ? "Please look at my homework photo. Teach me the idea. Do not give the answer."
        : "I need help with homework. Teach me, do not give the answer.");
    setPrompt("");
    await ask({
      system: homeworkSystem(name),
      history: turns,
      userText: spoken,
      media: snapshot ?? undefined,
      setTurns,
    });
  }

  return (
    <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <section className="flex flex-col">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Homework Helper
        </h1>
        <p className="text-muted mt-1 max-w-lg text-sm leading-relaxed">
          Show a problem. SchoolBud explains it like you are three — and will
          not tell you the answer.
        </p>

        <div className="border-border bg-surface relative mt-5 overflow-hidden rounded-xl border">
          <div className="bg-camera relative h-52 w-full sm:h-auto sm:aspect-video">
            {snapshot ? (
              <img
                src={snapshot}
                alt="Captured homework"
                className="h-full w-full object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                playsInline
                muted
                className={cn(
                  "h-full w-full object-cover",
                  camOn ? "opacity-100" : "opacity-0",
                )}
              />
            )}

            {!camOn && !snapshot ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <CameraMark />
                <p className="text-fg/90 text-sm font-medium">
                  Live camera feed would be here
                </p>
                <p className="text-muted max-w-xs text-xs leading-relaxed">
                  Point it at a worksheet, or upload a photo if the camera is
                  not available.
                </p>
              </div>
            ) : null}

            {camOn && !snapshot ? (
              <button
                type="button"
                onClick={captureFrame}
                className="border-fg/80 absolute top-1/2 right-4 size-12 -translate-y-1/2 rounded-full border-4 bg-white/90 shadow-lg"
                aria-label="Capture photo"
              />
            ) : null}
          </div>
        </div>

        {camError ? (
          <p className="text-cal mt-2 text-sm" role="alert">
            {camError}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {!camOn ? (
            <Button type="button" variant="outline" onClick={startCamera}>
              <Camera className="size-4" />
              Start camera
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={stopCamera}>
              Stop camera
            </Button>
          )}
          {snapshot ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSnapshot(null);
              }}
            >
              <RefreshCw className="size-4" />
              Retake
            </Button>
          ) : camOn ? (
            <Button type="button" variant="outline" onClick={captureFrame}>
              Capture
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  onFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              <Upload className="size-4" />
              Upload photo
            </label>
          </Button>
        </div>

        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void respond();
          }}
        >
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What are you stuck on?"
            className="border-border bg-elevated focus-visible:ring-primary/50 h-12 flex-1 rounded-pill border px-4 text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
          <Button type="submit" size="pill" disabled={busy} className="sm:min-w-40">
            {busy ? "Teaching…" : "Response"}
          </Button>
        </form>
      </section>

      <section className="border-border bg-surface flex min-h-96 flex-col rounded-xl border p-4 sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display font-semibold">Tutor</h2>
            <p className="text-muted text-xs">Explains. Never answers.</p>
          </div>
          {turns.length > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setTurns([])}
            >
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

        <ChatThread
          turns={turns}
          streaming={busy}
          error={error}
          disabled={busy}
          onSend={(text) => void respond(text)}
          placeholder="Ask a follow-up — not for the answer"
          empty={
            <div className="text-muted flex h-full flex-col items-center justify-center gap-2 px-4 py-10 text-center text-sm">
              <ImagePlus className="size-8 opacity-50" />
              <p>
                Capture or upload a problem, then tap Response. SchoolBud will
                walk you through the idea in tiny steps.
              </p>
            </div>
          }
        />
      </section>
    </div>
  );
}

function CameraMark() {
  return (
    <svg
      viewBox="0 0 88 64"
      className="h-16 w-20 text-fg/80"
      aria-hidden="true"
    >
      <rect
        x="8"
        y="16"
        width="72"
        height="42"
        rx="8"
        fill="currentColor"
        opacity="0.18"
      />
      <rect
        x="8"
        y="16"
        width="72"
        height="42"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect x="28" y="8" width="18" height="10" rx="3" fill="currentColor" />
      <circle cx="44" cy="37" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="44" cy="37" r="5" fill="currentColor" />
    </svg>
  );
}

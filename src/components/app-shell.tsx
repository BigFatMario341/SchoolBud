import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, CalendarDays, House, LogIn, LogOut, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  getPuterUser,
  isPuterSignedIn,
  signInPuter,
  signOutPuter,
  type PuterUser,
} from "@/lib/puter";
import { hydratePuterSession, pushSchoolBudToCloud } from "@/lib/puter-sync";

const NAV = [
  { to: "/homework", label: "Homework Helper", icon: BookOpen },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/chatbot", label: "Chatbot", icon: MessageCircle },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<PuterUser | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const session = await hydratePuterSession();
      if (cancelled) return;
      setSignedIn(session.signedIn);
      setUser(session.user);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSignIn() {
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signInPuter();
      const session = await hydratePuterSession();
      setSignedIn(session.signedIn || isPuterSignedIn());
      setUser(session.user ?? (await getPuterUser()));
      if (isPuterSignedIn()) {
        await pushSchoolBudToCloud();
      }
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : "Could not sign in. Allow popups and try again.",
      );
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSignOut() {
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signOutPuter();
      setSignedIn(false);
      setUser(null);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Sign out failed.");
    } finally {
      setAuthBusy(false);
    }
  }

  const label =
    user?.username ||
    (typeof user?.email === "string" ? user.email.split("@")[0] : null) ||
    "Account";

  return (
    <div className="bg-bg text-fg flex min-h-dvh flex-col">
      <header className="border-border/80 sticky top-0 z-40 border-b bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <Link
            to="/"
            className="font-display shrink-0 text-lg font-semibold tracking-tight"
          >
            SchoolBud
          </Link>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <nav className="hidden items-center gap-1 sm:flex">
              {NAV.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "rounded-pill px-3.5 py-2 text-sm transition-colors duration-(--motion-quick) ease-(--ease-out)",
                      active ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {signedIn ? (
              <div className="flex items-center gap-2">
                <span
                  className="text-muted hidden max-w-28 truncate text-xs sm:inline"
                  title={label}
                >
                  {label}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={authBusy}
                  onClick={() => void handleSignOut()}
                >
                  <LogOut className="size-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={authBusy}
                onClick={() => void handleSignIn()}
              >
                <LogIn className="size-3.5" />
                {authBusy ? "\u2026" : "Sign in"}
              </Button>
            )}
          </div>
        </div>
        {authError ? (
          <p className="text-cal px-4 pb-2 text-center text-xs sm:px-6" role="alert">
            {authError}
          </p>
        ) : null}
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-5 sm:px-6 sm:py-8">
        {children}
      </main>

      <nav className="border-border bg-bg/95 sticky bottom-0 z-40 border-t backdrop-blur-md sm:hidden">
        <div className="grid grid-cols-4 px-1 pb-[env(safe-area-inset-bottom)]">
          <TabLink to="/" label="Home" icon={House} active={pathname === "/"} />
          {NAV.map((item) => (
            <TabLink
              key={item.to}
              to={item.to}
              label={item.label.split(" ")[0]}
              icon={item.icon}
              active={pathname === item.to}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}

function TabLink({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof House;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex min-h-12 flex-col items-center justify-center gap-0.5 py-2 text-xs",
        active ? "text-primary" : "text-muted",
      )}
    >
      <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
      {label}
    </Link>
  );
}

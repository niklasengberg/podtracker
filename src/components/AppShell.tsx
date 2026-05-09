import { Link, useLocation } from "@tanstack/react-router";
import { Home, PlusCircle, History, Settings as SettingsIcon } from "lucide-react";
import { useAppData } from "@/lib/useAppData";
import { t } from "@/lib/i18n";
import { OnboardingDialog } from "./OnboardingDialog";

export function AppShell({ children }: { children: React.ReactNode }) {
  const data = useAppData();
  const lang = data.settings.language;
  const loc = useLocation();

  const tabs = [
    { to: "/", icon: Home, label: t(lang, "home") },
    { to: "/log", icon: PlusCircle, label: t(lang, "log") },
    { to: "/history", icon: History, label: t(lang, "history") },
    { to: "/settings", icon: SettingsIcon, label: t(lang, "settings") },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-3">
        <h1 className="text-lg font-semibold tracking-tight">
          <span className="text-primary">Pod</span>Tracker
        </h1>
      </header>
      <main className="flex-1 px-5 pb-28">{children}</main>
      <nav
        className="fixed bottom-0 inset-x-0 border-t border-border bg-card/90 backdrop-blur"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)" }}
      >
        <ul className="grid grid-cols-4 max-w-md mx-auto">
          {tabs.map((tab) => {
            const active =
              tab.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(tab.to);
            const Icon = tab.icon;
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={`flex flex-col items-center justify-center gap-1 py-2.5 text-xs ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="size-5" />
                  <span>{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {!data.settings.onboardingDone && <OnboardingDialog lang={lang} />}
    </div>
  );
}

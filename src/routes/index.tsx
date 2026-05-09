import { createFileRoute, Link } from "@tanstack/react-router";
import { useAppData } from "@/lib/useAppData";
import { AppShell } from "@/components/AppShell";
import { BodyMap } from "@/components/BodyMap";
import { t, zoneLabel } from "@/lib/i18n";
import { suggestNext, daysSince, hoursSince } from "@/lib/suggest";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "PodTracker — Insulinpump-tracker" },
      {
        name: "description",
        content:
          "Håll koll på var du senast placerade din insulinpump och få förslag på nästa plats.",
      },
    ],
  }),
});

function Home() {
  const data = useAppData();
  const lang = data.settings.language;
  const current = data.placements[0];
  const intervalH = data.settings.intervalDays * 24;
  const elapsedH = current ? hoursSince(current.startedAt) : 0;
  const remainingH = current ? intervalH - elapsedH : 0;
  const overdue = remainingH < 0;

  const suggestions = suggestNext(data.placements, data.settings).slice(0, 3);
  const highlights: Record<string, "current" | "suggest"> = {};
  if (current) highlights[`${current.zone}-${current.side}`] = "current";
  for (const s of suggestions) {
    const k = `${s.zone}-${s.side}`;
    if (!highlights[k]) highlights[k] = "suggest";
  }

  return (
    <AppShell>
      <Card className="border-0 bg-gradient-to-br from-primary/10 to-accent shadow-sm">
        <CardContent className="p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            {t(lang, "currentPlacement")}
          </div>
          {current ? (
            <>
              <div className="mt-1 text-2xl font-semibold">
                {zoneLabel(lang, current.zone)} ·{" "}
                <span className="text-muted-foreground font-normal">
                  {t(lang, current.side)}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <Clock className="size-4 text-primary" />
                {overdue ? (
                  <span className="font-medium text-destructive">
                    {t(lang, "overdue")} {Math.abs(Math.ceil(remainingH / 24))}{" "}
                    {Math.abs(Math.ceil(remainingH / 24)) === 1
                      ? t(lang, "daysAgo")
                      : t(lang, "daysAgoPlural")}
                  </span>
                ) : remainingH < 24 ? (
                  <span className="font-medium">
                    {t(lang, "changeIn")} {Math.max(0, remainingH)}h
                  </span>
                ) : (
                  <span>
                    {t(lang, "changeIn")} {Math.ceil(remainingH / 24)}{" "}
                    {Math.ceil(remainingH / 24) === 1
                      ? t(lang, "daysAgo").replace(" sen", "").replace(" ago", "")
                      : t(lang, "daysAgoPlural").replace(" sen", "").replace(" ago", "")}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="mt-1 text-base text-muted-foreground">
              {t(lang, "noPlacementYet")}
            </div>
          )}
        </CardContent>
      </Card>

      <Link to="/log">
        <Button size="lg" className="mt-4 w-full">
          <Plus /> {t(lang, "logNew")}
        </Button>
      </Link>

      <div className="mt-6">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-sm font-medium">{t(lang, "suggestions")}</h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3">
          <BodyMap enabled={data.settings.enabledZones} highlights={highlights} />
        </div>
        <ul className="mt-3 space-y-2">
          {suggestions.map((s, i) => (
            <li
              key={`${s.zone}-${s.side}`}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
            >
              <div>
                <div className="font-medium">
                  {i === 0 && (
                    <span className="mr-2 inline-block size-2 rounded-full bg-[oklch(0.72_0.17_145)]" />
                  )}
                  {zoneLabel(lang, s.zone)} · {t(lang, s.side)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {s.daysSince === null
                    ? t(lang, "suggestionNever")
                    : `${t(lang, "suggestionReason")} ${s.daysSince} ${
                        s.daysSince === 1 ? t(lang, "daysAgo") : t(lang, "daysAgoPlural")
                      }`}
                </div>
              </div>
              {i === 0 && (
                <span className="text-xs font-medium text-primary">
                  {t(lang, "topSuggestion")}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}

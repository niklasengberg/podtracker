import { createFileRoute } from "@tanstack/react-router";
import { useAppData } from "@/lib/useAppData";
import { AppShell } from "@/components/AppShell";
import { BodyMap } from "@/components/BodyMap";
import { t, zoneLabel } from "@/lib/i18n";
import { deletePlacement } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ALL_ZONES } from "@/lib/zones";
import type { ZoneId, Side } from "@/lib/types";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({
    meta: [
      { title: "Historik — PodTracker" },
      { name: "description", content: "Se senaste placeringar och användningskarta." },
    ],
  }),
});

function HistoryPage() {
  const data = useAppData();
  const lang = data.settings.language;

  // Heatmap last 90 days
  const cutoff = Date.now() - 90 * 86_400_000;
  const counts: Record<string, number> = {};
  for (const p of data.placements) {
    if (new Date(p.startedAt).getTime() < cutoff) continue;
    const k = `${p.zone}-${p.side}`;
    counts[k] = (counts[k] ?? 0) + 1;
  }
  const max = Math.max(0, ...Object.values(counts));
  const highlights: Record<string, "heat-1" | "heat-2" | "heat-3"> = {};
  for (const z of ALL_ZONES) {
    for (const s of ["left", "right"] as Side[]) {
      const k = `${z}-${s}`;
      const c = counts[k] ?? 0;
      if (c === 0) continue;
      const r = c / max;
      highlights[k] = r > 0.66 ? "heat-3" : r > 0.33 ? "heat-2" : "heat-1";
    }
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(lang === "sv" ? "sv-SE" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <AppShell>
      <h2 className="mb-3 text-xl font-semibold">{t(lang, "history")}</h2>

      <div className="mb-4">
        <h3 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
          {t(lang, "heatmap")}
        </h3>
        <div className="rounded-2xl border border-border bg-card p-3">
          <BodyMap enabled={data.settings.enabledZones} highlights={highlights} />
        </div>
      </div>

      <h3 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        {t(lang, "recentChanges")}
      </h3>
      {data.placements.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          {t(lang, "noHistory")}
        </div>
      ) : (
        <ul className="space-y-2">
          {data.placements.map((p) => (
            <li
              key={p.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="min-w-0">
                <div className="font-medium">
                  {zoneLabel(lang, p.zone as ZoneId)} · {t(lang, p.side)}
                </div>
                <div className="text-xs text-muted-foreground">{fmt(p.startedAt)}</div>
                {p.note && (
                  <div className="mt-1 text-xs text-foreground/80 break-words">{p.note}</div>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                aria-label={t(lang, "delete")}
                onClick={() => deletePlacement(p.id)}
              >
                <Trash2 className="size-4 text-muted-foreground" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}

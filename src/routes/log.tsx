import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAppData } from "@/lib/useAppData";
import { AppShell } from "@/components/AppShell";
import { BodyMap } from "@/components/BodyMap";
import { t, zoneLabel } from "@/lib/i18n";
import { addPlacement } from "@/lib/storage";
import { suggestNext } from "@/lib/suggest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Side, ZoneId } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/log")({
  component: LogPage,
  head: () => ({
    meta: [
      { title: "Logga byte — PodTracker" },
      { name: "description", content: "Logga var du placerade din insulinpump." },
    ],
  }),
});

function LogPage() {
  const data = useAppData();
  const lang = data.settings.language;
  const navigate = useNavigate();

  const [zone, setZone] = useState<ZoneId | null>(null);
  const [side, setSide] = useState<Side | null>(null);
  const [when, setWhen] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [note, setNote] = useState("");

  const suggestions = suggestNext(data.placements, data.settings).slice(0, 3);
  const highlights: Record<string, "suggest"> = {};
  for (const s of suggestions) highlights[`${s.zone}-${s.side}`] = "suggest";

  const onSelect = (spot: { zone: ZoneId; side: Side }) => {
    setZone(spot.zone);
    setSide(spot.side);
  };

  const canSave = zone && side;

  const onSave = () => {
    if (!zone || !side) return;
    addPlacement({
      id: crypto.randomUUID(),
      zone,
      side,
      startedAt: new Date(when).toISOString(),
      note: note.trim() || undefined,
    });
    toast.success(t(lang, "saved"));
    navigate({ to: "/" });
  };

  const selectedHighlight: Record<string, "current"> = {};
  if (zone && side) selectedHighlight[`${zone}-${side}`] = "current";

  return (
    <AppShell>
      <h2 className="mb-3 text-xl font-semibold">{t(lang, "logNew")}</h2>

      <div className="rounded-2xl border border-border bg-card p-3">
        <BodyMap
          enabled={data.settings.enabledZones}
          highlights={{ ...highlights, ...selectedHighlight }}
          onSelect={onSelect}
          selected={zone && side ? { zone, side } : null}
        />
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <Label className="mb-2 block">{t(lang, "selectZone")}</Label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(data.settings.enabledZones) as ZoneId[])
              .filter(
                (z) =>
                  data.settings.enabledZones[z].left ||
                  data.settings.enabledZones[z].right,
              )
              .map((z) => (
                <Button
                  key={z}
                  type="button"
                  variant={zone === z ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setZone(z);
                    if (side) {
                      const en = data.settings.enabledZones[z];
                      if (!en[side]) setSide(en.left ? "left" : "right");
                    }
                  }}
                >
                  {zoneLabel(lang, z)}
                </Button>
              ))}
          </div>
        </div>

        {zone && (
          <div>
            <Label className="mb-2 block">{t(lang, "selectSide")}</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["left", "right"] as Side[]).map((s) => {
                const allowed = data.settings.enabledZones[zone][s];
                return (
                  <Button
                    key={s}
                    type="button"
                    variant={side === s ? "default" : "outline"}
                    disabled={!allowed}
                    onClick={() => setSide(s)}
                  >
                    {t(lang, s)}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="when" className="mb-2 block">
            {t(lang, "date")}
          </Label>
          <Input
            id="when"
            type="datetime-local"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="note" className="mb-2 block">
            {t(lang, "note")}
          </Label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => navigate({ to: "/" })}>
            {t(lang, "cancel")}
          </Button>
          <Button className="flex-1" disabled={!canSave} onClick={onSave}>
            {t(lang, "save")}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

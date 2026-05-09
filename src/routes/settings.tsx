import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { useAppData } from "@/lib/useAppData";
import { AppShell } from "@/components/AppShell";
import { t, zoneLabel } from "@/lib/i18n";
import {
  updateSettings,
  exportJson,
  importJson,
  clearAll,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_ZONES } from "@/lib/zones";
import type { Language, ZoneId } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Inställningar — PodTracker" },
      { name: "description", content: "Anpassa språk, intervall och tillåtna placeringar." },
    ],
  }),
});

function SettingsPage() {
  const data = useAppData();
  const lang = data.settings.language;
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleSide = (zone: ZoneId, side: "left" | "right") => {
    const next = { ...data.settings.enabledZones };
    next[zone] = { ...next[zone], [side]: !next[zone][side] };
    updateSettings({ enabledZones: next });
  };

  const onExport = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `podtracker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (file: File) => {
    const text = await file.text();
    const ok = importJson(text);
    toast[ok ? "success" : "error"](t(lang, ok ? "importOk" : "importFail"));
  };

  return (
    <AppShell>
      <h2 className="mb-4 text-xl font-semibold">{t(lang, "settings")}</h2>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>{t(lang, "language")}</Label>
          <Select
            value={lang}
            onValueChange={(v) => updateSettings({ language: v as Language })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sv">Svenska</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label>{t(lang, "intervalDays")}</Label>
          <Select
            value={String(data.settings.intervalDays)}
            onValueChange={(v) => updateSettings({ intervalDays: Number(v) })}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-1 text-sm font-medium">{t(lang, "enabledZones")}</div>
          <p className="mb-3 text-xs text-muted-foreground">
            {t(lang, "enabledZonesHint")}
          </p>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 text-xs uppercase tracking-wider text-muted-foreground">
              <span></span>
              <span className="w-14 text-center">{t(lang, "left")}</span>
              <span className="w-14 text-center">{t(lang, "right")}</span>
            </div>
            {ALL_ZONES.map((z) => {
              const en = data.settings.enabledZones[z];
              return (
                <div key={z} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                  <span className="text-sm">{zoneLabel(lang, z)}</span>
                  <div className="w-14 text-center">
                    <Checkbox
                      checked={en.left}
                      onCheckedChange={() => toggleSide(z, "left")}
                    />
                  </div>
                  <div className="w-14 text-center">
                    <Checkbox
                      checked={en.right}
                      onCheckedChange={() => toggleSide(z, "right")}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4">
          <div>
            <Label>{t(lang, "notifications")}</Label>
            <p className="text-xs text-muted-foreground">{t(lang, "notificationsHint")}</p>
          </div>
          <Switch
            checked={data.settings.notificationsEnabled}
            onCheckedChange={(v) => updateSettings({ notificationsEnabled: v })}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onExport}>
            {t(lang, "exportData")}
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            {t(lang, "importData")}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
              e.target.value = "";
            }}
          />
        </div>

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            if (confirm(t(lang, "clearConfirm"))) clearAll();
          }}
        >
          {t(lang, "clearData")}
        </Button>

        <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          {t(lang, "disclaimer")}
        </div>
      </section>
    </AppShell>
  );
}

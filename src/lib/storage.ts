import type { AppData, Settings, Placement } from "./types";
import { DEFAULT_ENABLED } from "./zones";

const KEY = "podtracker.v1";

const DEFAULT_SETTINGS: Settings = {
  language: "sv",
  intervalDays: 3,
  enabledZones: DEFAULT_ENABLED,
  notificationsEnabled: false,
  onboardingDone: false,
};

const EMPTY: AppData = {
  version: 1,
  placements: [],
  settings: DEFAULT_SETTINGS,
};

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadData(): AppData {
  if (!isBrowser()) return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      version: 1,
      placements: parsed.placements ?? [],
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
    };
  } catch {
    return EMPTY;
  }
}

export function saveData(data: AppData) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("podtracker:update"));
}

export function addPlacement(p: Placement) {
  const d = loadData();
  d.placements.unshift(p);
  saveData(d);
}

export function updatePlacement(id: string, patch: Partial<Placement>) {
  const d = loadData();
  d.placements = d.placements.map((p) => (p.id === id ? { ...p, ...patch } : p));
  saveData(d);
}

export function deletePlacement(id: string) {
  const d = loadData();
  d.placements = d.placements.filter((p) => p.id !== id);
  saveData(d);
}

export function updateSettings(patch: Partial<Settings>) {
  const d = loadData();
  d.settings = { ...d.settings, ...patch };
  saveData(d);
}

export function clearAll() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("podtracker:update"));
}

export function exportJson(): string {
  return JSON.stringify(loadData(), null, 2);
}

export function importJson(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as AppData;
    if (!parsed || !Array.isArray(parsed.placements)) return false;
    saveData({
      version: 1,
      placements: parsed.placements,
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
    });
    return true;
  } catch {
    return false;
  }
}

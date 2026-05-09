export type ZoneId = "abdomen" | "thigh" | "arm" | "buttock" | "back" | "leg";
export type Side = "left" | "right";
export type View = "front" | "back";

export interface Placement {
  id: string;
  zone: ZoneId;
  side: Side;
  startedAt: string; // ISO
  note?: string;
}

export type Language = "sv" | "en";

export type EnabledZones = Record<ZoneId, { left: boolean; right: boolean }>;

export interface Settings {
  language: Language;
  intervalDays: number; // 2 or 3
  enabledZones: EnabledZones;
  notificationsEnabled: boolean;
  onboardingDone: boolean;
}

export interface AppData {
  version: 1;
  placements: Placement[];
  settings: Settings;
}

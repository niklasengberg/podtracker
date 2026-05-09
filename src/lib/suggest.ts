import type { Placement, Settings, ZoneId, Side } from "./types";
import { ALL_ZONES } from "./zones";

export interface SpotKey {
  zone: ZoneId;
  side: Side;
}

export interface Suggestion extends SpotKey {
  lastUsedAt: string | null;
  daysSince: number | null; // null = never used
  score: number;
}

/**
 * Rank allowed spots by how long since they were last used.
 * Heavily penalize the 3 most recent placements to avoid repeating zones.
 */
export function suggestNext(
  placements: Placement[],
  settings: Settings,
): Suggestion[] {
  const allowedSpots: SpotKey[] = [];
  for (const zone of ALL_ZONES) {
    const en = settings.enabledZones[zone];
    if (en?.left) allowedSpots.push({ zone, side: "left" });
    if (en?.right) allowedSpots.push({ zone, side: "right" });
  }

  const sorted = [...placements].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );
  const recent3 = sorted.slice(0, 3);
  const now = Date.now();

  const suggestions: Suggestion[] = allowedSpots.map((s) => {
    const last = sorted.find((p) => p.zone === s.zone && p.side === s.side);
    const lastUsedAt = last?.startedAt ?? null;
    const daysSince = lastUsedAt
      ? Math.floor((now - new Date(lastUsedAt).getTime()) / 86_400_000)
      : null;

    let score = daysSince ?? 9999; // never used = best
    // penalty if used in the last 3 placements
    const recentIdx = recent3.findIndex((p) => p.zone === s.zone && p.side === s.side);
    if (recentIdx >= 0) score -= 1000 - recentIdx * 100; // most recent gets biggest penalty

    return { ...s, lastUsedAt, daysSince, score };
  });

  return suggestions.sort((a, b) => b.score - a.score);
}

export function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

export function hoursSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
}

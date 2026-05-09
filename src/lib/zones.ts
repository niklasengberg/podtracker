import type { ZoneId, View, EnabledZones } from "./types";

export const ALL_ZONES: ZoneId[] = ["abdomen", "thigh", "arm", "buttock", "back", "leg"];

export const ZONE_VIEW: Record<ZoneId, View> = {
  abdomen: "front",
  thigh: "front",
  arm: "back",
  buttock: "back",
  back: "back",
  leg: "back",
};

export const DEFAULT_ENABLED: EnabledZones = {
  abdomen: { left: true, right: true },
  thigh: { left: true, right: true },
  arm: { left: true, right: true },
  buttock: { left: true, right: true },
  back: { left: true, right: true },
  leg: { left: true, right: true },
};

// SVG zone hotspots — coordinates inside a 200x400 viewBox per silhouette
// Each zone gets a left and right ellipse position
export const ZONE_HOTSPOTS: Record<
  ZoneId,
  { left: { cx: number; cy: number; rx: number; ry: number }; right: { cx: number; cy: number; rx: number; ry: number } }
> = {
  // FRONT — viewer's left = subject's right (we use subject perspective for "left/right")
  abdomen: {
    right: { cx: 88, cy: 175, rx: 14, ry: 18 }, // subject's right = viewer's left side
    left: { cx: 112, cy: 175, rx: 14, ry: 18 },
  },
  thigh: {
    right: { cx: 84, cy: 245, rx: 16, ry: 26 },
    left: { cx: 116, cy: 245, rx: 16, ry: 26 },
  },
  // BACK — viewer's left = subject's left (mirrored)
  arm: {
    left: { cx: 60, cy: 150, rx: 12, ry: 18 },
    right: { cx: 140, cy: 150, rx: 12, ry: 18 },
  },
  back: {
    left: { cx: 88, cy: 165, rx: 12, ry: 16 },
    right: { cx: 112, cy: 165, rx: 12, ry: 16 },
  },
  buttock: {
    left: { cx: 86, cy: 215, rx: 14, ry: 18 },
    right: { cx: 114, cy: 215, rx: 14, ry: 18 },
  },
  leg: {
    left: { cx: 84, cy: 280, rx: 14, ry: 24 },
    right: { cx: 116, cy: 280, rx: 14, ry: 24 },
  },
};

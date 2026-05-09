import { ZONE_HOTSPOTS, ZONE_VIEW, ALL_ZONES } from "@/lib/zones";
import type { ZoneId, Side, View, EnabledZones } from "@/lib/types";

export interface BodySpot {
  zone: ZoneId;
  side: Side;
}

interface Props {
  enabled: EnabledZones;
  highlights?: Record<string, "current" | "suggest" | "heat-1" | "heat-2" | "heat-3">; // key = `${zone}-${side}`
  onSelect?: (spot: BodySpot) => void;
  selected?: BodySpot | null;
  showLabels?: boolean;
}

const FRONT_PATH =
  "M100 18 C112 18 120 28 120 40 C120 52 112 62 100 62 C88 62 80 52 80 40 C80 28 88 18 100 18 Z " +
  "M70 70 L130 70 L138 100 L150 175 L138 195 L130 175 L130 260 L120 330 L122 380 L108 380 L102 320 L98 320 L92 380 L78 380 L80 330 L70 260 L70 195 L62 175 L50 175 L62 100 Z";

const BACK_PATH = FRONT_PATH; // mirrored body silhouette — same shape, hair on back differs but we keep simple

interface SilhouetteProps {
  view: View;
  enabled: EnabledZones;
  highlights?: Props["highlights"];
  onSelect?: Props["onSelect"];
  selected?: BodySpot | null;
}

function Silhouette({ view, enabled, highlights, onSelect, selected }: SilhouetteProps) {
  return (
    <svg viewBox="0 0 200 400" className="w-full h-auto" role="img">
      <path d={FRONT_PATH} className="fill-muted stroke-border" strokeWidth={1.5} />
      {ALL_ZONES.filter((z) => ZONE_VIEW[z] === view).map((zone) => {
        const sides: Side[] = ["left", "right"];
        return sides.map((side) => {
          const spec = ZONE_HOTSPOTS[zone][side];
          const isEnabled = enabled[zone][side];
          const key = `${zone}-${side}`;
          const hl = highlights?.[key];
          const isSelected =
            selected && selected.zone === zone && selected.side === side;

          let fill = "var(--muted-foreground)";
          let opacity = 0.25;
          if (!isEnabled) {
            fill = "var(--muted-foreground)";
            opacity = 0.08;
          } else if (isSelected) {
            fill = "var(--primary)";
            opacity = 0.85;
          } else if (hl === "current") {
            fill = "var(--destructive)";
            opacity = 0.7;
          } else if (hl === "suggest") {
            fill = "oklch(0.72 0.17 145)"; // green
            opacity = 0.7;
          } else if (hl === "heat-3") {
            fill = "var(--destructive)";
            opacity = 0.6;
          } else if (hl === "heat-2") {
            fill = "oklch(0.75 0.15 70)";
            opacity = 0.55;
          } else if (hl === "heat-1") {
            fill = "oklch(0.8 0.1 90)";
            opacity = 0.45;
          }

          return (
            <ellipse
              key={key}
              cx={spec.cx}
              cy={spec.cy}
              rx={spec.rx}
              ry={spec.ry}
              fill={fill}
              opacity={opacity}
              className={
                isEnabled && onSelect
                  ? "cursor-pointer transition-opacity hover:opacity-100"
                  : ""
              }
              onClick={() => isEnabled && onSelect?.({ zone, side })}
            />
          );
        });
      })}
    </svg>
  );
}

export function BodyMap({ enabled, highlights, onSelect, selected, showLabels = true }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col items-center">
        <Silhouette
          view="front"
          enabled={enabled}
          highlights={highlights}
          onSelect={onSelect}
          selected={selected}
        />
        {showLabels && (
          <span className="mt-1 text-xs font-medium tracking-widest text-primary">FRONT</span>
        )}
      </div>
      <div className="flex flex-col items-center">
        <Silhouette
          view="back"
          enabled={enabled}
          highlights={highlights}
          onSelect={onSelect}
          selected={selected}
        />
        {showLabels && (
          <span className="mt-1 text-xs font-medium tracking-widest text-primary">BACK</span>
        )}
      </div>
    </div>
  );
}

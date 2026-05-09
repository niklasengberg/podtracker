import type { Language, ZoneId } from "./types";

type Dict = Record<string, string>;

const sv: Dict = {
  appName: "PodTracker",
  home: "Hem",
  log: "Logga",
  history: "Historik",
  settings: "Inställningar",

  currentPlacement: "Nuvarande placering",
  noPlacementYet: "Ingen placering loggad ännu",
  daysAgo: "dag sen",
  daysAgoPlural: "dagar sen",
  changeIn: "Byt om",
  changeNow: "Byt nu",
  overdue: "Försenad med",
  logNew: "Logga nytt byte",
  suggestions: "Förslag på nästa plats",
  suggestionReason: "Inte använd på",
  suggestionNever: "Aldrig använd",
  topSuggestion: "Bästa förslag",

  selectZone: "Välj zon",
  selectSide: "Välj sida",
  left: "Vänster",
  right: "Höger",
  date: "Datum",
  note: "Anteckning (valfritt)",
  save: "Spara",
  cancel: "Avbryt",
  delete: "Ta bort",
  edit: "Redigera",
  front: "Fram",
  back: "Bak",

  zone_abdomen: "Mage",
  zone_thigh: "Lår",
  zone_arm: "Arm",
  zone_buttock: "Säte",
  zone_back: "Rygg",
  zone_leg: "Ben",

  language: "Språk",
  intervalDays: "Bytesintervall (dagar)",
  enabledZones: "Tillåtna placeringar",
  enabledZonesHint: "Avmarkerade platser visas inte och föreslås aldrig.",
  notifications: "Påminnelser",
  notificationsHint: "Få en notis innan nästa byte (kräver iOS-app).",
  exportData: "Exportera data",
  importData: "Importera data",
  clearData: "Rensa all data",
  clearConfirm: "Detta tar bort all historik och inställningar. Är du säker?",

  onboardingTitle: "Välkommen till PodTracker",
  onboardingBody:
    "Logga var du placerar din pump. Appen kommer ihåg dina senaste platser och föreslår nästa.",
  disclaimer:
    "Detta är ett minneshjälpmedel. Följ alltid din vårdgivares råd. Appen ersätter inte medicinsk rådgivning.",
  getStarted: "Kom igång",

  noHistory: "Ingen historik ännu",
  recentChanges: "Senaste byten",
  heatmap: "Användning senaste 90 dagarna",
  zoneDisabled: "Avstängd",

  saved: "Sparat",
  importOk: "Importerat",
  importFail: "Kunde inte importera filen",
};

const en: Dict = {
  appName: "PodTracker",
  home: "Home",
  log: "Log",
  history: "History",
  settings: "Settings",

  currentPlacement: "Current placement",
  noPlacementYet: "No placement logged yet",
  daysAgo: "day ago",
  daysAgoPlural: "days ago",
  changeIn: "Change in",
  changeNow: "Change now",
  overdue: "Overdue by",
  logNew: "Log new change",
  suggestions: "Suggested next spots",
  suggestionReason: "Unused for",
  suggestionNever: "Never used",
  topSuggestion: "Top suggestion",

  selectZone: "Select zone",
  selectSide: "Select side",
  left: "Left",
  right: "Right",
  date: "Date",
  note: "Note (optional)",
  save: "Save",
  cancel: "Cancel",
  delete: "Delete",
  edit: "Edit",
  front: "Front",
  back: "Back",

  zone_abdomen: "Abdomen",
  zone_thigh: "Thigh",
  zone_arm: "Arm",
  zone_buttock: "Buttock",
  zone_back: "Back",
  zone_leg: "Leg",

  language: "Language",
  intervalDays: "Change interval (days)",
  enabledZones: "Allowed placements",
  enabledZonesHint: "Unchecked spots are hidden and never suggested.",
  notifications: "Reminders",
  notificationsHint: "Get a reminder before your next change (requires iOS app).",
  exportData: "Export data",
  importData: "Import data",
  clearData: "Clear all data",
  clearConfirm: "This will erase all history and settings. Are you sure?",

  onboardingTitle: "Welcome to PodTracker",
  onboardingBody:
    "Log where you place your pump. The app remembers recent spots and suggests the next one.",
  disclaimer:
    "This is a memory aid only. Always follow your healthcare provider's advice. This app is not medical advice.",
  getStarted: "Get started",

  noHistory: "No history yet",
  recentChanges: "Recent changes",
  heatmap: "Usage in the last 90 days",
  zoneDisabled: "Disabled",

  saved: "Saved",
  importOk: "Imported",
  importFail: "Could not import file",
};

const dicts: Record<Language, Dict> = { sv, en };

export function t(lang: Language, key: string): string {
  return dicts[lang][key] ?? dicts.sv[key] ?? key;
}

export function zoneLabel(lang: Language, zone: ZoneId): string {
  return t(lang, `zone_${zone}`);
}

## PodTracker – iOS-app via App Store

Webbapp byggd i Lovable, paketerad som iOS-app med **Capacitor** och publicerad på App Store. All data sparas lokalt på enheten – ingen inloggning eller molnlagring.

### App-funktioner

1. **Startvy** – nuvarande placering, dagar kvar till byte, snabbknapp "Logga nytt byte", topp 3 föreslagna nästa platser.
2. **Logga byte** – interaktiv kroppskarta (front/back) med klickbara zoner, val av sida (vänster/höger), datum/tid, valfri anteckning.
3. **Smart förslag** – rangordnar tillåtna zoner efter hur länge sen de användes, undviker senast använda 2–3 platser, markerar topp 3 i grönt på kartan.
4. **Historik** – kronologisk lista (redigera/radera) + heatmap över 30/90 dagar.
5. **Inställningar**:
   - Språk: Svenska / English
   - Bytesintervall (default 3 dagar)
   - **Tillåtna placeringar** – checkboxar för varje zon och sida; avmarkerade zoner döljs på kroppskartan, kan inte loggas och ingår inte i förslag (t.ex. "Ben vänster" + "Ben höger" av som standard för dig)
   - Påminnelse-notis på/av
   - Export/import av data
   - Rensa data
6. **Onboarding** första gången – kort förklaring + medicinsk disclaimer + första valet av tillåtna placeringar.

### Placeringar (zoner)

Enligt Omnipod-rekommendationen, varje zon har vänster/höger:

- Mage, Lår, Arm (baksida av överarm), Säte, Rygg, Ben

Användaren kan när som helst slå av/på vilka som helst i Inställningar. Om en zon stängs av men har historik bevaras historiken – den visas bara inte som valbar längre.

### Anpassningar för iOS / App Store-godkännande

- **Lokal lagring** via `@capacitor/preferences` på iOS, `localStorage` i webbläsaren (samma kod via wrapper).
- **Lokala påminnelser** via `@capacitor/local-notifications` inför nästa byte.
- **Haptik** vid loggning (`@capacitor/haptics`).
- **Safe areas** för notch / Dynamic Island.
- **App-ikon och splash screen** matchande designen.
- **Mörkt läge** följer system.
- **Inga nätverksanrop** – förenklar granskning, App Store-fältet "Data Not Collected".
- **Medicinsk disclaimer** i onboarding och Inställningar.

### Sidor / rutter

```
/            Hem (status + förslag)
/log         Logga nytt byte
/history     Historik + heatmap
/settings    Språk, intervall, tillåtna placeringar, påminnelser, export/import
```

### Teknisk översikt

- **Bas**: TanStack Start som SPA-build (ingen SSR i Capacitor-paketet).
- **Lagring**: `src/lib/storage.ts` med plattformsdetektering (`Capacitor.isNativePlatform()`).
- **Inställningsmodell**:
  ```ts
  type Settings = {
    language: 'sv' | 'en';
    intervalDays: 2 | 3;
    enabledZones: Record<ZoneId, { left: boolean; right: boolean }>;
    notificationsEnabled: boolean;
  };
  ```
- **Förslagsalgoritm**: pure function `suggestNext(placements, settings)` filtrerar bort avstängda zoner/sidor innan rangordning. Enhetstestbar.
- **Kroppskarta**: handritad SVG-komponent. Avstängda zoner ritas med låg opacitet och är inte klickbara.
- **i18n**: enkel egen lösning med `sv`/`en`-ordböcker.
- **Capacitor**: `@capacitor/core`, `@capacitor/ios`, `@capacitor/cli`, `capacitor.config.ts` med app-id och webDir.

### Vägen till App Store

1. Bygg och testa appen i Lovables preview.
2. **Export to GitHub** från Lovable.
3. Klona på en Mac, `npm install`, `npx cap add ios`, `npx cap sync ios`.
4. Öppna i Xcode, fyll i signering / bundle-id / ikon, testkör på iPhone.
5. Skapa app-post i App Store Connect, fyll i beskrivning, screenshots, "Data Not Collected".
6. Archive → ladda upp → skicka till granskning.
7. Framtida uppdateringar: ändra i Lovable → pull → `npx cap sync ios` → ny version i Xcode.

### Krav du behöver

- Apple Developer-licens (99 USD/år)
- En Mac med Xcode

### Vad vi inte gör nu

- Ingen molnsynk / inloggning (du valde lokalt).
- Ingen Android-version i första utgåvan (Capacitor gör det enkelt att lägga till senare).
- Ingen integration mot Omnipod-pumpen (inget öppet API från Insulet).

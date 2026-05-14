import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor-konfiguration för PodTracker iOS-appen.
 *
 * Eftersom appen använder TanStack Start (SSR) laddar vi den
 * från den hostade Lovable-URL:en istället för att packa statiska
 * filer i appen. Kräver internet på telefonen.
 */
const config: CapacitorConfig = {
  appId: 'com.niklas.podtracker',
  appName: 'PodTracker',
  webDir: 'dist/client',
  server: {
    url: 'https://project--4bf4fb26-a2e8-405e-a0af-dbb234fa0f92.lovable.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
  },
};

export default config;

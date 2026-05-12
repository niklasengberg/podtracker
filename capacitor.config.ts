import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor-konfiguration för PodTracker iOS-appen.
 *
 * appId måste matcha Bundle Identifier i Xcode och kan INTE
 * ändras efter att appen publicerats på App Store. Byt ut
 * "com.dittnamn.podtracker" mot ditt eget reverse-domain-id
 * innan du kör `npx cap add ios` första gången.
 */
const config: CapacitorConfig = {
  appId: 'com.niklas.podtracker',
  appName: 'PodTracker',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
  },
};

export default config;

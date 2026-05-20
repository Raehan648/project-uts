import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // ── Identity ──────────────────────────────────────
  appId:   'com.rehalivan.ibadahassistant',   // ID unik Play Store
  appName: 'Ibadah Assistant App',

  // ── Web output ────────────────────────────────────
  webDir: 'www',

  // ── Server (development only, remove for production)
  // server: { androidScheme: 'https' },

  // ── Plugin Configurations ─────────────────────────
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a1628',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#c9973a',
    },

    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a1628',
      overlaysWebView: false,
    },

    LocalNotifications: {
      smallIcon: 'ic_adzan',
      iconColor: '#C9973A',
      sound: 'adzan.wav',
    },

    Geolocation: {
      // Permissions declared in AndroidManifest.xml
    },

    Haptics: {
      // No extra config needed
    },
  },

  // ── Android Build ─────────────────────────────────
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // set true only in dev
    buildOptions: {
      releaseType: 'AAB',               // ← Wajib untuk Play Store
      keystorePath: 'ibadah-release.keystore',
      keystoreAlias: 'ibadahkey',
    },
  },

  // ── iOS Build ─────────────────────────────────────
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
  },
};

export default config;
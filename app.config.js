export default ({ config }) => {
  return {
    ...config,
    name: 'learn-languages',
    slug: 'learn-languages',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/android-chrome-192x192.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    scheme: 'com.islacode.learnlanguages',
    splash: {
      image: './assets/android-chrome-512x512.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      bundleIdentifier: 'com.islacode.learnlanguages',
      supportsTablet: true,
      icon: './assets/android-chrome-192x192.png',
    },
    android: {
      package: 'com.islacode.learnlanguages',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      icon: './assets/android-chrome-192x192.png',
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: './assets/favicon-32x32.png',
    },
    extra: {
      GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      GOOGLE_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    },
  };
};

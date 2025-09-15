import { useState, useMemo } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import type { AuthRequest, AuthSessionResult } from 'expo-auth-session';
import { Platform } from 'react-native';

export interface UseGoogleOAuthReturn {
  loading: boolean;
  setLoading: (v: boolean) => void;
  handleGoogleSignIn: () => Promise<void>;
  request: AuthRequest | null;
  response: AuthSessionResult | null;
}

export function useGoogleOAuth(): UseGoogleOAuthReturn {
  const [loading, setLoading] = useState(false);
  const [isWeb] = useState(Platform.OS === 'web');

  const redirectUri = useMemo(
    () =>
      makeRedirectUri({
        // Optionally set a consistent path if you configured one in Google Console
        path: process.env.EXPO_PUBLIC_AUTH_REDIRECT_PATH ?? 'auth/callback',
      }),
    []
  );

  // Google OAuth configuration with proper parameters
  const [request, response, promptAsync] = Google.useAuthRequest({
    // clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID!,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
    ...(isWeb && { redirectUri, responseType: 'id_token' }),
    scopes: ['openid', 'profile', 'email'],
    selectAccount: true,
  });

  const handleGoogleSignIn = async () => {
    if (!request) {
      // Optional: log or toast for debugging/UX
      console.warn('Auth request not ready yet');
      return;
    }

    setLoading(true);

    try {
      await promptAsync({
        showInRecents: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    handleGoogleSignIn,
    request,
    response,
  };
};

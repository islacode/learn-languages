import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';

export const useGoogleOAuth = () => {
  const [loading, setLoading] = useState(false);

  // Google OAuth configuration with proper parameters
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID!,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
    redirectUri: Platform.OS === 'web' 
      ? process.env.EXPO_PUBLIC_WEB_REDIRECT_URL
      : process.env.EXPO_PUBLIC_MOBILE_REDIRECT_URL,
    // Google OAuth best practices
    scopes: ['openid', 'profile', 'email'],
  });

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      if (Platform.OS === 'web') {
        // For web, use a direct redirect to avoid popup issues
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(process.env.EXPO_PUBLIC_WEB_REDIRECT_URL!)}&` +
          `response_type=code&` +
          `scope=${encodeURIComponent('openid profile email')}&` +
          `access_type=offline&` +
          `prompt=consent`;
        
        window.location.href = authUrl;
      } else {
        // For mobile, use the normal Expo AuthSession flow
        await promptAsync();
      }
    } catch (error) {
      console.error('Error initiating Google sign in:', error);
      setLoading(false);
      throw error;
    }
  };

  return {
    loading,
    setLoading,
    handleGoogleSignIn,
    response,
  };
}; 
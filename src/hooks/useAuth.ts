import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { supabase } from '../supabase';
import { useGoogleOAuth } from './useGoogleOAuth';
import { useSession } from './useSession';


interface UserSession {
  id: string;
  googleId: string;
  nickname: string | null;
  email?: string;
  lastActivity: number;
}

export const useAuth = () => {
  const { loading, setLoading, handleGoogleSignIn, response } = useGoogleOAuth();
  const { session, saveSession, clearSession, handleSignOut } = useSession();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Handle OAuth callback for web redirect flow
  useEffect(() => {
    if (Platform.OS === 'web') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (code) {
        handleOAuthCallback(code);
      } else if (error) {
        console.error('OAuth error:', error);
        Alert.alert('Login failed', 'OAuth authentication failed.');
      }
    }
  }, []);

  // Handle Expo AuthSession response (only for mobile)
  useEffect(() => {
    if (Platform.OS !== 'web' && response) {
      console.log('OAuth response received:', response);
      console.log('Response type:', response?.type);

      if (response?.type === 'success') {
        console.log('Response authentication:', response.authentication);
        if (response.authentication?.accessToken) {
          console.log('Processing successful OAuth response');
          handleGoogleSignInSuccess(response.authentication.accessToken);
        }
      } else if (response?.type === 'error') {
        console.error('OAuth error:', response.error);
        Alert.alert('Login failed', 'OAuth authentication failed.');
      } else if (response?.type === 'cancel') {
        console.log('OAuth cancelled by user');
      }
    }
  }, [response]);

  const handleOAuthCallback = async (code: string) => {
    try {
      setIsAuthenticating(true);

      // Exchange code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
          client_secret: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET!,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: `${window.location.origin}${process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL}`,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();

      // Get user info and proceed with login
      await handleGoogleSignInSuccess(tokenData.access_token);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      Alert.alert('Login failed', 'Failed to complete authentication.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getGoogleUserInfo = async (accessToken: string) => {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info from Google');
    }

    return response.json();
  };

  const saveUserToDatabase = async (userInfo: any) => {
    const googleId = `google_${userInfo.id}`;

    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .rpc('check_user_exists', { google_id_param: googleId });

    if (checkError) {
      console.error('Error checking user:', checkError);
      throw new Error('Failed to check user existence');
    }

    if (existingUser) {
      console.log('User already exists:', existingUser);
      return existingUser;
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .rpc('create_user_if_not_exists', {
        google_id_param: googleId,
        nickname_param: null
      });

    if (createError) {
      console.error('Error creating user:', createError);
      throw new Error('Failed to create user');
    }

    console.log('User saved to database:', newUser);
    return newUser;
  };

  const handleGoogleSignInSuccess = async (accessToken: string) => {
    try {
      setLoading(true);

      // Get user info from Google
      const userInfo = await getGoogleUserInfo(accessToken);

      // Save user to database
      const savedUser = await saveUserToDatabase(userInfo);

      // Create session
      const sessionData: UserSession = {
        id: savedUser.id,
        googleId: savedUser.google_id,
        nickname: savedUser.nickname,
        email: userInfo.email,
        lastActivity: Date.now(),
      };

      // Save session
      await saveSession(sessionData);

      Alert.alert('Success!', 'You have been logged in successfully.');

    } catch (error) {
      console.error('Error during sign in:', error);
      Alert.alert('Login failed', 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      await handleGoogleSignIn();
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login failed', 'Failed to start Google login.');
    }
  };

  return {
    session,
    loading: loading || isAuthenticating,
    login,
    logout: handleSignOut,
    isAuthenticated: !!session,
  };
};

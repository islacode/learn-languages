import { useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
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

export interface GoogleClaims {
  sub: string;
  email?: string;
  name?: string;
  picture?: string
};

function decodeJwtPayload(jwt: string): GoogleClaims {
  return jwtDecode<GoogleClaims>(jwt);
}

export function useAuth() {
  const { loading, setLoading, handleGoogleSignIn, response, request } = useGoogleOAuth();
  const { session, saveSession, handleSignOut } = useSession();

  const idToken = useMemo(() => {
    if (!response) return undefined;
    if (Platform.OS === 'web') return (response as any)?.params?.id_token;
    return (response as any)?.authentication?.idToken;
  }, [response]);

  useEffect(() => {
    const go = async () => {
      if (!response) return;
      if (response.type === 'success' && idToken) {
        await handleGoogleSignInSuccess(idToken);
      } else if (response.type === 'error') {
        console.error('OAuth error:', response.error);
        Alert.alert('Login failed', 'OAuth authentication failed.');
      } else if (response.type === 'cancel' || response.type === 'dismiss') {
        console.log('OAuth flow cancelled/dismissed');
      }
    };
    go();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, idToken]);

  const handleGoogleSignInSuccess = async (idToken: string) => {
    try {
      setLoading(true);
      const claims = decodeJwtPayload(idToken);
      const googleId = `google_${claims.sub}`;

      // Persist user in DB via existing RPCs
      const { data: existingUser, error: checkError } = await supabase.rpc('check_user_exists', {
        google_id_param: googleId,
      });
      if (checkError) {
        throw checkError;
      }

      let user = existingUser;
      if (!user) {
        const { data: newUser, error: createError } = await supabase.rpc('create_user_if_not_exists', {
          google_id_param: googleId,
          nickname_param: null,
        });
        if (createError) {
          throw createError;
        }
        user = newUser;
      }

      const sessionData: UserSession = {
        id: user.id,
        googleId: user.google_id,
        nickname: user.nickname,
        email: claims.email,
        lastActivity: Date.now(),
      };
      await saveSession(sessionData);

      Alert.alert('Success!', 'You have been logged in successfully.');
    } catch (e) {
      console.error('Error during sign in:', e);
      Alert.alert('Login failed', 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    if (!request) {
      console.warn('Auth request not ready yet');
      return;
    }
    try {
      await handleGoogleSignIn();
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login failed', 'Failed to start Google login.');
    }
  };

  return {
    session,
    loading,
    canLogin: !!request && !loading,
    login,
    logout: handleSignOut,
    isAuthenticated: !!session,
  };
}

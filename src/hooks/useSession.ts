import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {
  SESSION_TIMEOUT_MINUTES,
  SESSION_TIMEOUT_MILLISECONDS,
  USER_SESSION_COOKIE,
} from '../constants';

interface UserSession {
  id: string;
  googleId: string;
  nickname: string | null;
  email?: string;
  lastActivity: number;
}

export const useSession = () => {
  const [session, setSession] = useState<UserSession | null>(null);

  // Cookie utilities for web
  const setCookie = (name: string, value: string, minutes: number) => {
    const expires = new Date(Date.now() + minutes * 60 * 1000);
    const secure = window.location.protocol === 'https:' ? ';Secure' : '';
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict${secure}`;
  };

  const getCookie = (name: string): string | null => {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  };

  const checkExistingSession = async () => {
    try {
      if (Platform.OS === 'web') {
        const raw = getCookie(USER_SESSION_COOKIE);
        if (!raw) return;
        const session = JSON.parse(decodeURIComponent(raw)) as UserSession;
        // expiration check below
        const now = Date.now();
        const lastActivity = session.lastActivity || 0;
        if (now - lastActivity > SESSION_TIMEOUT_MILLISECONDS) {
          deleteCookie(USER_SESSION_COOKIE);
          return;
        }
        setSession(session);
        return;
      }

      const raw = await SecureStore.getItemAsync(USER_SESSION_COOKIE);
      if (!raw) return;
      const session = JSON.parse(raw) as UserSession;
      const now = Date.now();
      const lastActivity = session.lastActivity || 0;
      if (now - lastActivity > SESSION_TIMEOUT_MILLISECONDS) {
        await SecureStore.deleteItemAsync(USER_SESSION_COOKIE);
        return;
      }
      setSession(session);
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const saveSession = async (sessionData: UserSession) => {
    if (Platform.OS === 'web') {
      setCookie(USER_SESSION_COOKIE, encodeURIComponent(JSON.stringify(sessionData)), SESSION_TIMEOUT_MINUTES);
    } else {
      await SecureStore.setItemAsync(USER_SESSION_COOKIE, JSON.stringify(sessionData));
    }
    setSession(sessionData);
  };

  const clearSession = async () => {
    if (Platform.OS === 'web') {
      deleteCookie(USER_SESSION_COOKIE);
    } else {
      await SecureStore.deleteItemAsync(USER_SESSION_COOKIE);
    }
    setSession(null);
  };

  const handleSignOut = async () => {
    try {
      await clearSession();
      Alert.alert('Signed out', 'You have been signed out successfully.');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out.');
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    session,
    saveSession,
    clearSession,
    handleSignOut,
  };
};

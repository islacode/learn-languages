import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { SESSION_TIMEOUT_MINUTES, SESSION_TIMEOUT_MILLISECONDS, USER_SESSION_COOKIE } from '../constants';

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
    const expires = new Date();
    expires.setTime(expires.getTime() + minutes * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  };

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
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
    console.log('checkExistingSession called');
    try {
      let sessionData: string | null = null;
      
      if (Platform.OS === 'web') {
        sessionData = getCookie(USER_SESSION_COOKIE);
        console.log('Web: Found session data in cookie:', sessionData);
      } else {
        sessionData = await SecureStore.getItemAsync(USER_SESSION_COOKIE);
        console.log('Mobile: Found session data in SecureStore:', sessionData);
      }

      if (sessionData) {
        const session = JSON.parse(sessionData);
        
        // Check if session is expired (60 minutes)
        const now = Date.now();
        const lastActivity = session.lastActivity || 0;
        const timeDiff = now - lastActivity;
        
        if (timeDiff > SESSION_TIMEOUT_MILLISECONDS) { // 60 minutes
          // Session expired, clear it
          if (Platform.OS === 'web') {
            deleteCookie(USER_SESSION_COOKIE);
          } else {
            await SecureStore.deleteItemAsync(USER_SESSION_COOKIE);
          }
          console.log('Session expired due to inactivity');
          return;
        }

        setSession(session);
        console.log('User already logged in:', session);
      } else {
        console.log('No existing session found');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const saveSession = async (sessionData: UserSession) => {
    if (Platform.OS === 'web') {
      setCookie(USER_SESSION_COOKIE, JSON.stringify(sessionData), SESSION_TIMEOUT_MINUTES);
    } else {
      await SecureStore.setItemAsync(USER_SESSION_COOKIE, JSON.stringify(sessionData));
    }
    setSession(sessionData);
  };

  const clearSession = async () => {
    console.log('clearSession called');
    if (Platform.OS === 'web') {
      console.log('Deleting cookie:', USER_SESSION_COOKIE);
      deleteCookie(USER_SESSION_COOKIE);
      console.log('Cookie deleted, checking if it exists:', getCookie(USER_SESSION_COOKIE));
    } else {
      await SecureStore.deleteItemAsync(USER_SESSION_COOKIE);
    }
    setSession(null);
    console.log('Session state set to null');
  };

  const handleSignOut = async () => {
    console.log('handleSignOut called');
    try {
      console.log('Clearing session...');
      await clearSession();
      console.log('User signed out successfully');
      Alert.alert('Signed out', 'You have been signed out successfully.');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out.');
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  return {
    session,
    saveSession,
    clearSession,
    handleSignOut,
  };
}; 
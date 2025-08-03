import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  
  // Access environment variables with EXPO_PUBLIC_ prefix (current 2025 approach)
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';

  // Debug: Log the environment variables
  console.log('Environment variables:', {
    clientId: clientId ? 'SET' : 'NOT SET',
    iosClientId: iosClientId ? 'SET' : 'NOT SET',
    androidClientId: androidClientId ? 'SET' : 'NOT SET',
    webClientId: webClientId ? 'SET' : 'NOT SET',
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId,
    iosClientId,
    androidClientId,
    webClientId,
  });

  // Function to save user to database
  const saveUserToDatabase = async (googleId: string) => {
    try {
      console.log('Attempting to save user with Google ID:', googleId);
      
      // Use RPC to check if user exists (POST request with body)
      const { data: existingUser, error: fetchError } = await supabase
        .rpc('check_user_exists', { google_id_param: googleId });

      console.log('Existing user RPC result:', { existingUser, fetchError });

      if (fetchError) {
        console.error('Error checking existing user:', fetchError);
        return;
      }

      if (existingUser) {
        console.log('User already exists:', existingUser);
        Alert.alert('Success', 'Welcome back!');
        return;
      }

      console.log('No existing user found, creating new user...');

      // Use RPC to create user (POST request with body)
      const { data: newUser, error: insertError } = await supabase
        .rpc('create_user_if_not_exists', { 
          google_id_param: googleId,
          nickname_param: null
        });

      if (insertError) {
        console.error('Error inserting user:', insertError);
        Alert.alert('Error', 'Failed to save user to database.');
        return;
      }

      console.log('User saved to database:', newUser);
      Alert.alert('Success', 'Welcome! Your account has been created.');
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Error', 'Failed to save user to database.');
    }
  };

  // Function to get Google user info
  const getGoogleUserInfo = async (accessToken: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      const userInfo = await response.json();
      console.log('Google user info:', userInfo);
      return userInfo;
    } catch (error) {
      console.error('Error fetching Google user info:', error);
      return null;
    }
  };

  React.useEffect(() => {
    if (response?.type === 'success') {
      setLoading(false);
      const { authentication } = response;
      console.log('Google authentication result:', authentication);
      
      // Get Google user info and save to database
      if (authentication?.accessToken) {
        getGoogleUserInfo(authentication.accessToken).then((userInfo) => {
          if (userInfo?.id) {
            saveUserToDatabase(userInfo.id);
          } else {
            // Fallback to timestamp if we can't get the ID
            const googleId = `google_${Date.now()}`;
            saveUserToDatabase(googleId);
          }
        });
      }
    } else if (response?.type === 'error') {
      setLoading(false);
      Alert.alert('Login failed', 'Google login failed.');
    }
  }, [response]);

  // Check if environment variables are loaded
  if (!clientId || !iosClientId || !androidClientId || !webClientId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.errorText}>
          Environment variables not loaded. Please check your .env.local file.
        </Text>
        <Text style={styles.debugText}>
          Check console for debug information.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4285F4" />
      ) : (
        <TouchableOpacity
          style={styles.googleButton}
          disabled={!request}
          onPress={() => {
            setLoading(true);
            promptAsync();
          }}
        >
          <View style={styles.buttonContent}>
            <View style={styles.googleIcon}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333333',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 240,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 18,
    height: 18,
    borderRadius: 2,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleIconText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#3c4043',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#d93025',
    textAlign: 'center',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    color: '#666666',
  },
});

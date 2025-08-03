import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      setLoading(false);
      const { authentication } = response;
      console.log('Google authentication result:', authentication);
      // You can handle authentication here (e.g., send token to backend)
    } else if (response?.type === 'error') {
      setLoading(false);
      Alert.alert('Login failed', 'Google login failed.');
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 24 }}>Login</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button
          title="Login with Google"
          disabled={!request}
          onPress={() => {
            setLoading(true);
            promptAsync();
          }}
        />
      )}
    </View>
  );
}

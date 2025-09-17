import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TopMenu from '@/components/TopMenu/TopMenu';
import Home from '@/pages/Home/Home';
import Footer from '@/components/Footer/Footer';
import linking from '@/navigation';
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

export type RootStackParamList = {
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <SafeAreaView style={{ flex: 1 }}>
          <TopMenu />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={Home} />
          </Stack.Navigator>
          <Footer />
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

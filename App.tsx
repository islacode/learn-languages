import React from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TopMenu from './TopMenu';
import Theme from './theme';
import Footer from './Footer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import linking from './navigation';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={{ flex: 1 }}>
      <View style={styles.article}>
        <Text style={styles.articleTitle}>Welcome to Learn Languages!</Text>
        <Text style={styles.articleText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut laoreet
          dictum, massa erat cursus enim, nec dictum urna elit nec urna. Pellentesque habitant morbi
          tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse potenti.
          Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam nisl
          nunc eu nisl. Mauris euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget
          aliquam nisl nunc eu nisl.
        </Text>
      </View>
    </ScrollView>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
          <View style={styles.container}>
            <TopMenu />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
            <Footer />
          </View>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    flexDirection: 'column',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  article: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    maxWidth: 600,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  articleTitle: {
    fontSize: Theme.fontSizes.large,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  articleText: {
    fontSize: Theme.fontSizes.medium,
    color: Theme.colors.textSecondary,
    textAlign: 'justify',
  },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';

export default function HomeScreen() {
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

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  article: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    maxWidth: 600,
    width: '100%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  articleText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'justify',
  },
}); 
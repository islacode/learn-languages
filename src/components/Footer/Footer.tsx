import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Theme from '../../theme';

function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2025 Learn Languages. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: Theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingVertical: Theme.spacing.sm,
    alignItems: 'center',
  },
  footerText: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.fontSizes.small,
  },
});

export default Footer;

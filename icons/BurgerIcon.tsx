import React from 'react';
import { View } from 'react-native';

function BurgerIcon({ color = 'white', size = 28 }) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{ width: size, height: 3, backgroundColor: color, borderRadius: 2, marginBottom: 5 }}
      />
      <View
        style={{ width: size, height: 3, backgroundColor: color, borderRadius: 2, marginBottom: 5 }}
      />
      <View style={{ width: size, height: 3, backgroundColor: color, borderRadius: 2 }} />
    </View>
  );
}

export default BurgerIcon;

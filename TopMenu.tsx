import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Pressable,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Theme from './theme';
import { CrossPlatformPressableStateCallbackType } from './types';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from './icons/Logo';
import BurgerIcon from './icons/BurgerIcon';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from './App';

const MENU_OPTIONS = ['Home', 'Courses', 'Practice', 'Progress', 'Settings'];
const MOBILE_BREAKPOINT = 900;

function TopMenu() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

  React.useEffect(() => {
    function handleResize() {
      setWindowWidth(Dimensions.get('window').width);
    }
    const subscription = Dimensions.addEventListener('change', handleResize);
    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, []);

  const isMobile = windowWidth < MOBILE_BREAKPOINT;

  function renderMenuItems(vertical = false) {
    return MENU_OPTIONS.map((option) => (
      <Pressable
        key={option}
        style={(state: CrossPlatformPressableStateCallbackType) => [
          vertical ? styles.menuItemVertical : styles.menuItem,
          state.hovered && (vertical ? styles.menuItemVerticalHovered : styles.menuItemHovered),
        ]}
        onPress={() => setMenuOpen(false)}
      >
        <Text style={styles.menuText}>{option}</Text>
      </Pressable>
    ));
  }

  if (isMobile) {
    // Mobile: burger left, logo center, login right
    return (
      <View style={styles.menuContainer}>
        <View style={styles.mobileLeft}>
          <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.burgerButton}>
            <BurgerIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.mobileCenter}>
          <Logo size={36} />
        </View>
        <View style={styles.mobileRight}>
          <Pressable
            style={(state: CrossPlatformPressableStateCallbackType) => [
              styles.loginButton,
              state.hovered && { backgroundColor: Theme.colors.primaryLight },
            ]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>Login</Text>
          </Pressable>
        </View>
        {/* Mobile menu modal */}
        <Modal
          visible={menuOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuOpen(false)}
        >
          <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.mobileMenuModal}>{renderMenuItems(true)}</View>
        </Modal>
      </View>
    );
  }

  // Web/desktop: logo left, menu center, login right
  return (
    <View style={styles.menuContainer}>
      <View style={styles.webLeft}>
        <Logo size={36} />
      </View>
      <View style={styles.webCenter}>
        <View style={styles.menuItemsContainer}>{renderMenuItems(false)}</View>
      </View>
      <View style={styles.webRight}>
        <Pressable
          style={(state: CrossPlatformPressableStateCallbackType) => [
            styles.loginButton,
            state.hovered && { backgroundColor: Theme.colors.primaryLight },
          ]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.primary,
    ...(Platform.OS === 'web' ? { minHeight: 56 } : {}),
    position: 'relative',
  },
  // Web layout
  webLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  webCenter: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  webRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  // Mobile layout
  mobileLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  mobileCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  burgerButton: {
    marginRight: Theme.spacing.md,
    padding: Theme.spacing.xs,
  },
  menuItemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    minWidth: 0,
  },
  menuItem: {
    marginHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.sm,
    minWidth: 48,
    alignItems: 'center',
  },
  menuItemHovered: {
    backgroundColor: Theme.colors.primaryLight,
  },
  menuItemVertical: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.sm,
    marginBottom: Theme.spacing.sm,
    alignItems: 'flex-start',
  },
  menuItemVerticalHovered: {
    backgroundColor: Theme.colors.primaryLight,
  },
  menuText: {
    color: Theme.colors.card,
    fontSize: Theme.fontSizes.medium,
    fontWeight: '500',
    flexShrink: 1,
  },
  logoPlaceholder: {
    width: 36,
    height: 36,
    backgroundColor: Theme.colors.secondary,
    borderRadius: 18,
    marginRight: Theme.spacing.md,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.sm,
    minWidth: 64,
    alignItems: 'center',
  },
  loginText: {
    color: 'white',
    fontSize: Theme.fontSizes.medium,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mobileMenuModal: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.lg,
    zIndex: 10,
    borderBottomLeftRadius: Theme.borderRadius.md,
    borderBottomRightRadius: Theme.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default TopMenu;

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Theme from '../../theme';
import { CrossPlatformPressableStateCallbackType } from '../../types';
import Logo from '../../../icons/Logo';
import BurgerIcon from '../../../icons/BurgerIcon';
import { useAuth } from '../../hooks/useAuth';
import { useResponsiveMenu } from '../../hooks/useResponsiveMenu';
import { MENU_OPTIONS, MOBILE_BREAKPOINT } from '../../constants';

function TopMenu() {
  const { loading, login, logout, isAuthenticated, canLogin } = useAuth();
  const { windowWidth, menuOpen, toggleMenu, closeMenu } = useResponsiveMenu();

  const isMobile = windowWidth < MOBILE_BREAKPOINT;

  function renderMenuItems(vertical = false) {
    return MENU_OPTIONS.map((option) => (
      <Pressable
        key={option}
        style={(state: CrossPlatformPressableStateCallbackType) => [
          vertical ? styles.menuItemVertical : styles.menuItem,
          state.hovered && (vertical ? styles.menuItemVerticalHovered : styles.menuItemHovered),
        ]}
        onPress={closeMenu}
      >
        <Text style={styles.menuText}>{option}</Text>
      </Pressable>
    ));
  }

  const handleAuthPress = () => {
    if (isAuthenticated) {
      logout();
    } else {
      if (!canLogin) {
        // Optional: toast/log for UX
        console.warn('Login not ready yet');
        return;
      }
      login();
    }
  };

  if (isMobile) {
    // Mobile: burger left, logo center, login right
    return (
      <View style={styles.menuContainer}>
        <View style={styles.mobileLeft}>
          <TouchableOpacity onPress={toggleMenu} style={styles.burgerButton}>
            <BurgerIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.mobileCenter}>
          <Logo size={36} />
        </View>
        <View style={styles.mobileRight}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : isAuthenticated ? (
            <Pressable style={styles.signOutButton} onPress={handleAuthPress}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </Pressable>
          ) : (
            <TouchableOpacity
              style={[styles.googleButton, !canLogin && styles.googleButtonDisabled]}
              onPress={handleAuthPress}
              disabled={!canLogin}
              accessibilityState={{ disabled: !canLogin }}
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
        {/* Mobile menu modal */}
        <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={closeMenu}>
          <TouchableWithoutFeedback onPress={closeMenu}>
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
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : isAuthenticated ? (
          <Pressable style={styles.signOutButton} onPress={handleAuthPress}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </Pressable>
        ) : (
          <TouchableOpacity
            style={[styles.googleButton, !canLogin && styles.googleButtonDisabled]}
            onPress={handleAuthPress}
            disabled={!canLogin}
            accessibilityState={{ disabled: !canLogin }}
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
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 240,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  googleButtonDisabled: {
    opacity: 0.5,
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
  signOutButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  signOutButtonText: {
    color: '#3c4043',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TopMenu;

import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export const useResponsiveMenu = () => {
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return {
    windowWidth,
    menuOpen,
    toggleMenu,
    closeMenu,
  };
}; 
const isWeb = typeof window !== 'undefined' && typeof window.location !== 'undefined';

const linking = {
  prefixes: isWeb ? [window.location.origin] : [],
  config: {
    screens: {
      Home: '',
      Login: 'login',
    },
  },
};

export default linking;

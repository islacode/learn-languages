// theme.ts

const Colors = {
  primary: '#2563EB', // Primary Blue
  secondary: '#FACC15', // Primary Yellow
  accent: '#22C55E', // Primary Green

  primaryLight: '#3B82F6', // Primary Blue Light

  info: '#3B82F6', // Info Blue
  success: '#16A34A', // Success Green
  error: '#DC2626', // Error Red

  background: '#F9FAFB', // Light Gray Background
  card: '#FFFFFF', // White Card Background

  textPrimary: '#111827', // Almost Black
  textSecondary: '#374151', // Dark Gray

  border: '#E5E7EB', // Light Border Color
};

const Theme = {
  colors: Colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 24,
  },
  fontSizes: {
    small: 14,
    medium: 16,
    large: 20,
    xlarge: 24,
  },
};

export type AppTheme = typeof Theme;
export default Theme;

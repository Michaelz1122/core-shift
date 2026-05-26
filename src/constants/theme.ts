export const Colors = {
  primaryBlue: '#2D7FF9',
  blueLight: '#EBF3FF',
  charcoal: '#1C1C1E',
  charcoalSoft: '#636366',
  muted: '#8E8E93',
  border: '#E5E5EA',
  background: '#F7F7FA',
  card: '#FFFFFF',
  white: '#FFFFFF',
  success: '#34C759',
  successLight: '#E8F8ED',
  red: '#FF3B30',
} as const;

export const Gradients = {
  primary: ['#2D7FF9', '#5B9CFF'] as const,
  purple: ['#7C4DFF', '#B388FF'] as const,
  gold: ['#FFD600', '#FFEA00'] as const,
  xp: ['#2D7FF9', '#8A2BE2'] as const,
  danger: ['#FF3B30', '#FF453A'] as const,
  success: ['#34C759', '#30D158'] as const,
  cardBg: ['#FFFFFF', '#FDFDFD'] as const,
} as const;

export const Typography = {
  // Font sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 34,

  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.4,
  lineHeightRelaxed: 1.6,

  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

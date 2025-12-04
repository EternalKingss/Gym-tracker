/**
 * Gym Tracker App - Design System Configuration
 * Glassmorphic dark theme with orange accents
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Dark theme backgrounds
  background: {
    primary: '#0a0a0a',      // Deep black
    secondary: '#1a1a1a',    // Dark gray
    tertiary: '#2d2d2d',     // Medium dark gray
    light: '#3a3a3a',        // Light gray
  },

  // Glassmorphic surface colors
  surface: {
    glass: 'rgba(255, 255, 255, 0.05)',      // Very subtle glass
    glassLight: 'rgba(255, 255, 255, 0.08)', // Light glass overlay
    glassMedium: 'rgba(255, 255, 255, 0.12)', // Medium glass overlay
    glassDark: 'rgba(20, 20, 20, 0.4)',      // Dark glass overlay
  },

  // Orange accent palette (primary brand color)
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',    // Primary orange
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Neutral grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Accent colors for states
  accent: {
    success: '#10b981',      // Green
    warning: '#f59e0b',      // Amber
    danger: '#ef4444',       // Red
    info: '#3b82f6',         // Blue
  },

  // Text colors
  text: {
    primary: '#ffffff',      // White text
    secondary: '#e5e7eb',    // Light gray text
    tertiary: '#9ca3af',     // Medium gray text
    muted: '#6b7280',        // Dark gray text
    accent: '#f97316',       // Orange text (for emphasis)
  },

  // Border colors
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(255, 255, 255, 0.3)',
    accent: '#f97316',       // Orange borders
  },

  // Shadows and overlays
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.4)',
    xl: 'rgba(0, 0, 0, 0.6)',
  },

  // Gradient definitions
  gradient: {
    orangeToDark: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    darkToTransparent: 'linear-gradient(180deg, rgba(10, 10, 10, 1) 0%, rgba(10, 10, 10, 0.8) 100%)',
    glassmorphic: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    accentGlow: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(249, 115, 22, 0.1) 100%)',
  },
} as const;

// ============================================================================
// BORDER RADIUS (Highly Rounded Cards)
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.375rem',     // 6px
  base: '0.5rem',     // 8px
  md: '0.75rem',      // 12px
  lg: '1rem',         // 16px
  xl: '1.5rem',       // 24px
  '2xl': '2rem',      // 32px
  full: '9999px',     // Full circle for pills
  card: '1.5rem',     // 24px - standard card radius
  largeCard: '2rem',  // 32px - large cards
  button: '1rem',     // 16px - button radius
  input: '0.75rem',   // 12px - input radius
  modal: '2rem',      // 32px - modal dialogs
  circle: {
    sm: '2rem',       // 32px
    md: '3rem',       // 48px
    lg: '4rem',       // 64px
    xl: '6rem',       // 96px
    '2xl': '8rem',    // 128px
  },
} as const;

// ============================================================================
// SPACING SCALE
// ============================================================================

export const spacing = {
  0: '0',
  1: '0.25rem',       // 4px
  2: '0.5rem',        // 8px
  3: '0.75rem',       // 12px
  4: '1rem',          // 16px
  5: '1.25rem',       // 20px
  6: '1.5rem',        // 24px
  7: '1.75rem',       // 28px
  8: '2rem',          // 32px
  9: '2.25rem',       // 36px
  10: '2.5rem',       // 40px
  12: '3rem',         // 48px
  14: '3.5rem',       // 56px
  16: '4rem',         // 64px
  20: '5rem',         // 80px
  24: '6rem',         // 96px
  28: '7rem',         // 112px
  32: '8rem',         // 128px
  36: '9rem',         // 144px
  40: '10rem',        // 160px
  44: '11rem',        // 176px
  48: '12rem',        // 192px
  52: '13rem',        // 208px
  56: '14rem',        // 224px
  60: '15rem',        // 240px
  64: '16rem',        // 256px
  80: '20rem',        // 320px
  96: '24rem',        // 384px
  // Common padding/margin combinations
  xs: '0.5rem',       // 8px
  sm: '1rem',         // 16px
  md: '1.5rem',       // 24px
  lg: '2rem',         // 32px
  xl: '3rem',         // 48px
  '2xl': '4rem',      // 64px
  '3xl': '6rem',      // 96px
} as const;

// ============================================================================
// TYPOGRAPHY SCALE
// ============================================================================

export const typography = {
  // Font families
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
  },

  // Font sizes
  fontSize: {
    xs: { size: '0.75rem', lineHeight: '1rem' },           // 12px
    sm: { size: '0.875rem', lineHeight: '1.25rem' },       // 14px
    base: { size: '1rem', lineHeight: '1.5rem' },          // 16px
    lg: { size: '1.125rem', lineHeight: '1.75rem' },       // 18px
    xl: { size: '1.25rem', lineHeight: '1.75rem' },        // 20px
    '2xl': { size: '1.5rem', lineHeight: '2rem' },         // 24px
    '3xl': { size: '1.875rem', lineHeight: '2.25rem' },    // 30px
    '4xl': { size: '2.25rem', lineHeight: '2.5rem' },      // 36px
    '5xl': { size: '3rem', lineHeight: '1.2' },            // 48px
    '6xl': { size: '3.75rem', lineHeight: '1.2' },         // 60px
    '7xl': { size: '4.5rem', lineHeight: '1.2' },          // 72px
  },

  // Font weights
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Line height
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Text styles (pre-composed)
  styles: {
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: '1.3',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: '1.4',
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: '1.4',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: '1.5',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: '1.5',
    },
    body: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5',
    },
    bodySmall: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.25',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: '1rem',
      letterSpacing: '0.025em',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.25',
      letterSpacing: '0.025em',
    },
    button: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: '1.5',
      letterSpacing: '0.025em',
    },
    buttonSmall: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.25',
    },
  },
} as const;

// ============================================================================
// SHADOWS & EFFECTS
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  // Glassmorphic specific shadows
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  glassSmall: '0 4px 15px 0 rgba(31, 38, 135, 0.2)',
  glassLarge: '0 15px 35px 0 rgba(31, 38, 135, 0.5)',
  // Glow effects
  orangeGlow: '0 0 30px rgba(249, 115, 22, 0.3)',
  orangeGlowSmall: '0 0 15px rgba(249, 115, 22, 0.2)',
  orangeGlowLarge: '0 0 50px rgba(249, 115, 22, 0.4)',
} as const;

// ============================================================================
// BACKDROP & BLUR EFFECTS
// ============================================================================

export const effects = {
  backdrop: {
    none: 'none',
    blur: 'blur(10px)',
    blurMd: 'blur(12px)',
    blurLg: 'blur(16px)',
  },
  // Backdrop filter for glassmorphism
  glassmorphic: {
    light: 'backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);',
    medium: 'backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);',
    heavy: 'backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);',
  },
  // Animation durations
  transition: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  // Easing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    elasticOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

// ============================================================================
// BREAKPOINTS (Responsive Design)
// ============================================================================

export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  offcanvas: 1050,
  modal: 1060,
  popover: 1070,
  tooltip: 1080,
  notification: 1090,
  max: 9999,
} as const;

// ============================================================================
// COMPONENT-SPECIFIC STYLES
// ============================================================================

export const componentStyles = {
  // Card styles with glassmorphism
  card: {
    base: {
      background: colors.surface.glass,
      border: `1px solid ${colors.border.light}`,
      borderRadius: borderRadius.card,
      padding: spacing.md,
      backdropFilter: 'blur(10px)',
      boxShadow: shadows.glass,
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    hover: {
      background: colors.surface.glassLight,
      border: `1px solid ${colors.border.medium}`,
      boxShadow: shadows.glassLarge,
      transform: 'translateY(-4px)',
    },
    active: {
      border: `2px solid ${colors.orange[500]}`,
      boxShadow: shadows.orangeGlow,
    },
  },

  // Button styles
  button: {
    base: {
      borderRadius: borderRadius.button,
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.base.size,
      fontWeight: typography.fontWeight.semibold,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    primary: {
      background: colors.orange[500],
      color: colors.text.primary,
      boxShadow: shadows.orangeGlow,
    },
    primaryHover: {
      background: colors.orange[600],
      boxShadow: shadows.orangeGlowLarge,
      transform: 'scale(1.02)',
    },
    secondary: {
      background: colors.surface.glassMedium,
      color: colors.text.primary,
      border: `1px solid ${colors.border.light}`,
    },
    secondaryHover: {
      background: colors.surface.glassDark,
      border: `1px solid ${colors.border.medium}`,
    },
  },

  // Input field styles
  input: {
    base: {
      background: colors.surface.glass,
      border: `1px solid ${colors.border.light}`,
      borderRadius: borderRadius.input,
      padding: `${spacing.sm} ${spacing.md}`,
      color: colors.text.primary,
      fontSize: typography.fontSize.base.size,
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    focus: {
      borderColor: colors.orange[500],
      boxShadow: `0 0 0 3px ${colors.orange[500]}20`,
      outline: 'none',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      backgroundColor: colors.background.tertiary,
    },
  },

  // Progress circle styles
  progressCircle: {
    background: colors.surface.glass,
    trackColor: `${colors.orange[500]}40`,
    fillColor: colors.orange[500],
    glowColor: colors.orange[500],
  },

  // Badge styles
  badge: {
    borderRadius: borderRadius.full,
    padding: `${spacing['1']} ${spacing['2']}`,
    fontSize: typography.fontSize.xs.size,
    fontWeight: typography.fontWeight.semibold,
  },

  // Stat card specific
  statCard: {
    background: colors.surface.glass,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.largeCard,
    padding: spacing.lg,
    backdropFilter: 'blur(10px)',
    boxShadow: shadows.glass,
  },

  // Modal/Dialog styles
  modal: {
    background: colors.background.secondary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.modal,
    boxShadow: shadows['2xl'],
    backdropFilter: 'blur(5px)',
  },
} as const;

// ============================================================================
// ANIMATION PRESETS
// ============================================================================

export const animations = {
  fadeIn: {
    duration: effects.transition.base,
    easing: effects.easing.out,
  },
  slideUp: {
    duration: effects.transition.base,
    easing: effects.easing.out,
  },
  slideDown: {
    duration: effects.transition.base,
    easing: effects.easing.out,
  },
  scaleIn: {
    duration: effects.transition.base,
    easing: effects.easing.elasticOut,
  },
  pulse: {
    duration: '2s',
    easing: effects.easing.inOut,
  },
  spin: {
    duration: '1s',
    easing: effects.easing.linear,
  },
} as const;

// ============================================================================
// THEME EXPORT
// ============================================================================

export const theme = {
  colors,
  borderRadius,
  spacing,
  typography,
  shadows,
  effects,
  breakpoints,
  zIndex,
  componentStyles,
  animations,
} as const;

export default theme;

import type {
  TsElevation, TsIntent, TsRadius, TsShadow, TsStrokeColor, TsSurface,
  TsStrokeWeight, TsFontSize, TsTracking, TsFontWeight, TsTypeface, TsColor, TsSize,
} from './types';
import type { BreakpointType, Breakpoints } from './types';


export const ts_size: Record<TsSize, string> = {
  'fixed-1': 'var(--size-fixed1)',
  'fixed-2': 'var(--size-fixed2)',
  'fixed-3': 'var(--size-fixed3)',
  'fixed-4': 'var(--size-fixed4)',
  'fixed-5': 'var(--size-fixed5)',
  'fixed-6': 'var(--size-fixed6)',
  'fixed-8': 'var(--size-fixed8)',
  'fixed-10': 'var(--size-fixed10)',
  'fixed-12': 'var(--size-fixed12)',
  'fixed-16': 'var(--size-fixed16)',
  'fixed-18': 'var(--size-fixed18)',
  'fixed-20': 'var(--size-fixed20)',
  'fixed-24': 'var(--size-fixed24)',
  'fixed-28': 'var(--size-fixed28)',
  'fixed-32': 'var(--size-fixed32)',
  'fixed-36': 'var(--size-fixed36)',
  'relative-1': 'var(--size-relative1)',
  'relative-2': 'var(--size-relative2)',
  'relative-3': 'var(--size-relative3)',
  'relative-4': 'var(--size-relative4)',
  'relative-5': 'var(--size-relative5)',
  'relative-6': 'var(--size-relative6)',
  'relative-8': 'var(--size-relative8)',
  'relative-10': 'var(--size-relative10)',
  'relative-12': 'var(--size-relative12)',
  'relative-16': 'var(--size-relative16)',
  'relative-18': 'var(--size-relative18)',
  'relative-20': 'var(--size-relative20)',
  'relative-24': 'var(--size-relative24)',
  'relative-28': 'var(--size-relative28)',
  'relative-32': 'var(--size-relative32)',
  'relative-36': 'var(--size-relative36)',
  'fluid-1': 'var(--size-fluid1)',
  'fluid-2': 'var(--size-fluid2)',
  'fluid-3': 'var(--size-fluid3)',
  'fluid-4': 'var(--size-fluid4)',
  'fluid-5': 'var(--size-fluid5)',
  'fluid-6': 'var(--size-fluid6)',
};

export const ts_level: Record<TsElevation, string> = {
  base: 'var(--elevation-levelBase)',
  low: 'var(--elevation-levelLow)',
  raised: 'var(--elevation-levelRaised)',
  medium: 'var(--elevation-levelMedium)',
  high: 'var(--elevation-levelHigh)',
  max: 'var(--elevation-levelMax)',
};

export const ts_radius: Record<TsRadius, string> = {
  sm: 'var(--shape-radiusSm)',
  md: 'var(--shape-radiusMd)',
  lg: 'var(--shape-radiusLg)',
  xl: 'var(--shape-radiusXl)',
  '2xl': 'var(--shape-radius2xl)',
  full: 'var(--shape-radiusFull)',
};

export const ts_stroke_weight: Record<TsStrokeWeight, string> = {
  light: 'var(--shape-strokeLight)',
  medium: 'var(--shape-strokeMedium)',
  'semi-bold': 'var(--shape-strokeSemiBold)',
  bold: 'var(--shape-strokeBold)',
};

export const ts_intent: Record<TsIntent, string> = {
  primary: 'var(--colors-primary)',
  secondary: 'var(--colors-secondary)',
  accent: 'var(--colors-accent)',
  info: 'var(--colors-info)',
  success: 'var(--colors-success)',
  warning: 'var(--colors-warning)',
  error: 'var(--colors-error)',
};

export const ts_stroke_color: Record<TsStrokeColor, string> = {
  subtle: 'var(--colors-strokeSubtle)',
  default: 'var(--colors-strokeDefault)',
  strong: 'var(--colors-strokeStrong)',
};

export const ts_surface: Record<TsSurface, string> = {
  base: 'var(--colors-bgBase)',
  surface: 'var(--colors-bgSurface)',
  subtle: 'var(--colors-bgSubtle)',
  raised: 'var(--colors-bgRaised)',
  overlay: 'var(--colors-bgOverlay)',
  floating: 'var(--colors-bgFloating)',
};

export const ts_shadow: Record<TsShadow, string> = {
  base: 'var(--elevation-boxShadowBase)',
  low: 'var(--elevation-boxShadowLow)',
  raised: 'var(--elevation-boxShadowRaised)',
  medium: 'var(--elevation-boxShadowMedium)',
  high: 'var(--elevation-boxShadowHigh)',
  max: 'var(--elevation-boxShadowMax)',
};

export const ts_font_size: Record<TsFontSize, string> = {
  '2xs': 'var(--typography-text2xs)',
  xs: 'var(--typography-textXs)',
  sm: 'var(--typography-textSm)',
  base: 'var(--typography-textBase)',
  md: 'var(--typography-textMd)',
  lg: 'var(--typography-textLg)',
  xl: 'var(--typography-textXl)',
  '2xl': 'var(--typography-text2xl)',
  '3xl': 'var(--typography-text3xl)',
  '4xl': 'var(--typography-text4xl)',
  '5xl': 'var(--typography-text5xl)',
  '6xl': 'var(--typography-text6xl)',
};

export const ts_line_height: Record<TsTracking, string> = {
  compact: 'var(--typography-leadingCompact)',
  tight: 'var(--typography-leadingTight)',
  snug: 'var(--typography-leadingSnug)',
  normal: 'var(--typography-leadingNormal)',
  relaxed: 'var(--typography-leadingRelaxed)',
  wide: 'var(--typography-leadingWide)',
};

export const ts_letter_spacing: Record<TsTracking, string> = {
  compact: 'var(--typography-trackingCompact)',
  tight: 'var(--typography-trackingTight)',
  snug: 'var(--typography-trackingSnug)',
  normal: 'var(--typography-trackingNormal)',
  relaxed: 'var(--typography-trackingRelaxed)',
  wide: 'var(--typography-trackingWide)',
};

export const ts_font_weight: Record<TsFontWeight, string> = {
  light: 'var(--typography-weightLight)',
  regular: 'var(--typography-weightRegular)',
  medium: 'var(--typography-weightMedium)',
  'semi-bold': 'var(--typography-weightSemibold)',
  bold: 'var(--typography-weightBold)',
};

export const ts_typeface: Record<TsTypeface, string> = {
  body: 'var(--typography-fontBody)',
  mono: 'var(--typography-fontMono)',
  headline: 'var(--typography-fontHeadline)',
};

export const ts_color: Record<TsColor, string> = {
  primary: 'var(--colors-textPrimary)',
  secondary: 'var(--colors-textSecondary)',
  muted: 'var(--colors-textMuted)',
  inverse: 'var(--colors-textInverse)',
  accent: 'var(--colors-accent)',
  info: 'var(--colors-info)',
  success: 'var(--colors-success)',
  warning: 'var(--colors-warning)',
  error: 'var(--colors-error)',
};


// ======================================================================================
export const default_breakpoints: Breakpoints = {
  compact: 480,
  small: 640,
  regular: 768,
  large: 1024,
  extended: 1280,
  ultra: 1536,
  cinema: 1920,
};

export const breakpoint_list: BreakpointType[] = ['cinema', 'compact', 'extended', 'large', 'small', 'regular', 'ultra'];

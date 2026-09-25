import type {
  SxElevation, SxFit, SxIntent, SxRadius, SxShadow, SxSpace, SxStrokeColor, SxSurface,
  SxStrokeWeight, SxFontSize, SxTracking, SxFontWeight, SxTypeface, SxColor, SxGap,
} from './types';
import type { BreakpointType, Breakpoints } from './types';


export const sxSpacingMap: Record<SxGap | SxSpace, string> = {
  'gap-1':    'var(--spacing-gap1)',
  'gap-2':    'var(--spacing-gap2)',
  'gap-3':    'var(--spacing-gap3)',
  'gap-4':    'var(--spacing-gap4)',
  'gap-5':    'var(--spacing-gap5)',
  'gap-6':    'var(--spacing-gap6)',
  'gap-8':    'var(--spacing-gap8)',
  'gap-10':   'var(--spacing-gap10)',
  'gap-12':   'var(--spacing-gap12)',
  'gap-16':   'var(--spacing-gap16)',
  'gap-18':   'var(--spacing-gap18)',
  'gap-20':   'var(--spacing-gap20)',
  'gap-24':   'var(--spacing-gap24)',
  'gap-28':   'var(--spacing-gap28)',
  'gap-32':   'var(--spacing-gap32)',
  'gap-36':   'var(--spacing-gap36)',
  'space-1':  'var(--spacing-space1)',
  'space-2':  'var(--spacing-space2)',
  'space-3':  'var(--spacing-space3)',
  'space-4':  'var(--spacing-space4)',
  'space-5':  'var(--spacing-space5)',
  'space-6':  'var(--spacing-space6)',
  'space-8':  'var(--spacing-space8)',
  'space-10': 'var(--spacing-space10)',
  'space-12': 'var(--spacing-space12)',
  'space-16': 'var(--spacing-space16)',
  'space-18': 'var(--spacing-space18)',
  'space-20': 'var(--spacing-space20)',
  'space-24': 'var(--spacing-space24)',
  'space-28': 'var(--spacing-space28)',
  'space-32': 'var(--spacing-space32)',
  'space-36': 'var(--spacing-space36)',
};

export const sxFitMap: Record<SxFit, string> = {
  auto:     'auto',
  fill:     '100%',
  half:     '50%',
  third:    '33.333%',
  quarter:  '25%',
};

export const sxLevelMap: Record<SxElevation, string> = {
  base:     'var(--elevation-levelBase)',
  low:      'var(--elevation-levelLow)',
  raised:   'var(--elevation-levelRaised)',
  medium:   'var(--elevation-levelMedium)',
  high:     'var(--elevation-levelHigh)',
  max:      'var(--elevation-levelMax)',
};

export const sxRadiusMap: Record<SxRadius, string> = {
  sm:     'var(--shape-radiusSm)',
  md:     'var(--shape-radiusMd)',
  lg:     'var(--shape-radiusLg)',
  xl:     'var(--shape-radiusXl)',
  '2xl':  'var(--shape-radius2xl)',
  full:   'var(--shape-radiusFull)',
};

export const sxStrokeWeightMap: Record<SxStrokeWeight, string> = {
  light:        'var(--shape-strokeLight)',
  medium:       'var(--shape-strokeMedium)',
  'semi-bold':  'var(--shape-strokeSemiBold)',
  bold:         'var(--shape-strokeBold)',
};

export const sxIntentMap: Record<SxIntent, string> = {
  primary:    'var(--colors-primary)',
  secondary:  'var(--colors-secondary)',
  accent:     'var(--colors-accent)',
  info:       'var(--colors-info)',
  success:    'var(--colors-success)',
  warning:    'var(--colors-warning)',
  error:      'var(--colors-error)',
};

export const sxStrokeColor: Record<SxStrokeColor, string> = {
  subtle:   'var(--colors-strokeSubtle)',
  default:  'var(--colors-strokeDefault)',
  strong:   'var(--colors-strokeStrong)',
};

export const sxSurface: Record<SxSurface, string> = {
  base:     'var(--colors-bgBase)',
  surface:  'var(--colors-bgSurface)',
  subtle:   'var(--colors-bgSubtle)',
  raised:   'var(--colors-bgRaised)',
  overlay:  'var(--colors-bgOverlay)',
  floating: 'var(--colors-bgFloating)',
};

export const sxShadow: Record<SxShadow, string> = {
  base:     'var(--elevation-boxShadowBase)',
  low:      'var(--elevation-boxShadowLow)',
  raised:   'var(--elevation-boxShadowRaised)',
  medium:   'var(--elevation-boxShadowMedium)',
  high:     'var(--elevation-boxShadowHigh)',
  max:      'var(--elevation-boxShadowMax)',
};

export const sxFontSize: Record<SxFontSize, string> = {
  '2xs':  'var(--typography-text2xs)',
  'xs':   'var(--typography-textXs)',
  'sm':   'var(--typography-textSm)',
  'base': 'var(--typography-textBase)',
  'md':   'var(--typography-textMd)',
  'lg':   'var(--typography-textLg)',
  'xl':   'var(--typography-textXl)',
  '2xl':  'var(--typography-text2xl)',
  '3xl':  'var(--typography-text3xl)',
  '4xl':  'var(--typography-text4xl)',
  '5xl':  'var(--typography-text5xl)',
  '6xl':  'var(--typography-text6xl)',
};

export const sxLineHeight: Record<SxTracking, string> = {
  compact:  'var(--typography-leadingCompact)',
  tight:    'var(--typography-leadingTight)',
  snug:     'var(--typography-leadingSnug)',
  normal:   'var(--typography-leadingNormal)',
  relaxed:  'var(--typography-leadingRelaxed)',
  wide:     'var(--typography-leadingWide)',
};

export const sxLetterSpacing: Record<SxTracking, string> = {
  compact:  'var(--typography-trackingCompact)',
  tight:    'var(--typography-trackingTight)',
  snug:     'var(--typography-trackingSnug)',
  normal:   'var(--typography-trackingNormal)',
  relaxed:  'var(--typography-trackingRelaxed)',
  wide:     'var(--typography-trackingWide)',
};

export const sxFontWeight: Record<SxFontWeight, string> = {
  light:        'var(--typography-weightLight)',
  regular:      'var(--typography-weightRegular)',
  medium:       'var(--typography-weightMedium)',
  'semi-bold':  'var(--typography-weightSemibold)',
  bold:         'var(--typography-weightBold)',
};

export const sxTypeface: Record<SxTypeface, string> = {
  body:     'var(--typography-fontBody)',
  mono:     'var(--typography-fontMono)',
  headline: 'var(--typography-fontHeadline)',
};

export const sxColor: Record<SxColor, string> = {
  primary:    'var(--colors-textPrimary)',
  secondary:  'var(--colors-textSecondary)',
  muted:      'var(--colors-textMuted)',
  inverse:    'var(--colors-textInverse)',
  accent:     'var(--colors-accent)',
  info:       'var(--colors-info)',
  success:    'var(--colors-success)',
  warning:    'var(--colors-warning)',
  error:      'var(--colors-error)',
};


// ======================================================================================
export const defaultBreakpoints: Breakpoints = {
  compact: 480,
  small: 640,
  regular: 768,
  large: 1024,
  extended: 1280,
  ultra: 1536,
  cinema: 1920,
};

export const breakpointList: BreakpointType[] = ['cinema', 'compact', 'extended', 'large', 'small', 'regular', 'ultra'];

import type { CSSProperties } from 'react';
import type {
  StyleValue, SxColor, SxElevation, SxFit, SxTypeface, SxFontSize, SxFontWeight,
  SxIntent, SxProps, SxRadius, SxShadow, SxSpace, SxStrokeColor, SxStrokeWeight,
  SxSurface, SxTracking,
  BreakpointType, ThemeTokensType, ResponsiveProp, BreakpointOptions, MediaQueryHook,
  VariantRegistry,
} from './types';
import { useMemo, useSyncExternalStore } from 'react';
import {
  sx_fit, sx_intent, sx_radius, sx_spacing, sx_stroke_color, sx_stroke_weight,
  sx_color, sx_typeface, sx_font_size, sx_font_weight, sx_letter_spacing, sx_level,
  sx_line_height, sx_shadow, sx_surface,
  breakpoint_list, default_breakpoints,
} from './constants';
import { tokens } from './tokens';


// UTILS ================================================================================
export const breakpointsSorted: { key: BreakpointType, value: number }[] = breakpoint_list
  .map(
    breakpoint => ({
      key: breakpoint,
      value: default_breakpoints[breakpoint],
    }))
  .sort((a, b) => a.value - b.value);


export const resolveBreakpoint = <T>(
  prop: ResponsiveProp<T>,
  breakpoint: BreakpointType | undefined,
): T | undefined => {
  if (prop === undefined || prop === null) return undefined;
 
  // primitive or array
  if (typeof prop !== 'object' || Array.isArray(prop)) {
    if (Array.isArray(prop)) {
      if (breakpoint === undefined) return undefined;
      const index = breakpointsSorted.findIndex(b => b.key === breakpoint);
      return prop[Math.min(index, prop.length -1)] ?? prop[0];
    }
    return prop;
  }
 
  // search object map fallback
  if (breakpoint === undefined) return undefined;
  const record: BreakpointOptions<T> = prop;
  // mobile-first cascade: start at the current breakpoint and fall back to smaller ones
  for (let i = breakpointsSorted.findIndex(b => b.key === breakpoint); i >= 0; i--) {
    const value = record[breakpointsSorted[i].key];
    if (value !== undefined) return value;
  }
 
  return undefined;
}
// ======================================================================================


// RESOLVER =============================================================================
const spaceOrFitKeys = new Set([
  'flexBasis',
  'width', 'minWidth', 'maxWidth',
  'height', 'minHeight', 'maxHeight',
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'marginVertical', 'marginHorizontal',
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'paddingVertical', 'paddingHorizontal',
  'top', 'right', 'bottom', 'left',
  'gap', 'columnGap', 'rowGap',
]);

const borderWidthKeys = new Set([
  'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
]);

const textKeys = new Set([
  'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight', 'fontFamily', 'color',
]);

const passthroughKeys = new Set([
  'display', 'alignSelf', 'alignItems', 'justifySelf', 'justifyContent',
  'flex', 'flexDirection', 'flexWrap', 'flexGrow', 'flexShrink',
  'order', 'overflow', 'position',
]);


const hasAttribute = (
  map: object,
  value: unknown,
): value is string => typeof value === 'string' && Object.hasOwn(map, value);


const resolveSxValue = (
  key: keyof SxProps,
  value: any,
): StyleValue => {
  if (value === undefined || value === null) return undefined;

  // elevation
  if (key === 'elevation') {
    if (hasAttribute(sx_level, value)) return sx_level[value as SxElevation];
  }

  // map to spacing or fit
  if (spaceOrFitKeys.has(key)) {
    if (hasAttribute(sx_spacing, value)) return sx_spacing[value as SxSpace];
    if (hasAttribute(sx_fit, value)) return sx_fit[value as SxFit];
    if (value === 'auto') return 'auto';
    if (/^-?\d*\.?\d+px$/.test(value)) return value;
  }

  // background color
  if (key === 'backgroundColor') {
    if (hasAttribute(sx_surface, value)) return sx_surface[value as SxSurface];
    if (hasAttribute(sx_intent, value)) return sx_intent[value as SxIntent];
  }

  // border
  if (key === 'borderColor') {
    if (hasAttribute(sx_intent, value)) return sx_intent[value as SxIntent];
    if (hasAttribute(sx_stroke_color, value)) return sx_stroke_color[value as SxStrokeColor];
  }
  if (key === 'borderRadius') return sx_radius[value as SxRadius];

  // the implications of adding this single edge case are making me sick
  if (borderWidthKeys.has(key)) return sx_stroke_weight[value as SxStrokeWeight];

  // box shadow
  if (key === 'boxShadow') {
    if (hasAttribute(sx_shadow, value)) return sx_shadow[value as SxShadow];
  }

  // text
  if (textKeys.has(key)) {
    if (hasAttribute(sx_font_size, value)) return sx_font_size[value as SxFontSize];
    if (key === 'lineHeight' && value in sx_line_height) return sx_line_height[value as SxTracking];
    if (key === 'letterSpacing' && value in sx_letter_spacing) return sx_letter_spacing[value as SxTracking];
    if (hasAttribute(sx_font_weight, value)) return sx_font_weight[value as SxFontWeight];
    if (hasAttribute(sx_typeface, value)) return sx_typeface[value as SxTypeface];
    if (hasAttribute(sx_color, value)) return sx_color[value as SxColor];
  }

  // css-native or raw strings
  if (passthroughKeys.has(key)) return value;

  return undefined; // fallback: eliminate undeclared values
}


/**
 * @note Do not assume that anything just passes through here. Confirm that every key in
 * `SxProps` is resolved in the `resolveSxValue` helper.
 */
export const resolveSx = (
  sx?: SxProps,
  breakpoint?: BreakpointType,
): CSSProperties => {
  if (sx === undefined || sx === null) return {} as CSSProperties;
  
  // mobile-first means we fall back to smallest breakpoint to prevent flash
  const currentBreakpoint = breakpoint ?? breakpointsSorted[0].key;

  const styles: Record<string, StyleValue> = {};

  // resolve each responsive prop to a single value at the current breakpoint
  const sxKeys = Object.keys(sx) as Array<keyof SxProps>;
  const sxResolved: Record<string, any> = {};
  for (const key of sxKeys) {
    const value = sx[key];
    if (value === undefined || value === null) continue;
    sxResolved[key] = resolveBreakpoint(value, currentBreakpoint);
  }

  // map each resolved value to a css property
  const sxResolvedEntries = Object.entries(sxResolved) as [keyof SxProps, unknown][];
  for (const [key, value] of sxResolvedEntries) {
    if (value === undefined || value === null) continue;
    const cssValue = resolveSxValue(key, value);

    // handle margin expansion
    if (key === 'margin') styles.margin = cssValue;
    else if (key === 'marginHorizontal') {
      styles.marginLeft = cssValue;
      styles.marginRight = cssValue;
    } else if (key === 'marginVertical') {
      styles.marginTop = cssValue;
      styles.marginBottom = cssValue;
    }
    
    // padding
    else if (key === 'padding') styles.padding = cssValue;
    else if (key === 'paddingHorizontal') {
      styles.paddingLeft = cssValue;
      styles.paddingRight = cssValue;
    } else if (key === 'paddingVertical') {
      styles.paddingTop = cssValue;
      styles.paddingBottom = cssValue;
    }
    
    // default: map key to css property directly
    else styles[key] = cssValue;
  }

  return styles as CSSProperties;
}
// ======================================================================================


// THEME API ============================================================================
const mergeTheme = (
  base: ThemeTokensType,
  override?: ThemeTokensType
): ThemeTokensType => {
  if (!override) return base;
  return {
    colors:     { ...base.colors,     ...override.colors, },
    typography: { ...base.typography, ...override.typography, },
    spacing:    { ...base.spacing,    ...override.spacing, },
    shape:      { ...base.shape,      ...override.shape, },
    elevation:  { ...base.elevation,  ...override.elevation, },
    optical:    { ...base.optical,    ...override.optical, },
    motion:     { ...base.motion,     ...override.motion, },
  };
}


export const SxStyles = {
  create: <T extends Record<string, SxProps>> (styles: T): T => styles,
  
  variants: <
    T extends { [K in keyof VariantRegistry]?: Record<string, NonNullable<VariantRegistry[K]>> }
  > (recipe: T): T => recipe,
  
  themes: <N extends readonly (ThemeTokensType & { name: string })[]> (
    base: ThemeTokensType = tokens,
    list: N = [] as unknown as N,
  ) => {
    const named = Object.fromEntries(
      list.map(({ name, ...partial }) => {
        return [name, mergeTheme(base, partial)]
      })
    ) as { [K in N[number]['name']]: ThemeTokensType };
    return Object.assign(base, named);
  },
};
// ======================================================================================


// MEDIA QUERIES ========================================================================
const getCurrentBreakpoint = (width: number): BreakpointType => {
  for (let i = breakpointsSorted.length -1; i >=0; i--) {
    if (width >= breakpointsSorted[i].value) return breakpointsSorted[i].key;
  }
  return breakpointsSorted[0].key;  // fallback
}

const listeners = new Set<() => void>();
let current: BreakpointType | undefined;
let teardown: (() => void) | undefined;


const updateBreakpoint = () => {
  const next = getCurrentBreakpoint(window.innerWidth);
  if (next === current) return; // only notify when a breakpoint is crossed
  current = next;
  listeners.forEach(notify => notify());
}


/**
 * I think this is basically what CSS' media query does
 */
const subscribeToViewport = (listener: () => void) => {
  if (listeners.size === 0) {
    current = getCurrentBreakpoint(window.innerWidth);
    const mediaQueryList = breakpointsSorted.map(breakpoint => window.matchMedia(`(min-width: ${breakpoint.value}px)`));
    mediaQueryList.forEach(mediaQuery => mediaQuery.addEventListener('change', updateBreakpoint));
    teardown = () => mediaQueryList.forEach(mediaQuery => mediaQuery.removeEventListener('change', updateBreakpoint));
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      teardown?.();
      teardown = undefined;
      current = undefined;
    }
  }
}


const getBreakpointSnapshot = () => current ?? getCurrentBreakpoint(window.innerWidth);
const getBreakpointServerSnapshot = (): BreakpointType | undefined => undefined;  // falls back on `'compact'` as a result.


/**
 * Memoizes only when `sx` and `style` are referentially stable. You are encouraged to use
 * `SxStyles.create` at module level since inline `sx={{ .... }}` recomputes every render
 */
export const useMediaQuery = (
  sx?: SxProps,
  style?: CSSProperties,
): MediaQueryHook => {
  const breakpoint = useSyncExternalStore(subscribeToViewport, getBreakpointSnapshot, getBreakpointServerSnapshot);
  return useMemo(() => {
    const sxStyles = resolveSx(sx, breakpoint);
    const cssProperties = { ...sxStyles, ...style };
    return ({ cssProperties, breakpoint });
  }, [sx, style, breakpoint]);
}
// ======================================================================================

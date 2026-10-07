import type { CSSProperties } from 'react';
import type {
  StyleValue, TsColor, TsElevation, TsTypeface, TsFontSize, TsFontWeight, TsIntent,
  TSProperties, TsRadius, TsShadow, TsStrokeColor, TsStrokeWeight, TsSize,
  TsSurface, TsTracking,
  BreakpointType, ThemeTokensType, ResponsiveProp, BreakpointOptions, MediaQueryHook,
  ThemeProviderValue,
  VariantRegistry,
} from './types';
import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import {
  ts_intent, ts_radius, ts_stroke_color, ts_stroke_weight, ts_color, ts_typeface,
  ts_font_size, ts_font_weight, ts_level, ts_line_height, ts_shadow, ts_surface, ts_size,
  ts_letter_spacing,
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


const resolveThemeSheetValue = (
  key: keyof TSProperties,
  value: any,
): StyleValue => {
  if (value === undefined || value === null) return undefined;

  // elevation
  if (key === 'elevation') {
    if (hasAttribute(ts_level, value)) return ts_level[value as TsElevation];
  }

  // map to spacing or fit
  if (spaceOrFitKeys.has(key)) {
    if (hasAttribute(ts_size, value)) return ts_size[value as TsSize];
    if (value === 'auto') return 'auto';
    if (/^-?\d*\.?\d+px$/.test(value)) return value;
  }

  // background color
  if (key === 'backgroundColor') {
    if (hasAttribute(ts_surface, value)) return ts_surface[value as TsSurface];
    if (hasAttribute(ts_intent, value)) return ts_intent[value as TsIntent];
  }

  // border
  if (key === 'borderColor') {
    if (hasAttribute(ts_intent, value)) return ts_intent[value as TsIntent];
    if (hasAttribute(ts_stroke_color, value)) return ts_stroke_color[value as TsStrokeColor];
  }
  if (key === 'borderRadius') return ts_radius[value as TsRadius];

  // the implications of adding this single edge case are making me sick
  if (borderWidthKeys.has(key)) return ts_stroke_weight[value as TsStrokeWeight];

  // box shadow
  if (key === 'boxShadow') {
    if (hasAttribute(ts_shadow, value)) return ts_shadow[value as TsShadow];
  }

  // text
  if (textKeys.has(key)) {
    if (hasAttribute(ts_font_size, value)) return ts_font_size[value as TsFontSize];
    if (key === 'lineHeight' && value in ts_line_height) return ts_line_height[value as TsTracking];
    if (key === 'letterSpacing' && value in ts_letter_spacing) return ts_letter_spacing[value as TsTracking];
    if (hasAttribute(ts_font_weight, value)) return ts_font_weight[value as TsFontWeight];
    if (hasAttribute(ts_typeface, value)) return ts_typeface[value as TsTypeface];
    if (hasAttribute(ts_color, value)) return ts_color[value as TsColor];
  }

  // css-native or raw strings
  if (passthroughKeys.has(key)) return value;

  return undefined; // fallback: eliminate undeclared values
}


/**
 * @note Do not assume that anything just passes through here. Confirm that every key in
 * `TSProperties` is resolved in the `resolveThemeSheetValue` helper.
 */
export const resolveThemeSheet = (
  theme?: TSProperties,
  breakpoint?: BreakpointType,
): CSSProperties => {
  if (theme === undefined || theme === null) return {} as CSSProperties;
  
  // mobile-first means we fall back to smallest breakpoint to prevent flash
  const currentBreakpoint = breakpoint ?? breakpointsSorted[0].key;

  const styles: Record<string, StyleValue> = {};

  // resolve each responsive prop to a single value at the current breakpoint
  const tsKeys = Object.keys(theme) as Array<keyof TSProperties>;
  const tsResolved: Record<string, any> = {};
  for (const key of tsKeys) {
    const value = theme[key];
    if (value === undefined || value === null) continue;
    tsResolved[key] = resolveBreakpoint(value, currentBreakpoint);
  }

  // map each resolved value to a css property
  const tsResolvedEntries = Object.entries(tsResolved) as [keyof TSProperties, unknown][];
  for (const [key, value] of tsResolvedEntries) {
    if (value === undefined || value === null) continue;
    const cssValue = resolveThemeSheetValue(key, value);

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


// API ==================================================================================
const mergeTheme = (
  base: ThemeTokensType,
  override?: ThemeTokensType
): ThemeTokensType => {
  if (!override) return base;
  return {
    colors:     { ...base.colors,     ...override.colors, },
    typography: { ...base.typography, ...override.typography, },
    size:       { ...base.size,       ...override.size, },
    shape:      { ...base.shape,      ...override.shape, },
    elevation:  { ...base.elevation,  ...override.elevation, },
    optical:    { ...base.optical,    ...override.optical, },
    motion:     { ...base.motion,     ...override.motion, },
  };
}


export const ThemeSheet = {
  create: <T extends Record<string, TSProperties>> (styles: T): T => styles,
  
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
 * Memoizes only when `theme` and `style` are referentially stable. You are encouraged to use
 * `ThemeSheet.create` at module level since inline `theme={{ .... }}` recomputes every render
 */
export const useMediaQuery = (
  theme?: TSProperties,
  style?: CSSProperties,
): MediaQueryHook => {
  const breakpoint = useSyncExternalStore(subscribeToViewport, getBreakpointSnapshot, getBreakpointServerSnapshot);
  return useMemo(() => {
    const tsStyles = resolveThemeSheet(theme, breakpoint);
    const cssProperties = { ...tsStyles, ...style };
    return ({ cssProperties, breakpoint });
  }, [theme, style, breakpoint]);
}
// ======================================================================================


// CONTEXT ==============================================================================
/**
 * Initializes theme context
 */
export const ThemeContext = createContext<ThemeProviderValue | null>(null);

/**
 * Creates theme context hook
 */
export const useTheme = (): ThemeProviderValue => {
  const values = useContext(ThemeContext);
  if (!values) throw new Error ('invalid theme');
  return values;
}

/**
 * Flattens the resolved token set into CSS custom properties
 * and injects them onto a wrapping div.
 * e.g. colors.primary -> --colors-primary
 */
export const toCSSVariables = (tokens: ThemeTokensType): Record<string, string> => {
  return Object
    .entries(tokens)
    .reduce((acc, [category, values]) => {
      Object.entries(values).forEach(([key, value]) => {
        acc[`--${category}-${key}`] = value as string
      });
      return acc;
    },
    {} as Record<string, string>
  );
}

import type { CSSProperties } from 'react';
import type {
  StyleValue, SxColor, SxElevation, SxFit, SxTypeface, SxFontSize, SxFontWeight,
  SxIntent, SxProps, SxRadius, SxShadow, SxSpace, SxStrokeColor, SxStrokeWeight,
  SxSurface, SxTracking,
  BreakpointOptions, BreakpointType, ResponsiveProp,
  ThemeTokensType,
  VariantRegistry,
} from './types';
import { useLayoutEffect, useMemo, useState } from 'react';
import {
  sxFitMap, sxIntentMap, sxRadiusMap, sxSpacingMap, sxStrokeColor, sxStrokeWeightMap,
  sxColor, sxTypeface, sxFontSize, sxFontWeight, sxLetterSpacing, sxLevelMap,
  sxLineHeight, sxShadow, sxSurface,
  breakpointList, defaultBreakpoints,
} from './constants';
import { tokens } from './tokens';


export const breakpointsSorted = breakpointList.map(
  breakpoint => {
    return ({ key: breakpoint, value: defaultBreakpoints[breakpoint], })
  })
  .sort((a, b) => a.value - b.value);


const getCurrentBreakpoint = (width?: number): BreakpointType | undefined => {
  if (width === undefined) return undefined;

  let current: BreakpointType = 'cinema';
  let capacity = breakpointsSorted.length -1;
  for (let i = capacity; i >= 0; i--) {
    if (width >= breakpointsSorted[i].value) {
      current = breakpointsSorted[i].key;
      break;
    }
  }
  return current;
}


export const resolveBreakpoint = <T>(
  prop: ResponsiveProp<T>,
  breakpoint: BreakpointType | undefined,
): T | undefined => {
  if (prop === undefined || prop === null) return undefined;

  // primitive or array
  if (typeof prop !== 'object' || Array.isArray(prop)) {
    if (Array.isArray(prop)) {
      if (breakpoint === undefined) return undefined;
      const index = breakpointList.indexOf(breakpoint);
      return prop[Math.min(index, prop.length -1)] ?? prop[0];
    }
    return prop;
  }

  // search object map fallback
  if (breakpoint === undefined) return undefined;
  const record: BreakpointOptions<T> = prop;
  const len = breakpointList.length -1;
  for (let i = len; i >= 0; i--) {
    const key: BreakpointType = breakpointList[i];
    const value = record[key];
    if (value !== undefined) return value;
  }

  return undefined;
}


export const useMediaQuery = () => {
  const [width, setWidth] = useState<number | undefined>(undefined);

  // no dependency because we only want the listener attach once when the component mounts
  // we apply immediate pre-paint `setWidth(window.innerWidth)` to set the width before the browser paints
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    setWidth(window.innerWidth);

    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  const breakpoint = useMemo(() => {
    return getCurrentBreakpoint(width);
  }, [width]);

  return { breakpoint, };
}
// ======================================================================================


// ======================================================================================
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


const resolveSxValue = (
  key: keyof SxProps,
  value: any,
): StyleValue => {
  if (value === undefined || value === null) return undefined;

  // elevation
  if (key === 'elevation') {
    if (value in sxLevelMap) return sxLevelMap[value as SxElevation];
  }

  // map to spacing or fit
  if (spaceOrFitKeys.has(key)) {
    if (value in sxSpacingMap) return sxSpacingMap[value as SxSpace];
    if (value in sxFitMap) return sxFitMap[value as SxFit];
    if (value === 'auto') return 'auto';
    if (/^-?\d*\.?\d+px$/.test(value)) return value;
  }

  // background color
  if (key === 'backgroundColor') {
    if (value in sxSurface) return sxSurface[value as SxSurface];
    if (value in sxIntentMap) return sxIntentMap[value as SxIntent];
  }

  // border
  if (key === 'borderColor') {
    if (value in sxIntentMap) return sxIntentMap[value as SxIntent];
    if (value in sxStrokeColor) return sxStrokeColor[value as SxStrokeColor];
  }
  if (key === 'borderRadius') return sxRadiusMap[value as SxRadius];

  // the implications of adding this single edge case are making me sick
  if (borderWidthKeys.has(key)) return sxStrokeWeightMap[value as SxStrokeWeight];

  // box shadow
  if (key === 'boxShadow') {
    if (value in sxShadow) return sxShadow[value as SxShadow];
  }

  // text
  if (textKeys.has(key)) {
    if (value in sxFontSize) return sxFontSize[value as SxFontSize];
    if (key === 'lineHeight' && value in sxLineHeight) return sxLineHeight[value as SxTracking];
    if (key === 'letterSpacing' && value in sxLetterSpacing) return sxLetterSpacing[value as SxTracking];
    if (value in sxFontWeight) return sxFontWeight[value as SxFontWeight];
    if (value in sxTypeface) return sxTypeface[value as SxTypeface];
    if (value in sxColor) return sxColor[value as SxColor];
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
  if (breakpoint === undefined || breakpoint === null) return {} as CSSProperties;

  const styles: Record<string, StyleValue> = {};

  // resolve each responsive prop to a single value at the current breakpoint
  const sxKeys = Object.keys(sx) as Array<keyof SxProps>;
  const sxResolved: Record<string, any> = {};
  for (const key of sxKeys) {
    const value = sx[key];
    if (value === undefined || value === null) continue;
    sxResolved[key] = resolveBreakpoint(value, breakpoint);
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


// ======================================================================================
const mergeTheme = (
  base: ThemeTokensType,
  override?: ThemeTokensType
): ThemeTokensType => {
  if (!override) return tokens;
  return {
    colors:     { ...base.colors,     ...override.colors, },
    typography: { ...base.typography, ...override.typography, },
    spacing:    { ...base.spacing,    ...override.spacing, },
    shape:      { ...base.shape,      ...override.shape, },
    elevation:  { ...base.elevation,  ...override.elevation, },
    optical:    { ...base.optical,    ...override.optical, },
    motion:     { ...base.motion,     ...override.motion, },
  }
}


export const SxStyles = {
  create: <T extends Record<string, SxProps>> (styles: T): T => styles,
  
  variants: <
    T extends { [K in keyof VariantRegistry]?: Record<string, NonNullable<VariantRegistry[K]>> }
  > (recipe: T): T => recipe,
  
  themes: <N extends readonly (ThemeTokensType & { name: string })[]> (
    base: ThemeTokensType = tokens,
    list: N = [] as unknown as N,
  ) => {{
    const named = Object.fromEntries(
      list.map(({ name, ...partial }) => {
        return [name, mergeTheme(base, partial)]
      })
    ) as { [K in N[number]['name']]: ThemeTokensType };
    return Object.assign(base, named);
  }},
};
// ======================================================================================


// ======================================================================================

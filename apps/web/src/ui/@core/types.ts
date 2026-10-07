import type { CSSProperties, ReactNode } from 'react';
import type { ButtonVariant, GlassButtonVariant } from '../button/types';
import type { GlassViewVariant, ViewVariant } from '../view/types';
import type { ToolbarVariant } from '../toolbar/types';
import type { GlassTextFieldVariant, TextFieldVariant } from '../text-field/types';
import { tokens } from './tokens';


// THEME: Media queries =================================================================
export type BreakpointType = 'compact' | 'small' | 'regular' | 'large' | 'extended' | 'ultra' | 'cinema';
export type Breakpoints = Record<BreakpointType, number>;
export type BreakpointOptions <T> = Partial<Record<BreakpointType, T>>;
export type ResponsiveProp <T = string | number> = T | T[] | BreakpointOptions<T>;
export type MediaQueryHook = {
  cssProperties: CSSProperties;
  breakpoint: BreakpointType | undefined;
};
// ======================================================================================


// THEME: Tokens ========================================================================
// `tokens` is declared `as const` to narrow its allowed values and provides
// autocomplete. However, this forces its inferred types to be the properties'
// literal values, not `string`, which is what we want.
// The snippet below is shorthand (`colors: Record<keyof typeof tokens.colors, string>;`)
// to map the token property types to `string`
export type ThemeTokensType = {
  [K in keyof typeof tokens]: {
    [P in keyof typeof tokens[K]]: string | number;
  };
};
// ======================================================================================


// THEME: Styles ========================================================================
export type StyleValue = string | number | undefined;
export type TsDisplay = 'flex' | 'none';
export type TsFlex = 'auto' | 'none';
export type TsAlign = 'start' | 'end' | 'center' | 'stretch';
export type TsJustify = 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'stretch';
export type TsDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type TsWrap = 'wrap' | 'nowrap' | 'wrap-reverse';
export type TsOverflow = 'visible' | 'hidden' | 'scroll' | 'auto';
export type TsPosition = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
export type TsElevation = 'base' | 'low' | 'raised' | 'medium' | 'high' | 'max';
export type TsSize =
  | 'fixed-1' | 'fixed-2' | 'fixed-3' | 'fixed-4'
  | 'fixed-5' | 'fixed-6' | 'fixed-8' | 'fixed-10'
  | 'fixed-12' | 'fixed-16' | 'fixed-18' | 'fixed-20'
  | 'fixed-24' | 'fixed-28' | 'fixed-32' | 'fixed-36'
  | 'relative-1' | 'relative-2' | 'relative-3' | 'relative-4'
  | 'relative-5' | 'relative-6' | 'relative-8' | 'relative-10'
  | 'relative-12' | 'relative-16' | 'relative-18' | 'relative-20'
  | 'relative-24' | 'relative-28' | 'relative-32' | 'relative-36'
  | 'fluid-1' | 'fluid-2' | 'fluid-3' | 'fluid-4'
  | 'fluid-5' | 'fluid-6';
export type TsIntent = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type TsFill = 'filled' | 'tonal' | 'outlined' | 'ghost';
export type TsSurface = 'base' | 'surface' | 'subtle' | 'raised' | 'overlay' | 'floating';
export type TsStrokeWeight = 'light' | 'medium' | 'semi-bold' | 'bold';
export type TsStrokeColor = 'subtle' | 'default' | 'strong';
export type TsRadius = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type TsShadow = 'base' | 'low' | 'raised' | 'medium' | 'high' | 'max';
export type TsTypeface = 'body' | 'mono' | 'headline';
export type TsFontSize = '2xs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type TsColor = 'primary' | 'secondary' | 'muted' | 'inverse' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type TsFontWeight = 'light' | 'regular' | 'medium' | 'semi-bold' | 'bold';
export type TsTracking = 'compact' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'wide';
export type TSProperties = {
  display?: ResponsiveProp<TsDisplay>;
  alignSelf?: ResponsiveProp<TsAlign>;
  alignItems?: ResponsiveProp<TsAlign>;
  justifySelf?: ResponsiveProp<TsJustify>;
  justifyContent?: ResponsiveProp<TsJustify>;
  order?: ResponsiveProp<number>;
  overflow?: ResponsiveProp<TsOverflow>;
  position?: ResponsiveProp<TsPosition>;
  elevation?: TsElevation;
  flex?: ResponsiveProp<TsFlex>;
  flexDirection?: ResponsiveProp<TsDirection>;
  flexWrap?: ResponsiveProp<TsWrap>;
  flexGrow?: ResponsiveProp<0 | 1>;
  flexShrink?: ResponsiveProp<0 | 1>;
  flexBasis?: ResponsiveProp<TsSize>;
  width?: ResponsiveProp<TsSize>;
  minWidth?: ResponsiveProp<TsSize>;
  maxWidth?: ResponsiveProp<TsSize>;
  height?: ResponsiveProp<TsSize>;
  minHeight?: ResponsiveProp<TsSize>;
  maxHeight?: ResponsiveProp<TsSize>;
  margin?: ResponsiveProp<TsSize>;
  marginVertical?: ResponsiveProp<TsSize>;
  marginHorizontal?: ResponsiveProp<TsSize>;
  marginTop?: ResponsiveProp<TsSize>;
  marginRight?: ResponsiveProp<TsSize>;
  marginBottom?: ResponsiveProp<TsSize>;
  marginLeft?: ResponsiveProp<TsSize>;
  padding?: ResponsiveProp<TsSize>;
  paddingVertical?: ResponsiveProp<TsSize>;
  paddingHorizontal?: ResponsiveProp<TsSize>;
  paddingTop?: ResponsiveProp<TsSize>;
  paddingRight?: ResponsiveProp<TsSize>;
  paddingBottom?: ResponsiveProp<TsSize>;
  paddingLeft?: ResponsiveProp<TsSize>;
  top?: ResponsiveProp<TsSize | 'auto'>;
  right?: ResponsiveProp<TsSize | 'auto'>;
  bottom?: ResponsiveProp<TsSize | 'auto'>;
  left?: ResponsiveProp<TsSize | 'auto'>;
  gap?: ResponsiveProp<TsSize>;
  columnGap?: ResponsiveProp<TsSize>;
  rowGap?: ResponsiveProp<TsSize>;
  backgroundColor?: TsSurface | TsIntent;
  boxShadow?: TsShadow;
  borderWidth?: ResponsiveProp<TsStrokeWeight>;
  borderTopWidth?: ResponsiveProp<TsStrokeWeight>;
  borderRightWidth?: ResponsiveProp<TsStrokeWeight>;
  borderBottomWidth?: ResponsiveProp<TsStrokeWeight>;
  borderLeftWidth?: ResponsiveProp<TsStrokeWeight>;
  borderRadius?: ResponsiveProp<TsRadius>;
  borderColor?: TsIntent | TsStrokeColor;
  fontFamily?: TsTypeface;
  fontSize?: ResponsiveProp<TsFontSize>;
  color?: TsColor;
  fontWeight?: ResponsiveProp<TsFontWeight>;
  lineHeight?: ResponsiveProp<TsTracking>;
  letterSpacing?: ResponsiveProp<TsTracking>;
};


// THEME: Variants ======================================================================
export interface ViewVariantExt {};
export interface GlassViewVariantExt {};
export interface ButtonVariantExt {};
export interface GlassButtonVariantExt {};
export interface ToolbarVariantExt {};
export interface TextFieldVariantExt {};
export interface GlassTextFieldVariantExt {};

export interface VariantRegistry {
  view: ViewVariant | ViewVariantExt;
  glassView: GlassViewVariant | GlassViewVariantExt;
  button: ButtonVariant | ButtonVariantExt;
  glassButton: GlassButtonVariant | GlassButtonVariantExt;
  toolbar: ToolbarVariant | ToolbarVariantExt;
  textField: TextFieldVariant | TextFieldVariant;
  glassTextField: GlassTextFieldVariant | GlassTextFieldVariantExt;
};
// ======================================================================================


// THEME: Context =======================================================================
export type ThemesType = Record<string, ThemeTokensType>;

export type ThemeProviderProps = {
  themes?: ThemesType;
  persister?: (topic: keyof StorageTopics) => StorageAdapter;
  children: ReactNode;
};

export type ThemeProviderValue = {
  tokens: ThemeTokensType;
  name: string;
  setTheme: (name: string) => void;
};
// ======================================================================================


// ACCESSIBILITY ========================================================================
type A11yState = {
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean;
  busy?: boolean;
  expanded?: boolean;
};

type A11yValue =
  | {
      now: number;
      min: number;
      max: number;
      text?: string;
    }
  | {
      now?: never;
      min?: number;
      max?: number;
      text?: string;
    };

export type A11yProps = {
  label?: string;
  role?: string;
  hint?: string;
  state?: A11yState;
  value?: A11yValue;
  hidden?: boolean;
};
// ======================================================================================


// STORAGE ==============================================================================
export type StorageTopics = {
  theme: Record<string, ThemeTokensType>,
  activeTheme: string;
};


export type StorageAdapter = {
  get: <T> (key: string) => T | null | Promise<T | null>;

  set <T> (
    key: string,
    value: T
  ): void | Promise<void>;

  remove (key: string): void | Promise<void>,
};
// ======================================================================================


// OFFICIAL =============================================================================
export type TargetEvent = { target: number | null | undefined; };

export type LayoutEvent = {
  layout: {
    width: number,
    height: number,
    x: number,
    y: number,
  },
  target: number | null | undefined,
};

export type PressEvent = {
  changedTouches: PressEvent[],
  identifier: number,
  locationX: number,
  locationY: number,
  pageX: number,
  pageY: number,
  target: number | null | undefined,
  timestamp: number,
  touches: PressEvent[]
};
// ======================================================================================


// LAYOUT ===============================================================================
export type Chrome = {
  size?: 'xsm' | 'sm' | 'md' | 'lg' | 'xl';
};

export type SlotMarker = {
  marker: {
    slotName: string;
    parentName: string;
  };
};


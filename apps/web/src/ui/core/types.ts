import type { CSSProperties } from 'react';
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
export type SxDisplay = 'flex' | 'none';
export type SxFlex = 'auto' | 'none';
export type SxAlign = 'start' | 'end' | 'center' | 'stretch';
export type SxJustify = 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'stretch';
export type SxDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type SxWrap = 'wrap' | 'nowrap' | 'wrap-reverse';
export type SxOverflow = 'visible' | 'hidden' | 'scroll' | 'auto';
export type SxPosition = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
export type SxElevation = 'base' | 'low' | 'raised' | 'medium' | 'high' | 'max';
export type SxSpace =
  | 'space-1' | 'space-2' | 'space-3' | 'space-4'
  | 'space-5' | 'space-6' | 'space-8' | 'space-10'
  | 'space-12' | 'space-16' | 'space-18' | 'space-20'
  | 'space-24' | 'space-28' | 'space-32' | 'space-36';
export type SxFit = 'auto' | 'content' | 'fill' | 'half' | 'third' | 'quarter';
export type SxGap =
  | 'gap-1' | 'gap-2' | 'gap-3' | 'gap-4'
  | 'gap-5' | 'gap-6' | 'gap-8' | 'gap-10'
  | 'gap-12' | 'gap-16' | 'gap-18' | 'gap-20'
  | 'gap-24' | 'gap-28' | 'gap-32' | 'gap-36';
export type SxIntent = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type SxFill = 'filled' | 'tonal' | 'outlined' | 'ghost';
export type SxSurface = 'base' | 'surface' | 'subtle' | 'raised' | 'overlay' | 'floating';
export type SxStrokeWeight = 'light' | 'medium' | 'semi-bold' | 'bold';
export type SxStrokeColor = 'subtle' | 'default' | 'strong';
export type SxRadius = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type SxShadow = 'base' | 'low' | 'raised' | 'medium' | 'high' | 'max';
export type SxTypeface = 'body' | 'mono' | 'headline';
export type SxFontSize = '2xs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type SxColor = 'primary' | 'secondary' | 'muted' | 'inverse' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type SxFontWeight = 'light' | 'regular' | 'medium' | 'semi-bold' | 'bold';
export type SxTracking = 'compact' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'wide';
export type SxProps = {
  display?: ResponsiveProp<SxDisplay>;
  alignSelf?: ResponsiveProp<SxAlign>;
  alignItems?: ResponsiveProp<SxAlign>;
  justifySelf?: ResponsiveProp<SxJustify>;
  justifyContent?: ResponsiveProp<SxJustify>;
  order?: ResponsiveProp<number>;
  overflow?: ResponsiveProp<SxOverflow>;
  position?: ResponsiveProp<SxPosition>;
  elevation?: SxElevation;
  flex?: ResponsiveProp<SxFlex>;
  flexDirection?: ResponsiveProp<SxDirection>;
  flexWrap?: ResponsiveProp<SxWrap>;
  flexGrow?: ResponsiveProp<0 | 1>;
  flexShrink?: ResponsiveProp<0 | 1>;
  flexBasis?: ResponsiveProp<SxSpace | SxFit>;
  width?: ResponsiveProp<SxSpace | SxFit>;
  minWidth?: ResponsiveProp<SxSpace | SxFit>;
  maxWidth?: ResponsiveProp<SxSpace | SxFit>;
  height?: ResponsiveProp<SxSpace | SxFit>;
  minHeight?: ResponsiveProp<SxSpace | SxFit>;
  maxHeight?: ResponsiveProp<SxSpace | SxFit>;
  margin?: ResponsiveProp<SxGap | SxSpace | SxFit>;
  marginVertical?: ResponsiveProp<SxGap | SxSpace | SxFit>;
  marginHorizontal?: ResponsiveProp<SxGap | SxSpace | SxFit>;
  marginTop?: ResponsiveProp<SxGap | SxSpace | SxFit>;
  marginRight?: ResponsiveProp<SxGap | SxSpace | SxFit>;
  marginBottom?: ResponsiveProp<SxGap | SxSpace | SxFit>;
  marginLeft?: ResponsiveProp<SxGap | SxSpace | SxFit>;
  padding?: ResponsiveProp<SxGap | SxSpace | SxFit>;
  paddingVertical?: ResponsiveProp<SxGap | SxSpace | SxFit>;
  paddingHorizontal?: ResponsiveProp<SxGap | SxSpace | SxFit>;
  paddingTop?: ResponsiveProp<SxGap | SxSpace | SxFit>;
  paddingRight?: ResponsiveProp<SxGap | SxSpace | SxFit>;
  paddingBottom?: ResponsiveProp<SxGap | SxSpace | SxFit>;
  paddingLeft?: ResponsiveProp<SxGap | SxSpace | SxFit>;
  top?: ResponsiveProp<SxSpace | 'auto'>;
  right?: ResponsiveProp<SxSpace | 'auto'>;
  bottom?: ResponsiveProp<SxSpace | 'auto'>;
  left?: ResponsiveProp<SxSpace | 'auto'>;
  gap?: ResponsiveProp<SxGap | SxSpace>;
  columnGap?: ResponsiveProp<SxGap | SxSpace>;
  rowGap?: ResponsiveProp<SxGap | SxSpace>;
  backgroundColor?: SxSurface | SxIntent;
  boxShadow?: SxShadow;
  borderWidth?: ResponsiveProp<SxStrokeWeight>;
  borderTopWidth?: ResponsiveProp<SxStrokeWeight>;
  borderRightWidth?: ResponsiveProp<SxStrokeWeight>;
  borderBottomWidth?: ResponsiveProp<SxStrokeWeight>;
  borderLeftWidth?: ResponsiveProp<SxStrokeWeight>;
  borderRadius?: ResponsiveProp<SxRadius>;
  borderColor?: SxIntent | SxStrokeColor;
  fontFamily?: SxTypeface;
  fontSize?: ResponsiveProp<SxFontSize>;
  color?: SxColor;
  fontWeight?: ResponsiveProp<SxFontWeight>;
  lineHeight?: ResponsiveProp<SxTracking>;
  letterSpacing?: ResponsiveProp<SxTracking>;
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

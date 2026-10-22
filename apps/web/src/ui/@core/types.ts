import type { CSSProperties, KeyboardEvent, ReactElement, ReactNode, Ref, } from 'react';
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
export type TsDisplay = 'flex' | 'none';
export type TsFlex = 'auto' | 'none';
export type TsAlign = 'start' | 'end' | 'center' | 'stretch';
export type TsJustify = 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'stretch';
export type TsDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type TsWrap = 'wrap' | 'nowrap' | 'wrap-reverse';
export type TsOverflow = 'visible' | 'hidden' | 'scroll' | 'auto';
export type TsPosition = 'static' | 'absolute' | 'fixed' | 'sticky';
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
  flexBasis?: ResponsiveProp<TsSize | 'auto'>;
  width?: ResponsiveProp<TsSize | 'auto'>;
  minWidth?: ResponsiveProp<TsSize | 'auto'>;
  maxWidth?: ResponsiveProp<TsSize | 'auto'>;
  height?: ResponsiveProp<TsSize | 'auto'>;
  minHeight?: ResponsiveProp<TsSize | 'auto'>;
  maxHeight?: ResponsiveProp<TsSize | 'auto'>;
  margin?: ResponsiveProp<TsSize | 'auto'>;
  marginVertical?: ResponsiveProp<TsSize | 'auto'>;
  marginHorizontal?: ResponsiveProp<TsSize | 'auto'>;
  marginTop?: ResponsiveProp<TsSize | 'auto'>;
  marginRight?: ResponsiveProp<TsSize | 'auto'>;
  marginBottom?: ResponsiveProp<TsSize | 'auto'>;
  marginLeft?: ResponsiveProp<TsSize | 'auto'>;
  padding?: ResponsiveProp<TsSize | 'auto'>;
  paddingVertical?: ResponsiveProp<TsSize | 'auto'>;
  paddingHorizontal?: ResponsiveProp<TsSize | 'auto'>;
  paddingTop?: ResponsiveProp<TsSize | 'auto'>;
  paddingRight?: ResponsiveProp<TsSize | 'auto'>;
  paddingBottom?: ResponsiveProp<TsSize | 'auto'>;
  paddingLeft?: ResponsiveProp<TsSize | 'auto'>;
  top?: ResponsiveProp<TsSize | 'auto'>;
  right?: ResponsiveProp<TsSize | 'auto'>;
  bottom?: ResponsiveProp<TsSize | 'auto'>;
  left?: ResponsiveProp<TsSize | 'auto'>;
  insetInlineStart?: ResponsiveProp<TsSize | 'auto'>;
  insetInlineEnd?: ResponsiveProp<TsSize | 'auto'>;
  gap?: ResponsiveProp<TsSize | 'auto'>;
  columnGap?: ResponsiveProp<TsSize | 'auto'>;
  rowGap?: ResponsiveProp<TsSize | 'auto'>;
  backgroundColor?: TsSurface | TsIntent;
  boxShadow?: TsShadow;
  borderWidth?: ResponsiveProp<TsStrokeWeight>;
  borderTopWidth?: ResponsiveProp<TsStrokeWeight>;
  borderRightWidth?: ResponsiveProp<TsStrokeWeight>;
  borderBottomWidth?: ResponsiveProp<TsStrokeWeight>;
  borderLeftWidth?: ResponsiveProp<TsStrokeWeight>;
  borderRadius?: ResponsiveProp<TsRadius>;
  borderColor?: TsStrokeColor;
  fontFamily?: TsTypeface;
  fontSize?: ResponsiveProp<TsFontSize>;
  color?: TsColor;
  fontWeight?: ResponsiveProp<TsFontWeight>;
  lineHeight?: ResponsiveProp<TsTracking>;
  letterSpacing?: ResponsiveProp<TsTracking>;
};
export type TsGlass = {
  intensity?: 'faint' | 'subtle' | 'base' | 'strong';
  tint?: TsIntent | TsSurface;
  interactive?: boolean;
};


// THEME: Variants ======================================================================
export interface VariantNamespaces {};
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
export type ViewportCoords = { x: number; y: number; };
export type ContentSize = { width: number; height: number; };

export type TargetEvent = { target: number | null | undefined; };

export type LayoutEvent = {
  layout: ViewportCoords & ContentSize,
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


// PSEUDO-OFFICIAL ======================================================================
// These are on the official react native website, just don't have dedicated pages
export type TextEventPayload = TargetEvent & {
  text: string;
  eventCount: number; // sequence counter for native-to-JS bridge sync (not available on web, 0 is fallback)
};
export type ContentSizeEventPayload = { contentSize: ContentSize };
export type KeyEventPayload = { key: string };
export type ScrollEventPayload = { contentOffset: ViewportCoords; };
export type SelectionEventPayload = { selection: { start: number; end: number; }};
// ======================================================================================


// UI ===================================================================================
export type NativeEvent<T> = { nativeEvent: T; };

export type ElementChildren = boolean | ReactElement | ElementChildren[];

export type ElementProps = {
  children?: ElementChildren;
  id?: string;
  style?: CSSProperties;
  theme?: TSProperties;
  a11y?: A11yProps;
  testID?: string;
};

export type ViewElementProps = ElementProps & {
  ref?: Ref<HTMLDivElement>;
};

export type PressElementState = {
  pressed?: boolean;
  disabled?: boolean;
};

export type PressElementProps = Omit<ElementProps, 'children'> & {
  onPress?: (event: NativeEvent<PressEvent>) => void;
  onPressIn?: (event: NativeEvent<PressEvent>) => void;
  onPressOut?: (event: NativeEvent<PressEvent>) => void;
  onPressMove?: (event: NativeEvent<PressEvent>) => void;
  onLongPress?: (event: NativeEvent<PressEvent>) => void;
  onHoverIn?: (event: NativeEvent<PressEvent>) => void;
  onHoverOut?: (event: NativeEvent<PressEvent>) => void;
  delayLongPress?: number;
  disabled?: boolean;
  children?: ElementChildren | ((state: PressElementState) => ElementChildren);
  ref?: Ref<HTMLDivElement>;
};

export type SlotMarker = {
  marker: {
    slotName: string;
    parentName: string;
  };
};

export type GroupVariant = {
  orientation?: 'horizontal' | 'vertical';
};

export type GroupItemPosition = 'first' | 'middle' | 'last' | 'only';

export type GroupItemContext<V extends GroupVariant = GroupVariant> = {
  variant: V;
  position: GroupItemPosition;
  index: number;
  count: number;
  derived: GroupItemDerived;
};

export type GroupMemberMarker = {
  groupMember: string;
};

export type GroupProps<V extends GroupVariant = GroupVariant> = ViewElementProps & { variant?: V; };

export type GroupItemProviderProps = {
  name: string;
  value: GroupItemContext | null;
  children: ReactNode;
};

export type GroupItemDerived = {
  classes?: string;
  style?: CSSProperties & Record<`--${string}`, string | number>; // allows CSS variables
};

export type GroupContainerDerived = GroupItemDerived & {
  a11y?: A11yProps; // so screen readers know the entire set is disabled
};

export type TextInputElementProps = Omit<ElementProps, 'children'> & {
  autoComplete?: string;
  autoFocus?: boolean;
  defaultValue?: string;
  editable?: boolean;
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
  maxLength?: number;
  placeholder?: string;
  readOnly?: boolean;
  submitBehavior?: 'submit' | 'newline';
  rows?: number;
  value?: string;
  onBlur?: (event: NativeEvent<TargetEvent>) => void;
  onChange?: (event: NativeEvent<TextEventPayload>) => void;
  onChangeText?: (text: string) => void;
  onContentSizeChange?: (event: NativeEvent<ContentSizeEventPayload>) => void;
  onFocus?: (event: NativeEvent<TargetEvent>) => void;
  onKeyPress?: (event: NativeEvent<KeyEventPayload>) => void;
  onPressIn?: (event: NativeEvent<PressEvent>) => void;
  onPressOut?: (event: NativeEvent<PressEvent>) => void;
  onScroll?: (event: NativeEvent<ScrollEventPayload>) => void;
  onSelectionChange?: (event: NativeEvent<SelectionEventPayload>) => void;
  onSubmitEditing?: (event: NativeEvent<TextEventPayload>) => void;
  onEndEditing?: (event: NativeEvent<TextEventPayload>) => void;
  onLayout?: (event: NativeEvent<LayoutEvent>) => void;
  ref?: Ref<HTMLTextAreaElement>;
};

export type LayerContextValue = {
  container: HTMLElement | null;
  nextZ: () => number;
  release: (z: number) => void;
};

export type LayerElementProps = ViewElementProps & {
  open: boolean;
  onDismiss?: () => void;
  dismissOnOutside?: boolean;
  dismissOnEscape?: boolean;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  modal?: boolean;
};

export type Placement =
  | 'top'    | 'top-start'    | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left'   | 'left-start'   | 'left-end'
  | 'right'  | 'right-start'  | 'right-end';
export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';
export type Rect = ViewportCoords & ContentSize;
export type Anchor =
  | HTMLElement
  | { current: HTMLElement | null }
  | null;

export type HoverElementProps = Omit<LayerElementProps, 'modal'> & {
  anchor: Anchor;
  placement?: Placement;
  offset?: number;
  flip?: boolean;
  shift?: boolean;
  matchAnchorWidth?: boolean;
};

export type ComputePositionOptions = {
  anchor: Rect;
  panel: ContentSize;
  placement: Placement;
  offset: number;
  flip: boolean;
  shift: boolean;
  matchAnchorWidth: boolean;
  contentSize: ContentSize;
};

export type ComputePositionResult = ViewportCoords & { placement: Placement; };

export type HoverListItemHookOptions = {
  index?: number; // required for virtualized lists
  disabled?: boolean;
  label?: string; // fallback announce text if ally.label isn't set
};

export type HoverListItemHookHandle = {
  index: number;
  active: boolean;
  ref: (element: HTMLElement | null) => void;
  itemProps: {
    id: string;
    tabIndex: 0 | -1;
    onFocus: () => void;
  };
};

export type HoverElementNavMode = 'none' | 'focus' | 'virtual';

export type HoverElementContextValue = {
  navMode: HoverElementNavMode;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  register: (opts: HoverListItemHookOptions) => {
    index: number;
    unregister: () => void;
  };
  setElement: (
    index: number,
    element: HTMLElement | null
  ) => void;
  getId: (index: number) => string;
};

export type HoverScopeProviderProps = HoverElementContextValue & {
  children: ElementChildren;
  tabIndex: 0 | -1;
  onKeyPress?: (event: KeyboardEvent<HTMLElement>) => void;
};

export type HoverListItem = {
  index: number;
  element: HTMLElement | null;
  disabled: boolean;
  label?: string;
};

export type HoverListNavHookOptions = {
  navMode: HoverElementNavMode;
  getId: (i: number) => string;
  items: Map<number, HoverListItem>;
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (i: number) => void;
  onCommit?: (i: number) => void;
};

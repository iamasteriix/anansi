import type {
  ChangeEventHandler, FocusEventHandler, KeyboardEventHandler, ReactElement, Ref,
  SyntheticEvent,
} from 'react';
import type { LayoutEvent, PressEvent, SxElevation, SxIntent, SxRadius, } from '../core';
import type { LayoutProps, } from '../types';
import type { IconProps } from '../icon/types';
import type { ButtonProps } from '../button/types';
import type { ImageProps } from '../image/types';
import type { TextProps } from '../text/types';
import type { GlassViewProps, ViewProps } from '../view/types';
import type { SlotProps } from '../slot/types';


export type TextFieldVariant = {
  fill?: 'filled' | 'outlined' | 'ghost';
  outline?: SxIntent;
  elevation?: SxElevation;
  shadow?: 'auto' | 'none';
  size?: 'sm' | 'md' | 'lg';
  radius?: SxRadius;
  pin?: 'top' | 'bottom';
};

export type TextFieldIconSlot =
  & { children?: never; }
  & Omit<SlotProps, 'children'>
  & IconProps;

type TextFieldAnchorChild =
  | ReactElement<TextFieldIconSlot>
  | ReactElement<ButtonProps>
  | ReactElement<ButtonProps>[]
  | ReactElement<ImageProps>;

// if you're looking at this future me, yes. I wrote it like this myself
// it was getting confusing to follow if I spread them all out neatly
type TextFieldTarget = number | null | undefined;
type TextFieldPressEvent = SyntheticEvent<HTMLTextAreaElement, PressEvent>;  // SyntheticEvent's second arg is passed to its nativeEvent property
type ScrollEvent = SyntheticEvent<HTMLTextAreaElement, { contentOffset: { x: number; y: number; }}>;
type SelectionChangeEvent = SyntheticEvent<HTMLTextAreaElement, { selection: { start: number; end: number; }}>;
type SubmitEditingEvent = SyntheticEvent<HTMLTextAreaElement, { text: string; eventCount?: number; target?: TextFieldTarget; }>;
type ContentChangeSizeEvent = SyntheticEvent<HTMLTextAreaElement, { contentSize: { width: number; height: number; }}>;
type TextFieldLayoutEvent = SyntheticEvent<HTMLTextAreaElement, LayoutEvent>;

export type TextFieldProps = Omit<LayoutProps, 'children'> & {
  variant?: TextFieldVariant;
  children?: ReactElement<TextFieldAnchorChild> | ReactElement<TextFieldAnchorChild>[];

  // input-native
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

  // events
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onChangeText?: (text: string) => void;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
  onKeyPress?: KeyboardEventHandler<HTMLTextAreaElement>;
  onPressIn?: (event: TextFieldPressEvent) => void;
  onPressOut?: (event: TextFieldPressEvent) => void;
  onScroll?: (event: ScrollEvent) => void;
  onSelectionChange?: (event: SelectionChangeEvent) => void;
  onSubmitEditing?: (event: SubmitEditingEvent) => void;
  onEndEditing?: () => void;
  onContentSizeChange?: (event: ContentChangeSizeEvent) => void;
  onLayout?: (event: TextFieldLayoutEvent) => void;

  ref?: Ref<HTMLTextAreaElement>;
};
  
export type TextFieldLabelProps = {
  children?: ReactElement<TextProps>;
};

export type TextFieldGroupProps = Omit<ViewProps, 'children'> & {
  children?: ReactElement<TextFieldProps | TextFieldLabelProps>[];
  ref?: Ref<HTMLDivElement>;
};


// —— GLASS —————————————————————————————————————————————————————————————————————————————
export type GlassTextFieldVariant = {
  tone?: 'neutral' | 'accent';
  intensity?: 'faint' | 'subtle' | 'base' | 'strong';
  blur?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  radius?: SxRadius;
  pin?: 'top' | 'bottom';
  elevation?: SxElevation;
};

export type GlassTextFieldProps = Omit<TextFieldProps, 'variant'> & {
  variant?: GlassTextFieldVariant;
};

export type GlassTextFieldGroupProps = Omit<GlassViewProps, 'children'> & {
  children?: ReactElement<GlassTextFieldProps | TextFieldLabelProps>[];
  ref?: Ref<HTMLDivElement>;
};

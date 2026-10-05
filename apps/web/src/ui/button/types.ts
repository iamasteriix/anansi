import type { ReactElement } from 'react';
import type {
  SxElevation, SxFill, SxFit, SxGap, SxIntent, SxJustify, SxRadius,
} from '../core';
import type { ElementChildren } from '../types';
import type { PressableProps, PressableState } from '../pressable/types';
import type { SlotProps } from '../slot/types';
import type { IconProps } from '../icon/types';
import type { BadgeProps } from '../badge/types';


export type ButtonVariant = {
  fill?: SxFill;
  intent?: SxIntent;
  fit?: SxFit;
  elevation?: SxElevation;
  size?: 'sm' | 'md' | 'lg';
  radius?: SxRadius;
  justify?: SxJustify;
};

export type GlassButtonVariant = ButtonVariant & {
  tone?: 'neutral' | 'accent';
  intensity?: 'faint' | 'subtle' | 'base' | 'strong';
  blur?: 'sm' | 'md' | 'lg';
};

export type ButtonIconSlot =
  & { children?: never; }
  & Omit<SlotProps, 'children'>
  & IconProps;

export type ButtonBadgeSlot =
  & SlotProps
  & BadgeProps;

type ButtonSlotChild =
  | ReactElement<ButtonIconSlot>
  | ReactElement<ButtonBadgeSlot>
  | ReactElement<ButtonIconSlot>[]
  | ReactElement<ButtonBadgeSlot>[];

export type ButtonSlotProps = Omit<SlotProps, 'children'> & {
  gap?: SxGap;
  children: ButtonSlotChild;
};

export type ButtonChild =
  | ReactElement<ButtonIconSlot>
  | ReactElement<ButtonBadgeSlot>
  | ReactElement<ButtonSlotProps>
  | ElementChildren;

export type ButtonProps = Omit<PressableProps, 'children'> & {
  variant?: ButtonVariant;
  children?: ButtonChild | ((state: PressableState) => ButtonChild);
};

export type GlassButtonProps = Omit<ButtonProps, 'variant'> & {
  variant?: GlassButtonVariant;
};

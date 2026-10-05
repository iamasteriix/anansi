import type { ReactElement, Ref } from 'react';
import type { SxFill, SxIntent, SxRadius } from '../core';
import type { LayoutProps } from '../types';
import type { IconProps } from '../icon/types';
import type { TextProps } from '../text/types';
import type { SlotProps } from '../slot/types';


export type BadgeVariant = {
  fill?: SxFill;
  intent?: SxIntent;
  size?: 'sm' | 'md' | 'lg';
  radius?: SxRadius;
  dot?: boolean;
};

export type BadgeIconSlot =
  & { children?: never; }
  & Omit<SlotProps, 'children'>
  & IconProps;

export type BadgeChild =
  | ReactElement<IconProps>
  | ReactElement<TextProps>;

export type BadgeProps = Omit<LayoutProps, 'children'> & {
  children?: BadgeChild;
  variant?: BadgeVariant;
  ref?: Ref<HTMLDivElement>;
};

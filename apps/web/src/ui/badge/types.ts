import type { ReactElement, Ref } from 'react';
import type { TsFill, TsIntent, TsRadius } from '../@core';
import type { LayoutProps } from '../types';
import type { IconProps } from '../icon/types';
import type { TextProps } from '../text/types';
import type { SlotProps } from '../slot/types';


export type BadgeVariant = {
  fill?: TsFill;
  intent?: TsIntent;
  size?: 'sm' | 'md' | 'lg';
  radius?: TsRadius;
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

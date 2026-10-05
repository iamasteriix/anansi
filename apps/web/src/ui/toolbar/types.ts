import type { ReactElement, Ref } from 'react';
import type { SxGap, SxJustify } from '../core';
import type { ElementChildren, LayoutProps } from '../types';
import type { SlotProps } from '../slot/types';
import type { ViewVariant } from '../view/types';


export type ToolbarVariant = ViewVariant & {
  justify?: SxJustify;
  gap?: SxGap;
  orientation?: 'horizontal' | 'vertical';
};

export type ToolbarSegmentProps = LayoutProps & {
  justify?: SxJustify;
  gap?: SxGap;
};

export type ToolbarChild =
  | ReactElement<SlotProps>
  | ReactElement<ToolbarSegmentProps>
  | ReactElement<SlotProps>[]
  | ReactElement<ToolbarSegmentProps>[]
  | ElementChildren;

export type ToolbarProps = Omit<LayoutProps, 'children'> & {
  variant?: ToolbarVariant;
  children?: ToolbarChild;
  ref?: Ref<HTMLDivElement>;
};

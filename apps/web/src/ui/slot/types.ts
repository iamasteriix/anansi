import type { CSSProperties } from 'react';
import type { TSProperties } from '../@core';
import type { LayoutProps } from '../types';


export type SlotParams <T = {}> = {
  displayName?: string;
  defaultSx?: TSProperties;
  defaultStyle?: CSSProperties;
  useContext?: () => Record<string, any>; // optional hook to inherit values from parent context
  extraProps?: T;                         // props the slot accepts beyond the base
};

export type SlotProps = LayoutProps & {
  position?: 'leading' | 'trailing';  // maps to order: -1 or 1
};

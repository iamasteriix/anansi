import type { LayoutProps } from '../types';
import type { SxElevation, } from '../core';


export type ViewVariant = {
  fill?: 'base' | 'surface' | 'subtle' | 'raised' | 'overlay' | 'floating';
  elevation?: SxElevation;
  outline?: 'accent' | 'info' | 'success' | 'warning' | 'error';
  shadow?: 'auto' | 'none';
};

export type ViewProps = LayoutProps & {
  variant?: ViewVariant;
  'data-component'?: string;
};

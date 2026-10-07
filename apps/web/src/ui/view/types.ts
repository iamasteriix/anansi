import type { Ref } from 'react';
import type { LayoutProps } from '../types';
import type { TsElevation, TsIntent, TsSurface, } from '../@core';


export type ViewVariant = {
  fill?: TsSurface;
  elevation?: TsElevation;
  outline?: TsIntent;
  shadow?: 'auto' | 'none';
};

export type GlassViewVariant = {
  tone?: 'neutral' | 'accent';
  intensity?: 'faint' | 'subtle' | 'base' | 'strong';
  elevation?: TsElevation;
  blur?: 'sm' | 'md' | 'lg';
};

export type ViewProps = LayoutProps & {
  variant?: ViewVariant;
  ref?: Ref<HTMLDivElement>;
};

export type GlassViewProps = Omit<ViewProps, 'variant'> & {
  variant?: GlassViewVariant;
};

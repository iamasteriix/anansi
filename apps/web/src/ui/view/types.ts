import type { Ref } from 'react';
import type { LayoutProps } from '../types';
import type { SxElevation, SxIntent, SxSurface, } from '../core';


export type ViewVariant = {
  fill?: SxSurface;
  elevation?: SxElevation;
  outline?: SxIntent;
  shadow?: 'auto' | 'none';
};

export type GlassViewVariant = {
  tone?: 'neutral' | 'accent';
  intensity?: 'faint' | 'subtle' | 'base' | 'strong';
  elevation?: SxElevation;
  blur?: 'sm' | 'md' | 'lg';
};

export type ViewProps = LayoutProps & {
  variant?: ViewVariant;
  ref?: Ref<HTMLDivElement>;
};

export type GlassViewProps = LayoutProps & {
  variant?: GlassViewVariant;
  ref?: Ref<HTMLDivElement>;
};

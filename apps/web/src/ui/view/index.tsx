import type { ViewElementProps } from '../@core';
import type { TsElevation, TsIntent, TsSurface, } from '../@core';
import { ViewElement } from '../@core';
import baseStyles from './base.module.css';
import glassStyles from './glass.module.css';


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

export type ViewProps = ViewElementProps & {
  variant?: ViewVariant;
};

export type GlassViewProps = ViewElementProps & {
  variant?: GlassViewVariant;
};


export const resolveBaseVariants = (variant: ViewVariant | undefined): string => {
  const shadow = variant?.shadow === 'none' ? 'none' : (variant?.elevation || 'base');
  const classes: (string | undefined)[] = [
    baseStyles.view,
    variant?.fill && baseStyles[`view--fill-${variant.fill}`],
    variant?.elevation && baseStyles[`view--elevation-${variant.elevation}`],
    variant?.outline && baseStyles[`view--outline-${variant.outline}`],
    baseStyles[`view--shadow-${shadow}`],
  ];
  return classes.filter(Boolean).join(' ');
}


export const resolveGlassVariants = (variant: GlassViewVariant | undefined): string => {
  const classes: (string | undefined)[] = [
    glassStyles['glass-view'],
    variant?.tone ? glassStyles[`glass-view--tone-${variant.tone}`] : glassStyles['glass-view--tone-neutral'],
    variant?.intensity && glassStyles[`glass-view--intensity-${variant.intensity}`],
    variant?.elevation && glassStyles[`glass-view--elevation-${variant.elevation}`],
    variant?.blur && glassStyles[`glass-view--blur-${variant.blur}`],
  ];
  return classes.filter(Boolean).join(' ');
}


export const View = ({ variant, ...rest }: ViewProps) => {
  return (
    <ViewElement
      { ...rest }
      classes={ resolveBaseVariants(variant) }
    />
  );
}


export const GlassView = ({ variant, ...rest }: GlassViewProps) => (
  <ViewElement
    { ...rest }
    classes={ resolveGlassVariants(variant) }
  />
);

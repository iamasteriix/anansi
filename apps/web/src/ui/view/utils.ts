import type { GlassViewVariant, ViewVariant } from './types';
import baseStyles from './base.module.css';
import glassStyles from './glass.module.css';


/**
 * Base view
 */
export const resolveBaseVariants = (variant: ViewVariant | undefined): string => {
  const classes: (string | undefined)[] = [
    baseStyles.view,
    variant?.fill && baseStyles[`view--fill-${variant.fill}`],
    variant?.elevation && baseStyles[`view--elevation-${variant.elevation}`],
    variant?.outline && baseStyles[`view--outline-${variant.outline}`],
    variant?.shadow && baseStyles[`view--shadow-${variant.shadow}`],
  ];
  return classes.filter(Boolean).join(' ');
}


/**
 * Glass view
 */
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

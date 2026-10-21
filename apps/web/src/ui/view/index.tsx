import type { Ref } from 'react';
import type { ElementProps, TsElevation, TsGlass, TsIntent, TsSurface, } from '../@core';
import { resolveGlassStyle, ViewElement } from '../@core';
import styles from './style.module.css';


// Types ————————————————————————————————————————————————————————————————————————————————
export type ViewVariant = {
  fill?: TsSurface;
  elevation?: TsElevation;
  outline?: TsIntent;
  shadow?: 'auto' | 'none';
  glass?: boolean | TsGlass;
};

export type ViewProps = ElementProps & {
  variant?: ViewVariant;
  ref?: Ref<HTMLDivElement>;
};


// Utils ————————————————————————————————————————————————————————————————————————————————
const resolveVariants = (variant: ViewVariant | undefined): string => {
  const shadow = variant?.shadow === 'none' ? 'none' : (variant?.elevation || 'base');
  return [
    styles.view,
    variant?.fill && styles[`view--fill-${variant.fill}`],
    variant?.elevation && styles[`view--elevation-${variant.elevation}`],
    variant?.outline && styles[`view--outline-${variant.outline}`],
    styles[`view--shadow-${shadow}`],
    resolveGlassStyle(variant?.glass),
  ].filter(Boolean).join(' ');
}


// Core —————————————————————————————————————————————————————————————————————————————————
export const View = ({
  children, id,  variant, theme, style, a11y, testID, ref,
}: ViewProps) => {
  return (
    <ViewElement
      classes={ resolveVariants(variant) }
      theme={ theme }
      style={ style }
      id={ id }
      testID={ testID }
      a11y={ a11y }
      ref={ ref }
    >
      { children }
    </ViewElement>
  );
}

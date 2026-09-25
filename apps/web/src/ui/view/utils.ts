import type { ViewVariant } from './types';
import styles from './index.module.css';


export const resolveViewClasses = (variant: ViewVariant | undefined): string => {
  const classes = [
    styles.view,
    variant?.fill ? styles[`view--fill-${variant.fill}`] : styles['view--fill-surface'],
    variant?.elevation && styles[`view--${variant.elevation}`],
    variant?.outline && styles[`view--outline-${variant.outline}`],
    variant?.shadow && styles[`view--shadow-${variant.shadow}`],
  ];
  return classes.filter(Boolean).join(' ');
}

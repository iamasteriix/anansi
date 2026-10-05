import type { ImageVariant } from './types';
import styles from './style.module.css';


export const resolveVariants = (variant: ImageVariant | undefined): string => {
  return [
    styles.image,
    variant?.resize && styles[`image--resize-${variant.resize}`],
    variant?.blur && styles[`image--blur-${variant.blur}`],
  ].filter(Boolean).join(' ');
};

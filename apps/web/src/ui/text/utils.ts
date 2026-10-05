import type { CSSProperties } from 'react';
import type { TextVariant } from './types';
import { createContext } from 'react';
import styles from './style.module.css';


export const TextContext = createContext(false);


export const resolveVariants = (variant: TextVariant | undefined): string => {
  return [
    styles.text,
    variant?.role ? styles[`text--role-${variant.role}`] : styles['text--role-body'],
    variant?.typeface && styles[`text--typeface-${variant.typeface}`],
    variant?.color && styles[`text--color-${variant.color}`],
  ]
    .filter(Boolean)
    .join(' ');
};

export const resolveClampStyle = (lines?: number): CSSProperties => {
  if (!lines) return {};
  return {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lines,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
};

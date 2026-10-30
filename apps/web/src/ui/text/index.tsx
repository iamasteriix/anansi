import type { CSSProperties, ReactElement, Ref } from 'react';
import type { ElementProps, TsColor, TsTypeface } from '../@core';
import { createContext, useContext } from 'react';
import { resolveA11y, useMediaQuery, } from '../@core';
import styles from './style.module.css';


// Types ————————————————————————————————————————————————————————————————————————————————
type TextRole = 
  | 'hero-lg' | 'hero'
  | 'section-xl' | 'section-lg' | 'section'
  | 'title-lg' | 'title'
  | 'heading-lg' | 'heading' | 'heading-sm'
  | 'body' | 'body-strong'
  | 'caption' | 'caption-strong'
  | 'mouseprint'
  | 'micro';
  
type TextChild = string | number | boolean | null | undefined | ReactElement<TextProps>;

export type TextVariant = {
  role?: TextRole;
  typeface?: TsTypeface;
  color?: TsColor;
};

export type TextProps = Omit<ElementProps, 'children'> & {
  variant?: TextVariant;
  lines?: number;
  children?: TextChild | TextChild[];
  ref?: Ref<HTMLParagraphElement>;
};


// Utils ————————————————————————————————————————————————————————————————————————————————
export const resolveVariants = (variant: TextVariant | undefined): string => {
  return [
    styles.text,
    variant?.role ? styles[`text--role-${variant.role}`] : styles['text--role-body'],
    variant?.typeface && styles[`text--typeface-${variant.typeface}`],
    variant?.color && styles[`text--color-${variant.color}`],
  ].filter(Boolean).join(' ');
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


// Core —————————————————————————————————————————————————————————————————————————————————
export const TextContext = createContext(false);


export const Text = ({
  children, id, lines, theme, style, variant, testID, a11y, ref,
}: TextProps) => {

  // determine whether component has nested children with context
  const isNested = useContext(TextContext);
  const Component = isNested ? 'span' : 'p';

  const { cssProperties, } = useMediaQuery(theme, style);
  const className = resolveVariants(variant);
  const clampStyles = resolveClampStyle(lines);
  const styleObj = Object.assign(clampStyles, cssProperties);
  const accessibility = resolveA11y(a11y);

  return (
    <TextContext.Provider value={ true }>
      <Component
        className={ className }
        style={ styleObj }
        id={ id }
        data-testid={ testID }
        ref={ ref }
        { ...accessibility }
      >
        { children }
      </Component>
    </TextContext.Provider>
  );
}

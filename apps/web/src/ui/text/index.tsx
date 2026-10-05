import type { TextProps } from './types';
import { useContext } from 'react';
import { resolveA11y, useMediaQuery, } from '../core';
import { resolveClampStyle, resolveVariants, TextContext } from './utils';


export const Text = ({
  children, id, lines, sx, style, variant, testID, a11y, ref,
}: TextProps) => {

  // determine whether component has nested children with context
  const isNested = useContext(TextContext);
  const Component = isNested ? 'span' : 'p';

  const { cssProperties, } = useMediaQuery(sx, style);
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

import type { GlassViewProps, ViewProps, } from './types';
import { resolveA11y, useMediaQuery } from '../@core';
import { resolveBaseVariants, resolveGlassVariants, } from './utils';


export const LayoutElement = ({
  children, id, theme, a11y, style, testID, ref,
  className,  // build class name from variant features
}: Omit<ViewProps, 'variant'> & {
  className: string;
}) => {
  const { cssProperties, } = useMediaQuery(theme, style);  // resolve styling at media query level
  const accessibility = resolveA11y(a11y);              // resolve accessibility props

  return (
    <div
      className={ className }
      style={ cssProperties }
      id={ id }
      data-testid={ testID }
      ref={ ref }
      { ...accessibility }
    >
      { children }
    </div>
  );
}


export const View = ({ variant, ...rest }: ViewProps) => (
  <LayoutElement
    { ...rest }
    className={ resolveBaseVariants(variant) }
  />
);


export const GlassView = ({ variant, ...rest }: GlassViewProps) => (
  <LayoutElement
    { ...rest }
    className={ resolveGlassVariants(variant) }
  />
);

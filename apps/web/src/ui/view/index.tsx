import type { GlassViewProps, ViewProps, } from './types';
import { resolveA11y, useMediaQuery } from '../core';
import { resolveBaseVariants, resolveGlassVariants, } from './utils';


const ViewBase = ({
  children, id, sx, a11y, style, testID, ref,
  className,  // build class name from variant features
}: Omit<ViewProps, 'variant'> & {
  className: string;
}) => {
  const { cssProperties, } = useMediaQuery(sx, style);  // resolve styling at media query level
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
  <ViewBase
    { ...rest }
    className={ resolveBaseVariants(variant) }
  />
);


export const GlassView = ({ variant, ...rest }: GlassViewProps) => (
  <ViewBase
    { ...rest }
    className={ resolveGlassVariants(variant) }
  />
);

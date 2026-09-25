import type { ViewProps, } from './types';
import { resolveA11y, resolveSx, useMediaQuery } from '../core';
import { resolveViewClasses } from './utils';


export const View = ({
  sx, a11y, style, children, variant, testID, ref,
  'data-component': dataComponent = 'view',
}: ViewProps) => {
  const { breakpoint, } = useMediaQuery();

  const className = resolveViewClasses(variant);    // build class name from variant features
  const sxStyles = resolveSx(sx, breakpoint);       // resolve sx into inline styles
  const styleObj = Object.assign(sxStyles, style);  // merge style properties
  const accessibility = resolveA11y(a11y);          // resolve accessibility props

  return (
    <div
      className={ className }
      style={ styleObj }
      data-component={ dataComponent }
      data-testid={ testID }
      ref={ ref }
      { ...accessibility }
    >
      { children }
    </div>
  );
}

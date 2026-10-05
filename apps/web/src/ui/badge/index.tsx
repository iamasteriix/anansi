import type { BadgeProps } from './types';
import { resolveA11y, useMediaQuery } from '../core';
import { getContentOrdering, resolveVariants } from './utils';
import { BadgeIcon } from './slots';


export const Badge = ({
  children, id, sx, a11y, style, variant, testID, ref,
}: BadgeProps) => {

  const { cssProperties, } = useMediaQuery(sx, style);
  const className = resolveVariants(variant);
  const accessibility = resolveA11y(a11y);

  const { leading, trailing, content, } = getContentOrdering(children);

  return (
    <div
      className={ className }
      style={ cssProperties }
      id={ id }
      data-testid={ testID }
      ref={ ref }
      { ...accessibility }
    >
      { leading }
      { content }
      { trailing }
    </div>
  );
};


Badge.Icon = BadgeIcon;

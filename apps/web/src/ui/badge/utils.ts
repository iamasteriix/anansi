import type { BadgeChild, BadgeProps, BadgeVariant } from './types';
import type { SlotProps } from '../slot/types';
import { Children, isValidElement } from 'react';
import { BadgeIcon } from './slots';
import styles from './style.module.css';


/**
 * Resolves CSS module styling
 */
export const resolveVariants = (variant: BadgeVariant | undefined): string => {
  const fill = variant?.fill ?? 'filled';
  const intent = variant?.intent ?? 'primary';
  const size = variant?.size ?? 'md';
  
  return [
    styles.badge,
    styles[`badge--fill-${fill}`],
    styles[`badge--intent-${intent}`],
    styles[`badge--size-${size}`],
    variant?.dot && styles['badge--dot'],
    variant?.radius && styles[`badge--radius-${variant.radius}`],
  ].filter(Boolean).join(' ');
};


/**
 * Facilitates distinguishing badge slot and content ordering
 */
export const getContentOrdering = (children: BadgeProps['children']) => {
  const leading: BadgeChild[] = [];
  const trailing: BadgeChild[] = [];
  const content: BadgeChild[] = [];
  const childrenArr = Children.toArray(children);
  for (const child of childrenArr) {
    if (!isValidElement(child)) continue;
    const slotProps = child.props as SlotProps;
    const position = child.type === BadgeIcon ? slotProps.position ?? 'leading' : slotProps.position;
    if (position === 'leading') leading.push(child as BadgeChild);
    else if (position === 'trailing') trailing.push(child as BadgeChild);
    else content.push(child as BadgeChild);
  }

  return { leading, trailing, content, };
}

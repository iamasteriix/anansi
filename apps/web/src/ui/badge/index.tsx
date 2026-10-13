import type { ReactElement, Ref } from 'react';
import type {
  ElementChildren, ElementProps, TsFill, TsIntent, TsRadius,
} from '../@core';
import type { TextProps } from '../text';
import type { IconProps } from '../icon';
import { Icon, } from '../icon';
import {
  createSlot, slotProp, SlotScopeProvider, useSlots, ViewElement,
} from '../@core';
import styles from './style.module.css';


// Types ————————————————————————————————————————————————————————————————————————————————
export type BadgeVariant = {
  fill?: TsFill;
  intent?: TsIntent;
  size?: 'sm' | 'md' | 'lg';
  radius?: TsRadius;
  dot?: boolean;
};

type BadgeIconSlotAlignment = 'start' | 'end';
type BadgeIconSlot = IconProps & {
  alignment?: BadgeIconSlotAlignment;
};

type BadgeChild =
  | ReactElement<BadgeIconSlot>
  | ReactElement<TextProps>;

export type BadgeProps = Omit<ElementProps, 'children'> & {
  children?: BadgeChild;
  variant?: BadgeVariant;
  ref?: Ref<HTMLDivElement>;
};


// Utils ————————————————————————————————————————————————————————————————————————————————
/**
 * Resolves CSS module styling
 */
const resolveVariants = (variant: BadgeVariant | undefined): string => {
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


// Core —————————————————————————————————————————————————————————————————————————————————
export const Badge = ({
  children, id, theme, a11y, style, variant, testID, ref,
}: BadgeProps) => {

  const slots = useSlots(children, ['Icon']);
  const startSlot: ElementChildren = [];
  const endSlot: ElementChildren = [];
  for (const element of slots.Icon) {
    const alignment = slotProp<BadgeIconSlotAlignment>(element, 'alignment') ?? 'start';
    (alignment === 'end' ? endSlot : startSlot).push(element);
  }

  const cssClasses = resolveVariants(variant);

  return (
    <SlotScopeProvider value='Badge'>
      <ViewElement
        classes={ cssClasses }
        theme={ theme }
        style={ style }
        a11y={ a11y }
        ref={ ref }
        testID={ testID }
        id={ id }
      >
        { startSlot }
        { slots.default }
        { endSlot }
      </ViewElement>
    </SlotScopeProvider>
  );
};


// Slots ————————————————————————————————————————————————————————————————————————————————
Badge.Icon = createSlot<typeof Icon, BadgeIconSlot, BadgeIconSlot>(Icon, {
  slotName: 'Icon',
  parentName: 'Badge',
  slotProps: ['alignment']
});

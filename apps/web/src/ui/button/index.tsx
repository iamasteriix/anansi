import type { ReactNode } from 'react';
import type {
  ElementChildren, PressElementProps, TsElevation, TsFill, TsGlass, TsIntent, TsJustify,
  TsRadius,
} from '../@core';
import type { IconProps } from '../icon';
import type { BadgeProps } from '../badge';
import {
  createSlot, PressElement, slotProp, SlotScopeProvider, useSlots, ViewElement,
} from '../@core';
import { Icon } from '../icon';
import { Badge } from '../badge';
import { styles as glassStyles } from '../@core';
import styles from './style.module.css';



// Types ————————————————————————————————————————————————————————————————————————————————
type ButtonSlotAlignment = 'start' | 'end';
type ButtonSlotProps = {
  alignment?: ButtonSlotAlignment;
};

export type ButtonVariant = {
  fill?: TsFill;
  intent?: TsIntent;
  fit?: 'fluid-1' | 'fluid-2' | 'fluid-3' | 'fluid-4' | 'fluid-5' | 'fluid-6';
  elevation?: TsElevation;
  shadow?: 'auto' | 'none',
  size?: 'sm' | 'md' | 'lg';
  radius?: TsRadius;
  justify?: TsJustify;
  glass?: boolean | TsGlass;
};

export type ButtonProps = PressElementProps & {
  variant?: ButtonVariant;
};


// Utils ————————————————————————————————————————————————————————————————————————————————
const resolveVariants = (variant: ButtonVariant | undefined): string => {
  const base = [
    styles.button,
    variant?.elevation && styles[`button--elevation-${variant.elevation}`],
    variant?.shadow === 'auto' && variant?.elevation ? styles[`button--shadow-${variant?.elevation}`] : undefined,
    styles[`button--size-${variant?.size ?? 'md'}`],
    variant?.radius && styles[`button--radius-${variant.radius}`],
    styles[`button--justify-${variant?.justify ?? 'center'}`],
  ];

  if (variant?.glass) {
    const options = variant.glass === true ? {} : variant.glass;
    return [
      ...base,
      styles['glass-button'],
      glassStyles[`glass--tint-${options.tint ?? variant.intent ?? 'raised'}`],
      glassStyles[`glass--intensity-${options.intensity ?? 'base'}`],
    ].filter(Boolean).join(' ');
  }

  return [
    ...base,
    styles[`button--fill-${variant?.fill ?? 'filled'}`],
    styles[`button--intent-${variant?.intent ?? 'primary'}`],
  ].filter(Boolean).join(' ');
};


// Core —————————————————————————————————————————————————————————————————————————————————
const ButtonLayout = ({ children }: { children: ReactNode; }) => {
  const slots = useSlots(children, ['slot']);
  const startSlot: ElementChildren = [];
  const endSlot: ElementChildren = [];
  for (const element of slots.slot) {
    const alignment = slotProp<ButtonSlotAlignment>(element, 'alignment') ?? 'start';
    (alignment === 'end' ?  endSlot : startSlot).push(element);
  }
  return (
    <>
      { startSlot.length > 0 &&
        <ViewElement classes={ styles.button__slot }>{ startSlot }</ViewElement>
      }
      <ViewElement classes={ styles.button__slot }>{ slots.default }</ViewElement>
      { endSlot.length > 0 &&
        <ViewElement classes={ styles.button__slot }>{ endSlot }</ViewElement>
      }
    </>
  );
}


export const Button = ({
  children, id, variant, theme, style, a11y, testID, ref,
  onPress, onPressIn, onPressOut, onPressMove, onLongPress, onHoverIn, onHoverOut,
  delayLongPress, disabled,
}: ButtonProps) => {
  return (
    <SlotScopeProvider value='Button'>
      <PressElement
        onPress={ onPress }
        onPressIn={ onPressIn }
        onPressOut={ onPressOut }
        onPressMove={ onPressMove }
        onLongPress={ onLongPress }
        onHoverIn={ onHoverIn }
        onHoverOut={ onHoverOut }
        delayLongPress={ delayLongPress }
        disabled={ disabled }
        classes={ resolveVariants(variant) }
        id={ id }
        theme={ theme }
        style={ style }
        a11y={ a11y }
        testID={ testID }
        ref={ ref }
      >
        { state => (
            <ButtonLayout>
              { typeof children === 'function' ? children(state) : children }
            </ButtonLayout>
          )
        }
      </PressElement>
    </SlotScopeProvider>
  );
}


// Slots ————————————————————————————————————————————————————————————————————————————————
const ButtonIcon = createSlot<
  typeof Icon,
  IconProps,
  ButtonSlotProps
>(Icon, {
  slotName: 'slot',
  parentName: 'Button',
  slotProps: ['alignment'],
});


const ButtonBadge = createSlot<
  typeof Badge,
  BadgeProps,
  ButtonSlotProps
>(Badge, {
  slotName: 'slot',
  parentName: 'Button',
  slotProps: ['alignment'],
});


Button.Icon = ButtonIcon;
Button.Badge = ButtonBadge;

import type { RefObject } from 'react';
import type {
  ElementChildren, TextInputElementProps, TsElevation, TsGlass, TsIntent, TsRadius,
  TsSize,
} from '../@core';
import type { ViewProps, ViewVariant } from '../view';
import type { IconProps } from '../icon';
import type { ButtonProps } from '../button';
import type { ImageProps } from '../image';
import { createContext, useCallback, useContext, useEffect, useRef, } from 'react';
import {
  createSlot, resolveGlassStyle, slotProp, SlotScopeProvider, TextInputElement, useSlots,
  ViewElement,
} from '../@core';
import { Icon } from '../icon';
import { Button } from '../button';
import { Image } from '../image';
import { View } from '../view';
import { Text } from '../text';
import styles from './style.module.css';


// Types ————————————————————————————————————————————————————————————————————————————————
export type TextFieldVariant = {
  fill?: 'filled' | 'outlined' | 'ghost';
  outline?: TsIntent;
  elevation?: TsElevation;
  shadow?: 'auto' | 'none';
  size?: 'sm' | 'md' | 'lg';
  radius?: TsRadius;
  glass?: boolean | TsGlass;
};

export type TextFieldProps = TextInputElementProps & {
  variant?: TextFieldVariant;
};

type TextFieldSlotAlignment = 'start' | 'end';
type TextFieldSlotProps = { alignment?: TextFieldSlotAlignment; };

type TextFieldSetProps = Omit<ViewProps, 'variant'> & {
  variant?: TextFieldVariant;
};

type TextFieldFieldProps = Omit<ViewProps, 'variant'> & {
  variant?: ViewVariant & { gap?: TsSize; };
};


// Utils ————————————————————————————————————————————————————————————————————————————————
const TextFieldSetContext = createContext(false);


export const resolveVariants = (variant: TextFieldVariant | undefined): string => {
  const glass = resolveGlassStyle(variant?.glass);
  return [
    styles['text-field'],
    !glass && styles[`text-field--fill-${variant?.fill ?? 'outlined'}`],
    variant?.outline && styles[`text-field--outline-${variant.outline}`],
    styles[`text-field--size-${variant?.size ?? 'md'}`],
    variant?.radius && styles[`text-field--radius-${variant.radius}`],
    variant?.elevation && styles[`text-field--elevation-${variant.elevation}`],
    variant?.shadow === 'auto' && variant?.elevation && styles[`text-field--shadow-${variant.elevation}`],
    glass,
  ].filter(Boolean).join(' ');
};


/**
 * Clicking dead space in the frame focuses the textarea. textarea and buttons keep their
 * own behavior.
 */
export const useFocusOnPress = (frame: RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const handler = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('textarea, [role="button"]')) return;
      element.querySelector('textarea')?.focus();
    }
    element.addEventListener('click', handler);
    return () => {
      element.removeEventListener('click', handler);
    }
  }, [frame]);
}


// Core —————————————————————————————————————————————————————————————————————————————————
const default_variant: TextFieldVariant = {
  fill: 'outlined',
  outline: 'primary',
  size: 'md',
  radius: '2xl',
};


export const TextField = ({
  id, theme, style, a11y, testID, ref,
  autoComplete, autoFocus, defaultValue, editable, inputMode, maxLength, placeholder,
  readOnly, rows, submitBehavior, value,
  onBlur, onChange, onChangeText, onContentSizeChange, onEndEditing, onFocus, onKeyPress,
  onLayout, onPressIn, onPressOut, onScroll, onSelectionChange, onSubmitEditing,
  variant = default_variant,
}: TextFieldProps) => {

  const frameRef = useRef<HTMLDivElement>(null);
  useFocusOnPress(frameRef);

  const Spine = () => (
    <TextInputElement
      autoComplete={ autoComplete }
      autoFocus={ autoFocus }
      defaultValue={ defaultValue}
      editable={ editable }
      inputMode={ inputMode }
      maxLength={ maxLength }
      placeholder={ placeholder }
      readOnly={ readOnly }
      rows={ rows }
      value={ value }
      submitBehavior={ submitBehavior }
      onChange={ onChange }
      onChangeText={ onChangeText }
      onFocus={ onFocus }
      onBlur={ onBlur }
      onSelectionChange={ onSelectionChange }
      onPressIn={ onPressIn }
      onPressOut={ onPressOut }
      onKeyPress={ onKeyPress }
      onSubmitEditing={ onSubmitEditing }
      onEndEditing={ onEndEditing }
      onLayout={ onLayout }
      onContentSizeChange={ onContentSizeChange }
      onScroll={ onScroll }
      id={ id }
      testID={ testID }
      ref={ ref }
      a11y={ a11y }
    />
  );

  // with slots, set owns frame, so we return bare input
  const isInSet = useContext(TextFieldSetContext);
  if (isInSet) return <Spine/>;

  return (
    <ViewElement
      classes={ resolveVariants(variant) }
      theme={ theme }
      style={ style }
      ref={ frameRef }
    >
      <Spine/>
    </ViewElement>
  );
}


// Slots ————————————————————————————————————————————————————————————————————————————————
TextField.Set = ({
  children, id, theme, style, a11y, testID, ref,
  variant = default_variant,
}: TextFieldSetProps) => {

  const frameRef = useRef<HTMLDivElement | null>(null);
  useFocusOnPress(frameRef);

  // link set frame with consumer frame
  const setFrame = useCallback((node: HTMLDivElement | null) => {
    frameRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const slots = useSlots(children, ['slot']);
  const startSlot: ElementChildren = [];
  const endSlot: ElementChildren = [];
  for (const element of slots.slot) {
    const alignment = slotProp<TextFieldSlotAlignment>(element, 'alignment') ?? 'start';
    (alignment === 'end' ? endSlot : startSlot).push(element);
  }

  return (
    <SlotScopeProvider value='TextField'>
      <TextFieldSetContext.Provider value={ true }>
        <ViewElement
          classes={ resolveVariants(variant) }
          theme={ theme }
          style={ style }
          id={ id }
          testID={ testID }
          a11y={ a11y }
          ref={ setFrame }
        >
          { startSlot.length > 0 &&
              <ViewElement classes={ styles[`text-field__slot--start`] }>{ startSlot }</ViewElement>
          }
          { slots.default }
          { endSlot.length > 0 &&
              <ViewElement classes={ styles[`text-field__slot--end`] }>{ endSlot }</ViewElement>
          }
        </ViewElement>
      </TextFieldSetContext.Provider>
    </SlotScopeProvider>
  );
};


TextField.Icon = createSlot<
  typeof Icon,
  IconProps,
  TextFieldSlotProps
>(Icon, {
  slotName: 'slot',
  parentName: 'TextField',
  slotProps: ['alignment'],
});


TextField.Button = createSlot<
  typeof Button,
  ButtonProps,
  TextFieldSlotProps
>(Button, {
  slotName: 'slot',
  parentName: 'TextField',
  slotProps: ['alignment'],
});


TextField.Image = createSlot<
  typeof Image,
  ImageProps,
  TextFieldSlotProps
>(Image, {
  slotName: 'slot',
  parentName: 'TextField',
  slotProps: ['alignment'],
});


TextField.Field = ({ children, id, variant, theme, style, a11y, testID, ref, }: TextFieldFieldProps) => {
  return (
    <View
      id={ id }
      variant={ variant }
      theme={ theme }
      style={ style }
      a11y={ a11y }
      testID={ testID }
      ref={ ref }
    >
      { children }
    </View>
  );
}


TextField.Text = Text;

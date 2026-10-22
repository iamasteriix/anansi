import type { RefObject } from 'react';
import type {
  ElementChildren, TextInputElementProps, TsElevation, TsGlass, TsIntent, TsRadius,
} from '../@core';
import type { ViewProps, } from '../view';
import type { IconProps } from '../icon';
import type { ButtonProps } from '../button';
import type { ImageProps } from '../image';
import { createContext, useContext, useEffect, useMemo, useRef, } from 'react';
import {
  createSlot, mergeRefs, resolveGlassStyle, slotProp, SlotScopeProvider,
  TextInputElement, useSlots, ViewElement,
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

export type TextFieldProps = Omit<ViewProps, 'variant'> & {
  variant?: TextFieldVariant;
  label?: string;
};

type TextFieldSlotProps = { alignment?: 'start' | 'end'; };

type TextFieldContextValue = {
  inputRef: RefObject<HTMLTextAreaElement | null>;
  label?: string;
}


// Utils ————————————————————————————————————————————————————————————————————————————————
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
 * Clicking frame dead space focuses shared textarea. textarea and buttons keep their
 * own behavior.
 */
export const useFocusOnPress = (
  frameRef: RefObject<HTMLDivElement | null>,
  inputRef: RefObject<HTMLTextAreaElement | null>,
) => {
  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;
    const handler = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest('textarea, [role="button"]')) return;
      inputRef.current?.focus();
    }
    element.addEventListener('click', handler);
    return () => {
      element.removeEventListener('click', handler);
    }
  }, [frameRef, inputRef]);
}


// Core —————————————————————————————————————————————————————————————————————————————————
const TextFieldContext = createContext<TextFieldContextValue | null>(null);


const default_variant: TextFieldVariant = {
  fill: 'outlined',
  outline: 'primary',
  size: 'md',
  radius: '2xl',
};


export const TextField = ({
  children, label, id, theme, style, a11y, testID, ref,
  variant = default_variant,
}: TextFieldProps) => {

  const frameRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const elementRef = useMemo(() => mergeRefs(frameRef, ref), [ref]);
  useFocusOnPress(frameRef, inputRef);

  const slots = useSlots(children, ['slot']);
  const startSlot: ElementChildren = [];
  const endSlot: ElementChildren = [];
  for (const element of slots.slot) {
    const alignment = slotProp<TextFieldSlotProps['alignment']>(element, 'alignment') ?? 'start';
    (alignment === 'end' ? endSlot : startSlot).push(element);
  }

  const contextValue = useMemo(() => ({ inputRef, label, }), [inputRef, label]);
  const accessibility = { role: 'group', ...a11y, };

  return (
    <SlotScopeProvider value='TextField'>
      <ViewElement
        classes={ resolveVariants(variant) }
        theme={ theme }
        style={ style }
        id={ id }
        testID={ testID }
        a11y={ accessibility }
        ref={ elementRef }
      >
        { startSlot.length > 0 &&
            <ViewElement classes={ styles[`text-field__slot--start`] }>{ startSlot }</ViewElement>
        }
        <TextFieldContext.Provider value={ contextValue }>
          { slots.default }
        </TextFieldContext.Provider>
        { endSlot.length > 0 &&
            <ViewElement classes={ styles[`text-field__slot--end`] }>{ endSlot }</ViewElement>
        }
      </ViewElement>
    </SlotScopeProvider>
  );
}


// Slots ————————————————————————————————————————————————————————————————————————————————
TextField.Input = ({
  id, theme, style, a11y, testID, ref,
  autoComplete, autoFocus, defaultValue, editable, inputMode, maxLength, placeholder,
  readOnly, rows, submitBehavior, value,
  onBlur, onChange, onChangeText, onContentSizeChange, onEndEditing, onFocus, onKeyPress,
  onLayout, onPressIn, onPressOut, onScroll, onSelectionChange, onSubmitEditing,
}: TextInputElementProps) => {

  const context = useContext(TextFieldContext);
  if (!context) throw new Error('<TextField.Input> must be rendered inside <TextField>');
  const elementRef = useMemo(() => mergeRefs(context.inputRef, ref), [ref, context.inputRef]);

  const accessibility = {
    ...a11y,
    label: a11y?.label ?? context.label,
  };

  return (
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
      ref={ elementRef }
      a11y={ accessibility }
      theme={ theme }
      style={ style }
    />
  );
}


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


TextField.Field = View;


TextField.Text = Text;

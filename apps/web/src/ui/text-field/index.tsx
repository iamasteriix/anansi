import type {
  ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent, PointerEvent, RefObject, UIEvent,
} from 'react';
import type {
  GlassTextFieldProps, GlassTextFieldVariant, TextFieldProps, TextFieldVariant,
} from './types';
import { useCallback, useEffect, useRef } from 'react';
import { resolveA11y, useMediaQuery } from '../@core';
import { getAnchorOrdering, resolveBaseVariants, resolveGlassVariants } from './utils';
import {
  GlassTextFieldGroup, TextFieldGroup, TextFieldIcon, TextFieldLabel, TextFieldLeading,
  TextFieldTrailing,
} from './slot';
import styles from './base.module.css';


const default_base_variant: TextFieldVariant = {
  fill: 'outlined',
  outline: 'primary',
  size: 'md',
  radius: '2xl',
  elevation: 'raised',
  pin: 'bottom',
};

const default_glass_variant: GlassTextFieldVariant = {
  tone: 'neutral',
  intensity: 'base',
  blur: 'md',
  size: 'md',
  radius: '2xl',
  elevation: 'raised',
  pin: 'bottom',
};

const parseTargetId = (id: string | undefined) => {
  const parsed = parseInt(id || '', 10);
  return Number.isNaN(parsed) ? null : parsed;
};


const TextFieldBase = ({
  children, id, theme, style, a11y, testID, ref,
  autoComplete, autoFocus, defaultValue, inputMode, maxLength, placeholder,
  readOnly, submitBehavior, value,
  onBlur, onChange, onChangeText, onFocus, onKeyPress, onPressIn, onPressOut, onScroll,
  onSelectionChange, onSubmitEditing, onEndEditing, onContentSizeChange,
  onLayout,
  className,
  rows = 1,
  editable = true,
}: Omit<TextFieldProps, 'variant'> & {
  className: string;
}) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const setInputRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        (ref as RefObject<HTMLTextAreaElement | null>).current = node;
      }
    },
    [ref]
  );

  const handleContainerClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== inputRef.current) inputRef.current?.focus();
  }, []);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event);
      onChangeText?.(event.target.value);
    },
    [onChange, onChangeText]
  );

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLTextAreaElement>) => {
      onFocus?.(event);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLTextAreaElement>) => {
      onBlur?.(event);
      onEndEditing?.();
    },
    [onBlur, onEndEditing]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyPress?.(event);
      if (event.key === 'Enter' && submitBehavior === 'submit' && !event.shiftKey) {
        event.preventDefault();
        onSubmitEditing?.({
          ...event,
          nativeEvent: {
            text: event.currentTarget.value,
            eventCount: event.eventPhase,
            target: parseTargetId(event.currentTarget.id),
          },
        });
      }
    },
    [onKeyPress, onSubmitEditing, submitBehavior]
  );

  const createPressPayload = (event: PointerEvent<HTMLTextAreaElement>, timestamp: number) => {
    const payload = {
      identifier: event.pointerId,
      locationX: event.nativeEvent.offsetX,
      locationY: event.nativeEvent.offsetY,
      pageX: event.pageX,
      pageY: event.pageY,
      target: parseTargetId(event.currentTarget.id),
      timestamp,
      changedTouches: [] as any[],
      touches: [] as any[],
    };
    payload.changedTouches = [payload];
    payload.touches = [payload];
    return payload;
  };

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLTextAreaElement>) => {
      onPressIn?.({
        ...event,
        nativeEvent: createPressPayload(event, Date.now()),
      });
    },
    [onPressIn]
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLTextAreaElement>) => {
      onPressOut?.({
        ...event,
        nativeEvent: createPressPayload(event, event.timeStamp),
      });
    },
    [onPressOut]
  );

  const handleScroll = useCallback(
    (event: UIEvent<HTMLTextAreaElement>) => {
      onScroll?.({
        ...event,
        nativeEvent: {
          contentOffset: {
            x: event.currentTarget.scrollLeft,
            y: event.currentTarget.scrollTop,
          },
        },
      });
    },
    [onScroll]
  );

  // onSelectionChange — document-level selectionchange while focused
  useEffect(() => {
    if (!onSelectionChange) return;
    const element = inputRef.current;
    if (!element) return;

    const handler = (event: Event) => {
      if (document.activeElement !== element) return;
      onSelectionChange({
        ...event,
        target: element,
        currentTarget: element,
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        defaultPrevented: event.defaultPrevented,
        eventPhase: event.eventPhase,
        isTrusted: event.isTrusted,
        timeStamp: event.timeStamp,
        type: event.type,
        nativeEvent: {
          selection: {
            start: element.selectionStart ?? 0,
            end: element.selectionEnd ?? 0,
          },
        },
        preventDefault: () => event.preventDefault(),
        stopPropagation: () => event.stopPropagation(),
        isDefaultPrevented: () => event.defaultPrevented,
        isPropagationStopped: () => false,
        persist: () => {},
      });
    };

    document.addEventListener('selectionchange', handler);
    return () => {
      document.removeEventListener('selectionchange', handler);
    };
  }, [onSelectionChange]);

  // onContentSizeChange — ResizeObserver on the textarea
  useEffect(() => {
    const element = inputRef.current;
    if (!element || !onContentSizeChange) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        onContentSizeChange({
          nativeEvent: { contentSize: { width, height } },
        } as any);
      }
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [onContentSizeChange]);

  // onLayout — ResizeObserver on the wrapper/textarea
  useEffect(() => {
    const element = containerRef.current || inputRef.current;
    if (!element || !onLayout) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height, x, y } = entry.contentRect;
        onLayout({
          nativeEvent: {
            layout: { width, height, x, y },
            target: parseTargetId(entry.target.id),
          },
        } as any);
      }
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [onLayout]);

  const { cssProperties } = useMediaQuery(theme, style);
  const accessibility = resolveA11y(a11y);

  const { leading, trailing } = getAnchorOrdering(children);

  return (
    <div
      className={ className }
      style={ cssProperties }
      onClick={ handleContainerClick }
      ref={ containerRef }
    >
      <span className={ styles['text-field__leading'] }>
        { leading }
      </span>
      <textarea
        className={ styles['text-field__input'] }
        autoComplete={ autoComplete }
        autoFocus={ autoFocus }
        defaultValue={ defaultValue}
        disabled={ !editable }
        inputMode={ inputMode }
        maxLength={ maxLength }
        placeholder={ placeholder }
        readOnly={ readOnly }
        rows={ rows }
        value={ value }
        onChange={ handleChange }
        onFocus={ handleFocus }
        onBlur={ handleBlur }
        onKeyDown={ handleKeyDown }
        onPointerDown={ handlePointerDown }
        onPointerUp={ handlePointerUp }
        id={ id }
        onScroll={ handleScroll }
        data-testid={ testID }
        ref={ setInputRef }
        { ...accessibility }
      />
      <span className={ styles['text-field__trailing'] }>
        { trailing }
      </span>
    </div>
  );
};


export const TextField = ({
  variant = default_base_variant,
  ...rest
}: TextFieldProps) => (
  <TextFieldBase
    { ...rest }
    className={ resolveBaseVariants(variant) }
  />
);


export const GlassTextField = ({
  variant = default_glass_variant,
  ...rest
}: GlassTextFieldProps) => (
  <TextFieldBase
    { ...rest }
    className={ resolveGlassVariants(variant) }
  />
);


/**
 * Namespacing
 */
TextField.Group = TextFieldGroup;
TextField.Label = TextFieldLabel;
TextField.Leading = TextFieldLeading;
TextField.Trailing = TextFieldTrailing;
TextField.Icon = TextFieldIcon;
GlassTextField.Group = GlassTextFieldGroup;
GlassTextField.Label = TextFieldLabel;
GlassTextField.Leading = TextFieldLeading;
GlassTextField.Trailing = TextFieldTrailing;
GlassTextField.Icon = TextFieldIcon;

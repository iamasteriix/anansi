import type { KeyboardEvent, PointerEvent, SyntheticEvent } from 'react';
import type { PressableProps, PressableState } from './types';
import { useCallback, useRef, useState, } from 'react';
import { resolveA11y, useMediaQuery } from '../@core';
import styles from './style.module.css';


export const Pressable = ({
  onPress, onPressIn, onPressOut, onLongPress, onPressMove, onHoverIn, onHoverOut,
  children, id, style, theme, a11y, testID, ref,
  delayLongPress = 500,
  disabled = false, 
}: PressableProps) => {

  const [pressed, setPressed] = useState(false);
  
  const timer = useRef<number | undefined>(undefined);  // ReturnType<typeof setTimeout> is number
  const isLongFired = useRef(false);
  const isKeyPress = useRef(false);

  const clearTimer = useCallback(
    () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = undefined;
      }
    },
    []
  );

  const handlePointerDown = useCallback(
    (event: SyntheticEvent<HTMLDivElement>) => {
      if (disabled) return;
      setPressed(true);
      isLongFired.current = false;
      onPressIn?.(event);
      if (onLongPress) {
        timer.current = setTimeout(
          () => {
            isLongFired.current = true;
            onLongPress(event);
          },
          delayLongPress
        );
      }
    },
    [disabled, onPressIn, onLongPress, delayLongPress]
  );

  const handlePointerUp = useCallback(
    (event: SyntheticEvent<HTMLDivElement>) => {
      if (disabled) return;
      setPressed(false);
      clearTimer();
      onPressOut?.(event);
      if (!isLongFired.current) onPress?.(event);
    },
    [disabled, onPressOut, onPress, setPressed, clearTimer]
  );

  const handlePointerCancel = useCallback(
    () => {
      setPressed(false);
      clearTimer();
      isLongFired.current = false;
      isKeyPress.current = false;
    },
    [clearTimer]
  );

  const handlePointerEnter = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      onHoverIn?.(event);
    },
    [disabled, onHoverIn]
  );

  const handlePointerLeave = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.buttons === 0) onHoverOut?.(event);
      if (!isKeyPress.current) handlePointerCancel();
    },
    [disabled, onHoverOut, handlePointerCancel]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      onPressMove?.(event);
    },
    [disabled, onPressMove]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled || event.repeat) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        isKeyPress.current = true;
        handlePointerDown(event);
      }
    },
    [disabled, handlePointerDown]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handlePointerUp(event);
        isKeyPress.current = false;
      }
    },
    [disabled, handlePointerUp]
  );

  const state: PressableState = { pressed, };
  const content = typeof children === 'function' ? children(state) : children;

  const { cssProperties } = useMediaQuery(theme, style);
  const accessibility = resolveA11y({
    role: 'button',
    ...a11y,
    state: { ...a11y?.state, disabled, },
  });

  return (
    <div
      className={ styles.pressable }
      style={ cssProperties }
      onPointerDown={ handlePointerDown }
      onPointerUp={ handlePointerUp }
      onPointerEnter={ handlePointerEnter }
      onPointerLeave={ handlePointerLeave }
      onPointerMove={ handlePointerMove }
      onPointerCancel={ handlePointerCancel }
      onKeyDown={ handleKeyDown }
      onKeyUp={ handleKeyUp }
      id={ id }
      tabIndex={ disabled ? -1 : 0 }
      data-testid={ testID }
      ref={ ref }
      { ...accessibility }
    >
      { content }
    </div>
  );
}

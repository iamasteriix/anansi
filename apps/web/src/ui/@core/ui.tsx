import type {
  ComponentType, CSSProperties, KeyboardEvent, PointerEvent, ReactElement, ReactNode,
  SyntheticEvent,
} from 'react';
import type {
  PressElementProps, PressElementState, SlotMarker, ThemeProviderProps, ThemesType,
  ViewElementProps,
} from './types';
import {
  Children, cloneElement, createContext, Fragment, isValidElement, useCallback,
  useContext, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { ThemeContext, toCSSVariables, useMediaQuery } from './theme';
import { resolveA11y } from './a11y';
import { storageAdapter } from './storage';
import { tokens } from './tokens';
import styles from './style.module.css';


// VIEW =================================================================================
// src/ui/view-element.tsx
export const ViewElement = ({
  children, id, theme, a11y, style, testID, ref, classes,
}: ViewElementProps) => {

  const { cssProperties, } = useMediaQuery(theme, style);         // resolve styling at media query level
  const className = [styles['view-element'], classes].join(' ');  // merge css classes
  const accessibility = resolveA11y(a11y);                        // resolve accessibility props

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
// ======================================================================================


// PRESS ================================================================================
// src/ui/press-element.tsx
export const PressElement = ({
  onPress, onPressIn, onPressOut, onLongPress, onPressMove, onHoverIn, onHoverOut,
  children, id, style, theme, a11y, testID, ref, classes,
  delayLongPress = 500,
  disabled = false, 
}: PressElementProps) => {

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

  const state: PressElementState = { pressed, disabled, };
  const content = typeof children === 'function' ? children(state) : children;

  const { cssProperties } = useMediaQuery(theme, style);
  const className = [styles['press-element'], classes].join(' ');
  const accessibility = resolveA11y({
    role: 'button',
    ...a11y,
    state: { ...a11y?.state, disabled, },
  });

  return (
    <div
      className={ className }
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
// ======================================================================================


// THEME ================================================================================
// src/theme/provider.tsx
const default_themes: ThemesType = { moonsong: tokens, };


/**
 * Provides the resolved theme to all children via context and CSS variables
 */
export const ThemeProvider = ({
  themes = default_themes,
  persister = storageAdapter,
  children,
}: ThemeProviderProps) => {

  const fallback: keyof ThemesType = Object.keys(themes)[0];
  const [themeName, setThemeName] = useState<keyof ThemesType>(fallback);
  
  // persist all provided themes
  useEffect(
    () => {
      const persist = persister('theme');
      Object.entries(themes)
        .forEach(([name, tokens]) => {
          persist.set(name, tokens);
        });
    },
    [themes, persister]
  );

  useLayoutEffect(
    () => {
      let canceled = false;
      Promise.resolve(
        persister('activeTheme').get<string>('name')
      ).then(activeThemeName => {
          if (!canceled && activeThemeName && activeThemeName in themes) setThemeName(activeThemeName);
        });
      return () => {
        canceled = true;
      };
    },
    [themes, persister]
  );

  const setTheme = useCallback(
    (name: keyof ThemesType) => {
      if (!(name in themes)) return;
      setThemeName(name);
      persister('activeTheme').set('name', name);
    },
    [themes, persister]
  );

  const resolvedTheme = themes[themeName];
  const cssVars: CSSProperties = useMemo(
    () => toCSSVariables(resolvedTheme),
    [resolvedTheme]
  );

  const themeProviderValues = useMemo(
    () => ({
      tokens: resolvedTheme,
      name: themeName,
      setTheme,
    }),
    [resolvedTheme, themeName, setTheme]
  );

  return (
    <ThemeContext.Provider value={ themeProviderValues }>
      <div style={ cssVars }>
        { children }
      </div>
    </ThemeContext.Provider>
  );
}
// ======================================================================================


// SLOT =================================================================================
// src/ui/slot.tsx
const SlotScope = createContext<string | null>(null);
export const SlotScopeProvider = SlotScope.Provider;


export const useSlots = <N extends string> (
  children: ReactNode,
  names: readonly N[]
) => {

  const buckets = Object.fromEntries(
    [...names, 'default'].map(name => ([
        name,
        [] as ReactElement[]
    ]))
  ) as Record<N | 'default', ReactElement[]>;

  // something about not treating every nested fragment as a single element
  const stack = Children.toArray(children)
  .reverse()
  .map(node => ({ node, prefix: '' }));
  const childrenList: ReactElement[] = [];
  while (stack.length) {
    const { node, prefix } = stack.pop()!;
    if (!isValidElement(node)) continue;
    const key = `${prefix}${node.key}`;
    if (node.type === Fragment) {
      const inner = Children.toArray((node.props as { children?: ReactNode }).children);
      for (let i = inner.length - 1; i >= 0; i--) {
        stack.push({ node: inner[i], prefix: `${key}/` });
      }
    } else childrenList.push(prefix ? cloneElement(node, { key }) : node);
  }

  for (const child of childrenList) {
    const marker = (child.type as Partial<SlotMarker>).marker;
    if (!marker) {
      buckets.default.push(child);
      continue;
    }
    if (!names.includes(marker.slotName as N)) throw new Error(`Unknown slot <${marker.parentName}.${marker.slotName}>`);
    buckets[marker.slotName as N].push(child);
  }

  return buckets;
}


export const createSlot = <P extends object, S extends object = {}> (
  Component: ComponentType<P>,
  opts: {
    slotName: string;
    parentName: string;
    slotProps?: readonly (keyof S)[]; // slot-only props: consumed by parent, never forwarded to component
  },
): ComponentType<P & S> & SlotMarker => {
  
  const Slot = (props: P & S) => {
    const scope = useContext(SlotScope);
    if (scope !== opts.parentName) throw new Error(`<${opts.parentName}.${opts.slotName}> must be rendered inside <${opts.parentName}>`);

    const forwarded = { ...props } as Record<PropertyKey, unknown>; // create copy
    for (const key of opts.slotProps ?? []) delete forwarded[key as PropertyKey];
    return <Component { ...(forwarded as unknown as P) }/>;
  }

  return Object.assign(Slot, {
    displayName: `${opts.parentName}.${opts.slotName}`,
    marker: {
      slotName: opts.slotName,
      parentName: opts.parentName,
    },
  });
}


export const slotProp = <T,>(
  element: ReactElement,
  key: string
): T | undefined => (element.props as Record<string, unknown>)[key] as T | undefined;
// ======================================================================================

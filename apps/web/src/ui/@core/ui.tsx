import type {
  ChangeEvent, ComponentProps, ComponentType, Context, CSSProperties, FocusEvent,
  KeyboardEvent, PointerEvent, ReactElement, ReactNode, Ref, UIEvent,
} from 'react';
import type {
  GroupContainerDerived, GroupItemContext, GroupItemDerived, GroupItemPosition,
  GroupItemProviderProps, GroupMemberMarker, GroupProps, GroupVariant, PressElementProps,
  PressElementState, PressEvent, ResponsiveProp, SlotMarker, TextInputElementProps,
  ThemeProviderProps, ThemesType, TsDirection, TsGlass, ViewElementProps,
  LayerContextValue, LayerElementProps, HoverElementProps, Placement,
  ViewportCoords, ContentSize, Side, ComputePositionOptions, ComputePositionResult,
  Align, Anchor, Rect, HoverListItemHookOptions, HoverListItemHookHandle,
  HoverElementContextValue, HoverListNavHookOptions,
} from './types';
import {
  Children, cloneElement, createContext, createElement, Fragment, isValidElement,
  useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { createPortal } from 'react-dom';
import { ThemeContext, toCSSVariables, useMediaQuery } from './theme';
import { resolveA11y } from './a11y';
import { storageAdapter } from './storage';
import { tokens } from './tokens';
import { focusable_selector, is_dev } from './constants';
import styles from './style.module.css';


// UTILS ================================================================================
export const resolveGlassStyle = (
  glass: boolean | TsGlass | undefined,
): string => {
  if (!glass) return '';
  const options = glass === true ? {} : glass;
  return [
    styles.glass,
    styles[`glass--tint-${options.tint ?? 'raised'}`],
    styles[`glass--intensity-${options.intensity ?? 'base'}`],
    options.interactive && styles['glass--interactive'],
  ].filter(Boolean).join(' ');
}


export const flattenChildren = (children: ReactNode): ReactElement[] => {
  const stack = Children.toArray(children)
    .reverse()
    .map(node => ({ node, prefix: '' }));
  const flatChildrenList: ReactElement[] = [];
  while (stack.length) {
    const { node, prefix } = stack.pop()!;
    if (!isValidElement(node)) continue;
    const key = `${prefix}${node.key}`;
    if (node.type === Fragment) {
      const inner = Children.toArray((node.props as { children?: ReactNode }).children);
      for (let i = inner.length - 1; i >= 0; i--) {
        stack.push({ node: inner[i], prefix: `${key}/` });
      }
    } else flatChildrenList.push(prefix ? cloneElement(node, { key }) : node);
  }

  return flatChildrenList;
}


const parseTargetId = (id: string | undefined) => {
  const parsed = parseInt(id || '', 10);
  return Number.isNaN(parsed) ? null : parsed;
}


/**
 * @see https://reactnative.dev/docs/pressevent
 */
const pressPayload = (event: PointerEvent<HTMLElement>): PressEvent => {
  const payload: PressEvent = {
    identifier: event.pointerId,
    locationX: event.nativeEvent.offsetX,
    locationY: event.nativeEvent.offsetY,
    pageX: event.pageX,
    pageY: event.pageY,
    target: parseTargetId(event.currentTarget.id),
    timestamp: event.timeStamp,
    changedTouches: [],
    touches: [],
  };
  payload.changedTouches = [payload];
  payload.touches = [payload];
  return payload;
}


const keyboardPressPayload = (event: KeyboardEvent<HTMLElement>): PressEvent => ({
  identifier: -1,
  locationX: 0,
  locationY: 0,
  pageX: 0,
  pageY: 0,
  target: parseTargetId(event.currentTarget.id),
  timestamp: event.timeStamp,
  changedTouches: [],
  touches: [],
});


export const mergeRefs = <T extends Element>(...refs: Array<Ref<T> | undefined | null>) => (
  (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    }
  }
);
// ======================================================================================


// VIEW =================================================================================
// src/ui/view-element.tsx
export const ViewElement = ({
  children, id, theme, a11y, style, testID, ref, classes,
}: ViewElementProps & { classes?: string; }) => {

  const { cssProperties, } = useMediaQuery(theme, style);                         // resolve styling at media query level
  const className = [styles['view-element'], classes].filter(Boolean).join(' ');  // merge css classes
  const accessibility = resolveA11y(a11y);                                        // resolve accessibility props

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
}: PressElementProps & { classes?: string; }) => {

  const [pressed, setPressed] = useState(false);
  
  const timer = useRef<number | undefined>(undefined);  // ReturnType<typeof setTimeout> is number
  const isLongFired = useRef(false);
  const isKeyPress = useRef(false);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
  }, []);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    setPressed(true);
    isLongFired.current = false;
    onPressIn?.({ nativeEvent: pressPayload(event) });
    if (onLongPress) {
      timer.current = setTimeout(
        () => {
          isLongFired.current = true;
          onLongPress({ nativeEvent: pressPayload(event) });
        },
        delayLongPress
      );
    }
  }, [disabled, onPressIn, onLongPress, delayLongPress]);

  const handlePointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    setPressed(false);
    clearTimer();
    onPressOut?.({ nativeEvent: pressPayload(event) });
    if (!isLongFired.current) onPress?.({ nativeEvent: pressPayload(event) });
  }, [disabled, onPressOut, onPress, setPressed, clearTimer]);

  const handlePointerCancel = useCallback(() => {
    setPressed(false);
    clearTimer();
    isLongFired.current = false;
    isKeyPress.current = false;
  },
  [clearTimer]);

  const handlePointerEnter = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    onHoverIn?.({ nativeEvent: pressPayload(event) });
  },
  [disabled, onHoverIn]);

  const handlePointerLeave = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.buttons === 0) onHoverOut?.({ nativeEvent: pressPayload(event) });
    if (!isKeyPress.current) handlePointerCancel();
  }, [disabled, onHoverOut, handlePointerCancel]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    onPressMove?.({ nativeEvent: pressPayload(event) });
  }, [disabled, onPressMove]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || event.repeat) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      isKeyPress.current = true;
      setPressed(true);
      isLongFired.current = false;
      onPressIn?.({ nativeEvent: keyboardPressPayload(event) });
    }
  }, [disabled, onPressIn]);

  const handleKeyUp = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setPressed(false);
      clearTimer();
      onPressOut?.({ nativeEvent: keyboardPressPayload(event) });
      if (!isLongFired.current) onPress?.({ nativeEvent: keyboardPressPayload(event) });
      isKeyPress.current = false;
    }
  }, [disabled, onPressOut, onPress, clearTimer]);

  const state: PressElementState = { pressed, disabled, };
  const content = typeof children === 'function' ? children(state) : children;

  const { cssProperties } = useMediaQuery(theme, style);
  const className = [styles['press-element'], classes].filter(Boolean).join(' ');
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


// TEXT INPUT ===========================================================================
export const TextInputElement = ({
  id, theme, style, a11y, testID, ref,
  autoComplete, autoFocus, defaultValue, inputMode, maxLength, placeholder,
  readOnly, value,
  onBlur, onChange, onChangeText, onFocus, onKeyPress, onPressIn, onPressOut, onScroll,
  onSelectionChange, onSubmitEditing, onEndEditing, onContentSizeChange,
  onLayout,
  classes,
  rows = 1,
  editable = true,
  submitBehavior = 'submit',
}: TextInputElementProps & { classes?: string }) => {

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const elementRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);

  // document-level selectionchange filtered to this element
  useEffect(() => {
    const element = inputRef.current;
    if (!element || !onSelectionChange) return;
    const handler = () => {
      if (document.activeElement !== element) return;
      onSelectionChange({
        nativeEvent: {
          selection: {
            start: element.selectionStart ?? 0,
            end: element.selectionEnd ?? 0,
        }},
      });
    }
    document.addEventListener('selectionchange', handler);
    return () => {
      document.removeEventListener('selectionchange', handler);
    }
  }, [onSelectionChange]);

  // ResizeObserver on the textarea
  useEffect(() => {
    const element = inputRef.current;
    if (!element || !onContentSizeChange) return;
    const resizeObserver = new ResizeObserver(entries => entries.forEach(entry => {
      const { width, height } = entry.contentRect;
      onContentSizeChange({
        nativeEvent: { contentSize: { width, height }},
      });
    }));
    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
    }
  }, [onContentSizeChange]);

  // ResizeObserver on the textarea
  useEffect(() => {
    const element = inputRef.current;
    if (!element || !onLayout) return;
    const resizeObserver = new ResizeObserver(entries => entries.forEach(entry => {
      const { width, height, x, y } = entry.contentRect;
      onLayout({
        nativeEvent: {
          layout: { width, height, x, y },
          target: parseTargetId(entry.target.id),
        },
      });
    }));
    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
    }
  }, [onLayout]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.({
      nativeEvent: {
        text: event.target.value,
        eventCount: 0,
        target: parseTargetId(event.currentTarget.id),
      },
    });
    onChangeText?.(event.target.value);
  };

  const handleFocus = (event: FocusEvent<HTMLTextAreaElement>) => {
    onFocus?.({ nativeEvent: { target: parseTargetId(event.currentTarget.id) } });
  }

  const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    onBlur?.({ nativeEvent: { target: parseTargetId(event.currentTarget.id) } });
    onEndEditing?.({
      nativeEvent: {
        text: event.currentTarget.value,
        eventCount: 0,
        target: parseTargetId(event.currentTarget.id),
      },
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyPress?.({ nativeEvent: { key: event.key, }});
    if (event.key === 'Enter' && submitBehavior === 'submit' && !event.shiftKey) {
      event.preventDefault();
      onSubmitEditing?.({
        nativeEvent: {
          text: event.currentTarget.value,
          eventCount: 0,
          target: parseTargetId(event.currentTarget.id),
      }});
    }
  }

  const handleScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    onScroll?.({
      nativeEvent: {
        contentOffset: {
          x: event.currentTarget.scrollLeft,
          y: event.currentTarget.scrollTop,
      }},
    });
  }
  
  const { cssProperties, } = useMediaQuery(theme, style);
  const className = [styles['text-input-element'], classes].filter(Boolean).join(' ');
  const accessibility = resolveA11y({
    ...a11y,
    state: {
      ...a11y?.state,
      disabled: !editable || a11y?.state?.disabled,
    },
  });

  return (
    <textarea
      className={ className }
      style={ cssProperties }
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
      onPointerDown={ event => onPressIn?.({ nativeEvent: pressPayload(event), }) }
      onPointerUp={ event => onPressOut?.({ nativeEvent: pressPayload(event), }) }
      id={ id }
      onScroll={ handleScroll }
      data-testid={ testID }
      ref={ elementRef }
      { ...accessibility }
    />
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


// PARTITIONS ===========================================================================
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

  const childrenList = flattenChildren(children); // something about not treating every nested fragment as a single element
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


// I need to use my own words for these types
export const createSlot = <
  C extends ComponentType<any>,
  PublicProps extends object = ComponentProps<C>,
  S extends object = {},
>(
  Component: C,
  opts: {
    slotName: string;
    parentName: string;
    slotProps?: readonly (keyof S)[];                                  // slot-only props: consumed by parent, never forwarded to component (?)
    derive?: (child: ComponentProps<C>, slot: S) => ComponentProps<C>; // translate (childProps, slotProps) to childProps before forwarding (??)
  },
): ComponentType<PublicProps & S> & SlotMarker & Omit<C, keyof ComponentType> => {

  // split slot-only props from the rest (??)
  const splitProps = (props: PublicProps & S): [child: ComponentProps<C>, slot: S] => {
    const child: Record<keyof S, unknown> = { ...props };
    const slot: Record<PropertyKey, unknown> = {};
    for (const propName of opts.slotProps ?? []) {
      slot[propName] = child[propName];
      delete child[propName];
    }
    return [child as ComponentProps<C>, slot as S];
  };

  const Slot = (props: PublicProps & S) => {
    const scope = useContext(SlotScope);
    if (scope !== opts.parentName) throw new Error(`<${opts.parentName}.${opts.slotName}> must be rendered inside <${opts.parentName}>`);
    const [child, slot] = splitProps(props);
    const forwarded = opts.derive ? opts.derive(child, slot) : child;
    return createElement(Component, forwarded);
  };

  return Object.assign(Slot, Component, {
    displayName: `${opts.parentName}.${opts.slotName}`,
    marker: {
      slotName: opts.slotName,
      parentName: opts.parentName,
    },
  });
};


export const slotProp = <T,>(
  element: ReactElement,
  key: string
): T | undefined => (element.props as Record<string, unknown>)[key] as T | undefined;


// src/ui/group.tsx
const groupContexts = new Map<string, Context<GroupItemContext | null>>();

/**
 * Gives each group kind its own context, created lazily from a registry keyed by `name`.
 * A `Button` inside a `TextField` group inside a `Button.Group` still finds its own
 * group, which a single shared context would
 * break.
 * @author claude
 */
const getGroupContext = (name: string) => {
  let context = groupContexts.get(name);
  if (!context) {
    context = createContext<GroupItemContext | null>(null);
    context.displayName = `GroupItem(${name})`;
    groupContexts.set(name, context);
  }
  return context;
}


export const GroupItemProvider = ({ name, value, children, }: GroupItemProviderProps) => createElement(
  getGroupContext(name).Provider,
  { value, },
  children,
);


/**
 * Members call this. `null` means 'standalone', so the component behaves as it would
 * when not in a group.
 */
export const useGroupItem = <V extends GroupVariant = GroupVariant>(name: string): GroupItemContext<V> | null => {
  const groupContext = getGroupContext(name);
  return useContext(groupContext) as GroupItemContext<V> | null;
}


/**
 * Strangers render untouched and uncounted, and normalize is accepted here as a plain
 * hook with an identity default.
 * @author claude
 */
export const createGroup = <V extends GroupVariant = GroupVariant>(
  opts: {
    name: string;
    normalize?: (variant: V | undefined) => V;
    deriveChildren?: (
      variant: V,
      item: Pick<GroupItemContext, 'position' | 'index' | 'count'>
    ) => GroupItemDerived;
    deriveContainer?: (variant: V) => GroupContainerDerived;
}) => {
  const { name } = opts;
  const normalize = opts.normalize ?? (( variant: V | undefined ) => (variant ?? {}) as V);
  const deriveChildren = opts.deriveChildren ?? (() => ({}));
  const kindOf = (child: ReactElement) => (child.type as Partial<GroupMemberMarker>).groupMember;

  const Group = ({
    children, variant, theme, a11y, id, style, testID, ref,
  }: GroupProps<V>) => {
    // saves something, since inline variant object is new on every render, making
    // memoizing pointless
    const variantKey = JSON.stringify(variant);
    const normalized = useMemo(() => normalize(variant), [variantKey]);

    const orientation = normalized.orientation ?? 'horizontal';
    const containerTheme = useMemo(() => ({
      flexDirection: orientation === 'horizontal' ? 'row' : 'column' as ResponsiveProp<TsDirection>,
      ...theme,
    }), [orientation, theme]);
    const containerProps = useMemo(() => opts.deriveContainer?.(normalized), [normalized]);
    const containerStyle = useMemo(() => ({
      ...containerProps?.style,
      ...style,
    }), [containerProps, style]);

    const flatChildrenList = flattenChildren(children);
    const count = flatChildrenList.filter(child => kindOf(child) === name).length;

    // warn once for all foreign children in group
    const foreignChildren = flatChildrenList.map(kindOf)
      .filter(kind => kind && kind !== name).join(', ');
    useEffect(() => {
      if (is_dev && foreignChildren) console.warn(`<${name}.Group> contains members of a different group: ${foreignChildren}`);
    }, [foreignChildren]);

    const values = useMemo(() => Array.from({ length: count }, (_, i): GroupItemContext => {
      const position: GroupItemPosition = count === 1 ? 'only' : i === 0 ? 'first' : i === count - 1 ? 'last' : 'middle';
      const item = { position, index: i, count };
      return { variant: normalized, ...item, derived: deriveChildren(normalized, item) };
    }),
    [normalized, count]
  );

    let index = 0;
    const items = flatChildrenList.map(child => {
      if (kindOf(child) !== name) return child; // stranger rendered as-is, not counted
      return (
        <GroupItemProvider
          key={ child.key }
          name={ name }
          value={ values[index++] }
        >
          { child }
        </GroupItemProvider>
      );
    });

    const accessibility = {
      role: 'group',
      ...containerProps?.a11y,
      ...a11y,
    };
    return (
      <ViewElement
        classes={ containerProps?.classes }
        theme={ containerTheme }
        style={ containerStyle }
        id={ id }
        testID={ testID }
        ref={ ref }
        a11y={ accessibility }
      >
        { items }
      </ViewElement>
    );
  }

  Group.displayName = `${name}.Group`;
  return Group;
}
// ======================================================================================


// LAYER ================================================================================
const LayerContext = createContext<LayerContextValue | null>(null);


export const LayerProvider = ({ children }: { children: ReactNode }) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const zCounter = useRef(0);

  const nextZ = useCallback(() => ++zCounter.current, []);
  const release = () => {}  // implement once we have nested menus

  const value = useMemo(() => ({ container, nextZ, release, }), [container, nextZ, release]);

  return (
    <LayerContext.Provider value={ value }>
      { children }
      <div
        className={ styles['layer-provider'] }
        ref={ setContainer }
        data-layer-host=''
      />
    </LayerContext.Provider>
  );
}


export const useLayer = (): LayerContextValue => {
  const layer = useContext(LayerContext);
  if (layer) return layer;
  
  // fallback: portal to `body` and isolated z-counter
  return {
    container: typeof document !== 'undefined' ? document.body : null,
    nextZ: (() => {
      let z = 1000;
      return () => ++z;
    })(),
    release: () => {},
  };
}


export const LayerElement = ({
  children, id, theme, style, a11y, testID, ref,
  open,
  onDismiss,
  dismissOnOutside = true,
  dismissOnEscape = true,
  trapFocus = true,
  restoreFocus = true,
  modal = false,
}: LayerElementProps) => {
  
  const { container, nextZ, } = useLayer();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<HTMLDivElement | null>(null);
  const zRef = useRef<number>(0);

  useEffect(() => {
    if (!open) return;
    zRef.current = nextZ();
    restoreRef.current = document.activeElement as HTMLDivElement | null;
    if (trapFocus && panelRef.current) getFirstFocusableElement(panelRef.current);
    return () => {
      if (restoreFocus) restoreRef.current?.focus?.();
    }
  }, [open, nextZ, trapFocus, restoreFocus]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (dismissOnEscape && event.key === 'Escape') {
        event.stopPropagation();
        onDismiss?.();
      }
      if (trapFocus && event.key === 'Tab') trapWithTabKey(event, panelRef.current);
    }
    const onDown = (event: PointerEvent) => {
      if (!dismissOnOutside) return;
      if (panelRef.current && !(panelRef.current.contains(event.target as Node))) onDismiss?.();
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown, true);
    }
  }, [open, dismissOnEscape, dismissOnOutside, trapFocus, onDismiss]);

  if (!open || !container) return null;

  const layerRef = useMemo(() => mergeRefs(panelRef, ref), [ref]);

  // ooh, this panel
  const panel = (
    <>
      { modal &&
        <div
          className={ styles['layer-element__modal-scrim'] }
          onPointerDown={ onDismiss }
        />
      }
      <ViewElement
        theme={ theme }
        style={{
          ...style,
          position: 'absolute',
          zIndex: zRef.current,
          pointerEvents: 'auto',
        }}
        a11y={{
          role: modal ? 'dialog' : a11y?.role,
          hidden: false,
        }}
        id={ id }
        testID={ testID }
        ref={ layerRef }
      >
        { children }
      </ViewElement>
    </>
  );
  return createPortal(panel, container);
}


/**
 * Runs `focusable_selector` against the panel (what panel?) to build the list the focus
 * trap cycles through.
 */
const getFocusable = (root: HTMLElement): HTMLElement[] => {
  return Array.from(root.querySelectorAll<HTMLElement>(focusable_selector))
    .filter(element => (
      !element.hasAttribute('inert') &&
      element.getAttribute('aria-hidden') !== 'true' &&
      (element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0)
    ));
}


const getFirstFocusableElement = (root: HTMLElement) => {
  const [first] = getFocusable(root);
  if (first) return first.focus();
  if (!root.hasAttribute('tabindex')) root.setAttribute('tabindex', '-1');  // fallback: make the panel itself focusable so the trap has an anchor
  root.focus();
}

const trapWithTabKey = (
  event: KeyboardEvent,
  root: HTMLElement | null,
) => {
  if (!root) return;
  const items = getFocusable(root);
  if (items.length === 0) {
    event.preventDefault();
    root.focus();
    return;
  }
  const first = items[0];
  const last = items[items.length -1];
  const active = document.activeElement;
  const outside = !active || !root.contains(active);

  if (
    event.shiftKey &&
    (active === first || active === root || outside)
  ) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || outside)) {
    event.preventDefault();
    first.focus();
  }
}
// ======================================================================================


// HOVER ================================================================================
const flip_side: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

const readAnchorRect = (anchor: Anchor): Rect | null => {
  if (!anchor) return null;
  const element = anchor instanceof HTMLElement ? anchor : anchor.current;  // preferred over 'current' in anchor for some reason
  if (!element || !element.isConnected) return null;  // return null because anchor may unmount between open and measure
  const rect = element.getBoundingClientRect();
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  };
}


const parsePlacement = (placement: Placement): [Side, Align] => {
  const [side, align] = placement.split('-') as [Side, Align];
  return [side, align];
}


const formatPlacement = (
  side: Side,
  align: Align,
): Placement => (align === 'center' ? side : `${side}-${align}`);


const clamp = (
  coordPoint: number,
  min: number,
  max: number
) => Math.min(Math.max(coordPoint, min), max);


const getRawCoords = (
  {
    x: anchorX,
    y: anchorY,
    width: anchorWidth,
    height: anchorHeight,
  }: Rect,
  panelWidth: number,
  panelHeight: number,
  side: Side,
  align: Align,
  offset: number,
): ViewportCoords => {
  let x = 0, y = 0;

  if (side === 'top')    y = anchorY -panelHeight -offset;
  if (side === 'bottom') y = anchorY +anchorHeight +offset;
  if (side === 'left')   x = anchorX -panelWidth -offset;
  if (side === 'right')  x = anchorX +anchorWidth +offset;

  // cross-axis alignment
  if (side === 'top' || side === 'bottom') {
    if (align === 'start') x = anchorX;
    else if (align === 'end') x = anchorX +anchorWidth -panelWidth;
    else x = anchorX +(anchorWidth -panelWidth) /2;
  } else {
    if (align === 'start') y = anchorY;
    else if (align === 'end') y = anchorY +anchorHeight -panelHeight;
    else y = anchorY +(anchorHeight - panelHeight) /2;
  }

  return { x, y, };
};


const primaryOverflow = (
  position: ViewportCoords,
  panelWidth: number,
  panelHeight: number,
  side: Side,
  contentSize: ContentSize,
): number => {
  switch (side) {
    case 'top':    return Math.max(0, -position.y);
    case 'bottom': return Math.max(0, position.y +panelHeight -contentSize.height);
    case 'left':   return Math.max(0, -position.x);
    case 'right':  return Math.max(0, position.x +panelWidth -contentSize.width);
  }
};


const computePosition = ({
  anchor, panel, placement, offset, flip, shift, matchAnchorWidth, contentSize,
}: ComputePositionOptions): ComputePositionResult => {
  const [side, align] = parsePlacement(placement);
  const panelWidth = matchAnchorWidth ? anchor.width : panel.width;
  const panelHeight = panel.height;

  let resolvedSide = side;
  let position = getRawCoords(anchor, panelWidth, panelHeight, side, align, offset);

  if (flip) {
    const here = primaryOverflow(position, panelWidth, panelHeight, side, contentSize);
    if (here > 0) {
      const oppositeSide = flip_side[side];
      const flippedPosition = getRawCoords(anchor, panelWidth, panelHeight, oppositeSide, align, offset);
      const there = primaryOverflow(flippedPosition, panelWidth, panelHeight, oppositeSide, contentSize);
      if (there < here) {
        resolvedSide = oppositeSide;
        position = flippedPosition;
      }
    }
  }

  if (shift) {
    if (resolvedSide === 'top' || resolvedSide === 'bottom') position.x = clamp(position.x, 0, Math.max(0, contentSize.width -panelWidth));
    else position.y = clamp(position.y, 0, Math.max(0, contentSize.height -panelHeight));
  }

  return {
    x: position.x,
    y: position.y,
    placement: formatPlacement(resolvedSide, align),
  };
}


export const HoverElement = ({
  children, id, theme, style, a11y, testID, ref,
  anchor, open, 
  onDismiss,
  placement = 'bottom-start',
  offset = 4,
  flip = true,
  shift = true,
  matchAnchorWidth = false,
  dismissOnOutside = true,
  dismissOnEscape = true,
  trapFocus = true,
  restoreFocus = true,
}: HoverElementProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const mergedRef = useMemo(() => mergeRefs(panelRef, ref), [ref]);
  const [position, setPosition] = useState<{
    x: number;
    y: number;
    placement: Placement;
    anchorWidth: number;
  } | null>(null);

  const update = useCallback(() => {
    const anchorRect = readAnchorRect(anchor);
    const panelElement = panelRef.current;
    if (!anchorRect || !panelElement) return;
    const rect = panelElement.getBoundingClientRect();
    const next = computePosition({
      placement, offset, flip, shift, matchAnchorWidth,
      anchor: anchorRect,
      panel: {
        width: rect.width,
        height: rect.height,
      },
      contentSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
    setPosition({
      ...next,
      anchorWidth: anchorRect.width,
    });
  }, [anchor, placement, offset, flip, shift, matchAnchorWidth]);

  // Run first `update` synchronously before browser paints to get `position`. Until
  // then, `visibility: 'hidden'`.
  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    const panelElement = panelRef.current;
    if (!panelElement) return;
    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(panelElement);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    }
  }, [open, update]);

  return (
    <LayerElement
      open={ open }
      style={{
        ...style,
        top: position?.y ?? 0,
        left: position?.x ?? 0,
        width: matchAnchorWidth && position ? position.anchorWidth : style?.width,
        visibility: position ? 'visible' : 'hidden',
      }}
      onDismiss={ onDismiss }
      dismissOnOutside={ dismissOnOutside }
      dismissOnEscape={ dismissOnEscape }
      trapFocus={ trapFocus }
      restoreFocus={ restoreFocus }
      theme={ theme }
      id={ id }
      testID={ testID }
      a11y={ a11y }
      ref={ mergedRef }
    >
      { children }
    </LayerElement>
  );
}



const HoverContext = createContext<HoverElementContextValue | null>(null);
export const HoverScopeProvider = HoverContext.Provider;


export const useHoverListItem = (opts: HoverListItemHookOptions = {}): HoverListItemHookHandle => {
  const context = useContext(HoverContext);
  if (!context) throw new Error('useHoverListItem must be used inside <HoverView>');

  const [index, setIndex] = useState<number>(-1);

  useLayoutEffect(() => {
    const registerContext = context.register(opts);
    setIndex(registerContext.index);
    return registerContext.unregister();
  });

  const active = index >= 0 && index === context.activeIndex;

  const ref = useCallback((element: HTMLElement | null) => {
    if (index >= 0) context.setElement(index, element);
  }, [index, context]);

  return ({
    index,
    active,
    ref,
    itemProps: {
      id: context.getId(index),
      tabIndex: context.navMode === 'focus' && active ? 0 : -1,
      onFocus: () => {
        if (index >= 0) context.setActive(index);
    }},
  });
}


export const useHoverListNavigation = ({
  navMode, count, items, activeIndex,
  getId, onActiveIndexChange, onCommit,
  defaultActiveIndex = -1,
}: HoverListNavHookOptions) => {

  const [uncontrolled, setUncontrolled] = useState(defaultActiveIndex);
  const activeIdx = activeIndex ?? uncontrolled;
  const setActiveIdx = useCallback((i: number) => {
    if (activeIndex === undefined) setUncontrolled(i);
    onActiveIndexChange?.(i);
  }, [activeIndex, onActiveIndexChange]);

  const buffer = useRef('');
  const bufferTimer = useRef<number | undefined>(undefined);

  const findNext = useCallback((
    from: number,
    order: 1 | -1
  ) => {
    if (count === 0) return -1;
    let i = from;
    for (let step = 0; step < count; step++) {
      i = (i +order +count) %count;
      if (!items.get(i)?.disabled) return i;
    }
    return -1;
  }, [count, items]);

  const onContainerKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
    if (navMode === 'none') return;
    const key = event.key;
    if (key === 'ArrowDown' || key === 'ArrowRight') {
      event.preventDefault();
      const nextIdx = findNext(activeIdx < 0 ? -1 : activeIdx, 1);
      if (nextIdx >= 0) setActiveIdx(nextIdx);
    } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
      event.preventDefault();
      const prevIdx = findNext(activeIdx < 0 ? count : activeIdx, -1);
      if (prevIdx >= 0) setActiveIdx(prevIdx);
    } else if (key === 'Home') {
      event.preventDefault();
      const first = findNext(-1, 1);
      if (first >= 0) setActiveIdx(first);
    } else if (key === 'End') {
      event.preventDefault();
      const last = findNext(count, -1);
      if (last >= 0) setActiveIdx(last);
    } else if (key === 'Enter') {
      if (activeIdx >= 0) {
        event.preventDefault();
        onCommit?.(activeIdx);
      }
    } else if (key.length === 1) {
      if (bufferTimer.current) clearTimeout(bufferTimer.current);
      buffer.current += key.toLowerCase();
      bufferTimer.current = window.setTimeout(() => {
        buffer.current = '';
      }, 500);
      for (let i = 0; i < count; i++) {
        const current = items.get(i);
        if (current?.disabled) continue;
        if (current?.label?.toLowerCase().startsWith(buffer.current)) {
          setActiveIdx(i);
          break;
        }
      }
    }
  }, [navMode, activeIdx, count, items, findNext, setActiveIdx, onCommit]);

  // focus adapter
  useEffect(() => {
    if (navMode !== 'focus' || activeIdx < 0) return;
    items.get(activeIdx)?.element?.focus();
  }, [navMode, activeIdx, items]);

  return ({
    activeIndex: activeIdx,
    setActive: setActiveIdx,
    onContainerKeyDown,
  });
}

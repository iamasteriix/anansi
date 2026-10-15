import type {
  ComponentProps, ComponentType, Context, CSSProperties, KeyboardEvent, PointerEvent,
  ReactElement, ReactNode, SyntheticEvent,
} from 'react';
import type {
  GroupContainerDerived, GroupItemContext, GroupItemDerived, GroupItemPosition,
  GroupItemProviderProps, GroupMemberMarker, GroupProps, GroupVariant, PressElementProps,
  PressElementState, ResponsiveProp, SlotMarker, ThemeProviderProps, ThemesType,
  TsDirection, TsGlass, ViewElementProps,
} from './types';
import {
  Children, cloneElement, createContext, createElement, Fragment, isValidElement,
  useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { ThemeContext, toCSSVariables, useMediaQuery } from './theme';
import { resolveA11y } from './a11y';
import { storageAdapter } from './storage';
import { tokens } from './tokens';
import { is_dev } from './constants';
import styles from './style.module.css';


// VIEW =================================================================================
// src/ui/view-element.tsx
export const ViewElement = ({
  children, id, theme, a11y, style, testID, ref, classes,
}: ViewElementProps & { classes?: string; }) => {

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
}: PressElementProps & { classes?: string; }) => {

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


const flattenChildren = (children: ReactNode): ReactElement[] => {
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
// ======================================================================================

// src/layout/slot.web.tsx
import type { ComponentType, ReactElement, ReactNode } from 'react';
import type { SlotMarker } from './types';
import { Children, cloneElement, createContext, Fragment, isValidElement, useContext } from 'react';


/**
 * Context
 */
const SlotScope = createContext<string | null>(null);
export const SlotScopeProvider = SlotScope.Provider;


/**
 * Hook
 */
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


/**
 * Factory
 */
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


/**
 * Util
 */
export const slotProp = <T,>(
  element: ReactElement,
  key: string
): T | undefined => (element.props as Record<string, unknown>)[key] as T | undefined;

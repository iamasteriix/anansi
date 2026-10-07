import type { ContextMenuState, } from './types';
import { createContext, useContext } from 'react';


/**
 * Initialize `ContextMenu` context
 */
export const ContextMenuContext = createContext<ContextMenuState | null>(null);


/**
 * Creates `ContextMenu` context hook
 */
export const useContextMenuContext = (): ContextMenuState => {
  const values = useContext(ContextMenuContext);
  if (!values) throw new Error('ContextMenu subcomponents must be rendered within ContextMenu');
  return values;
}

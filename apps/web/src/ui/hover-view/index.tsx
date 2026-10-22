import type {
  HoverElementNavMode, HoverElementProps, HoverListItem, HoverListItemHookOptions,
} from '../@core';
import { useCallback, useId, useRef } from 'react';
import {
  HoverElement, HoverScopeProvider, useHoverListNavigation, ViewElement,
} from '../@core';
import styles from './styles.module.css';


// Types ————————————————————————————————————————————————————————————————————————————————
export type HoverViewProps = HoverElementProps & {
  navMode?: HoverElementNavMode;
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  onCommit?: (index: number) => void; // Enter/Space on active item
};


// Core —————————————————————————————————————————————————————————————————————————————————
export const HoverView = ({
  children, id, theme, style, a11y, testID, ref,
  activeIndex, defaultActiveIndex,
  onActiveIndexChange, onCommit,
  anchor, placement, offset, flip, shift, matchAnchorWidth, open, dismissOnOutside,
  dismissOnEscape, trapFocus, restoreFocus,
  onDismiss, 
  navMode = 'none',
}: HoverViewProps) => {

  const items = useRef(new Map<number, HoverListItem>());
  const nextIndex = useRef(0);
  const idPrefix = useId();
  const getId = useCallback((i: number) => `${idPrefix}-item-${i}`, [idPrefix]);

  const register = useCallback((opts: HoverListItemHookOptions) => {
    const index = opts.index ?? nextIndex.current++;
    items.current.set(index, {
      index,
      disabled: !!opts.disabled,
      label: opts.label,
      element: null,
    });
    return {
      index,
      unregister: () => {
        items.current.delete(index);
      },
    };
  }, []);

  const setElement = useCallback((
    index: number,
    element: HTMLElement | null
  ) => {
    const item = items.current.get(index);
    if (item) item.element = element;
  }, []);

  const {
    setActiveIndex, onKeyPress,
    activeIndex: activeIdx,
  } = useHoverListNavigation({
    navMode, activeIndex, defaultActiveIndex,
    getId, onActiveIndexChange, onCommit,
    items: items.current,
  });

  return (
    <HoverElement
      anchor={ anchor }
      placement={ placement }
      offset={ offset }
      flip={ flip }
      shift={ shift }
      matchAnchorWidth={ matchAnchorWidth }
      open={ open }
      onDismiss={ onDismiss }
      dismissOnOutside={ dismissOnOutside }
      dismissOnEscape={ dismissOnEscape }
      trapFocus={ trapFocus ?? (navMode !== 'none') }
      restoreFocus={ restoreFocus }
      theme={ theme }
      style={ style }
      id={ id }
      a11y={ a11y }
      testID={ testID }
      ref={ ref }
    >
      <HoverScopeProvider
        navMode={ navMode }
        activeIndex={ activeIdx }
        register={ register }
        setElement={ setElement }
        getId={ getId }
        setActiveIndex={ setActiveIndex }
        onKeyPress={ onKeyPress }
        tabIndex={ navMode === 'virtual' ? 0 : -1 }
      >
        <ViewElement classes={ styles['hover-view'] }>
          { children }
        </ViewElement>
      </HoverScopeProvider>
    </HoverElement>
  );
}

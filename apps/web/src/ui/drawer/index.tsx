import type { CSSProperties, RefObject, TransitionEvent } from 'react';
import type { ResponsiveProp, TsSize, ViewElementProps } from '../@core';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDrag } from '@use-gesture/react';
import {
  createSlot, mergeRefs, resolveBreakpoint, SlotScopeProvider, useLayerBehavior,
  useMediaQuery, useSlots, ViewElement,
} from '../@core';
import { styles } from '../@core';


// Types ————————————————————————————————————————————————————————————————————————————————
type DrawerType = 'front' | 'back' | 'slide' | 'permanent';
type DrawerPosition = 'left' | 'right';
type DrawerPhase = 'open' | 'opening' | 'closed' | 'closing';

type DrawerProps = ViewElementProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drawerType?: ResponsiveProp<DrawerType>;
  drawerPosition?: DrawerPosition;
  drawerWidth?: ResponsiveProp<TsSize> | number;
  swipeEnabled?: boolean;
  swipeEdgeWidth?: number;
  swipeMinDistance?: number;
};

type DrawerGestureOptions = {
  enabled: boolean;
  open: boolean;
  position: DrawerPosition;
  edgeWidth: number;
  minDistance: number;
  rootRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLElement | null>;
  startDrag: () => void;
  endDrag: (target: boolean) => void;
  setProgress: (progress: number) => void;
  onOpenChange: (open: boolean) => void;
};


// Utils ————————————————————————————————————————————————————————————————————————————————
const resolveStyle = ({
  type, drawerPosition, interactive, isPermanent,
  animating, style, progress, drawerWidth,
}: {
  type?: DrawerType;
  drawerPosition?: DrawerPosition;
  interactive?: boolean;
  isPermanent?: boolean;
  animating: boolean;
  style?: CSSProperties;
  progress?: number;
  drawerWidth?: ResponsiveProp<TsSize> | number;
}) => {
  const classes = [
    styles.drawer,
    styles[`drawer--${type}`],
    styles[`drawer--${drawerPosition}`],
    interactive && !isPermanent && styles['drawer--interactive'],
    animating && styles['drawer--animating'],
  ].filter(Boolean).join(' ');

  const cssVars = {
    ...style,
    ...(typeof drawerWidth === 'number' ? { '--drawer-width': `${drawerWidth}px` } : {}),
    '--drawer-progress': isPermanent ? 1 : progress,
  } as CSSProperties;

  return { classes, cssVars, };
}


// Core —————————————————————————————————————————————————————————————————————————————————
const settle_fallback_ms = 540; // covers reduced motion/zero-duration where 'transitionend' never fires


const useDrawerPhase = (open: boolean) => {
  const [phase, setPhase] = useState<DrawerPhase>(open ? 'open' : 'closed');
  const [progress, setProgress] = useState(open ? 1 : 0);

  // mount at 0 first, then move to 1 on second frame so browser has a start value
  useEffect(() => {
    if (open) {
      setPhase(currentPhase => currentPhase === 'open' ? currentPhase : 'opening');
      let secondFrameProgress = 0;
      const firstFrameProgress = requestAnimationFrame(() => {
        secondFrameProgress = requestAnimationFrame(() => setProgress(1));
      });
      return () => {
        cancelAnimationFrame(firstFrameProgress);
        cancelAnimationFrame(secondFrameProgress);
      }
    }
    setPhase(currentPhase => currentPhase === 'closed' ? currentPhase : 'closing'); // reverse transition when `open` flipped mid-flight
    setProgress(0);
  }, [open]);

  const settle = useCallback(() => {
    return setPhase(currentPhase => (
      currentPhase === 'opening' && progress === 1 ? 'open' :
      currentPhase === 'closing' && progress === 0 ? 'closed' :
      currentPhase
    ));
  }, [progress]);

  useEffect(() => {
    if (phase !== 'opening' && phase !== 'closing') return;
    const timer = setTimeout(settle, settle_fallback_ms);
    return () => {
      clearTimeout(timer);
    }
  }, [phase, settle]);

  const [dragging, setDragging] = useState(false);

  const startDrag = useCallback(() => {
    setDragging(true);
    setPhase(currentPhase => currentPhase === 'closed' ? 'opening' : currentPhase); // mount panel
  }, []);

  const endDrag = useCallback((target: boolean) => {
    setDragging(false);
    setProgress(target ? 1 : 0);
    setPhase(target ? 'opening' : 'closing');
  }, []);

  // attach to the panel only, ignore transitions bubbling up from its children
  const onTranstitionEnd = useCallback((event: TransitionEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) settle();
  }, [settle]);

  return ({
    phase,
    progress,
    setProgress,
    onTranstitionEnd,
    mounted: phase !== 'closed',  // keeps panel in DOM while it animated out
    interactive: phase === 'opening' || phase === 'open', // focus trapping and dismissal end when closing starts
    animating: (phase === 'opening' || phase === 'closing') && !dragging,
    dragging,
    startDrag,
    endDrag,
  });
}


export const useDrawerGesture = ({
  open, enabled, position, edgeWidth, rootRef, panelRef, minDistance,
  onOpenChange, startDrag, setProgress, endDrag,
}: DrawerGestureOptions) => {
  const suppressClick = useRef(false);
  const active = useRef(false);
  const direction = position === 'left' ? 1 : -1;
  const progressAt = (movementX: number) => {
    const width = panelRef.current?.offsetWidth || 270; // panel not yet mounted on first frame
    const value = (open ? 1 : 0) +(movementX *direction) /width;
    return Math.min(1, Math.max(0, value));
  }

  useDrag(({
    first, last, tap, cancel, event,
    xy: [x],
    movement: [movementX],
    direction: [directionX],
    velocity: [velocityX],
  }) => {
    if (tap) return;
    if (first) {
      const rect = rootRef.current!.getBoundingClientRect();  // do we know for a fact that `rect` exists?
      const startX = x -movementX;  // threshold means `xy` has already moved past the start
      const fromEdge = position === 'left' ? startX -rect.left : rect.right -startX;
      const opening = movementX *direction > 0;
      if (open === opening || (!open && fromEdge > edgeWidth)) return cancel();
      if ((event as PointerEvent).pointerType === 'mouse') return cancel(); // ignore drag for mouse pointer
      active.current = true;
      startDrag();
    }
    if (!active.current) return;
    if (!last) return setProgress(progressAt(movementX));

    active.current = false;
    const target = velocityX > .5 ? directionX *direction > 0 : progressAt(movementX) > .5;
    suppressClick.current = true; // click after 'pointerup' mustn't hit the scrim
    setTimeout(() => {
      suppressClick.current = false;
    });
    endDrag(target);
    if (target !== open) onOpenChange(target);
  }, {
    target: rootRef,
    enabled,
    axis: 'x',
    filterTaps: true,
    threshold: minDistance,
    eventOptions: { passive: false, },
  });

  return { suppressClick, };
}


export const Drawer = ({
  children, id, theme, style, a11y, testID, ref,
  onLayout,
  open, drawerWidth,
  onOpenChange,
  drawerType = 'front',
  drawerPosition = 'left',
  swipeEnabled = true,
  swipeEdgeWidth = 27,
  swipeMinDistance = 9,
}: DrawerProps) => {

  const { breakpoint, } = useMediaQuery();
  const type = resolveBreakpoint(drawerType, breakpoint) ?? 'front';
  const isPermanent = type === 'permanent';

  const {
    interactive, animating, progress, mounted, onTranstitionEnd,
    startDrag, endDrag, setProgress,
  } = useDrawerPhase(open);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const handleDismiss = useCallback(() => onOpenChange(false), [onOpenChange]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const elementRef = useMemo(() => mergeRefs(rootRef, ref), [ref]);

  const { suppressClick, } = useDrawerGesture({
    open, rootRef, panelRef, startDrag, endDrag, setProgress, onOpenChange,
    enabled: swipeEnabled && !isPermanent,
    position: drawerPosition,
    edgeWidth: swipeEdgeWidth,
    minDistance: swipeMinDistance,
  });
  
  useLayerBehavior({
    active: interactive && !isPermanent,
    panelRef,
    onDismiss: handleDismiss,
    dismissOnOutside: false,  // avoid scrim click and drag conflict
  });

  // main content inert while drawer is modal
  const contentRef = useRef<HTMLDivElement | null>(null);

  // `useLayoutEffect` because focus restore in `useLayerBehavior` runs in a passive
  // cleanup, and `focus()` fails on inert elements
  useLayoutEffect(() => {
    if (contentRef.current) contentRef.current.inert = interactive && !isPermanent;
  }, [interactive, isPermanent]);

  const handleClickScrim = () => {
    if (!suppressClick.current) handleDismiss();
  }

  const slots = useSlots(children, ['Content']);

  const { classes, cssVars, } = resolveStyle({
    type, drawerPosition, interactive, isPermanent, animating,
    style, progress, drawerWidth,
  });

  return (
    <ViewElement
      classes={ classes }
      theme={{
        ...(typeof drawerWidth !== 'number' ? { width: drawerWidth } : {}),
        ...theme,
      }}
      style={ cssVars }
      a11y={ a11y }
      id={ id }
      testID={ testID }
      ref={ elementRef }
      onLayout={ onLayout }
    >
      { (isPermanent || mounted) &&
        <ViewElement
          classes={ styles['drawer__panel'] }
          ref={ panelRef }
        >
          <SlotScopeProvider value='Drawer'>
              { slots.Content }
          </SlotScopeProvider>
        </ViewElement>
      }
      <ViewElement classes={ styles['drawer__main'] }>
        <ViewElement
          classes={ styles['drawer__content'] }
          ref={ contentRef }
        >
          { slots.default }
        </ViewElement>
        { !isPermanent &&
          <div
            className={ styles['drawer__scrim'] }
            onClick={ handleClickScrim }
            onTransitionEnd={ onTranstitionEnd }
          />
        }
      </ViewElement>
    </ViewElement>
  );
}


// Slots ————————————————————————————————————————————————————————————————————————————————
Drawer.Content = createSlot(ViewElement, {
  slotName: 'Content',
  parentName: 'Drawer',
});

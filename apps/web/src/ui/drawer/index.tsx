import type { CSSProperties, RefObject, TransitionEvent } from 'react';
import type { ResponsiveProp, ViewElementProps } from '../@core';
import {
  useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { useDrag } from '@use-gesture/react';
import {
  createSlot, mergeRefs, resolveBreakpoint, SlotScopeProvider, useLayerBehavior,
  useMediaQuery, useSlots, ViewElement,
} from '../@core';
import styles from './style.module.css';


// Types ————————————————————————————————————————————————————————————————————————————————
type DrawerType = 'front' | 'back' | 'slide' | 'permanent';
type DrawerPosition = 'left' | 'right';
type DrawerPhase = 'open' | 'opening' | 'closed' | 'closing';

type DrawerGestureConfig = {
  activeOffsetX?: [number, number];
  failOffsetY?: [number, number];
};

type DrawerGestureOptions = {
  enabled: boolean;
  open: boolean;
  position: DrawerPosition;
  edgeWidth: number;
  minDistance: number;
  minVelocity: number;
  gestureConfig: DrawerGestureConfig;
  rootRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLElement | null>;
  panelWidthRef: RefObject<number>;
  startDrag: () => void;
  endDrag: (target: boolean) => void;
  setProgress: (progress: number) => void;
  onOpen: () => void;
  onClose: () => void;
};

type DrawerProps = ViewElementProps & {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  drawerType?: ResponsiveProp<DrawerType>;
  drawerPosition?: DrawerPosition;
  drawerWidth?: number;
  overlayStyle?: CSSProperties;
  swipeEnabled?: boolean;
  swipeEdgeWidth?: number;
  swipeMinDistance?: number;
  swipeMinVelocity?: number;
  configureGestureHandler?: (defaults: DrawerGestureConfig) => DrawerGestureConfig;
};


// Utils ————————————————————————————————————————————————————————————————————————————————
const resolveStyle = ({
  type, drawerPosition, interactive, isPermanent,
  animating, style, progress, drawerWidth,
}: {
  type: DrawerType;
  drawerPosition: DrawerPosition;
  interactive: boolean;
  isPermanent: boolean;
  animating: boolean;
  style?: CSSProperties;
  progress: number;
  drawerWidth?: number;
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
    '--drawer-width': `${drawerWidth ?? 0}px`,
    '--drawer-progress': isPermanent ? 1 : progress,
  } as CSSProperties;

  return { classes, cssVars, };
}


// Core —————————————————————————————————————————————————————————————————————————————————
const settle_fallback_ms = 540; // covers reduced motion/zero-duration where 'transitionend' never fires


const useDrawerPhase = (open: boolean) => {
  const [phase, setPhase] = useState<DrawerPhase>(open ? 'open' : 'closed');
  const [progress, setProgress] = useState(open ? 1 : 0);
  const [dragging, setDragging] = useState(false);

  // mount at 0 first, then move to 1 on second frame so browser has a start value (??)
  useEffect(() => {
    setDragging(false); // cancel any in-flight drag if `open` flipped externally
    if (open) {
      setPhase(currentPhase => currentPhase === 'open' ? currentPhase : 'opening');
      let secondFrame = 0;
      const firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => setProgress(1));
      });
      return () => {
        cancelAnimationFrame(firstFrame);
        if (secondFrame) cancelAnimationFrame(secondFrame);
      }
    }
    setPhase(currentPhase => currentPhase === 'closed' ? currentPhase : 'closing'); // reverse transition when `open` flipped mid-flight
    setProgress(0);
  }, [open]);

  const settle = useCallback(() => {
    setPhase(currentPhase => (
      currentPhase === 'opening' && progress === 1 ? 'open' :
      currentPhase === 'closing' && progress === 0 ? 'closed' :
      currentPhase
    ));
  }, [progress]);

  useEffect(() => {
    if (phase !== 'opening' && phase !== 'closing') return;
    if (dragging) return; // never settle mid-drag
    const timer = setTimeout(settle, settle_fallback_ms);
    return () => {
      clearTimeout(timer);
    }
  }, [phase, dragging, settle]);


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
  const handleTranstitionEnd = useCallback((event: TransitionEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) settle();
  }, [settle]);

  return ({
    phase,
    progress,
    setProgress,
    onTranstitionEnd: handleTranstitionEnd,
    mounted: phase !== 'closed',  // keeps panel in DOM while it animates out
    interactive: phase === 'opening' || phase === 'open', // focus trapping and dismissal end when closing starts
    animating: (phase === 'opening' || phase === 'closing') && !dragging,
    dragging,
    startDrag,
    endDrag,
  });
}


export const useDrawerGesture = ({
  open, enabled, position, edgeWidth, minDistance, minVelocity, gestureConfig, rootRef,
  panelRef, panelWidthRef,
  onOpen, onClose, startDrag, setProgress, endDrag,
}: DrawerGestureOptions) => {
  const suppressClick = useRef(false);
  const active = useRef(false);
  const direction = position === 'left' ? 1 : -1;

  const progressAt = (movementX: number) => {
    const width = panelWidthRef.current || panelRef.current?.offsetWidth || 270; // panel not yet mounted on first frame
    const value = (open ? 1 : 0) +(movementX *direction) /width;
    return Math.min(1, Math.max(0, value));
  }
  const threshold = gestureConfig.activeOffsetX
    ? Math.min(Math.abs(gestureConfig.activeOffsetX[0]), Math.abs(gestureConfig.activeOffsetX[1]))
    : minDistance;

  useDrag(({
    first, last, tap, event, cancel,
    xy: [x],
    movement: [movementX, movementY],
    direction: [directionX],
    velocity: [velocityX],
  }) => {
    if (tap) return;

    // some shit about gating activation and committing on drag
    if (!active.current && gestureConfig.failOffsetY) {
      const foo = gestureConfig.failOffsetY;
      if (movementY < foo[0] || movementY > foo[1]) return cancel();
    }

    if (first) {
      const root = rootRef.current;
      if (!root) return cancel();
      const rect = root.getBoundingClientRect();
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
    const target = velocityX > minVelocity ? directionX *direction > 0 : progressAt(movementX) > .5;
    suppressClick.current = true; // click after 'pointerup' mustn't hit the scrim
    setTimeout(() => {
      suppressClick.current = false;
    }, 0);
    endDrag(target);
    if (target && !open) onOpen();
    else if (!target && open) onClose();
  }, {
    target: rootRef,
    enabled,
    axis: 'x',
    filterTaps: true,
    threshold,
    eventOptions: { passive: false, },
  });

  return { suppressClick, };
}


export const Drawer = ({
  children, id, theme, style, a11y, testID, ref,
  onLayout,
  open, drawerWidth, overlayStyle,
  onOpen, onClose, configureGestureHandler,
  drawerType = 'front',
  drawerPosition = 'left',
  swipeEnabled = true,
  swipeEdgeWidth = 27,
  swipeMinDistance = 9,
  swipeMinVelocity = .5,
}: DrawerProps) => {

  const { breakpoint, } = useMediaQuery();
  const type = resolveBreakpoint(drawerType, breakpoint) ?? 'front';
  const isPermanent = type === 'permanent';

    const {
    phase, interactive, animating, progress, mounted,
    onTranstitionEnd, startDrag, endDrag, setProgress,
  } = useDrawerPhase(open);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const panelWidthRef = useRef(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null); // main content inert while drawer is modal
  const elementRef = useMemo(() => mergeRefs(rootRef, ref), [ref]);

  // track panel width so drag math doesn't thrash layout on every frame
  useLayoutEffect(() => {
    const element = panelRef.current;
    if (!element) return;
    const measure = () => {
      panelWidthRef.current = element.offsetWidth;
    }
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
    }
  }, [mounted]);

  const gestureConfig = useMemo<DrawerGestureConfig>(() => {
    const defaults: DrawerGestureConfig = {
      activeOffsetX: [-swipeMinDistance, swipeMinDistance],
    };
    return configureGestureHandler?.(defaults) ?? defaults;
  }, [swipeMinDistance, configureGestureHandler]);

  const { suppressClick, } = useDrawerGesture({
    open, rootRef, panelRef, panelWidthRef, gestureConfig,
    startDrag, endDrag, setProgress, onOpen, onClose,
    enabled: swipeEnabled && !isPermanent,
    position: drawerPosition,
    edgeWidth: swipeEdgeWidth,
    minDistance: swipeMinDistance,
    minVelocity: swipeMinVelocity,
  });

  // capture on activation, restore only when panel is fully gone
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const wasInteractive = useRef(false);

  useLayoutEffect(() => {
    if (!interactive || isPermanent || wasInteractive.current) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    wasInteractive.current = true;
  }, []);

  useEffect(() => {
    if (phase !== 'closed' || !wasInteractive.current) return;
    previouslyFocused.current?.focus?.();
    previouslyFocused.current = null;
    wasInteractive.current = false;
  }, [phase]);
  
  useLayerBehavior({
    active: interactive && !isPermanent,
    panelRef,
    onDismiss: onClose,
    dismissOnOutside: false,  // scrim handles dismissal, drag would double-fire
    restoreFocus: false,  // handled after slide-out (above)
  });

  // `useLayoutEffect` because focus restore in `useLayerBehavior` runs in a passive
  // cleanup, and `focus()` fails on inert elements
  useLayoutEffect(() => {
    if (contentRef.current) contentRef.current.inert = interactive && !isPermanent;
  }, [interactive, isPermanent]);

  const handleClickScrim = () => {
    if (!suppressClick.current) onClose();
  }

  const slots = useSlots(children, ['slot']);

  const { classes, cssVars, } = resolveStyle({
    type, drawerPosition, interactive, isPermanent, animating,
    style, progress, drawerWidth,
  });

  return (
    <ViewElement
      classes={ classes }
      theme={ theme }
      style={ cssVars }
      id={ id }
      testID={ testID }
      ref={ elementRef }
      onLayout={ onLayout }
    >
      { (isPermanent || mounted) &&
        <ViewElement
          classes={ styles['drawer__panel'] }
          a11y={{ role: 'dialog', ...a11y, }}
          ref={ panelRef }
        >
          <SlotScopeProvider value='Drawer'>
            { slots.slot }
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
            style={ overlayStyle }
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
  slotName: 'slot',
  parentName: 'Drawer',
});

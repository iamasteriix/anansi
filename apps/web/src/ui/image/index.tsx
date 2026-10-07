import type { ImageEvent, ImageProps } from './types';
import { useCallback, useEffect, useRef, } from 'react';
import { resolveA11y, useMediaQuery } from '../@core';
import { resolveVariants } from './utils';


export const Image = ({
  variant, src, alt, crossOrigin, referrerPolicy,
  onError, onLoad, onLoadStart, onLoadEnd, onLayout,
  id, theme, style, a11y, testID, ref,
}: ImageProps) => {

  const internalRef = useRef<HTMLImageElement | null>(null);

  // merge internal and external ref
  const setRef = useCallback((node: HTMLImageElement | null) => {
    internalRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const handleLoad = useCallback((event: ImageEvent) => {
    onLoad?.(event);
    onLoadEnd?.();
  }, [onLoad, onLoadEnd]);

  const handleError = useCallback((event: ImageEvent) => {
    onError?.(event);
    onLoadEnd?.();
  }, [onError, onLoadEnd]);

  /**
   * **latest-callback ref** pattern
   * More efficient because we update the callbacks live without having to set up and tear down
   * event listeners and observers every time a parent re-renders with a new inline function.
   * Safe because mutating `.current` does not trigger re-renders
   */
  const onLoadStartRef = useRef(onLoadStart);
  const onLayoutRef = useRef(onLayout);
  useEffect(() => {
    onLoadStartRef.current = onLoadStart;
    onLayoutRef.current = onLayout;
  });

  // only depends on `src`
  // doesn't need to fire on every render, because it's about loading the image
  useEffect(() => {
    onLoadStartRef.current?.();
  }, [src]);

  // no idea wtf this does
  useEffect(() => {
    if (!onLayout || !internalRef.current) return;
    const element = internalRef.current;
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      const target = parseInt(element.id, 10);
      onLayoutRef.current?.({
        layout: { width, height, x: element.offsetLeft, y: element.offsetTop },
        target: Number.isNaN(target) ? null : target,
      });
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    }
  }, [onLayout]);

  const { cssProperties } = useMediaQuery(theme, style);
  const className = resolveVariants(variant);
  const accessibility = resolveA11y(a11y);

  return (
    <img
      className={ className }
      style={ cssProperties }
      src={ src }
      alt={ alt }
      crossOrigin={ crossOrigin }
      referrerPolicy={ referrerPolicy }
      onLoad={ handleLoad }
      onError={ handleError }
      id={ id }
      data-testid={ testID }
      ref={ setRef }
      { ...accessibility }
    />
  );
};
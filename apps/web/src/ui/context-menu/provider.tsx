import type { KeyboardEvent, MouseEvent } from 'react';
import type { ContextMenuTriggerProps } from './types';
import { useCallback } from 'react';
import { useContextMenuContext } from './context';


export const ContextMenuTrigger = ({
  children,
}: ContextMenuTriggerProps) => {

  const { openMenu, } = useContextMenuContext();

  const handleContextMenu = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    openMenu({
      x: event.pageX,
      y: event.pageY,
    });
  }, [openMenu]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (
      (event.shiftKey && event.key === 'F10') ||
      event.key === 'ContextMenu'
    ) {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      openMenu({
        x: rect.left +window.scrollX,
        y: rect.top +window.scrollY,
      });
    }
  }, [openMenu]);

  return (
    <div
      onContextMenu={ handleContextMenu }
      onKeyDown={ handleKeyDown }
    >
      { children }
    </div>
  );
}

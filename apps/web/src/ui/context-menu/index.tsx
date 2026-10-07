import type { ContextMenuProps } from './types';
import { useEffect, useRef, useState, } from 'react';
import { Portal } from '../portal';
import { useContextMenuContext } from './context';


export const ContextMenu = ({
  children,
}: ContextMenuProps) => {

  const { isOpen, position, closeMenu, } = useContextMenuContext();
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState({ x: 0, y: 0, });

  useEffect(() => {
    if (!isOpen) return;

    // adjust viewport to avoid collision
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const x = position.x +rect.width > window.innerWidth +window.scrollX ? Math.max(10, position.x -rect.width) : position.x; // we subtract
      const y = position.y +rect.height > window.innerHeight +window.scrollY ? Math.max(10, position.y -rect.height) : position.y;
      setAdjustedPos({ x, y, });
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) closeMenu();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, position, closeMenu]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        ref={ menuRef }
        style={{
          position: 'absolute',
          left: `${adjustedPos.x}px`,
          top: `${adjustedPos.y}px`,
        }}
      >
        { children }
      </div>
    </Portal>
  );
}

import type { ElementChildren } from '../@core';
import { createContext, useContext, useEffect, useRef, useState, } from 'react';
import { Portal } from '../portal';


// Types ————————————————————————————————————————————————————————————————————————————————
type ContextMenuPosition = {
  x: number;
  y: number;
};

export type ContextMenuState = {
  isOpen: boolean;
  position: ContextMenuPosition;
  openMenu: (position: ContextMenuPosition) => void;
  closeMenu: () => void;
};

export type ContextMenuTriggerProps = {
  children: ElementChildren;
};

export type ContextMenuProps = {
  children: ElementChildren;
};


// Utils ————————————————————————————————————————————————————————————————————————————————
export const ContextMenuContext = createContext<ContextMenuState | null>(null);


export const useContextMenuContext = (): ContextMenuState => {
  const values = useContext(ContextMenuContext);
  if (!values) throw new Error('ContextMenu subcomponents must be rendered within ContextMenu');
  return values;
}



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

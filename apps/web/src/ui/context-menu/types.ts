import type { ElementChildren } from '../types';


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

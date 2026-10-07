import type { PortalProps } from './types';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';


export const Portal = ({
  children,
  container,
}: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const targetNode = container ?? document.body;
  return createPortal(children, targetNode);
}

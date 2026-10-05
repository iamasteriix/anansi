import type { ToolbarChild, } from './types';
import type { SlotProps } from '../slot/types';
import { Children, isValidElement } from 'react';
import { ToolbarAnchor } from './slots';


export const getContentOrdering = (children: ToolbarChild | ToolbarChild[] | undefined) => {
  const leading: ToolbarChild[] = [];
  const trailing: ToolbarChild[] = [];
  const content: ToolbarChild[] = [];
  const childrenArr = Children.toArray(children);
  for (const child of childrenArr) {
    if (!isValidElement(child)) continue;
    const slotProps = child.props as SlotProps;
    const position = child.type === ToolbarAnchor ? slotProps.position ?? 'leading' : slotProps.position;
    if (position === 'leading') leading.push(child);
    else if (position === 'trailing') trailing.push(child);
    else content.push(child);
  }

  return { leading, trailing, content };
};

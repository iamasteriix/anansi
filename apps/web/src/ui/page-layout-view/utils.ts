import type { ElementChildren } from '../types';
import { Children, isValidElement } from 'react';
import { PageLayoutFooter, PageLayoutHeader } from './slots';


export const getContentOrdering = (children: ElementChildren | undefined) => {
  let header: ElementChildren | undefined;
  let footer: ElementChildren | undefined;
  const content: ElementChildren[] = [];
  const childrenArr = Children.toArray(children); // `toArray` assigns stable keys and drops null, undefined, and booleans
  for (const child of childrenArr) {
    if (!isValidElement(child)) continue;  // raw text/numbers: types forbid them, so drop any that slip through
    if (child.type === PageLayoutHeader) header = child;
    else if (child.type === PageLayoutFooter) footer = child;
    else content.push(child);
  }

  return { header, footer, content, };
}

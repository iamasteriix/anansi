import type { GraphNode } from './types';
import { name_keys } from './constants';


export const displayName = (node: GraphNode): string | undefined => {
  if (node.label) return node.label;
  for (const key of name_keys) {
    const value = node.props[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return undefined;
}

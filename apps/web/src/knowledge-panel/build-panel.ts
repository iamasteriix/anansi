import type {
  FocusOptions, Graph, GraphIndex, GraphNode, NodeId, RelatedItem, Section,
} from './types';
import { getHumanReadable } from '@/utils';
import { inferShape } from './infer-shape';
import { buildIndex, pickFocus } from './core';


type PanelModel = {
  focusId: NodeId;
  sections: Section[];
};


const toItem = (node: GraphNode): RelatedItem => {
  const shape = inferShape(node);
  return {
    id: node.id,
    name: shape.title ?? node.id,
    subtitle: shape.subtitle,
    image: shape.image,
  };
}


export const buildPanel = (
  index: GraphIndex,
  focus: GraphNode
): PanelModel => {
  const shape = inferShape(focus);
  const sections: Section[] = [];

  sections.push({
    type: 'header',
    title: shape.title ?? focus.id,
    subtitle: shape.subtitle,
    image: shape.image,
  });
  if (shape.description) sections.push({ type: 'description', text: shape.description, });
  if (shape.facts.length) sections.push({ type: 'facts', facts: shape.facts, });
  for (const table of shape.tables) sections.push({ type: 'table', table, });

  // related: connected nodes, grouped by relationship label and direction
  const groups = new Map<string, Map<NodeId, RelatedItem>>();
  const addToGroup = (
    label: string,
    node: GraphNode | undefined,
  ) => {
    if (!node || node.id === focus.id) return;
    if (!groups.has(label)) groups.set(label, new Map());
    const groupValue = groups.get(label);
    if (groupValue) groupValue.set(node.id, toItem(node));
  }

  const outOfFocusEdges = index.outgoing(focus.id);
  const intoFocusEdges = index.incoming(focus.id);
  for (const edge of outOfFocusEdges)
    addToGroup(
      edge.label ? getHumanReadable(edge.label) : 'Related',
      index.getNode(edge.target)
    );
  for (const edge of intoFocusEdges)
    addToGroup(
      edge.label ? getHumanReadable(edge.label) : 'More',
      index.getNode(edge.target)
    );
  for (const [label, items] of groups)
    sections.push({
      type: 'related',
      label,
      items: [...items.values()],
    });

  // others: nodes in the result with no connection to the focus
  const neighborIds = index.neighbors(focus.id).map(neighbor => neighbor.id);
  const uniqueNeighborIds = new Set(neighborIds);
  const others = index.nodes
    .filter(node => node.id !== focus.id && !uniqueNeighborIds.has(node.id))
    .map(toItem)
  if (others.length) sections.push({ type: 'others', items: others, });
  
  return {
    focusId: focus.id,
    sections,
  };
}


export const buildPanelFromGraph = (
  graph: Graph,
  opts?: FocusOptions
): PanelModel | undefined => {
  const graphIndex = buildIndex(graph);
  const focusNode = pickFocus(graphIndex, opts);
  return focusNode ? buildPanel(graphIndex, focusNode) : undefined;
}

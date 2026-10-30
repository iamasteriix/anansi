import type {
  FocusOptions, Graph, GraphEdge, GraphIndex, GraphNode, NodeId,
} from './types';
import { displayName } from './utils';


// GRAPH INDEX ——————————————————————————————————————————————————————————————————————————
const push = <K, V>(
  map: Map<K, V[]>,
  key: K,
  value: V
) => {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}


export const buildIndex = (graph: Graph): GraphIndex => {
  const nodesMap = new Map<NodeId, GraphNode>();
  const incomingEdgesMap = new Map<NodeId, GraphEdge[]>();
  const outgoingEdgesMap = new Map<NodeId, GraphEdge[]>();

  for (const node of graph.nodes) nodesMap.set(node.id, node);

  for (const edge of graph.edges) {
    if (!nodesMap.has(edge.source) || !nodesMap.has(edge.target)) continue; // skip dangling edges
    push(incomingEdgesMap, edge.target, edge);
    push(outgoingEdgesMap, edge.source, edge);
  }

  const getOutgoing = (id: NodeId) => outgoingEdgesMap.get(id) ?? [];
  const getIncoming = (id: NodeId) => incomingEdgesMap.get(id) ?? [];
  const getNeighbors = (id: NodeId) => {
    const ids = new Set<NodeId>([
      ...getIncoming(id).map(edge => edge.target),
      ...getOutgoing(id).map(edge => edge.source),
    ]);
    return [...ids]
      .map(itemId => nodesMap.get(itemId))
      .filter(item => item !== undefined);
  }

  return {
    nodes: graph.nodes,
    getNode: (id: NodeId) => nodesMap.get(id),
    incoming: getIncoming,
    outgoing: getOutgoing,
    neighbors: getNeighbors,
  };
}


// FOCUS ————————————————————————————————————————————————————————————————————————————————
/**
 * @note Manual scoring here is a stand-in. The backend provides the relevance score.
 */
export const pickFocus = (
  index: GraphIndex,
  opts: FocusOptions = {},
): GraphNode | undefined => {
  if (opts.focusId) {
    const explicit = index.getNode(opts.focusId);
    if (explicit) return explicit;
  }

  const query = opts.query?.trim().toLowerCase();
  let best: GraphNode | undefined;
  let bestScore = -Infinity;

  for (const node of index.nodes) {
    const name = displayName(node);
    const degree = index.outgoing(node.id).length + index.incoming(node.id).length;

    let score = degree *2;
    if (name) score += 1;
    score += Math.min(Object.keys(node.props).length, 10) *.1;
    if (query && name?.toLowerCase().includes(query)) score += 5;

    if (score > bestScore) {
      best = node;
      bestScore = score;
    }
  }

  return best;
}

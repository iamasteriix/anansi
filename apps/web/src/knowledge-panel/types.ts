import type { ComponentType } from 'react';


export type NodeId = string;

export type GraphNode = {
  id: NodeId;
  type?: string;                    // optional hint, eg 'person', 'row', 'document'
  label?: string;                   // human-readable name if one can be found
  props: Record<string, unknown>;  // everything else, untouched
};

export type GraphEdge = {
  id: string;
  source: NodeId;
  target: NodeId;
  label?: string; // relationship name
};

export type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type GraphIndex = {
  getNode (id: NodeId): GraphNode | undefined;
  incoming (id: NodeId): GraphEdge[];
  outgoing (id: NodeId): GraphEdge[];
  neighbors (id: NodeId): GraphNode[];
  nodes: GraphNode[];
};

export type FocusOptions = {
  focusId?: NodeId; // top hit informed by backend
  query?: string;   // search text to facor matching nodes
};

export type ValueKind =
  | 'text' | 'number' | 'boolean' | 'date'
  | 'url' | 'email' | 'list' | 'object';

export type Fact = {
  key: string;
  label: string;
  value: unknown;
  kind: ValueKind;
};

export type TableData = {
  key: string;
  label: string;
  columns: string[];
  rows: Record<string, unknown>[];
};

export type RelatedItem = {
  id: NodeId;
  name: string;
  subtitle?: string;
  image?: string;
};

export type Section =
  | { type: 'header';       title: string;  subtitle?: string;  image?: string; }
  | { type: 'description';  text: string; }
  | { type: 'facts';        facts: Fact[]; }
  | { type: 'table';        table: TableData; }
  | { type: 'related';      label: string;  items: RelatedItem[]; }
  | { type: 'others';       items: RelatedItem[]; };

export type SectionProps<T extends Section['type']> = {
  section: Extract<Section, { type: T }>;
  onSelect?: (id: NodeId) => void;
}

export type SectionRegistry = {
  [K in Section['type']]: ComponentType<SectionProps<K>>;
};

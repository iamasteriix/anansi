import type { Graph, NodeId } from './types';
import type { SectionRegistry } from './types';
import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/assets/ui/card';
import { buildIndex, pickFocus, } from './core';
import { buildPanel } from './build-panel';
import { renderSection, } from './registry';


interface KnowledgePanelProps {
  graph: Graph;
  query?: string;
  focusId?: NodeId; // from the backend, if it names a top hit
  registry?: Partial<SectionRegistry>;
}


export const KnowledgePanel = ({ graph, query, focusId, registry }: KnowledgePanelProps) => {
  const index = useMemo(() => buildIndex(graph), [graph]);

  // Which node the user clicked. Remember the graph it was chosen in,
  // so a new search result resets it.
  const [selection, setSelection] = useState<{ graph: Graph; id: NodeId } | null>(null);
  const selectedId = selection?.graph === graph ? selection.id : undefined;

  const panel = useMemo(() => {
    const focus = pickFocus(index, { focusId: selectedId ?? focusId, query });
    return focus ? buildPanel(index, focus) : undefined;
  }, [index, selectedId, focusId, query]);

  if (!panel) return <p className='text-sm text-muted-foreground'>No results.</p>;

  return (
    <Card className='w-full max-w-xl'>
      <CardContent className='flex flex-col gap-6'>
        { panel.sections.map((section, i) => (
          <div key={ `${section.type}-${i}` }>
            { renderSection(section, {
                registry,
                onSelect: id => setSelection({ graph, id }),
            })}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

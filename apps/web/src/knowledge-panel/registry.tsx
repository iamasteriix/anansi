import type { ComponentType } from 'react';
import type { NodeId, Section } from './types';
import type { SectionRegistry } from './types';
import {
  DescriptionSection, FactsSection, HeaderSection, OthersSection, RelatedSection,
} from './sections';
import { TableSection } from './table-section';


export const defaultRegistry: SectionRegistry = {
  header: HeaderSection,
  description: DescriptionSection,
  facts: FactsSection,
  table: TableSection,
  related: RelatedSection,
  others: OthersSection,
};


export const renderSection = (
  section: Section,
  options: {
    onSelect?: (id: NodeId) => void;
    registry?: Partial<SectionRegistry>; // override any section's component
  } = {}
) => {
  const registry = { ...defaultRegistry, ...options.registry };
  // Lookup is keyed by section.type, so the pairing is always valid;
  // TypeScript just can't see that correlation.
  const Component = registry[section.type] as ComponentType<{
    section: Section;
    onSelect?: (id: NodeId) => void;
  }>;
  return (
    <Component
      section={ section }
      onSelect={ options.onSelect }
    />
  );
}

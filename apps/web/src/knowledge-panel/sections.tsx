import type { ReactNode } from 'react';
import type { NodeId, RelatedItem, } from './types';
import type { SectionProps } from './types';
import { Fragment, } from 'react';
import { ValueView } from './value-view';


const Heading = ({ children }: { children: ReactNode }) => (
  <h3 className='mb-2 text-sm font-semibold'>{ children }</h3>
);


export const HeaderSection = ({ section }: SectionProps<'header'>) => {
  return (
    <div className='flex items-center gap-4'>
      {section.image && (
        <img
          src={section.image}
          alt={section.title}
          className='size-20 shrink-0 rounded-lg object-cover'
        />
      )}
      <div className='min-w-0'>
        <h2 className='break-words text-2xl font-semibold'>{section.title}</h2>
        {section.subtitle && (
          <p className='text-sm text-muted-foreground'>{section.subtitle}</p>
        )}
      </div>
    </div>
  );
}


export const DescriptionSection = ({ section }: SectionProps<'description'>) => (
  <p className='text-sm leading-relaxed'>{ section.text }</p>
);


export const FactsSection = ({ section }: SectionProps<'facts'>) => (
  <div>
    <Heading>Details</Heading>
    <dl className='grid grid-cols-[minmax(6rem,auto)_1fr] gap-x-6 gap-y-2 text-sm'>
      { section.facts.map(fact => (
        <Fragment key={ fact.key }>
          <dt className='text-muted-foreground'>{ fact.label }</dt>
          <dd className='min-w-0 break-words'>
            <ValueView value={ fact.value } />
          </dd>
        </Fragment>
      ))}
    </dl>
  </div>
);


export const ItemList = ({ items, onSelect, }: {
  items: RelatedItem[];
  onSelect?: (id: NodeId) => void;
}) => (
  <ul className='flex flex-wrap gap-3'>
    { items.map((item) => (
      <li key={ item.id }>
        <button
          type='button'
          onClick={ () => onSelect?.(item.id) }
          className='flex w-40 flex-col items-center gap-2 rounded-lg p-2 text-center hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring'
        >
          { item.image ? <img src={ item.image } alt='' className='size-16 rounded-full object-cover'/>
            :
            <span className='flex size-16 items-center justify-center rounded-full bg-muted text-lg font-medium'>
              { item.name.charAt(0).toUpperCase() }
            </span>
          }
          <span className='w-full truncate text-sm font-medium'>{ item.name }</span>
          { item.subtitle &&
            <span className='w-full truncate text-xs text-muted-foreground'>
              { item.subtitle }
            </span>
          }
        </button>
      </li>
    ))}
  </ul>
);


export const RelatedSection = ({ section, onSelect }: SectionProps<'related'>) => (
  <div>
    <Heading>{ section.label }</Heading>
    <ItemList
      items={ section.items }
      onSelect={ onSelect }
    />
  </div>
);


export const OthersSection = ({ section, onSelect }: SectionProps<'others'>) => (
  <div>
    <Heading>Other results</Heading>
    <ItemList
      items={ section.items }
      onSelect={ onSelect }
    />
  </div>
);

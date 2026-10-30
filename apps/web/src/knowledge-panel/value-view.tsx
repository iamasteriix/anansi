import { Fragment } from 'react';
import { Badge } from '@/assets/ui/badge';
import { formatDate, getHumanReadable, } from '@/utils';
import { detectKind } from './infer-shape';


const max_depth = 3;


const linkClass = 'text-primary underline-offset-4 hover:underline break-all';


export const ValueView = ({
  value,
  depth = 0,
}: {
  value: unknown;
  depth?: number;
}) => {
  if (value == null) return <span className='text-muted-foreground'>—</span>;

  switch (detectKind(value)) {
    case 'boolean':
      return <Badge variant={ value ? 'default' : 'secondary' }>{ value ? 'Yes' : 'No' }</Badge>;
    case 'number':
      return <span>{ value.toLocaleString() }</span>;
    case 'date':
      return <span>{ formatDate(value as string) }</span>;
    case 'url': {
      const href = value as string;
      return (
        <a
          href={ href }
          target='_blank'
          rel='noreferrer'
          className={ linkClass }
        >
          { href.replace(/^https?:\/\//, '') }
        </a>
      );
    }
    case 'email':
      return (
        <a
          href={ `mailto:${value}` }
          className={ linkClass }
        >
          { String(value) }
        </a>
      );
    case 'list':
      return (
        <div className='flex flex-wrap gap-1.5'>
          { (value as unknown[]).map((item, i) => (
            <Badge key={ i } variant='secondary'>
              { typeof item === 'object' ? JSON.stringify(item) : String(item) }
            </Badge>
          ))}
        </div>
      );
    case 'object': {
      if (depth >= max_depth) return <code className='text-xs'>{ JSON.stringify(value) }</code>;
      return (
        <dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-1'>
          { Object.entries(value as Record<string, unknown>).map(([k, v]) => (
            <Fragment key={ k }>
              <dt className='text-muted-foreground'>{ getHumanReadable(k) }</dt>
              <dd className='min-w-0'>
                <ValueView
                  value={ v }
                  depth={ depth + 1 }
                />
              </dd>
            </Fragment>
          ))}
        </dl>
      );
    }
    default:
      return <span>{ String(value) }</span>;
  }
}

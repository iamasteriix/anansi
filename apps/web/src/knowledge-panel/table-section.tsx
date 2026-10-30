import type { SectionProps } from './types';
import type { ColumnDef, } from '@tanstack/react-table';
import { useMemo, } from 'react';
import { createSortedRowModel, flexRender, rowSortingFeature, sortFn_alphanumeric,
  tableFeatures, useTable,
} from '@tanstack/react-table';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/assets/ui/table';
import { ValueView } from './value-view';
import { getHumanReadable } from '@/utils';


type Row = Record<string, unknown>;


const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, },
});


export const TableSection = ({ section }: SectionProps<'table'>) => {
  const { label, columns, rows } = section.table;

  const defs = useMemo<ColumnDef<typeof features, Row>[]>(() => (
    columns.map(key => ({
      id: key,
      accessorFn: row => row[key],
      header: getHumanReadable(key),
      cell: ctx => <ValueView value={ ctx.getValue() }/>,
    }))),
    [columns]
  );

  const table = useTable({
    data: rows,
    columns: defs,
    features,
  });

  return (
    <div>
      <h3 className='mb-2 text-sm font-semibold'>{ label }</h3>
      <Table>
        <TableHeader>
          { table.getHeaderGroups().map(group => (
            <TableRow key={ group.id }>
              { group.headers.map(header => {
                const sorted = header.column.getIsSorted();
                return (
                  <TableHead key={ header.id }>
                    <button
                      type='button'
                      onClick={ () => header.column.toggleSorting() }
                      className='inline-flex items-center gap-1 font-medium'
                    >
                      { flexRender(header.column.columnDef.header, header.getContext()) }
                      <span aria-hidden className='text-xs text-muted-foreground'>
                        {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : ''}
                      </span>
                    </button>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          { table.getRowModel().rows.map(row => (
            <TableRow key={ row.id }>
              { row.getAllCells().map(cell => (
                <TableCell key={ cell.id }>
                  { flexRender(cell.column.columnDef.cell, cell.getContext()) }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

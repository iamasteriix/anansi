import type { GraphNode, Fact, ValueKind, TableData, } from './types';
import { getHumanReadable, isEmpty, isPlainObject } from '@/utils';
import { displayName } from './utils';
import { name_keys } from './constants';


type EntityShape = {
  title?: string;
  subtitle?: string;
  image?: string;
  description?: string;
  facts: Fact[];
  tables: TableData[];
};


const image_keys = /image|photo|avatar|picture|logo|thumbnail/i;
const image_ext = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i;
const desc_keys = /description|summary|bio|about|abstract|text|body|content/i;
const subtitle_keys = /^(subtitle|tagline|role|occupation|category|kind|type)$/i;
const url_re = /^https?:\/\/\S+$/i;
const email_re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const date_re = /^\d{4}-\d{2}-\d{2}([T ].*)?$/;


export const detectKind = (value: unknown): ValueKind => {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (Array.isArray(value)) return 'list';
  if (isPlainObject(value)) return 'object';
  if (typeof value === 'string') {
    if (email_re.test(value)) return 'email';
    if (url_re.test(value)) return 'url';
    if (date_re.test(value)) return 'date';
  }
  return 'text';
}


export const inferShape = (node: GraphNode): EntityShape => {
  const usedData = new Set<string>(['id']);
  const entries = Object.entries(node.props)
    .filter(([, value]) => !isEmpty(value));

  // title
  const title = displayName(node);
  for (const key of name_keys)
    if (node.props[key] === title) usedData.add(key);

  // image
  const imageEntry = entries.find(([key, value]) => (
    typeof value === 'string' &&
    url_re.test(value) &&
    (image_keys.test(key) || image_ext.test(value))
  ));
  if (imageEntry) usedData.add(imageEntry[0]);

  // description (longest qualifying test value)
  const descEntry = entries.filter(([key, value]) => (
    typeof value === 'string' &&
    !usedData.has(key) &&
    detectKind(value) === 'text' &&
    (value.length >= 108 || (desc_keys.test(key) && value.length >= 36))
  ))
  .sort((a, b) => (b[1] as string).length -(a[1] as string).length)
  .at(0);
  if (descEntry) usedData.add(descEntry[0]);

  // subtitle (short desc or node type)
  const subtitleEntry = entries.find(([key, value]) => (
    typeof value === 'string' &&
    !usedData.has(key) &&
    subtitle_keys.test(key) && value.length <= 81
  ));
  if (subtitleEntry) usedData.add(subtitleEntry[0]);

  // passthrough
  const tables: TableData[] = [];
  const facts: Fact[] = [];
  for (const [key, value] of entries) {
    if (usedData.has(key)) continue;

    if (Array.isArray(value) && value.every(isPlainObject)) {
      const rows = value;
      const rowKeys = rows.flatMap(row => Object.keys(row));
      const columns = [...new Set(rowKeys)];
      tables.push({
        key, rows, columns,
        label: getHumanReadable(key),
      });
    } else {
      facts.push({
        key, value,
        label: getHumanReadable(key),
        kind: detectKind(value),
      });
    }
  }

  return {
    title,
    subtitle: (subtitleEntry?.at(1) as string | undefined) ?? node.type,
    image: imageEntry?.at(1) as string | undefined,
    description: descEntry?.at(1) as string | undefined,
    facts,
    tables,
  };
}

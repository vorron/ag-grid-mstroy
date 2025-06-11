import type { Item } from './Item';

export type TreeAction =
  | { type: 'add'; item: Item }
  | { type: 'remove'; item: Item; items?: Item[] }
  | { type: 'rename'; id: Item['id']; oldValue: string; newValue: string };

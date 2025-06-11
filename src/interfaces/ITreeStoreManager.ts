import type { Reactive, Ref } from 'vue';
import type { ActionStatus } from './ActionStatus';
import type { TreeAction } from './TreeAction';
import type { Item } from './Item';
import type { ITreeStore } from './ITreeStore';

//Дополняет функциональность ITreeStore

export interface ITreeStoreManager {
  treeStore: Reactive<ITreeStore>;
  load(items: Item[]): void;
  actionStatus: Ref<ActionStatus>;
  addAction(action: TreeAction): void;
  redoAction(): void;
  undoAction(): void;
}

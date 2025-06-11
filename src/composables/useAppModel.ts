import type { TreeAction } from 'src/interfaces/TreeAction';
import type { ITreeStore } from 'src/interfaces/ITreeStore';
import type { Item } from 'src/interfaces/Item';
import type { ActionStatus } from 'src/interfaces/ActionStatus';
import TreeStore from 'src/model/TreeStore';
import { reactive, ref, type Ref } from 'vue';

export function useAppModel() {
  let history: TreeAction[] = [];
  let currentIndex = -1;

  const actionStatus: Ref<ActionStatus> = ref(null);

  const treeStore = reactive<ITreeStore>(new TreeStore());

  const load = (items: Item[]) => {
    for (const item of items) treeStore.addItem(item);
  };

  const refreshActionStatus = () => {
    const canUndo = history.length > 0 && currentIndex >= 0;
    const canRedo = history.length > 0 && currentIndex < history.length - 1;
    console.log(canUndo, canRedo, history.length, currentIndex);

    actionStatus.value =
      canUndo && canRedo ? 'CAN_UNDO&REDO' : canUndo ? 'CAN_UNDO' : canRedo ? 'CAN_REDO' : null;
  };

  const redoAction = () => {
    currentIndex++;
    const action = history[currentIndex];
    if (!action) throw new Error();
    switch (action.type) {
      case 'add':
        treeStore.addItem(action.item);
        break;
      case 'remove':
        action.items = treeStore.removeItem(action.item.id);
        break;
      case 'rename':
        treeStore.getItem(action.id).label = action.newValue;
        break;
    }
    refreshActionStatus();
  };

  const addAction = (action: TreeAction) => {
    history = history.slice(0, currentIndex + 1); // Отрезаем "будущее"
    history.push(action);
    redoAction();
    refreshActionStatus();
  };

  const undoAction = () => {
    const action = history[currentIndex];
    if (!action) throw new Error();
    switch (action.type) {
      case 'add':
        treeStore.removeItem(action.item.id);
        break;
      case 'remove':
        action.items?.forEach((item) => treeStore.addItem(item));
        break;
      case 'rename':
        treeStore.getItem(action.id).label = action.oldValue;
        break;
    }

    currentIndex--;
    refreshActionStatus();
  };

  return {
    redoAction,
    addAction,
    undoAction,
    load,
    treeStore,
    actionStatus,
  };
}

import { Ref, ref } from "vue";
import TreeStore from "./TreeStore";
import { HistoryManager } from "./HistoryManager";
import { IHistoryManager, Item, ITreeStore, TreeAction } from "./interfaces";

const useAppModel = (data: Item[]) => {
  const treeStore: Ref<ITreeStore> = ref<TreeStore>(new TreeStore(data)) as Ref<ITreeStore>;

  const historyManager: Ref<IHistoryManager<TreeAction>> = ref<IHistoryManager<TreeAction>>(
    new HistoryManager(applyAction, reverseAction)
  ) as Ref<IHistoryManager<TreeAction>>;

  function applyAction(action: TreeAction) {
    switch (action.type) {
      case "add":
        treeStore.value.addItem(action.item);
        break;
      case "remove":
        action.items = treeStore.value.removeItem(action.item.id);
        break;
      case "rename":
        treeStore.value.getItem(action.id).label = action.newValue;
        break;
    }
  }

  function reverseAction(action: TreeAction) {
    switch (action.type) {
      case "add":
        treeStore.value.removeItem(action.item.id);
        break;
      case "remove":
        action.items?.forEach((item) => treeStore.value.addItem(item));
        break;
      case "rename":
        treeStore.value.getItem(action.id).label = action.oldValue;
        break;
    }
  }

  return { treeStore, historyManager };
};

export default useAppModel;

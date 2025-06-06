import { Ref, ref } from "vue";
import TreeStore from "./TreeStore";
import { HistoryManager } from "./HistoryManager";
import { Item } from "./TreeStore";

export type TreeAction =
  | { type: "add"; item: Item }
  | { type: "remove"; item: Item }
  | { type: "rename"; id: Item["id"]; oldValue: string; newValue: string };

const useAppModel = (data: Item[]) => {
  const treeStore: Ref<TreeStore> = ref<TreeStore>(new TreeStore(data)) as Ref<TreeStore>;

  const reverseAction = (action: TreeAction) => {
    switch (action.type) {
      case "add":
        treeStore.value.removeItem(action.item.id);
        break;
      case "remove":
        treeStore.value.addItem(action.item);
        break;
      case "rename":
        treeStore.value.getItem(action.id).label = action.oldValue;
        break;
    }
  };

  const applyAction = (action: TreeAction) => {
    switch (action.type) {
      case "add":
        treeStore.value.addItem(action.item);
        break;
      case "remove":
        treeStore.value.removeItem(action.item.id);
        break;
      case "rename":
        treeStore.value.getItem(action.id).label = action.newValue;
        break;
    }
  };

  const historyManager: Ref<HistoryManager<TreeAction>> = ref<HistoryManager<TreeAction>>(
    new HistoryManager(applyAction, reverseAction)
  ) as Ref<HistoryManager<TreeAction>>;

  return { treeStore, historyManager };
};

export default useAppModel;

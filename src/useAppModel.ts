import { Ref, ref } from "vue";
import { HistoryManager } from "./HistoryManager";
import { IHistoryManager, Item, TreeAction, TreeStoreManager } from "./interfaces";

const useAppModel = (data: Item[]) => {
  const treeStoreManager = new TreeStoreManager();
  treeStoreManager.load(data);

  const historyManager: Ref<IHistoryManager<TreeAction>> = ref<IHistoryManager<TreeAction>>(
    new HistoryManager((action, reverseMode) => treeStoreManager.applyAction(action, reverseMode))
  ) as Ref<IHistoryManager<TreeAction>>;

  return { treeStore: treeStoreManager.treeStore, historyManager };
};

export default useAppModel;

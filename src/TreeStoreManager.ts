import { reactive } from "vue";
import { Item, ITreeStore, ITreeStoreManager, TreeAction } from "./interfaces";
import TreeStore from "./TreeStore";

export class TreeStoreManager implements ITreeStoreManager {
  treeStore = reactive<ITreeStore>(new TreeStore());

  load(items: Item[]) {
    for (const item of items) this.treeStore.addItem(item);
  }

  applyAction(action: TreeAction, reverseMode = false) {
    if (!reverseMode) {
      switch (action.type) {
        case "add":
          this.treeStore.addItem(action.item);
          break;
        case "remove":
          action.items = this.treeStore.removeItem(action.item.id);
          break;
        case "rename":
          this.treeStore.getItem(action.id).label = action.newValue;
          break;
      }
    } else {
      switch (action.type) {
        case "add":
          this.treeStore.removeItem(action.item.id);
          break;
        case "remove":
          action.items?.forEach((item) => this.treeStore.addItem(item));
          break;
        case "rename":
          this.treeStore.getItem(action.id).label = action.oldValue;
          break;
      }
    }
  }
}

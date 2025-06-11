import { reactive, Ref, ref } from "vue";
import { Item, ITreeStore, ITreeStoreManager, TreeAction } from "./interfaces";
import TreeStore from "./TreeStore";

export type ActionStatus = "CAN_UNDO" | "CAN_UNDO&REDO" | "CAN_REDO" | null;

export class TreeStoreManager implements ITreeStoreManager {
  treeStore = reactive<ITreeStore>(new TreeStore());

  load(items: Item[]) {
    for (const item of items) this.treeStore.addItem(item);
  }

  private history: TreeAction[] = [];
  private currentIndex = -1;

  addAction(action: TreeAction) {
    this.history = this.history.slice(0, this.currentIndex + 1); // Отрезаем "будущее"
    this.history.push(action);
    this.redoAction();
    this.refreshActionStatus();
  }

  actionStatus: Ref<ActionStatus> = ref(null);

  refreshActionStatus() {
    const canUndo = this.history.length > 0 && this.currentIndex >= 0;
    const canRedo = this.history.length > 0 && this.currentIndex < this.history.length - 1;
    console.log(canUndo, canRedo, this.history.length, this.currentIndex);

    this.actionStatus.value = canUndo && canRedo ? "CAN_UNDO&REDO" : canUndo ? "CAN_UNDO" : canRedo ? "CAN_REDO" : null;
  }

  undoAction() {
    const action = this.history[this.currentIndex];
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

    this.currentIndex--;
    this.refreshActionStatus();
  }

  redoAction() {
    this.currentIndex++;
    const action = this.history[this.currentIndex];

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
    this.refreshActionStatus();
  }
}

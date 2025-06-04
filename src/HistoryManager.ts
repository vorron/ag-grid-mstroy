import { Ref } from "vue";
import TreeStore, { Item } from "./TreeStore";

export type TreeAction =
  | { type: "add"; item: Item }
  | { type: "remove"; item: Item }
  | { type: "rename"; id: string; oldValue: string; newValue: string };

export class HistoryManager {
  private history: TreeAction[] = [];
  private currentIndex = -1;
  private treeStore: Ref<TreeStore>;
  private indexer = 0;

  constructor(treeStore: Ref<TreeStore>) {
    this.treeStore = treeStore;
    this.indexer = treeStore.value.getAll().reduce((a, c) => (+c.id > a ? +c.id : a), 0);
  }

  private applyAction(action: TreeAction) {
    switch (action.type) {
      case "add":
        this.treeStore.value.addItem({
          id: ++this.indexer,
          label: "Новый элемент",
          parent: action.item.id,
        });
        break;
      case "remove":
        this.treeStore.value.removeItem(action.item.id);
        break;
      case "rename":
        this.treeStore.value.getItem(action.id).label = action.newValue;
        break;
    }
  }

  execute(action: TreeAction) {
    // Отрезаем "будущее", если делаем новое действие после отката
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(action);
    this.currentIndex++;
    this.applyAction(action);
  }

  undo() {
    if (this.currentIndex < 0) return;

    const action = this.history[this.currentIndex];
    this.reverseAction(action);
    this.currentIndex--;
  }

  redo() {
    if (this.currentIndex >= this.history.length - 1) return;

    this.currentIndex++;
    const action = this.history[this.currentIndex];
    this.applyAction(action);
  }

  private reverseAction(action: TreeAction) {
    switch (action.type) {
      case "add":
        this.treeStore.value.removeItem(action.item.id);
        break;
      case "remove":
        this.treeStore.value.addItem(action.item);
        break;
      case "rename":
        this.treeStore.value.getItem(action.id).label = action.oldValue;
        break;
    }
  }

  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }
}

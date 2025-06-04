import { Item } from "./TreeStore";

export type TreeAction =
  | { type: "add"; item: Item }
  | { type: "remove"; item: Item }
  | { type: "rename"; id: Item["id"]; oldValue: string; newValue: string };

export class HistoryManager {
  private history: TreeAction[] = [];
  private currentIndex = -1;

  add?: (item: Item) => void;
  remove?: (id: Item["id"]) => void;
  rename?: (id: Item["id"], name: string) => void;

  constructor() {}

  private applyAction(action: TreeAction) {
    switch (action.type) {
      case "add":
        this.add?.(action.item);
        break;
      case "remove":
        this.remove?.(action.item.id);
        break;
      case "rename":
        this.rename?.(action.id, action.newValue);
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
        this.remove?.(action.item.id);
        break;
      case "remove":
        this.add?.(action.item);
        break;
      case "rename":
        this.rename?.(action.id, action.oldValue);
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

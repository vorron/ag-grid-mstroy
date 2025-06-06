import { IHistoryManager } from "./interfaces";

export class HistoryManager<T> implements IHistoryManager<T> {
  private history: T[] = [];
  private currentIndex = -1;
  
  constructor(private onAction: (action: T, reverseMode: boolean) => void) {}

  execute(action: T) {
    // Отрезаем "будущее", если делаем новое действие после отката
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(action);
    this.currentIndex++;
    this.onAction(action, false);
  }

  undo() {
    if (this.currentIndex < 0) return;

    const action = this.history[this.currentIndex];
    this.onAction(action, true);
    this.currentIndex--;
  }

  redo() {
    if (this.currentIndex >= this.history.length - 1) return;

    this.currentIndex++;
    const action = this.history[this.currentIndex];
    this.onAction(action, false);
  }

  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }
}

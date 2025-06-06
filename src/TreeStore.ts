import { ITreeStore, Item } from "./interfaces";

export default class TreeStore implements ITreeStore {
  private itemsMap = new Map<Item["id"], Item>();
  private childrenMap = new Map<Item["id"], Item[]>();
  private allChildrenCache = new Map<Item["id"], Item[]>();
  private allParentsCache = new Map<Item["id"], Item[]>();

  private clearCache() {
    this.allChildrenCache.clear();
    this.allParentsCache.clear();
  }

  getAll(): Item[] {
    return Array.from(this.itemsMap.values());
  }

  getItem(id: Item["id"]): Item {
    const item = this.itemsMap.get(id);
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    return item;
  }

  getChildren(id: Item["id"]): Item[] {
    return [...(this.childrenMap.get(id) || [])];
  }

  getAllChildren(id: Item["id"]): Item[] {
    if (this.allChildrenCache.has(id)) {
      return this.allChildrenCache.get(id)!;
    }

    const allChildren: Item[] = [];
    const children = [...this.getChildren(id)];

    while (children.length > 0) {
      const current = children.pop()!;
      allChildren.push(current);
      children.push(...this.getChildren(current.id));
    }

    this.allChildrenCache.set(id, allChildren);
    return allChildren;
  }

  getAllParents(id: Item["id"]): Item[] {
    if (this.allParentsCache.has(id)) {
      return this.allParentsCache.get(id)!;
    }

    const parents: Item[] = [];
    let currentId: Item["id"] | null = id;

    while (currentId !== null) {
      const item = this.itemsMap.get(currentId);
      if (!item) throw new Error(`Item with id ${id} undefined`);

      parents.push(item);
      currentId = item.parent;
    }

    this.allParentsCache.set(id, parents);
    return parents;
  }

  addItem(item: Item, loading = false): void {
    if (this.itemsMap.has(item.id)) {
      throw new Error(`Item with id ${item.id} already exists`);
    }

    if (item.id === -1) item.id = this.getAll().reduce((a, c) => (+c.id > a ? +c.id : a), 0) + 1;

    if (!loading) this.clearCache();

    this.itemsMap.set(item.id, item);

    if (!this.childrenMap.has(item.parent ?? "null")) {
      this.childrenMap.set(item.parent ?? "null", []);
    }
    this.childrenMap.get(item.parent ?? "null")?.push(item);
  }

  removeItem(id: Item["id"]): Item[] {
    if (!this.itemsMap.has(id)) return [];

    this.clearCache();

    const itemsToRemove = this.getAllChildren(id);
    itemsToRemove.push(this.getItem(id));

    for (const item of itemsToRemove) {
      this.itemsMap.delete(item.id);

      const siblings = this.childrenMap.get(item.parent ?? "null") || [];
      this.childrenMap.set(
        item.parent ?? "null",
        siblings.filter((i) => i.id !== item.id)
      );

      this.childrenMap.delete(item.id);
    }
    return itemsToRemove;
  }

  updateItem(item: Item): void {
    if (!this.itemsMap.has(item.id)) {
      throw new Error(`Item with id ${item.id} not found`);
    }

    this.clearCache();

    const oldItem = this.itemsMap.get(item.id)!;

    if (oldItem.parent !== item.parent) {
      // Удаляем из старого parent
      const oldParentKey = oldItem.parent ?? "null";
      const oldParentChildren = this.childrenMap.get(oldParentKey) || [];
      this.childrenMap.set(
        oldParentKey,
        oldParentChildren.filter((i) => i.id !== item.id)
      );

      // Добавляем к новому parent
      const newParentKey = item.parent ?? "null";
      if (!this.childrenMap.has(newParentKey)) {
        this.childrenMap.set(newParentKey, []);
      }
      this.childrenMap.get(newParentKey)?.push(item);
    }

    Object.assign(oldItem, item);
  }
}

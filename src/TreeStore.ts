export interface Item {
  id: number | string;
  parent: number | string | null;
  label: string;
}

export interface ITreeStore {
  getAll(): Item[];
  getItem(id: Item["id"]): Item;
  getChildren(id: Item["id"]): Item[];
  getAllChildren(id: Item["id"]): Item[];
  getAllParents(id: Item["id"]): Item[];
  addItem(item: Item): void;
  removeItem(id: Item["id"]): void;
  updateItem(item: Item): void;
}

export default class TreeStore implements ITreeStore {
  private items: Item[] = [];
  private itemsMap = new Map<Item["id"], Item>();
  private childrenMap = new Map<Item["id"], Item[]>();

  constructor(items: Item[]) {
    for (const item of items) this.addItem(item);
  }

  getAll(): Item[] {
    return [...this.items];
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
    const allChildren: Item[] = [];
    const children = [...this.getChildren(id)];

    while (children.length > 0) {
      const current = children.pop()!;
      allChildren.push(current);
      children.push(...this.getChildren(current.id));
    }

    return allChildren;
  }

  getAllParents(id: Item["id"]): Item[] {
    const parents: Item[] = [];
    let currentId: Item["id"] | null = id;

    while (currentId !== null) {
      const item = this.itemsMap.get(currentId);
      if (!item) throw new Error(`Item with id ${id} undefined`);

      parents.push(item);
      currentId = item.parent;
    }

    return parents;
  }

  addItem(item: Item): void {
    if (this.itemsMap.has(item.id)) {
      throw new Error(`Item with id ${item.id} already exists`);
    }

    this.items.push(item);
    this.itemsMap.set(item.id, item);

    if (!this.childrenMap.has(item.parent ?? "null")) {
      this.childrenMap.set(item.parent ?? "null", []);
    }
    this.childrenMap.get(item.parent ?? "null")?.push(item);
  }

  removeItem(id: Item["id"]): void {
    if (!this.itemsMap.has(id)) return;

    const itemsToRemove = this.getAllChildren(id);
    itemsToRemove.push(this.getItem(id));

    for (const item of itemsToRemove) {
      // Удаляем из items и itemsMap
      this.items = this.items.filter((i) => i.id !== item.id);
      this.itemsMap.delete(item.id);

      // Удаляем из childrenMap родителя (как было)
      const siblings = this.childrenMap.get(item.parent ?? "null") || [];
      this.childrenMap.set(
        item.parent ?? "null",
        siblings.filter((i) => i.id !== item.id)
      );

      this.childrenMap.delete(item.id); // <- Вот оно!
    }
  }

  updateItem(item: Item): void {
    if (!this.itemsMap.has(item.id)) {
      throw new Error(`Item with id ${item.id} not found`);
    }

    const oldItem = this.itemsMap.get(item.id)!;

    // Если изменился parent, нужно обновить childrenMap
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

    // Важно: обновляем сам объект, а не просто заменяем ссылки
    Object.assign(oldItem, item);

    // Обновляем в items массиве
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.items[index] = oldItem; // Используем обновлённый объект
    }
  }
}

import { describe, it, expect, beforeEach } from "vitest";
import TreeStore from "./TreeStore";
import { Item } from "./interfaces";

describe("TreeStore", () => {
  let items: Item[];
  let treeStore: TreeStore;

  beforeEach(() => {
    items = [
      { id: 1, parent: null, label: "Айтем 1" },
      { id: "2", parent: 1, label: "Айтем 2" },
      { id: 3, parent: 1, label: "Айтем 3" },
      { id: 4, parent: "2", label: "Айтем 4" },
      { id: 5, parent: "2", label: "Айтем 5" },
      { id: 6, parent: "2", label: "Айтем 6" },
      { id: 7, parent: 4, label: "Айтем 7" },
      { id: 8, parent: 4, label: "Айтем 8" },
    ];
    treeStore = new TreeStore();
    for (const item of items) treeStore.addItem(item);
  });

  it("getAll() возвращает все элементы", () => {
    const allItems = treeStore.getAll();
    expect(allItems).toEqual(items);
    expect(allItems).not.toBe(items);
  });

  it("getItem() возвращает элемент по id", () => {
    expect(treeStore.getItem(1)).toEqual({ id: 1, parent: null, label: "Айтем 1" });
    expect(treeStore.getItem("2")).toEqual({ id: "2", parent: 1, label: "Айтем 2" });
    expect(() => treeStore.getItem(999)).toThrow("Item with id 999 not found");
  });

  it("getChildren() возвращает прямых потомков", () => {
    expect(treeStore.getChildren(1)).toEqual([
      { id: "2", parent: 1, label: "Айтем 2" },
      { id: 3, parent: 1, label: "Айтем 3" },
    ]);
    expect(treeStore.getChildren("2")).toEqual([
      { id: 4, parent: "2", label: "Айтем 4" },
      { id: 5, parent: "2", label: "Айтем 5" },
      { id: 6, parent: "2", label: "Айтем 6" },
    ]);
    expect(treeStore.getChildren(3)).toEqual([]);
    expect(treeStore.getChildren(999)).toEqual([]);
  });

  it("getAllChildren() возвращает всех потомков (не включая сам элемент)", () => {
    const allChildren = treeStore.getAllChildren(1);
    expect(allChildren).toHaveLength(7);
    expect(allChildren).toEqual(
      expect.arrayContaining([
        { id: "2", parent: 1, label: "Айтем 2" },
        { id: 3, parent: 1, label: "Айтем 3" },
        { id: 4, parent: "2", label: "Айтем 4" },
        { id: 5, parent: "2", label: "Айтем 5" },
        { id: 6, parent: "2", label: "Айтем 6" },
        { id: 7, parent: 4, label: "Айтем 7" },
        { id: 8, parent: 4, label: "Айтем 8" },
      ])
    );
    expect(treeStore.getAllChildren(3)).toEqual([]);
  });

  it("getAllParents() возвращает всех родителей (включая сам элемент, от ближайшего к корню)", () => {
    expect(treeStore.getAllParents(7)).toEqual([
      { id: 7, parent: 4, label: "Айтем 7" },
      { id: 4, parent: "2", label: "Айтем 4" },
      { id: "2", parent: 1, label: "Айтем 2" },
      { id: 1, parent: null, label: "Айтем 1" },
    ]);
    expect(treeStore.getAllParents(1)).toEqual([{ id: 1, parent: null, label: "Айтем 1" }]);
    expect(() => treeStore.getAllParents(999)).toThrow("Item with id 999 undefined");
  });

  describe("addItem()", () => {
    it("добавляет новый элемент", () => {
      const newItem = { id: 9, parent: 3, label: "Айтем 9" };
      treeStore.addItem(newItem);
      expect(treeStore.getItem(9)).toEqual(newItem);
      expect(treeStore.getChildren(3)).toEqual([newItem]);
      expect(treeStore.getAll()).toHaveLength(items.length + 1);
    });

    it("выбрасывает ошибку при добавлении элемента с существующим id", () => {
      const duplicateItem = { id: 1, parent: null, label: "Дубликат" };
      expect(() => treeStore.addItem(duplicateItem)).toThrow("Item with id 1 already exists");
    });
  });

  describe("removeItem()", () => {
    it("удаляет элемент без потомков", () => {
      treeStore.removeItem(3);
      expect(() => treeStore.getItem(3)).toThrow();
      expect(treeStore.getAll()).toHaveLength(items.length - 1);
      expect(treeStore.getChildren(1)).toHaveLength(1); // Остался только элемент 2
    });

    it("удаляет элемент со всеми потомками", () => {
      // В исходном массиве 8 элементов
      // Удаляем ветку с корнем "2" (элементы: 2,4,5,6,7,8 - всего 6)
      treeStore.removeItem("2");

      expect(() => treeStore.getItem("2")).toThrow();
      expect(() => treeStore.getItem(4)).toThrow();
      expect(() => treeStore.getItem(5)).toThrow();
      expect(() => treeStore.getItem(6)).toThrow();
      expect(() => treeStore.getItem(7)).toThrow();
      expect(() => treeStore.getItem(8)).toThrow();

      // Должно остаться 2 элемента (1 и 3)
      expect(treeStore.getAll()).toHaveLength(2);
    });

    it("очищает childrenMap при удалении", () => {
      // Перед удалением проверяем, что записи существуют
      expect(treeStore["childrenMap"].has(1)).toBe(true);
      expect(treeStore["childrenMap"].has("2")).toBe(true);
      expect(treeStore["childrenMap"].has(4)).toBe(true);

      treeStore.removeItem(1);

      // После удаления проверяем, что записи удалены
      expect(treeStore["childrenMap"].has(1)).toBe(false);
      expect(treeStore["childrenMap"].has("null")).toBe(true);
    });

    it("не выбрасывает ошибку при удалении несуществующего элемента", () => {
      expect(() => treeStore.removeItem(999)).not.toThrow();
    });
  });

  describe("updateItem()", () => {
    it("обновляет элемент без изменения parent", () => {
      const updatedItem = { id: 4, parent: "2", label: "Обновлённый айтем 4" };
      treeStore.updateItem(updatedItem);

      const item4 = treeStore.getItem(4);
      expect(item4.label).toBe("Обновлённый айтем 4");
      expect(treeStore.getChildren("2")).toContainEqual(item4);
    });

    it("обновляет элемент с изменением parent", () => {
      const updatedItem = { id: 4, parent: 3, label: "Перемещённый айтем 4" };
      treeStore.updateItem(updatedItem);

      const item4 = treeStore.getItem(4);
      expect(item4.parent).toBe(3);
      expect(treeStore.getChildren("2")).not.toContainEqual(expect.objectContaining({ id: 4 }));
      expect(treeStore.getChildren(3)).toContainEqual(item4);
    });

    it("выбрасывает ошибку при обновлении несуществующего элемента", () => {
      const nonExistentItem = { id: 999, parent: null, label: "Несуществующий" };
      expect(() => treeStore.updateItem(nonExistentItem)).toThrow("Item with id 999 not found");
    });
  });
});

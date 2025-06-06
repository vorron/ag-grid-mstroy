export interface Item {
  id: number | string;
  parent: number | string | null;
  label: string;
}

export interface ITreeStore {
  //Должен возвращать изначальный массив элементов
  getAll(): Item[];

  //Принимает id элемента и возвращает сам объект элемента
  getItem(id: Item["id"]): Item;

  //Принимает id элемента и возвращает массив элементов, являющихся дочерними для того элемента, чей id получен в аргументе. Если у элемента нет дочерних, то должен возвращаться пустой массив
  getChildren(id: Item["id"]): Item[];

  //Принимает id элемента и возвращает массив элементов, являющихся прямыми дочерними элементами того, чей id получен в аргументе + если у них в свою очередь есть еще дочерние элементы, они все тоже будут включены в результат и так до самого глубокого уровня
  getAllChildren(id: Item["id"]): Item[];

  //Принимает id элемента и возвращает массив из цепочки родительских элементов, начиная от самого элемента, чей id был передан в аргументе и до корневого элемента, т.е. должен получиться путь элемента наверх дерева через цепочку родителей к корню дерева.
  getAllParents(id: Item["id"]): Item[];

  //Принимает объект нового элемента и добавляет его в общую структуру хранилища.
  addItem(item: Item): void;

  //Принимает id элемента и удаляет соответствующий элемент и все его дочерние элементы из хранилища.
  removeItem(id: Item["id"]): Item[];

  //Принимает объект обновленного айтема и актуализирует этот айтем в хранилище.
  updateItem(item: Item): void;
}

export interface IHistoryManager<T> {
  execute(action: T): void;
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;
}

export type TreeAction =
  | { type: "add"; item: Item }
  | { type: "remove"; item: Item; items?: Item[] }
  | { type: "rename"; id: Item["id"]; oldValue: string; newValue: string };

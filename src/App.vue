<script setup lang="ts">
import { Ref, ref } from "vue";
import TreeGrid from "./components/TreeGrid.vue";
import TreeStore, { Item } from "./TreeStore";
import data from "./data";
import ModeToggler from "./components/ModeToggler.vue";
import HistoryView from "./components/HistoryView.vue";
import { HistoryManager } from "./HistoryManager";

const treeStore: Ref<TreeStore> = ref<TreeStore>(new TreeStore(data)) as Ref<TreeStore>;
const isEditMode = ref(false);

const historyManager: Ref<HistoryManager> = ref<HistoryManager>(new HistoryManager()) as Ref<HistoryManager>;
historyManager.value.add = (item: Item) => treeStore.value.addItem(item);
historyManager.value.remove = (id: Item["id"]) => treeStore.value.removeItem(id);
historyManager.value.rename = (id: Item["id"], name: string) => (treeStore.value.getItem(id).label = name);

let indexer = treeStore.value.getAll().reduce((a, c) => (+c.id > a ? +c.id : a), 0);

const handleAddClick = (item: Item) =>
  historyManager.value.execute({
    type: "add",
    item: {
      id: ++indexer,
      label: "Новый элемент",
      parent: item.id,
    },
  });
const handleRemoveClick = (item: Item) => historyManager.value.execute({ type: "remove", item });
const handleRenameClick = (id: Item["id"], name: string) =>
  historyManager.value.execute({ type: "rename", id, newValue: name, oldValue: treeStore.value.getItem(id).label });

const onRedo = () => {
  historyManager.value.redo();
};

const onUndo = () => {
  historyManager.value.undo();
};
</script>

<template>
  <div class="toolbar">
    <ModeToggler v-model="isEditMode" />
    <HistoryView v-if="isEditMode" :historyManager="historyManager" @redo="onRedo" @undo="onUndo" />
  </div>
  <TreeGrid
    :treeStore="treeStore"
    :isEditMode="isEditMode"
    :actions="[
      { title: '+', exec: handleAddClick },
      { title: '-', exec: handleRemoveClick },
    ]"
    @rename="handleRenameClick"
  />
</template>

<style scoped>
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  align-items: center;
  height: 30px;
}
</style>

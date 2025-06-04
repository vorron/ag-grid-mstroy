<script setup lang="ts">
import { Ref, ref } from "vue";
import TreeGrid from "./components/TreeGrid.vue";
import TreeStore, { Item } from "./TreeStore";
import data from "./data";
import ModeToggler from "./components/ModeToggler.vue";
import HistoryView from "./components/HistoryView.vue";

const treeStore: Ref<TreeStore> = ref<TreeStore>(new TreeStore(data)) as Ref<TreeStore>;
const isEditMode = ref(false);

let indexer = treeStore.value.getAll().reduce((a, c) => (+c.id > a ? +c.id : a), 0);

const handleAddClick = (item: Item) => {
  treeStore.value.addItem({
    id: ++indexer,
    label: "Новый элемент",
    parent: item.id,
  });
};

const handleRemoveClick = (item: Item) => {
  treeStore.value.removeItem(item.id);
};

const handleRenameClick = (id: Item["id"], name: string) => {
  treeStore.value.getItem(id).label = name;
};
</script>

<template>
  <pre> {{ JSON.stringify(treeStore.getAll(), null, 2) }}</pre>
  <div class="toolbar">
    <ModeToggler v-model="isEditMode" />
    <HistoryView v-if="isEditMode" />
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

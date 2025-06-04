<script setup lang="ts">
import { Ref, ref } from "vue";
import TreeGrid from "./components/TreeGrid.vue";
import TreeStore, { Item } from "./TreeStore";
import data from "./data";
import ModeToggler from "./components/ModeToggler.vue";

const treeStore: Ref<TreeStore> = ref<TreeStore>(new TreeStore(data)) as Ref<TreeStore>;
const isEditMode = ref(false);

const handleAddClick = (item: Item) => {
  alert(item.label);
};

const handleRemoveClick = (item: Item) => {
  alert(item.label);
};
</script>

<template>
  <div class="toolbar">
    <ModeToggler v-model="isEditMode" />
  </div>
  <TreeGrid
    :treeStore="treeStore"
    :isEditMode="isEditMode"
    :actions="[
      { title: '+', exec: handleAddClick },
      { title: '-', exec: handleRemoveClick },
    ]"
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

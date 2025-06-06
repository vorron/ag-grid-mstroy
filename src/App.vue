<script setup lang="ts">
import { reactive, ref } from "vue";
import TreeGrid from "./components/TreeGrid.vue";
import data from "./data";
import ModeToggler from "./components/ModeToggler.vue";
import HistoryView from "./components/HistoryView.vue";
import ActionPanel from "./components/ActionPanel.vue";
import { HistoryManager } from "./HistoryManager";
import { IHistoryManager, TreeAction } from "./interfaces";
import { TreeStoreManager } from "./TreeStoreManager";

const treeStoreManager = new TreeStoreManager();
treeStoreManager.load(data);

const historyManager = reactive<IHistoryManager<TreeAction>>(
  new HistoryManager((action, reverseMode) => treeStoreManager.applyAction(action, reverseMode))
);

const isEditMode = ref(false);
</script>

<template>
  <ActionPanel>
    <ModeToggler v-model="isEditMode" />
    <HistoryView v-if="isEditMode" :historyManager="historyManager" />
  </ActionPanel>
  <TreeGrid
    :treeStore="treeStoreManager.treeStore"
    :isEditMode="isEditMode"
    @on-action="historyManager.execute($event)"
  />
</template>

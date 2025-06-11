<script setup lang="ts">
import {  ref } from "vue";
import TreeGrid from "./components/TreeGrid.vue";
import data from "./data";
import ModeToggler from "./components/ModeToggler.vue";
import HistoryView from "./components/HistoryView.vue";
import ActionPanel from "./components/ActionPanel.vue";
import { TreeStoreManager } from "./TreeStoreManager";

const treeStoreManager = new TreeStoreManager();
treeStoreManager.load(data);

const isEditMode = ref(false);
</script>

<template>
  <ActionPanel>
    <ModeToggler v-model="isEditMode" />
    <HistoryView
      v-if="isEditMode"
      :status="treeStoreManager.actionStatus"
      @redo="treeStoreManager.redoAction()"
      @undo="treeStoreManager.undoAction()"
    />
  </ActionPanel>
  <TreeGrid
    :treeStore="treeStoreManager.treeStore"
    :isEditMode="isEditMode"
    @on-action="treeStoreManager.addAction($event)"
  />
</template>

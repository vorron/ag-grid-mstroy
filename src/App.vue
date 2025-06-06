<script setup lang="ts">
import { ref } from "vue";
import TreeGrid from "./components/TreeGrid.vue";
import data from "./data";
import ModeToggler from "./components/ModeToggler.vue";
import HistoryView from "./components/HistoryView.vue";
import ActionPanel from "./components/ActionPanel.vue";
import useAppModel from "./useAppModel";

const { treeStore, historyManager } = useAppModel(data);
const isEditMode = ref(false);
</script>

<template>
  <ActionPanel>
    <ModeToggler v-model="isEditMode" />
    <HistoryView v-if="isEditMode" :historyManager="historyManager" />
  </ActionPanel>
  <TreeGrid :treeStore="treeStore" :isEditMode="isEditMode" @on-action="historyManager.execute($event)" />
</template>

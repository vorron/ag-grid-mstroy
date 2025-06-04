<script setup lang="ts">
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import TreeStore from "../TreeStore";

ModuleRegistry.registerModules([AllEnterpriseModule]);
ModuleRegistry.registerModules([AllCommunityModule]);

const { treeStore } = defineProps<{
  treeStore: TreeStore;
}>();
</script>

<template>
  <ag-grid-vue
    :rowNumbers="true"
    :style="{ height: '1200px' }"
    :row-data="treeStore.getAll()"
    :treeData="true"
    :group-default-expanded="-1"
  />
</template>

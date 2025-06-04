<script setup lang="ts">
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import TreeStore, { Item } from "../TreeStore";

ModuleRegistry.registerModules([AllEnterpriseModule]);
ModuleRegistry.registerModules([AllCommunityModule]);

const { treeStore } = defineProps<{
  treeStore: TreeStore;
}>();

const columnDefs: ColDef[] = [
  {
    headerName: "№ п\\п",
    valueGetter: (params: any) => {
      return params.node.rowIndex + 1;
    },
    width: 100,
    pinned: "left",
    sortable: false,
    filter: false,
    cellClass: "row-number-cell",
  },
  {
    headerName: "Наименование",
    field: "label",
    width: 150,
  },
];

const autoGroupColumnDef: ColDef = {
  headerName: "Категория",
  cellRendererParams: {
    suppressCount: true,
  },
  valueGetter: (params: any) => {
    return params.node.allChildrenCount === null ? "Элемент" : "Группа";
  },
};

const getDataPath = (item: Item) =>
  treeStore
    .getAllParents(item.id)
    .map((e: Item) => e.id.toString())
    .reverse();
</script>

<template>
  <ag-grid-vue
    :rowNumbers="true"
    :style="{ height: '1200px' }"
    :row-data="treeStore.getAll()"
    :column-defs="columnDefs"
    :treeData="true"
    :getDataPath="getDataPath"
    :group-default-expanded="-1"
    :autoGroupColumnDef="autoGroupColumnDef"
  />
</template>

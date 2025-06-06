<script setup lang="ts">
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import TreeStore, { Item } from "../TreeStore";
import ButtonCellRenderer from "./ButtonCellRenderer.vue";
import { TreeAction } from "../useAppModel";

ModuleRegistry.registerModules([AllEnterpriseModule]);
ModuleRegistry.registerModules([AllCommunityModule]);

const { treeStore, isEditMode } = defineProps<{
  treeStore: TreeStore;
  isEditMode: boolean;
}>();

const emits = defineEmits<{
  rename: [id: Item["id"], name: string];
  onAction: [action: TreeAction];
}>();

const getDataPath = (item: Item) =>
  treeStore
    .getAllParents(item.id)
    .map((e: Item) => e.id.toString())
    .reverse();

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
    editable: () => isEditMode,
    cellEditor: "agTextCellEditor",
    cellEditorParams: {
      maxLength: 100,
    },
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

const columnActionDef: ColDef = {
  headerName: "Actions",
  cellRenderer: ButtonCellRenderer,
  cellRendererParams: {
    onAddClick: (item: Item) =>
      emits("onAction", {
        type: "add",
        item: {
          id: -1,
          label: "Новый элемент",
          parent: item.id,
        },
      }),
    onRemoveClick: (item: Item) => emits("onAction", { type: "remove", item }),
  },
  sortable: false,
  filter: false,
  width: 200,
};

const onCellValueChanged = (value: { data: Item; oldValue: string }) => {
  emits("onAction", {
    type: "rename",
    id: value.data.id,
    oldValue: value.oldValue,
    newValue: value.data.label,
  });
};
</script>

<template>
  <ag-grid-vue
    :rowNumbers="true"
    :style="{ height: '1200px' }"
    :row-data="treeStore.getAll()"
    :column-defs="isEditMode ? [...columnDefs, columnActionDef] : columnDefs"
    :treeData="true"
    :getDataPath="getDataPath"
    :group-default-expanded="-1"
    :autoGroupColumnDef="autoGroupColumnDef"
    @cell-value-changed="onCellValueChanged"
  />
</template>

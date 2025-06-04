<script setup lang="ts">
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import TreeStore, { Item } from "../TreeStore";
import ButtonCellRenderer from "./ButtonCellRenderer.vue";

ModuleRegistry.registerModules([AllEnterpriseModule]);
ModuleRegistry.registerModules([AllCommunityModule]);

const { treeStore, isEditMode, actions } = defineProps<{
  treeStore: TreeStore;
  isEditMode: boolean;
  actions: {
    title: string;
    exec: (item: Item) => void;
  }[];
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
    editable: true,
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

const execAction = (title: string, item: Item) => {
  const action = actions.find((e) => e.title === title);
  if (action) action.exec(item);
};

const columnActionDef: ColDef = {
  headerName: "Actions",
  cellRenderer: ButtonCellRenderer,
  cellRendererParams: {
    onAddClick: (item: Item) => execAction("+", item),
    onRemoveClick: (item: Item) => execAction("-", item),
  },
  sortable: false,
  filter: false,
  width: 200,
};

const onCellValueChanged = ({ data }: { data: Item }) => {
  treeStore.getItem(data.id).label = data.label;
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

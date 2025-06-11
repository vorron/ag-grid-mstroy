<template>
  <q-card flat bordered>
    <ag-grid-vue
      class="ag-theme-quartz"
      :style="{ height: 'calc(100vh - 150px)', width: '100%' }"
      :rowData="treeStore.getAll()"
      :columnDefs="computedColumnDefs"
      :treeData="true"
      :getDataPath="getDataPath"
      :groupDefaultExpanded="-1"
      :autoGroupColumnDef="autoGroupColumnDef"
      @cell-value-changed="onCellValueChanged"
    />
  </q-card>
</template>

<script setup lang="ts">
import type { ColDef } from 'ag-grid-community';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { AgGridVue } from 'ag-grid-vue3';
import type { TreeAction } from '../interfaces/TreeAction';
import type { ITreeStore } from 'src/interfaces/ITreeStore';
import type { Item } from 'src/interfaces/Item';
import ButtonCellRenderer from './ButtonCellRenderer.vue';
import { computed } from 'vue';

ModuleRegistry.registerModules([AllEnterpriseModule, AllCommunityModule]);

const props = defineProps<{
  treeStore: ITreeStore;
  isEditMode: boolean;
}>();

const emit = defineEmits<{
  (e: 'on-action', action: TreeAction): void;
}>();

const getDataPath = (item: Item) =>
  props.treeStore
    .getAllParents(item.id)
    .map((e: Item) => e.id.toString())
    .reverse();

const baseColumnDefs: ColDef[] = [
  {
    headerName: '№ п/п',
    valueGetter: (params: unknown) => (params as { node: { rowIndex: number } }).node.rowIndex + 1,
    width: 100,
    pinned: 'left',
    sortable: false,
    filter: false,
    cellClass: 'row-number-cell',
  },
  {
    headerName: 'Наименование',
    field: 'label',
    flex: 1,
    editable: () => props.isEditMode,
    cellEditor: 'agTextCellEditor',
    cellEditorParams: { maxLength: 100 },
  },
];

const autoGroupColumnDef: ColDef = {
  headerName: 'Категория',
  width: 400,
  cellRendererParams: { suppressCount: true },
  valueGetter: (params: unknown) => {
    return (params as { node: { allChildrenCount: null | number } }).node.allChildrenCount === null
      ? 'Элемент'
      : 'Группа';
  },
};

const columnActionDef: ColDef = {
  headerName: 'Действия',
  cellRenderer: ButtonCellRenderer,
  cellRendererParams: {
    onAddClick: (item: Item) =>
      emit('on-action', {
        type: 'add',
        item: { id: -1, label: 'Новый элемент', parent: item.id },
      }),
    onRemoveClick: (item: Item) => emit('on-action', { type: 'remove', item }),
  },
  sortable: false,
  filter: false,
  width: 150,
};

const computedColumnDefs = computed(() =>
  props.isEditMode ? [...baseColumnDefs, columnActionDef] : baseColumnDefs,
);

const onCellValueChanged = (value: { data: Item; oldValue: string }) => {
  emit('on-action', {
    type: 'rename',
    id: value.data.id,
    oldValue: value.oldValue,
    newValue: value.data.label,
  });
};
</script>

<style lang="scss">
.ag-theme-quartz {
  --ag-grid-size: 8px;
  --ag-list-item-height: 36px;
  --ag-font-size: 14px;

  .row-number-cell {
    background-color: #f5f5f5;
    font-weight: bold;
  }
}
</style>

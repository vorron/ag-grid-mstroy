<script setup lang="ts">
import { ICellRendererParams } from "ag-grid-community";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const onAddClick = () => {
  if (props.params.onAddClick) {
    props.params.onAddClick(props.params.node.data);
  }
};

const onRemoveClick = () => {
  if (props.params.onRemoveClick) {
    props.params.onRemoveClick(props.params.node.data);
  }
};
</script>

<template>
  <div class="action-buttons">
    <button @click="onAddClick" class="add-button">+</button>
    <button @click="onRemoveClick" class="remove-button">-</button>
  </div>
</template>

<style scoped>
.action-buttons {
  display: flex;
  gap: 8px;
}

.add-button {
  background-color: #4caf50;
  color: white;
}

.remove-button {
  background-color: #f44336;
  color: white;
}
</style>

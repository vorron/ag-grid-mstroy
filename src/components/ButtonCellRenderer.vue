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
  <div style="display: flex; gap: 8px">
    <button
      @click="onAddClick"
      style="
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: none;
        color: white;
        font-weight: 800;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        background-color: blue;
      "
    >
      <span style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%">+</span>
    </button>
    <button
      @click="onRemoveClick"
      style="
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: none;
        color: white;
        font-weight: 800;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        background-color: red;
      "
    >
      <span style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%">-</span>
    </button>
  </div>
</template>

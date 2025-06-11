<template>
  <div class="row q-gutter-xs">
    <q-btn
      round
      dense
      icon="add"
      color="positive"
      size="sm"
      @click="params.onAddClick(params.data)"
    />
    <q-btn
      round
      dense
      icon="remove"
      color="negative"
      size="sm"
      @click="params.onRemoveClick(params.data)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Item } from 'src/interfaces/Item';

interface ButtonCellParams {
  onAddClick: (item: Item) => void;
  onRemoveClick: (item: Item) => void;
  data: Item;
}

defineProps<{
  params: ButtonCellParams;
}>();
</script>

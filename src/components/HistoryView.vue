<script setup lang="ts">
import { ref } from "vue";
import { HistoryManager } from "../HistoryManager";

const { historyManager } = defineProps<{
  historyManager: HistoryManager;
}>();

const emits = defineEmits<{
  undo: [];
  redo: [];
}>();
</script>

<template>
  <div class="edit-controls">
    <button @click="emits('undo')" :disabled="!historyManager.canUndo()" title="Отменить">
      <span>↩</span>
    </button>
    <button @click="emits('redo')" :disabled="!historyManager.canRedo()" title="Повторить">
      <span>↪</span>
    </button>
  </div>
</template>

<style scoped>
.edit-controls {
  display: flex;
  gap: 8px;
  margin-right: 16px;
}

.edit-controls button {
  min-width: 32px;
  padding: 6px;
}
</style>

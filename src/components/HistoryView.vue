<script setup lang="ts" generic="T">
import { HistoryManager } from "../HistoryManager";

const { historyManager } = defineProps<{
  historyManager: HistoryManager<T>;
}>();
</script>

<template>
  <div class="edit-controls">
    <button @click="historyManager.undo" :disabled="!historyManager.canUndo()" title="Отменить">
      <span>↩</span>
    </button>
    <button @click="historyManager.redo" :disabled="!historyManager.canRedo()" title="Повторить">
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
  border-radius: 100%;
}
</style>

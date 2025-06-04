<script setup lang="ts">
import { ref } from "vue";

const emits = defineEmits<{
  undo: [];
  redo: [];
}>();

const canUndo = ref(true);
const canRedo = ref(true);
</script>

<template>
  <div class="edit-controls">
    <button @click="emits('undo')" :disabled="!canUndo" title="Отменить">
      <span>↩</span>
    </button>
    <button @click="emits('undo')" :disabled="!canRedo" title="Повторить">
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

<script setup lang="ts">
import { Ref } from "vue";
import { ActionStatus } from "../TreeStoreManager";

const { status } = defineProps<{
  status: Ref<ActionStatus>;
}>();

const emits = defineEmits(["undo", "redo"]);
</script>

<template>
  <div class="edit-controls">
    <button
      @click="emits('undo')"
      :disabled="status.value !== 'CAN_UNDO' && status.value !== 'CAN_UNDO&REDO'"
      title="Отменить"
    >
      <span>↩</span>
    </button>
    <button
      @click="emits('redo')"
      :disabled="status.value !== 'CAN_REDO' && status.value !== 'CAN_UNDO&REDO'"
      title="Повторить"
    >
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

<template>
  <q-btn-group push>
    <q-btn
      push
      icon="undo"
      color="primary"
      :disable="!canUndo"
      @click="$emit('undo')"
      title="Отменить"
    />
    <q-btn
      push
      icon="redo"
      color="primary"
      :disable="!canRedo"
      @click="$emit('redo')"
      title="Повторить"
    />
  </q-btn-group>
</template>

<script setup lang="ts">
import type { ActionStatus } from 'src/interfaces/ActionStatus';
import { computed } from 'vue';

const props = defineProps<{
  status: ActionStatus;
}>();

defineEmits(['undo', 'redo']);

const canUndo = computed(() => props.status === 'CAN_UNDO' || props.status === 'CAN_UNDO&REDO');

const canRedo = computed(() => props.status === 'CAN_REDO' || props.status === 'CAN_UNDO&REDO');
</script>

<template>
  <q-toggle
    v-model="isEditMode"
    :label="isEditMode ? 'Режим редактирования' : 'Режим просмотра'"
    color="primary"
    checked-icon="edit"
    unchecked-icon="visibility"
  />
</template>

<script setup lang="ts">
const isEditMode = defineModel<boolean>({ required: true });
</script>

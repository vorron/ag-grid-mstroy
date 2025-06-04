<script setup lang="ts">
const isEditMode = defineModel<boolean>({ required: true });
</script>

<template>
  <button @click="() => (isEditMode = !isEditMode)">Режим {{ isEditMode ? "редактирования" : "просмотра" }}</button>
</template>

<style scoped>
button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  width: 200px;
  background: #4a6fa5;
  color: white;
  font-weight: bold;
}
</style>

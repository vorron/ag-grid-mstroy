<template>
  <div class="toolbar">
    <slot></slot>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  align-items: center;
  height: 30px;
}
</style>

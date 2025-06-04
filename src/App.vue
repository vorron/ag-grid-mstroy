<script setup lang="ts">
import { Ref, ref } from "vue";
import TreeGrid from "./components/TreeGrid.vue";
import TreeStore from "./TreeStore";
import data from "./data";

const treeStore: Ref<TreeStore> = ref<TreeStore>(new TreeStore(data)) as Ref<TreeStore>;
</script>

<template>
  <TreeGrid :treeStore="treeStore" />
</template>

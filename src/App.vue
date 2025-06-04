<script setup lang="ts">
import { Ref, ref } from "vue";
import TreeStore from "./TreeStore";
import data from "./data";

const treeStore: Ref<TreeStore> = ref<TreeStore>(new TreeStore(data)) as Ref<TreeStore>;
</script>

<template>
{{ treeStore.getItem(1).label }}
</template>

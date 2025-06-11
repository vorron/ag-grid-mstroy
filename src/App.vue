<template>
  <q-layout view="hHh Lpr lFf">
    <q-page-container>
      <q-page padding>
        <q-toolbar class="bg-grey-2 rounded-borders q-pa-sm q-gutter-x-sm">
          <ModeToggler v-model="isEditMode" />
          <HistoryView
            v-if="isEditMode"
            :status="actionStatus"
            @redo="redoAction()"
            @undo="undoAction()"
          />
        </q-toolbar>

        <TreeGrid
          :treeStore="treeStore"
          :isEditMode="isEditMode"
          @on-action="addAction($event)"
          class="q-mt-md"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TreeGrid from './components/TreeGrid.vue';
import ModeToggler from './components/ModeToggler.vue';
import HistoryView from './components/HistoryView.vue';
import { useAppModel } from './composables/useAppModel';
import data from './data/data';

const { load, treeStore, addAction, undoAction, redoAction, actionStatus } = useAppModel();

load(data);

const isEditMode = ref(false);
</script>

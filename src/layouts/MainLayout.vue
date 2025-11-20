<template>
  <q-layout view="lHh Lpr lFf">
    <NabVar />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import NabVar from 'src/components/NabVar.vue'
</script>

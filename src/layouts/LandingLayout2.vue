<template>
  <q-layout view="lHh Lpr lFf">
    <LandingNavbar />

    <q-page-container style="padding-left: 0; padding-right: 0; padding-top: 0 !important;">
      <router-view />
    </q-page-container>

    <LandingFooter />
  </q-layout>
</template>

<script setup>
import LandingNavbar from 'components/LandingNavbar.vue'
import LandingFooter from 'components/LandingFooter.vue'
</script>

<style scoped>
/* Ensure navbar covers the top mesh if needed, or adjust padding */
</style>

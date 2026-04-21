<template>
  <q-layout view="lHh Lpr lFf" class="auth-layout-bg">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Layout minimalista para procesos de autenticación/seguridad
</script>

<style scoped>
.auth-layout-bg {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}
</style>

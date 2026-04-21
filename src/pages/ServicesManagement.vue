<template>
  <q-page padding>
    <div class="row items-center q-mb-lg">
      <q-icon name="mdi-hammer-wrench" size="32px" color="primary" class="q-mr-sm" />
      <h1 class="text-h4 text-bold text-secondary q-my-none">Gestión de Servicios</h1>
    </div>

    <q-card class="glass-effect q-pa-lg rounded-xl shadow-2">
      <div class="text-center q-py-xl">
        <q-icon name="mdi-tools" size="64px" color="grey-4" />
        <p class="text-h6 text-grey-6 q-mt-md">Próximamente: Administra tu catálogo de servicios aquí.</p>
        <q-btn unelevated color="primary" label="Nuevo Servicio" icon="add" rounded class="q-mt-md" />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
// Lógica de servicios próximamente
</script>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
</style>

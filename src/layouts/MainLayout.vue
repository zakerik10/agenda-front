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
import { onMounted } from 'vue'
import { useAuthStore } from 'stores/auth' // Asegúrate de la ruta correcta

const authStore = useAuthStore()

onMounted(async () => {
  // Ejecutar la verificación de sesión al montar el layout
  console.log('MainLayout montado, verificando sesión...')
  try {
    await authStore.checkAuthAndLoadUser()
  } catch (error) {
    // La Store ya maneja la limpieza si el token es inválido (401)
    console.log('Sesión no válida o expirada. El usuario está deslogueado. error: ' + error)
  }
})
</script>

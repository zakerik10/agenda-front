<template>
  <q-layout view="hHh lpR fFf">
    <!-- Navbar sin botón de menú -->
    <NabVar :show-menu-button="false" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import NabVar from 'src/components/NabVar.vue'
import { onMounted } from 'vue'
import { useAuthStore } from 'stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  // Verificación opcional de sesión en Landing
  try {
    await authStore.checkAuthAndLoadUser()
  } catch {
    console.log('Usuario anónimo en Landing Page')
  }
})
</script>

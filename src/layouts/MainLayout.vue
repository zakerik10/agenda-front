<template>
  <q-layout view="hHh lpR fFf">
    <NabVar />

    <q-drawer v-model="calendarStore.isDrawerOpen" side="left" bordered>
      <div class="q-pa-md row justify-center">
        <q-date
          v-model="calendarStore.selectedDate"
          minimal
          today-btn
          mask="YYYY-MM-DD"
          @update:model-value="calendarStore.updateDate"
        />
      </div>
      <div class="q-pa-md">
        <div class="text-subtitle2 q-mb-sm">Navegación</div>
        <p class="text-caption text-grey">
          Selecciona una fecha para mover el calendario principal.
        </p>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import NabVar from 'src/components/NabVar.vue'
import { onMounted } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useCalendarStore } from 'stores/calendar'

const authStore = useAuthStore()
const calendarStore = useCalendarStore()

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

<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <NabVar />

    <q-drawer
      v-model="calendarStore.isDrawerOpen"
      side="left"
      bordered
      :width="300"
      class="bg-white scroll-none"
    >
      <div class="q-pa-sm">
        <div class="text-subtitle1 text-bold q-mb-md text-secondary">Navegación</div>
        <q-list padding class="rounded-borders">
          <q-item clickable v-ripple @click="router.push('/dashboard/agenda')" v-if="authStore.hasPermission('appointments.view')">
            <q-item-section avatar>
              <q-icon name="mdi-calendar" color="primary" />
            </q-item-section>
            <q-item-section>Agenda</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="router.push('/dashboard/servicios')" v-if="authStore.hasPermission('services.manage')">
            <q-item-section avatar>
              <q-icon name="mdi-hammer-wrench" color="primary" />
            </q-item-section>
            <q-item-section>Servicios</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="router.push('/dashboard/equipo')" v-if="authStore.hasPermission('staff.view')">
            <q-item-section avatar>
              <q-icon name="mdi-account-group" color="primary" />
            </q-item-section>
            <q-item-section>Equipo</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="router.push('/dashboard/sucursales')" v-if="authStore.hasPermission('branches.manage')">
            <q-item-section avatar>
              <q-icon name="mdi-store" color="primary" />
            </q-item-section>
            <q-item-section>Sucursales</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="router.push('/dashboard/roles')" v-if="authStore.hasPermission('roles.manage')">
            <q-item-section avatar>
              <q-icon name="mdi-shield-account" color="primary" />
            </q-item-section>
            <q-item-section>Roles y Permisos</q-item-section>
          </q-item>
        </q-list>

        <q-separator class="q-my-md" />

        <div class="text-subtitle1 text-bold q-mb-md text-secondary">Ir a Fecha</div>
        <q-date
          v-model="selectedDate"
          minimal
          flat
          mask="YYYY-MM-DD"
          class="full-width q-date-premium"
          @update:model-value="onDateChange"
        />
      </div>
    </q-drawer>

    <q-page-container style="padding-left: 0; padding-right: 0;">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import NabVar from 'src/components/NabVar.vue'
import { onMounted, computed } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'
//import { useBranchStore } from 'stores/branch'
import { useCalendarStore } from 'stores/calendar'

const authStore = useAuthStore()
//const branchStore = useBranchStore()
const calendarStore = useCalendarStore()
const router = useRouter()

const selectedDate = computed({
  get: () => calendarStore.selectedDate,
  set: (val) => calendarStore.updateDate(val)
})

const onDateChange = (val) => {
  if (val) {
    calendarStore.updateDate(val)
  }
}

onMounted(async () => {
  console.log('MainLayout montado, verificando sesión...')
  try {
    await authStore.checkAuthAndLoadUser()

    // Redirigir si el usuario necesita completar algún paso antes del dashboard
    if (authStore.isLoggedIn) {
      const targetRoute = authStore.getPostLoginRoute()
      if (targetRoute !== '/dashboard') {
        router.push(targetRoute)
      }
    }
  } catch (error) {
    console.log('Sesión no válida o expirada. error: ' + error)
  }
})
</script>

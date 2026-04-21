<template>
  <q-header elevated class="app-header">
    <q-toolbar class="q-px-md">
      <q-btn
        v-if="showMenuButton"
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        color="secondary"
        @click="calendarStore.toggleDrawer()"
      />

      <q-toolbar-title class="flex items-center cursor-pointer" @click="router.push('/')">
        <q-icon name="mdi-calendar-star" color="primary" class="q-mr-xs" size="24px" />
        <span class="text-subtitle1 text-bold text-secondary">Zen<span class="text-primary text-bold">Agenda</span></span>
      </q-toolbar-title>

      <div class="flex items-center q-gutter-sm">
        <BranchSelector v-if="isLoggedIn" />

        <q-btn flat color="secondary" label="Ingresar" v-if="!isLoggedIn" @click="handleLogin()" />

        <q-btn v-if="isLoggedIn" flat round color="secondary" icon="mdi-logout-variant" @click="logout()">
          <q-tooltip>Cerrar Sesión</q-tooltip>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { useCalendarStore } from 'stores/calendar'
import BranchSelector from 'components/BranchSelector.vue'

defineProps({
  showMenuButton: {
    type: Boolean,
    default: true,
  },
})

const authStore = useAuthStore()
const calendarStore = useCalendarStore()
const { isLoggedIn } = storeToRefs(authStore)
const router = useRouter()

async function handleLogin() {
  await authStore.accessGoogle()
  if (authStore.isLoggedIn) {
    router.push(authStore.getPostLoginRoute())
  }
}

function logout() {
  authStore.logoutGoogle().then(() => {
    router.push('/')
  })
}
</script>

<style scoped>
.app-header {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  color: #1d3557;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>

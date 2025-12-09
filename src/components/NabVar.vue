<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        v-if="showMenuButton"
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="calendarStore.toggleDrawer()"
      />

      <q-toolbar-title> Quasar App </q-toolbar-title>

      <q-btn color="secondary" label="Ingresar" v-if="!isLoggedIn" @click="handleLogin()" />
      <q-btn color="secondary" label="Salir" v-if="isLoggedIn" @click="authStore.logoutGoogle()" />
    </q-toolbar>
  </q-header>
</template>

<script setup>
// import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/stores/auth'
import { useCalendarStore } from 'stores/calendar'

defineProps({
  showMenuButton: {
    type: Boolean,
    default: true,
  },
})

const authStore = useAuthStore()
const calendarStore = useCalendarStore()

// const leftDrawerOpen = ref(false)

const { isLoggedIn } = storeToRefs(authStore)

function handleLogin() {
  authStore.accessGoogle() // Llama a la Action
}
</script>

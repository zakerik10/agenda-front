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

      <BranchSelector v-if="isLoggedIn" />

      <q-btn color="secondary" label="Ingresar" v-if="!isLoggedIn" @click="handleLogin()" />
      <q-btn color="secondary" label="Salir" v-if="isLoggedIn" @click="authStore.logoutGoogle()" />
    </q-toolbar>
  </q-header>
</template>

<script setup>
// import { ref } from 'vue'
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

// const leftDrawerOpen = ref(false)

const { isLoggedIn } = storeToRefs(authStore)
const router = useRouter()

async function handleLogin() {
  await authStore.accessGoogle()
  if (authStore.isLoggedIn) {
    router.push('/dashboard')
  }
}
</script>

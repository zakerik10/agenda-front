<template>
  <q-header elevated>
    <q-toolbar>
      <!-- <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" /> -->

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

const authStore = useAuthStore()

// const leftDrawerOpen = ref(false)

const { isLoggedIn } = storeToRefs(authStore)

function handleLogin() {
  authStore.accessGoogle() // Llama a la Action
}
</script>

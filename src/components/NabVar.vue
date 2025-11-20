<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

      <q-toolbar-title> Quasar App </q-toolbar-title>

      <q-btn color="secondary" label="Ingresar" v-if="!isLoggedIn" @click="handleLogin()" />
      <q-btn color="secondary" label="Salir" v-if="isLoggedIn" @click="authStore.logoutGoogle()" />
    </q-toolbar>
  </q-header>

  <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
    <q-list>
      <q-item-label header> Essential Links </q-item-label>

      <!-- <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" /> -->
    </q-list>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/stores/auth'

const authStore = useAuthStore()

const leftDrawerOpen = ref(false)

const { isLoggedIn } = storeToRefs(authStore)

function handleLogin() {
  authStore.accessGoogle() // Llama a la Action
}

// function accessGoogle() {
//   console.log('Login')
//   const provider = new GoogleAuthProvider()
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       // This gives you a Google Access Token. You can use it to access the Google API.
//       const credential = GoogleAuthProvider.credentialFromResult(result)
//       const token = credential.accessToken
//       // The signed-in user info.
//       const user = result.user
//       console.log(token)
//       console.log(user)
//       // IdP data available using getAdditionalUserInfo(result)
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code
//       const errorMessage = error.message
//       // The email of the user's account used.
//       const email = error.customData.email
//       // The AuthCredential type that was used.
//       const credential = GoogleAuthProvider.credentialFromError(error)
//       console.log(errorCode)
//       console.log(errorMessage)
//       console.log(email)
//       console.log(credential)
//     })
// }

// function logoutGoogle() {
//   console.log('Logout')
//   signOut(auth)
//     .then(console.log('Se cerró sesión'))
//     .catch((e) => console.log(e))
// }

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

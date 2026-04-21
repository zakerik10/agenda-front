<template>
  <q-page class="flex flex-center">
    <q-card class="glass-card q-pa-xl shadow-24" style="max-width: 450px; width: 100%;">
      <div class="text-center q-mb-xl">
        <q-icon name="mdi-shield-lock" size="64px" color="primary" class="q-mb-md" />
        <h1 class="text-h4 text-bold text-secondary q-mb-xs">Seguridad</h1>
        <p class="text-subtitle1 text-grey-7">Por seguridad, debes cambiar tu contraseña inicial antes de continuar.</p>
      </div>

      <q-form @submit="handleSubmit" class="q-gutter-md">
        <q-input
          v-model="newPassword"
          label="Nueva Contraseña"
          type="password"
          outlined
          rounded
          bg-color="white"
          :rules="[
            val => !!val || 'Requerido',
            val => val.length >= 8 || 'Mínimo 8 caracteres',
            val => /[A-Z]/.test(val) || 'Debe incluir una mayúscula',
            val => /[0-9]/.test(val) || 'Debe incluir un número',
            val => /[!@#$%^&*]/.test(val) || 'Debe incluir un carácter especial (!@#$%^&*)'
          ]"
        />

        <q-input
          v-model="confirmPassword"
          label="Repetir Contraseña"
          type="password"
          outlined
          rounded
          bg-color="white"
          :rules="[
            val => !!val || 'Requerido',
            val => val === newPassword || 'Las contraseñas no coinciden'
          ]"
        />

        <div class="q-pt-lg">
          <q-btn
            label="Actualizar y Comenzar"
            type="submit"
            color="primary"
            rounded
            unelevated
            class="full-width"
            size="lg"
            :loading="loading"
          />
        </div>
      </q-form>

      <div class="text-center q-mt-md">
        <q-btn flat color="grey-7" label="Cerrar Sesión" @click="handleLogout" />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { api } from 'boot/axios'
import { Notify } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  try {
    await api.post('/employees/change-password', {
      new_password: newPassword.value
    })
    
    Notify.create({
      type: 'positive',
      message: 'Contraseña actualizada. ¡Bienvenido!'
    })

    // Actualizamos el estado local
    if (authStore.user) {
      authStore.user.password_changed = true
    }

    router.push('/dashboard')
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al actualizar'
    })
  } finally {
    loading.value = false
  }
}

function handleLogout() {
  authStore.logoutGoogle()
  router.push('/')
}
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 24px;
}
</style>

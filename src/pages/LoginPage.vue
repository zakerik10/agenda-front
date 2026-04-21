<template>
  <q-page class="flex flex-center login-bg">
    <div class="row q-col-gutter-lg justify-center full-width q-px-md" style="max-width: 1000px;">
      
      <!-- Lado del Dueño (Google) -->
      <div class="col-12 col-md-5">
        <q-card class="glass-card login-card flex flex-center text-center q-pa-xl">
          <div class="column items-center">
            <q-icon name="mdi-calendar-star" size="64px" color="primary" class="q-mb-md" />
            <h2 class="text-h4 text-bold text-secondary q-mb-xs">Dueño</h2>
            <p class="text-subtitle1 text-grey-7 q-mb-xl">Gestiona tu negocio y sucursales</p>
            
            <q-btn
              unelevated
              rounded
              padding="12px 24px"
              color="white"
              text-color="secondary"
              class="google-btn shadow-2"
              @click="handleGoogleLogin"
              :loading="loadingGoogle"
            >
              <img src="https://lh3.googleusercontent.com/COxitqgJr1sICpe9ubD8q0u69557N0Isy9pIpWpPZ8X6yq3W965r4pS3nF6Cdw=s48" alt="Google" class="q-mr-sm" style="width: 20px;">
              Continuar con Google
            </q-btn>
          </div>
        </q-card>
      </div>

      <!-- Divisor visual para desktop -->
      <div class="gt-sm flex flex-center">
        <div class="divider-line"></div>
      </div>

      <!-- Lado del Staff (Usuario/PSW) -->
      <div class="col-12 col-md-5">
        <q-card class="glass-card login-card q-pa-xl">
          <div class="column">
            <h2 class="text-h4 text-bold text-secondary q-mb-xs">Staff</h2>
            <p class="text-subtitle1 text-grey-7 q-mb-lg">Ingresa a tu agenda asignada</p>

            <q-form @submit="handleStaffLogin" class="q-gutter-md">
              <q-input
                v-model="username"
                label="Usuario"
                rounded
                outlined
                bg-color="white"
                :rules="[val => !!val || 'El usuario es requerido']"
              />
              <q-input
                v-model="password"
                label="Contraseña"
                type="password"
                rounded
                outlined
                bg-color="white"
                :rules="[val => !!val || 'La contraseña es requerida']"
              />
              
              <div class="q-pt-md">
                <q-btn
                  label="Ingresar"
                  type="submit"
                  color="primary"
                  rounded
                  unelevated
                  class="full-width"
                  size="lg"
                  :loading="loadingStaff"
                />
              </div>
            </q-form>
          </div>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const loadingGoogle = ref(false)
const loadingStaff = ref(false)

async function handleGoogleLogin() {
  loadingGoogle.value = true
  try {
    await authStore.accessGoogle()
    if (authStore.isLoggedIn) {
      router.push(authStore.getPostLoginRoute())
    }
  } finally {
    loadingGoogle.value = false
  }
}

async function handleStaffLogin() {
  loadingStaff.value = true
  try {
    const success = await authStore.loginStaff(username.value, password.value)
    if (success) {
      router.push(authStore.getPostLoginRoute())
    }
  } finally {
    loadingStaff.value = false
  }
}
</script>

<style scoped>
.login-bg {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 24px;
  transition: all 0.3s ease;
}

.login-card {
  min-height: 450px;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.google-btn {
  font-weight: 600;
  border: 1px solid #e0e0e0;
}

.divider-line {
  width: 1px;
  height: 300px;
  background: linear-gradient(to bottom, transparent, #dee2e6, transparent);
}
</style>

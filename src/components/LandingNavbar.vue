<template>
  <q-header elevated class="lp2-header">
    <div class="lp2-nav-container q-px-xl q-py-md flex items-center justify-between">
      <div class="text-h5 text-bold flex items-center cursor-pointer" @click="router.push('/')">
        <q-icon name="mdi-calendar-star" color="primary" class="q-mr-sm" size="32px" />
        <span class="text-secondary">Zen<span class="text-primary">Agenda</span></span>
      </div>

      <div class="gt-sm q-gutter-lg flex items-center">
        <span class="nav-link cursor-pointer" @click="scrollToSection('caracteristicas')">Características</span>
        <span class="nav-link cursor-pointer" @click="scrollToSection('soluciones')">Soluciones</span>
        <span class="nav-link cursor-pointer" @click="scrollToSection('recursos')">Recursos</span>
        <span class="nav-link cursor-pointer" @click="scrollToSection('precios')">Precios</span>
      </div>

      <div class="flex items-center q-gutter-sm">
        <q-btn flat color="secondary" :label="authStore.isLoggedIn ? 'Ir al Panel' : 'Ingresar'" class="gt-xs" @click="handleAuthAction" />
        <q-btn unelevated color="primary" :label="authStore.isLoggedIn ? 'Mi Agenda' : 'Empieza ahora'" rounded padding="8px 24px" @click="handleAuthAction" />
        <q-btn flat round icon="menu" class="lt-md" />
      </div>
    </div>
  </q-header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleAuthAction = () => {
  if (authStore.isLoggedIn) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.lp2-header {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  color: #1d3557;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.lp2-nav-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.nav-link {
  font-weight: 600;
  font-size: 15px;
  color: #1d3557;
  opacity: 0.8;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  opacity: 1;
  color: var(--q-primary);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--q-primary);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}
</style>

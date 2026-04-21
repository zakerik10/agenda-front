<template>
  <div class="error-page bg-grey-1 flex flex-center">
    <div class="mesh-bg"></div>
    
    <div class="content-card glass-effect text-center q-pa-xl rounded-xl shadow-24">
      <div class="text-h1 text-primary text-bold q-mb-md">404</div>
      <div class="text-h4 text-secondary q-mb-lg">Página no encontrada</div>
      <p class="text-body1 text-grey-7 q-mb-xl">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <q-btn unelevated color="primary" label="Volver al inicio" rounded padding="12px 32px" @click="router.push('/')" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.mesh-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f8fafc;
  background-image: 
    radial-gradient(at 0% 0%, rgba(214, 40, 40, 0.08) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(29, 53, 87, 0.05) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(69, 123, 157, 0.05) 0px, transparent 50%);
  z-index: 0;
}

.content-card {
  position: relative;
  z-index: 1;
  max-width: 500px;
  width: 90%;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.text-h1 {
  font-size: 8rem;
  line-height: 1;
}
</style>

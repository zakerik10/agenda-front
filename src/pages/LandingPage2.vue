<template>
  <q-page class="lp2-page">
    <div class="mesh-bg"></div>

    <section class="hero-section row q-px-xl items-center justify-between main-content-pt">
      <div class="col-12 col-md-6 hero-text-container">
        <div class="badge-premium q-mb-md">
          <q-icon name="mdi-check-decagram" color="primary" size="18px" />
          <span class="text-caption text-weight-bold q-ml-xs">HERRAMIENTA GRATUITA</span>
        </div>
        <h1 class="text-h1 text-bold text-secondary q-mb-md leading-tight">
          La agenda que <br /><span class="text-primary text-italic">trabaja</span> para ti.
        </h1>
        <p class="text-h5 text-grey-8 q-mb-xl opacity-90">
          Gestiona citas, clientes y equipo en una sola plataforma fluida y minimalista. 
          Diseñada para profesionales que valoran su tiempo.
        </p>
        <div class="row q-gutter-md">
          <q-btn 
            unelevated 
            color="primary" 
            size="lg" 
            :label="authStore.isLoggedIn ? 'Ir al Panel de Gestión' : 'Comienza a organizarte'" 
            rounded 
            padding="12px 32px" 
            @click="handleAuthAction" 
          />
          <q-btn 
            outline 
            color="primary" 
            size="lg" 
            label="Reservar Turno" 
            rounded 
            padding="12px 32px" 
            class="glass-effect"
            to="/reservar" 
          />
        </div>
      </div>

      <div class="col-12 col-md-5 q-mt-xl gt-sm relative-position flex flex-center">
        <!-- Dashboard Mockup using Quasar components -->
        <q-card 
          class="dashboard-mockup glass-effect shadow-24 q-pa-lg"
          v-intersection="{ handler: onIntersection, once: true }"
          :class="{ 'animate-in': isVisible }"
        >
          <div class="row q-gutter-xs q-mb-md">
            <div class="dot bg-red-4"></div>
            <div class="dot bg-amber-4"></div>
            <div class="dot bg-green-4"></div>
          </div>
          
          <div class="mockup-content row q-col-gutter-md">
            <div class="col-4">
              <div class="mockup-line bg-grey-3 rounded q-mb-sm h-20 animate-pulse"></div>
              <div class="mockup-line bg-grey-2 rounded q-mb-sm h-10"></div>
              <div class="mockup-line bg-grey-2 rounded q-mb-sm h-10 w-80"></div>
            </div>
            <div class="col-8">
              <div class="calendar-grid q-pa-sm border-grey-2 rounded bg-white-50">
                <div class="row q-gutter-xs q-mb-xs" v-for="i in 4" :key="i">
                  <div 
                    class="calendar-cell col" 
                    v-for="j in 7" 
                    :key="j"
                    :class="{ 'bg-primary-light': (i+j) % 5 === 0 }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </q-card>

        <!-- Premium Floaters using Quasar Chips/Badges -->
        <div class="floater f-1 animate-float">
          <q-chip icon="mdi-bell-ring" color="primary" text-color="white" class="shadow-10">
            Nueva Cita
          </q-chip>
        </div>
        <div class="floater f-2 animate-float-delayed">
          <q-chip icon="mdi-check-circle" color="positive" text-color="white" class="shadow-10">
            Pagado
          </q-chip>
        </div>
      </div>
    </section>

    <section id="caracteristicas" class="features-section q-px-xl q-py-xl">
      <div class="text-center q-mb-xl">
        <h2 class="text-h2 text-bold text-secondary">Todo lo que necesitas, <br />sin la complejidad.</h2>
      </div>

      <div class="bento-grid">
        <div class="bento-card b-main glass-effect q-pa-xl rounded-xl">
          <q-icon name="mdi-sync" color="primary" size="48px" class="q-mb-md" />
          <h3 class="text-h4 text-bold q-mb-sm">Sincronización Total</h3>
          <p class="text-body1 text-grey-7">Conecta tu calendario de Google, Outlook y Apple en un solo lugar. Todo siempre al día.</p>
        </div>
        <div class="bento-card b-side glass-effect q-pa-xl rounded-xl">
          <q-icon name="mdi-lightning-bolt" color="amber-8" size="48px" class="q-mb-md" />
          <h3 class="text-h4 text-bold q-mb-sm">Reserva Instantánea</h3>
          <p class="text-body1 text-grey-7">Tus clientes agendan en 3 clics sin salir de tus redes sociales.</p>
        </div>
        <div class="bento-card b-bottom-1 glass-effect q-pa-xl rounded-xl">
          <q-icon name="mdi-shield-check" color="secondary" size="32px" class="q-mb-sm" />
          <h5 class="text-h6 text-bold q-mb-xs">Seguridad Bancaria</h5>
          <p class="text-caption text-grey-7">Tus datos y los de tus clientes protegidos con encriptación de grado militar.</p>
        </div>
        <div class="bento-card b-bottom-2 glass-effect q-pa-xl rounded-xl">
          <q-icon name="mdi-whatsapp" color="green" size="32px" class="q-mb-sm" />
          <h5 class="text-h6 text-bold q-mb-xs">WhatsApp Pro</h5>
          <p class="text-caption text-grey-7">Notificaciones automáticas directas al móvil de tus clientes.</p>
        </div>
      </div>
    </section>

    <section id="precios" class="cta-lp2 q-px-xl q-py-xl flex flex-center">
      <div class="cta-card glass-effect text-center q-pa-xl rounded-xl full-width shadow-24">
        <h2 class="text-h2 text-bold text-white q-mb-md">Domina tu tiempo hoy.</h2>
        <p class="text-h6 text-white opacity-80 q-mb-xl">Únete a la comunidad de profesionales que ya han transformado su negocio.</p>
        <q-btn 
          unelevated 
          color="white" 
          text-color="primary" 
          size="lg" 
          :label="authStore.isLoggedIn ? 'Volver a mi Agenda' : 'Crear mi cuenta'" 
          rounded 
          padding="12px 48px" 
          class="q-hover-up" 
          @click="handleAuthAction" 
        />
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isVisible = ref(false)

const onIntersection = (entry) => {
  if (entry.isIntersecting) {
    isVisible.value = true
  }
}

const handleAuthAction = () => {
  if (authStore.isLoggedIn) {
    router.push(authStore.getPostLoginRoute())
  } else {
    router.push('/login')
  }
}

onMounted(() => {
  // Si ya está logueado, redirigir según su estado
  if (authStore.isLoggedIn) {
    router.push(authStore.getPostLoginRoute())
  }
})
</script>

<style scoped>
.lp2-page {
  position: relative;
  overflow-x: hidden;
  background-color: white;
}

.mesh-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: min(100vh, 1200px);
  background-color: #f8fafc;
  background-image: 
    radial-gradient(at 0% 0%, rgba(214, 40, 40, 0.08) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(29, 53, 87, 0.05) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(69, 123, 157, 0.05) 0px, transparent 50%);
  mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
  z-index: 0;
  pointer-events: none;
}

.main-content-pt {
  padding-top: 100px;
}

.hero-section {
  min-height: 80vh;
}

.hero-text-container {
  z-index: 1;
}

.badge-premium {
  display: inline-flex;
  align-items: center;
  background: rgba(214, 40, 40, 0.1);
  padding: 6px 16px;
  border-radius: 100px;
  border: 1px solid rgba(214, 40, 40, 0.2);
}

.glass-effect {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.dashboard-mockup {
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg) scale(0.9);
  opacity: 0;
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.dashboard-mockup.animate-in {
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg) scale(1);
  opacity: 1;
}

.dashboard-mockup:hover {
  transform: perspective(1000px) rotateY(-2deg) rotateX(2deg) scale(1.02);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.mockup-line {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.05);
}

.w-80 { width: 80%; }

.calendar-grid {
  display: grid;
  gap: 4px;
}

.calendar-cell {
  background: rgba(0, 0, 0, 0.03);
  height: 20px;
  border-radius: 4px;
}

.bg-primary-light {
  background: rgba(214, 40, 40, 0.1);
}

.floater {
  position: absolute;
  z-index: 10;
  pointer-events: none;
}

.f-1 { top: 10%; right: -10px; }
.f-2 { bottom: 10%; left: -20px; }

.animate-float {
  animation: float-premium 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-premium 6s ease-in-out infinite 3s;
}

@keyframes float-premium {
  0%, 100% { transform: translateY(0) rotate(0); }
  33% { transform: translateY(-15px) rotate(2deg); }
  66% { transform: translateY(-5px) rotate(-2deg); }
}

.animate-pulse {
  animation: pulse-op 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-op {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 200px;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.bento-card {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.bento-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.b-main { grid-column: span 2; grid-row: span 2; }
.b-side { grid-column: span 1; grid-row: span 2; }
.b-bottom-1 { grid-column: span 1; grid-row: span 1; }
.b-bottom-2 { grid-column: span 2; grid-row: span 1; }

.cta-lp2 {
  background-color: white;
}

.cta-card {
  background: linear-gradient(135deg, #d62828 0%, #1d3557 100%);
  color: white;
}

.q-hover-up {
  transition: transform 0.3s ease;
}

.q-hover-up:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }
  .b-main, .b-side, .b-bottom-1, .b-bottom-2 {
    grid-column: span 1;
    grid-row: span 1;
  }
}
</style>

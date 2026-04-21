<template>
  <q-page class="">
    <!-- ---------------------------------------------- -->
    <!-- Hero Section -->
    <!-- ---------------------------------------------- -->

    <div class="row q-my-xl q-px-xl">
      <div class="col">
        <div class="row">
          <div class="flex items-center brand-chip rounded-full bordered">
            <q-icon class="q-ma-sm" name="mdi-creation" size="18px" />
            <span class="q-my-sm q-mr-sm text-caption text-weight-medium">
              Sistema Moderno de Gestión
            </span>
          </div>
          <div class="col-12 q-my-xl">
            <span class="text-h2 text-bold">La solución moderna para gestionar tu negocio</span>
          </div>
          <div class="col-12">
            <span class="text-h5">
              Simplifica la agenda de tu negocio con nuestro sistema intuitivo. Tus clientes
              reservan turnos en segundos, tú te enfocas en lo que importa.
            </span>
          </div>
        </div>
      </div>

      <div class="col gt-sm flex justify-center items-center">
        <div class="hero-visual-container">
          <!-- Card 1 (Top) -->
          <div class="floating-card card-top glass-effect glow-primary float-animation-1">
            <q-icon name="mdi-calendar-check" color="primary" size="24px" class="q-mr-sm" />
            <span class="text-weight-bold text-primary">Agendamiento 24/7</span>
          </div>

          <!-- Card 2 (Bottom/Offset) -->
          <div class="floating-card card-bottom glass-effect glow-secondary float-animation-2">
            <q-icon name="mdi-trending-up" color="secondary" size="24px" class="q-mr-sm" />
            <span class="text-weight-bold text-secondary">Control de tu Negocio</span>
          </div>

          <!-- Visual Background Element (Optional blur bubble) -->
          <div class="blur-bubble"></div>
        </div>
      </div>
    </div>

    <!-- ---------------------------------------------- -->
    <!-- Characteristics Section -->
    <!-- ---------------------------------------------- -->

    <div class="row q-px-xl q-py-xl">
      <div class="col-12"></div>
      <div class="col-12">
        <div class="row q-col-gutter-xl">
          <div v-for="card in cards" :key="card.title" class="col-12 col-sm-6 col-md-4 flex">
            <q-card class="column full-height">
              <q-card-section class="col-auto">
                <q-icon
                  class="q-pa-sm q-ml-sm q-mt-sm text-white rounded-border"
                  v-bind:class="card.iconColor"
                  v-bind:name="card.icon"
                  size="30px"
                />
              </q-card-section>
              <q-card-section>
                <div class="text-h6">{{ card.title }}</div>
                <div class="text-subtitle2">{{ card.description }}</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div v-for="tick in card.ticks" :key="tick" class="col-12">
                    <q-icon name="mdi-check" />
                    {{ tick }}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    <!-- ---------------------------------------------- -->
    <!-- How it Works Section -->
    <!-- ---------------------------------------------- -->

    <div class="row q-py-xl q-col-gutter-xl items-center q-px-xl">
      <div class="col-12 text-center q-mb-lg">
        <div class="text-overline text-primary font-bold">PROCESO SIMPLE</div>
        <div class="text-h3 text-bold">¿Cómo funciona?</div>
      </div>
      
      <div class="col-12 col-md-4 text-center">
        <div class="step-icon brand-light-bg text-primary q-mx-auto q-mb-md">
          <q-icon name="mdi-store-edit-outline" size="40px" />
          <div class="step-number">1</div>
        </div>
        <div class="text-h6">Crea tu Sucursal</div>
        <p class="text-grey-7">Configura tus horarios, servicios y equipo en minutos.</p>
      </div>

      <div class="col-12 col-md-4 text-center">
        <div class="step-icon brand-light-bg text-primary q-mx-auto q-mb-md">
          <q-icon name="mdi-link-variant" size="40px" />
          <div class="step-number">2</div>
        </div>
        <div class="text-h6">Comparte tu Link</div>
        <p class="text-grey-7">Tus clientes acceden a tu portal personalizado de reservas.</p>
      </div>

      <div class="col-12 col-md-4 text-center">
        <div class="step-icon brand-light-bg text-primary q-mx-auto q-mb-md">
          <q-icon name="mdi-calendar-check" size="40px" />
          <div class="step-number">3</div>
        </div>
        <div class="text-h6">Gestiona y Crece</div>
        <p class="text-grey-7">Recibe turnos, envía recordatorios y escala tu negocio.</p>
      </div>
    </div>


    <!-- Final CTA & Footer -->
    <!-- ---------------------------------------------- -->

    <div class="row q-px-xl q-my-xl">
      <div class="col-12 row q-py-xl bg-primary text-white text-center rounded-xl">
        <div class="col-12 q-pa-xl">
          <div class="text-h3 q-mb-md">Listo para modernizar tu agenda?</div>
          <p class="text-h6 q-mb-lg opacity-80">Únete a cientos de negocios que ya optimizan su tiempo.</p>
          <q-btn size="lg" color="white" text-color="primary" label="¡Comenzar Ahora!" unelevated />
        </div>
      </div>
    </div>

    <footer class="footer-brand footer-breakout text-white">
      <div class="row q-py-xl q-col-gutter-xl q-px-xl">
        <div class="col-12 col-md-4">
          <div class="text-h6 font-bold q-mb-md">Agenda Pro</div>
          <p class="opacity-80">Simplificando la gestión de negocios modernos desde 2024.</p>
        </div>
        <div class="col-6 col-md-4 text-center">
          <div class="text-subtitle1 font-bold q-mb-sm text-white">Links</div>
          <div class="footer-link">Características</div>
          <div class="footer-link">Soporte</div>
        </div>
        <div class="col-6 col-md-4 text-right">
          <div class="text-subtitle1 font-bold q-mb-sm text-white">Contacto</div>
          <div class="footer-link">info@agendapro.com</div>
          <div class="footer-link">+123 456 789</div>
        </div>
        <div class="col-12 text-center q-mt-xl text-caption opacity-40">
          © 2026 Agenda Pro. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  </q-page>
</template>

<script setup>
// var lorem =
//   'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
var cards = [
  {
    title: 'Agenda Inteligente',
    description: 'Sistema de calendario avanzado que se adapta a las necesidades de tu negocio.',
    icon: 'mdi-calendar-check-outline',
    iconColor: 'bg-primary',
    ticks: [
      'Vista diaria, semanal y mensual',
      'Gestión de múltiples profesionales',
      'Bloqueo de horarios automático',
    ],
  },
  {
    title: 'Recordatorios Automáticos',
    description: 'Envía recordatorios por SMS, email o WhatsApp para reducir ausencias.',
    icon: 'mdi-bell-ring-outline',
    iconColor: 'bg-primary',
    ticks: [
      'Recordatorios personalizables',
      'Múltiples canales de comunicación',
      'Reducción de no-shows hasta 70%',
    ],
  },
  {
    title: 'Gestión de Pagos',
    description: 'Acepta pagos online y presenciales. Integrado con principales plataformas.',
    icon: 'mdi-cash-register',
    iconColor: 'bg-primary',
    ticks: [
      'Pagos con tarjeta y transferencia',
      'Señas y anticipos',
      'Reportes financieros detallados',
    ],
  },
  {
    title: 'Portal de Clientes',
    description: 'Tus clientes pueden reservar turnos 24/7 desde cualquier dispositivo.',
    icon: 'mdi-account-circle-outline',
    iconColor: 'bg-primary',
    ticks: ['Reserva online sin fricción', 'Historial de turnos', 'Gestión de cancelaciones'],
  },
  {
    title: 'Reportes y Análisis',
    description: 'Visualiza métricas clave y toma decisiones informadas para tu negocio.',
    icon: 'mdi-chart-line',
    iconColor: 'bg-primary',
    ticks: ['Dashboard en tiempo real', 'Métricas de ocupación', 'Análisis de ingresos'],
  },
  {
    title: 'App Móvil',
    description: 'Gestiona tu negocio desde cualquier lugar con nuestra app nativa.',
    icon: 'mdi-cellphone',
    iconColor: 'bg-primary',
    ticks: ['iOS y Android', 'Notificaciones push', 'Sincronización en tiempo real'],
  },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');

.rounded-full {
  border-radius: 2000px;
}

.bordered {
  border-width: 1px;
  border-style: solid;
}

/* ---------------------------------------------- */
/* Hero Visual Styles */
/* ---------------------------------------------- */

.hero-visual-container {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-card {
  position: absolute;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  backdrop-filter: blur(8px);
  z-index: 10;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: white; /* Fallback */
  background: rgba(255, 255, 255, 0.9);
}

.card-top {
  top: 80px;
  left: 50%;
  margin-left: -115px; /* 30% offset: more stacked */
}

.card-bottom {
  top: 170px;
  left: 50%;
  margin-left: -65px; /* 30% offset: more stacked */
}

.glow-primary {
  box-shadow: 0 15px 35px rgba(214, 40, 40, 0.2);
  border-left: 4px solid var(--q-primary);
}

.glow-secondary {
  box-shadow: 0 15px 35px rgba(29, 53, 87, 0.2);
  border-left: 4px solid var(--q-secondary);
}

.blur-bubble {
  position: absolute;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0) 70%);
  filter: blur(50px);
  z-index: 1;
}

/* ---------------------------------------------- */
/* New Sections Styles */
/* ---------------------------------------------- */

.step-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.step-number {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--q-primary);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
}

.pricing-card {
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.pricing-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.featured-card {
  border: 2px solid var(--q-primary);
  transform: scale(1.05);
  position: relative;
}

.featured-card:hover {
  transform: scale(1.05) translateY(-10px);
}

.featured-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--q-primary);
  color: white;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.footer-link {
  cursor: pointer;
  margin-bottom: 8px;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--q-primary);
}

.rounded-xl {
  border-radius: 32px;
}

.font-bold {
  font-weight: 700;
}

.opacity-80 {
  opacity: 0.8;
}

/* ---------------------------------------------- */
/* Animations */
/* ---------------------------------------------- */

.float-animation-1 {
  animation: float1 4s ease-in-out infinite;
}

.float-animation-2 {
  animation: float2 5s ease-in-out infinite;
}

@keyframes float1 {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float2 {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* ---------------------------------------------- */
/* Global Refinements */
/* ---------------------------------------------- */

.brand-chip {
  background-color: var(--q-primary);
  color: white;
  opacity: 0.9;
}

.brand-light-bg {
  background-color: #f1faee; 
}

.footer-brand {
  background-color: var(--q-secondary);
}

.footer-breakout {
  width: 100%;
  margin-top: 80px;
  padding-bottom: 40px;
}

.q-page {
  font-family: 'Inter', sans-serif;
  background: radial-gradient(circle at 0% 0%, rgba(214, 40, 40, 0.05) 0%, rgba(255, 255, 255, 1) 50%);
  overflow-x: hidden;
  padding-bottom: 0px;
  display: flex;
  flex-direction: column;
}

.text-overline {
  letter-spacing: 2px;
}

.q-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.rounded-border {
  border-radius: 12px;
}

.q-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.opacity-80 {
  opacity: 0.8;
}

.opacity-40 {
  opacity: 0.4;
}
</style>

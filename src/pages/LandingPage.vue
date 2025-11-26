<template>
  <q-page class="q-px-xl q-pa-xl">
    <!-- ---------------------------------------------- -->
    <!-- Hero Section -->
    <!-- ---------------------------------------------- -->

    <div class="row q-my-xl">
      <div class="col">
        <div class="row">
          <div class="flex items-center bg-blue-1 text-blue-8 rounded-full bordered">
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

      <div class="col gt-sm">
        <div class="q-pa-md bg-white text-dark shadow-2">Contenido con un radio grande.</div>

        <div class="q-mt-md q-pa-sm bg-blue-1">
          <q-icon name="mdi-star-four-points-outline" size="18px" />
          <span class="text-caption text-weight-medium q-ml-sm"> Sistema Moderno de Gestión </span>
        </div>
      </div>
    </div>

    <!-- ---------------------------------------------- -->
    <!-- Characteristics Section -->
    <!-- ---------------------------------------------- -->

    <div class="row">
      <div class="col-12"></div>
      <div class="col-12">
        <div class="row q-col-gutter-xl">
          <div v-for="card in cards" :key="card.title" class="col-12 col-sm-6 col-md-4">
            <q-card class="">
              <q-card-section class="">
                <q-icon
                  class="q-pa-sm q-ml-sm q-mt-sm text-white rouded-border"
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
    iconColor: 'bg-deep-purple',
    ticks: [
      'Vista diaria, semanal y mensual',
      'Gestión de múltiples profesionales',
      'Bloqueo de horarios automático',
    ],
  },
  {
    title: 'Recordatorios Automáticos',
    description: 'Envía recordatorios por SMS, email o WhatsApp para reducir ausencias.',
    icon: 'mdi-calendar-check-outline',
    iconColor: '',
    ticks: [
      'Recordatorios personalizables',
      'Múltiples canales de comunicación',
      'Reducción de no-shows hasta 70%',
    ],
  },
  {
    title: 'Gestión de Pagos',
    description: 'Acepta pagos online y presenciales. Integrado con principales plataformas.',
    icon: 'mdi-calendar-check-outline',
    iconColor: '',
    ticks: [
      'Pagos con tarjeta y transferencia',
      'Señas y anticipos',
      'Reportes financieros detallados',
    ],
  },
  {
    title: 'Portal de Clientes',
    description: 'Tus clientes pueden reservar turnos 24/7 desde cualquier dispositivo.',
    icon: 'mdi-calendar-check-outline',
    iconColor: '',
    ticks: ['Reserva online sin fricción', 'Historial de turnos', 'Gestión de cancelaciones'],
  },
  {
    title: 'Reportes y Análisis',
    description: 'Visualiza métricas clave y toma decisiones informadas para tu negocio.',
    icon: 'mdi-calendar-check-outline',
    iconColor: '',
    ticks: ['Dashboard en tiempo real', 'Métricas de ocupación', 'Análisis de ingresos'],
  },
  {
    title: 'App Móvil',
    description: 'Gestiona tu negocio desde cualquier lugar con nuestra app nativa.',
    icon: 'mdi-calendar-check-outline',
    iconColor: '',
    ticks: ['iOS y Android', 'Notificaciones push', 'Sincronización en tiempo real'],
  },
]
</script>

<style scoped>
.rounded-full {
  border-radius: 2000px;
}

.bordered {
  border-width: 1px;
  border-style: solid;
}
</style>

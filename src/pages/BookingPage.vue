<template>
  <q-page class="q-pa-md flex flex-center bg-grey-1">
    <q-card class="booking-card shadow-10" style="width: 100%; max-width: 500px; border-radius: 20px;">
      <q-card-section class="bg-primary text-white q-pa-lg">
        <div class="text-h5 text-weight-bold">{{ branchInfo?.name || 'Agendar Turno' }}</div>
        <div class="text-subtitle2 opacity-80">{{ branchInfo?.address || 'Seleccioná el servicio y horario que prefieras' }}</div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <q-stepper
          v-model="step"
          vertical
          color="primary"
          animated
          flat
        >
          <!-- PASO 1: SERVICIO -->
          <q-step
            :name="1"
            title="Seleccionar Servicio"
            icon="settings"
            :done="step > 1"
          >
            <q-select
              v-model="booking.service"
              :options="services"
              label="Servicio"
              option-label="name"
              filled
              @update:model-value="onServiceSelected"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    No hay servicios disponibles en esta sucursal
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-stepper-navigation>
              <q-btn @click="step = 2" color="primary" label="Continuar" :disable="!booking.service" />
            </q-stepper-navigation>
          </q-step>

          <!-- PASO 2: FECHA -->
          <q-step
            :name="2"
            title="Elegir Fecha"
            icon="calendar_today"
            :done="step > 2"
          >
            <div class="flex justify-center">
              <q-date
                v-model="booking.date"
                minimal
                flat
                color="primary"
                mask="YYYY-MM-DD"
                @update:model-value="onDateSelected"
              />
            </div>
            <q-stepper-navigation>
              <q-btn flat @click="step = 1" color="primary" label="Atrás" class="q-ml-sm" />
              <q-btn @click="step = 3" color="primary" label="Ver Horarios" :disable="!booking.date" :loading="loadingSlots" />
            </q-stepper-navigation>
          </q-step>

          <!-- PASO 3: HORARIOS -->
          <q-step
            :name="3"
            title="Elegir Horario"
            icon="access_time"
          >
            <div v-if="availableSlots.length > 0" class="row q-col-gutter-sm">
              <div v-for="slot in availableSlots" :key="slot" class="col-4">
                <q-btn
                  :label="slot"
                  :color="booking.time === slot ? 'primary' : 'grey-2'"
                  :text-color="booking.time === slot ? 'white' : 'black'"
                  flat
                  bordered
                  class="full-width"
                  @click="booking.time = slot"
                />
              </div>
            </div>
            <div v-else class="text-center q-pa-md text-grey-7">
              <q-icon name="event_busy" size="md" />
              <p>No hay turnos disponibles para este día.</p>
            </div>

            <q-stepper-navigation>
              <q-btn flat @click="step = 2" color="primary" label="Atrás" class="q-ml-sm" />
              <q-btn @click="confirmBooking" color="positive" label="Confirmar Turno" :disable="!booking.time" :loading="bookingStore.loading" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>

    <!-- DIALOGO DE CONFIRMACIÓN -->
    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="border-radius: 15px; min-width: 300px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Resumen del Turno</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <q-list bordered separator padding class="rounded-borders">
            <q-item>
              <q-item-section avatar><q-icon name="content_cut" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Servicio</q-item-label>
                <q-item-label class="text-weight-bold">{{ booking.service?.name }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="event" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Fecha y Hora</q-item-label>
                <q-item-label class="text-weight-bold">{{ booking.date }} - {{ booking.time }} hs</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <p class="text-subtitle2 text-grey-8">Ingresá tus datos para finalizar la reserva:</p>
          <div class="row q-col-gutter-sm">
            <div class="col-6"><q-input v-model="client.name" label="Nombre" dense filled /></div>
            <div class="col-6"><q-input v-model="client.surname" label="Apellido" dense filled /></div>
            <div class="col-6"><q-input v-model="client.mail" label="Email" dense filled type="email" /></div>
            <div class="col-6"><q-input v-model="client.phone" label="Teléfono" dense filled type="tel" /></div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn label="Reservar Ahora" color="primary" @click="doBooking" :disable="!client.name || !client.mail" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useAppointmentStore } from 'src/stores/appointment'

const route = useRoute()
const router = useRouter()
const bookingStore = useAppointmentStore()

const step = ref(1)
const slug = route.params.slug
const branchInfo = ref(null)
const services = ref([])
const loadingSlots = ref(false)
const confirmDialog = ref(false)
const client = ref({
  name: '',
  surname: '',
  mail: '',
  phone: ''
})

const booking = ref({
  service: null,
  date: new Date().toISOString().split('T')[0],
  time: null
})

const availableSlots = computed(() => bookingStore.availableSlots)

onMounted(async () => {
  await fetchBranchInfo()
})

async function fetchBranchInfo() {
  try {
    const response = await api.get(`/branches/by-slug/${slug}`)
    branchInfo.value = response.data
    // Una vez que tenemos la sucursal, cargamos sus servicios
    fetchServices(branchInfo.value.id_branch)
  } catch (error) {
    console.error('Error fetching branch info:', error)
    // Redirigir a 404 o mostrar error
  }
}

async function fetchServices() {
  try {
    const response = await api.get(`/services/`) // TODO: Filtrar por sucursal en el backend
    services.value = response.data
  } catch (error) {
    console.error('Error fetching services:', error)
  }
}

async function onDateSelected() {
  if (booking.value.service && booking.value.date && branchInfo.value) {
    await bookingStore.fetchAvailableSlots(booking.value.service.id_service, booking.value.date, branchInfo.value.id_branch)
  }
}

async function onServiceSelected() {
  if (booking.value.date && branchInfo.value) {
    await bookingStore.fetchAvailableSlots(booking.value.service.id_service, booking.value.date, branchInfo.value.id_branch)
  }
}

function confirmBooking() {
  confirmDialog.value = true
}

async function doBooking() {
  if (!branchInfo.value) return

  const data = {
    client_data: {
      name: client.value.name,
      surename: client.value.surname,
      mail: client.value.mail,
      phone: client.value.phone
    },
    id_service: booking.value.service.id_service,
    id_branch: branchInfo.value.id_branch,
    time_start: `${booking.value.date} ${booking.value.time}:00`
  }
  
  const result = await bookingStore.createAppointment(data)
  if (result) {
    confirmDialog.value = false
    router.push('/') // Redirigir a la landing o página de éxito
  }
}
</script>

<style scoped>
.booking-card {
  transition: transform 0.3s ease;
}
.opacity-80 {
  opacity: 0.8;
}
</style>

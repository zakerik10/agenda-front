<!-- <template>
  <q-card class="">
    <div class="row" v-for="(row, hourIndex) in column_hours" :key="hourIndex">
      <div class="col" v-for="(column, dayIndex) in weekDays" :key="dayIndex">
        <div v-if="hourIndex === 0">
          {{ column }}
        </div>

        <div v-else-if="column == 0">
          {{ row }}
        </div>

        <div v-else>Dato</div>
      </div>
    </div>
  </q-card>
</template> -->

<template>
  <q-card class="q-ma-xl shadow-4">
    <q-card-section>
      <div class="text-h5 text-weight-bold">Turnos de la semana</div>
    </q-card-section>
    <q-card-section>
      <div
        class="row"
        v-for="i in column_hours.length + 1"
        :key="i"
        :class="{ 'bg-grey-3': i === 1 }"
      >
        <div
          class="col-1 text-center"
          style="border-right: 1px solid #cccc; border-left: 1px solid #cccc"
        >
          <div v-if="i === 1" class="q-py-sm text-weight-bold">Hora</div>

          <div v-else class="q-px-sm text-grey-7">
            {{ column_hours[i - 2] }}
          </div>
        </div>

        <div
          class="col text-center"
          v-for="(day, j) in weekDays"
          :key="j"
          style="border-right: 1px solid #cccc"
        >
          <div v-if="i === 1" class="text-weight-bold q-py-sm">
            {{ day }}
          </div>

          <div v-else class="">Dato</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'

// =========================================================
// VARIABLES DE CONFIGURACIÓN
// =========================================================
// const startOfWeek = ref(new Date('2025-12-01')) // Lunes 1 de Diciembre de 2025
// const intervalMinutes = ref(5) // Granularidad: 10 minutos por fila
// const startHour = 8 // Inicio a las 8:00
// const endHour = 20 // Fin a las 20:00

// Datos de prueba (Reemplazar con la llamada a la API)
// const rawAppointments = ref([
//   {
//     id: 1,
//     timeStart: new Date('2025-12-01T14:00:00'), // Lunes a las 14:00
//     duration: 30,
//     clientName: 'Juan Pérez',
//     color: 'bg-red-6',
//   },
//   {
//     id: 2,
//     timeStart: new Date('2025-12-03T09:30:00'), // Miércoles a las 9:30
//     duration: 60,
//     clientName: 'María Gómez',
//     color: 'bg-teal-7',
//   },
// ])

// const columnOfHours = () => {
//   const slots = []
//   for (let h = startHour; h <= endHour; h++) {
//     for (let m = 0; m < 60; m += intervalMinutes.value) {
//       const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
//       slots.push(time)
//     }
//   }
//   return slots
// }

const startHourStr = '08:00'
const endHourStr = '20:30'
const intervalMinutes = ref(30)
const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Vernes', 'Sábado', 'Domingo']

// Convierte la hora en string a hora de date
const createDateFromHHMM = (hhmm) => {
  if (!hhmm || typeof hhmm !== 'string' || !hhmm.includes(':')) {
    return new Date(0)
  }

  const [h, m] = hhmm.split(':').map(Number)
  const date = new Date()
  date.setHours(h, m, 0, 0)
  return date
}

const columnOfHours = () => {
  const slots = []

  let current = createDateFromHHMM(startHourStr)
  const end = createDateFromHHMM(endHourStr)

  const adjustedEnd = new Date(end)
  console.log('adjustedEnd 1 ' + adjustedEnd)
  adjustedEnd.setMinutes(adjustedEnd.getMinutes() + intervalMinutes.value)

  console.log('adjustedEnd 2 ' + adjustedEnd)

  while (current.getTime() < adjustedEnd.getTime()) {
    const h = String(current.getHours()).padStart(2, '0')
    const m = String(current.getMinutes()).padStart(2, '450')

    slots.push(`${h}:${m}`)

    current.setMinutes(current.getMinutes() + intervalMinutes.value)
  }

  return slots
}

function obtenerSemana(date) {
  let fecha = new Date(date.getTime())
  let dia = fecha.getDay()

  if (dia === 0) {
    fecha.setDate(fecha.getDate() + 1)
  } else {
    fecha.setDate(fecha.getDate() - (dia - 1))
  }

  let semana = []
  for (let i = 0; i < 7; i++) {
    let diaActual = new Date(fecha.getTime())
    diaActual.setDate(fecha.getDate() + i)
    semana.push(diaActual)
  }

  return semana
}
let dia = new Date('12/2/2025')
console.log('semana del dia ' + dia + ': ' + obtenerSemana(dia))
const column_hours = computed(columnOfHours)
console.log(column_hours)
</script>

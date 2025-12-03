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
          class="col text-center flex flex-center"
          v-for="(day, j) in weekDaysWithAppointment"
          :key="j"
          style="border-right: 1px solid #cccc"
        >
          <div v-if="i === 1" class="text-weight-bold q-py-sm">
            {{ day.dayStr }}
          </div>

          <div v-else class="full-width full-height">
            <div v-for="data in day.data" :key="data" class="full-width full-height">
              <div
                v-if="data.hoursOccupieds.includes(column_hours[i - 2])"
                class="full-width full-height"
              >
                <div
                  :class="data.color"
                  class="full-width full-height"
                  style="margin-top: -1px; margin-bottom: -1px"
                ></div>
              </div>
            </div>
          </div>
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
const rawAppointments = ref([
  {
    id: 1,
    timeStart: new Date('2025-12-01T14:00:00'), // Lunes a las 14:00
    duration: 30,
    clientName: 'Juan Pérez',
    color: 'bg-red-6',
    hoursOccupieds: [],
  },
  {
    id: 2,
    timeStart: new Date('2025-12-03T09:30:00'), // Miércoles a las 9:30
    duration: 60,
    clientName: 'María Gómez',
    color: 'bg-teal-7',
    hoursOccupieds: [],
  },
])

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
const intervalMinutes = ref(10)

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

// function HHMMToDate(date) {
//   const hours = date.getHours()
//   const minutes = date.getMinutes()

//   const formattedHours = String(hours).padStart(2, '0')
//   const formattedMinutes = String(minutes).padStart(2, '0')

//   return `${formattedHours}:${formattedMinutes}`
// }

const columnOfHours = () => {
  const slots = []

  let current = createDateFromHHMM(startHourStr)
  const end = createDateFromHHMM(endHourStr)

  const adjustedEnd = new Date(end)
  adjustedEnd.setMinutes(adjustedEnd.getMinutes() + intervalMinutes.value)

  while (current.getTime() < adjustedEnd.getTime()) {
    const h = String(current.getHours()).padStart(2, '0')
    const m = String(current.getMinutes()).padStart(2, '0')

    slots.push(`${h}:${m}`)

    current.setMinutes(current.getMinutes() + intervalMinutes.value)
  }

  return slots
}

function obtenerSemana(dateStr) {
  let date = new Date(dateStr.getTime())
  let day = date.getDay()

  if (day === 0) {
    date.setDate(date.getDate() + 1)
  } else {
    date.setDate(date.getDate() - (dia - 1))
  }

  let week = []
  for (let i = 0; i < 7; i++) {
    let currentDay = new Date(date.getTime())
    currentDay.setDate(date.getDate() + i)
    week.push(currentDay)
  }

  return week
}

// Devuelve una lista ordenada de objetos, donde cada objeto tiene su dia, y una lista data que contiene todos los turnos que sean de ese día
let orderWithDays = () => {
  let weekDaysWithAppointment = [
    {
      dayStr: 'Lunes',
      data: [],
    },
    {
      dayStr: 'Martes',
      data: [],
    },
    {
      dayStr: 'Miércoles',
      data: [],
    },
    {
      dayStr: 'Jueves',
      data: [],
    },
    {
      dayStr: 'Viernes',
      data: [],
    },
    {
      dayStr: 'Sabado',
      data: [],
    },
    {
      dayStr: 'Domingo',
      data: [],
    },
  ]
  console.log('RAW APPOINT ' + rawAppointments.value)
  for (let raw of rawAppointments.value) {
    console.log('Que poronga es?: ' + raw)
    console.log('raw timestart: ' + raw.timeStart)
    console.log('raw timestart getDay: ' + raw.timeStart.getDay())
    let rawDay = raw.timeStart.getDay()
    let day = -1
    if (rawDay == 0) {
      day = 6
    } else {
      day = rawDay - 1
    }
    console.log('day: ' + day)
    weekDaysWithAppointment[day].data.push(raw)
    console.log('pusheado: ' + weekDaysWithAppointment[day].data)
    for (let data of weekDaysWithAppointment[day].data) {
      data.hoursOccupieds = hoursOccupiedInTable(raw.timeStart, raw.duration)
    }
    console.log(weekDaysWithAppointment[day].data[0])
  }
  console.log('a----------------------------------------------------------------------')
  console.log('Martes antes return: ' + weekDaysWithAppointment[0].dayStr)
  console.log('Martes antes return: ' + weekDaysWithAppointment[0].data[0])
  console.log('-----------------------------------------------------------------------')
  return weekDaysWithAppointment
}

function hoursOccupiedInTable(timeStart, duration) {
  let hoursOccupieds = []
  let current = timeStart
  let cellsOccupiedInTable = Math.ceil(duration / intervalMinutes.value)

  for (let i = 0; i < cellsOccupiedInTable; i++) {
    const h = String(current.getHours()).padStart(2, '0')
    const m = String(current.getMinutes()).padStart(2, '0')

    hoursOccupieds.push(`${h}:${m}`)

    current.setMinutes(current.getMinutes() + intervalMinutes.value)
  }
  console.log('HOURS OCCUPIEDS: ' + hoursOccupieds)
  return hoursOccupieds
}

let dia = new Date('12/2/2025')
console.log('semana del dia ' + dia + ': ' + obtenerSemana(dia))
let column_hours = computed(columnOfHours)
let weekDaysWithAppointment = computed(orderWithDays)
console.log('column_hours: ' + column_hours.value)
console.log('weekDaysWithAppointment: ' + weekDaysWithAppointment.value)
</script>

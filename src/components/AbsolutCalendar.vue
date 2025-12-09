<template>
  <q-card class="q-ma-xl shadow-4 calendar-container calendar-card">
    <q-card-section>
      <div class="text-h5 text-weight-bold">Turnos de la semana {{ monthContext }}</div>
    </q-card-section>

    <q-card-section class="q-pa-none agenda-body-scroll-container scroll-content">
      <div
        class="agenda-body"
        :style="{ '--agenda-height': `calc(${agendaBodyHeight}px + ${ROW_HEIGHT}px)` }"
      >
        <div class="calendar-grid header-row bg-grey-3">
          <div class="text-center grid-cell grid-cell-hour header-hour">
            <div class="text-weight-bold">Hora</div>
          </div>

          <div class="text-center grid-cell" v-for="(day, j) in weekDaysWithAppointment" :key="j">
            <div class="text-weight-bold">{{ day.dayStr }} {{ day.dateNum }}</div>
          </div>
        </div>

        <div class="calendar-grid hour-row" v-for="(hour, i) in column_hours" :key="i">
          <div class="text-center grid-cell grid-cell-hour">
            <div class="text-grey-7">{{ hour }}</div>
          </div>

          <div class="grid-cell" v-for="(day, j) in weekDaysWithAppointment" :key="j"></div>
        </div>

        <div class="absolute-appointments-layer">
          <div class="days-area-layer">
            <div class="day-column-layer" v-for="(day, j) in weekDaysWithAppointment" :key="j">
              <div
                v-for="data in day.data"
                :key="data.id"
                :class="[data.color, 'appointment-bar']"
                :style="calculateAppointmentStyle(data.timeStart, data.duration)"
              >
                <div class="appointment-content q-pa-xs">
                  {{ data.clientName }}
                </div>
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
// DATOS Y CONFIGURACIÓN
// =========================================================

const BASE_DATE_STRING = '2025-12-01'
const TODAY = new Date('2025-12-03T00:00:00')
const WEEK_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const startHourStr = '08:00'
const endHourStr = '20:30'
const intervalMinutes = ref(60) // <-- Intervalo dinámico
const ROW_HEIGHT = 40
const TOTAL_MINUTES_IN_AGENDA = 750 // 20:30 - 08:00 = 750 min

const PIXELS_PER_MINUTE = computed(() => {
  return ROW_HEIGHT / intervalMinutes.value
})

// CLAVE: Cálculo de la altura total del contenido de scroll en píxeles.
const agendaBodyHeight = computed(() => {
  const totalSlots = TOTAL_MINUTES_IN_AGENDA / intervalMinutes.value
  const totalHeight = totalSlots * ROW_HEIGHT
  // Retornamos la altura del contenido de la grilla (sin la cabecera de hora)
  return Math.max(totalHeight, ROW_HEIGHT)
})

// Datos de prueba (sin cambios)
const rawAppointments = ref([
  {
    id: 1,
    timeStart: new Date(`${BASE_DATE_STRING} 08:00:00`),
    duration: 60,
    clientName: 'Juan Pérez (Lunes 08:00)',
    color: 'bg-red-6',
  },
  {
    id: 2,
    timeStart: new Date('2025-12-03 09:30:00'),
    duration: 90,
    clientName: 'María Gómez (Miércoles 09:30)',
    color: 'bg-teal-7',
  },
  {
    id: 3,
    timeStart: new Date('2025-12-07 16:00:00'),
    duration: 30,
    clientName: 'Nuevo Cliente (Domingo 16:00)',
    color: 'bg-blue-grey-6',
  },
])

// =========================================================
// LÓGICA DE TIEMPO Y CÁLCULOS
// =========================================================

const getStartOfWeek = (date) => {
  const day = date.getDay()
  const diff = day === 0 ? 6 : day - 1
  const monday = new Date(date)
  monday.setDate(date.getDate() - diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

const createDateFromHHMM = (hhmm) => {
  if (!hhmm || typeof hhmm !== 'string' || !hhmm.includes(':')) {
    return new Date(`${BASE_DATE_STRING} 00:00:00`)
  }
  return new Date(`${BASE_DATE_STRING} ${hhmm}:00`)
}

const columnOfHours = () => {
  const slots = []
  let current = createDateFromHHMM(startHourStr)
  const end = createDateFromHHMM(endHourStr)

  while (current.getTime() < end.getTime()) {
    const h = String(current.getHours()).padStart(2, '0')
    const m = String(current.getMinutes()).padStart(2, '0')
    slots.push(`${h}:${m}`)
    current.setMinutes(current.getMinutes() + intervalMinutes.value)
  }
  return slots
}

const orderWithDays = () => {
  const startOfWeek = getStartOfWeek(TODAY)
  let weekDaysData = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)

    weekDaysData.push({
      dayStr: WEEK_DAYS[i],
      dateNum: date.getDate(),
      fullDate: date,
      data: [],
    })
  }

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)

  for (let raw of rawAppointments.value) {
    const appointmentDate = raw.timeStart

    if (appointmentDate >= startOfWeek && appointmentDate < endOfWeek) {
      const dayIndex = appointmentDate.getDay() === 0 ? 6 : appointmentDate.getDay() - 1
      weekDaysData[dayIndex].data.push(raw)
    }
  }

  return weekDaysData
}

const column_hours = computed(columnOfHours)
const weekDaysWithAppointment = computed(orderWithDays)

const monthContext = computed(() => {
  const dates = weekDaysWithAppointment.value
  if (dates.length === 0) return ''

  const startMonth = dates[0].fullDate.toLocaleString('es-ES', { month: 'long' })
  const endMonth = dates[dates.length - 1].fullDate.toLocaleString('es-ES', { month: 'long' })

  const capStartMonth = startMonth.charAt(0).toUpperCase() + startMonth.slice(1)
  const capEndMonth = endMonth.charAt(0).toUpperCase() + endMonth.slice(1)

  if (startMonth === endMonth) {
    return `(${capStartMonth})`
  }
  return `(${capStartMonth} - ${capEndMonth})`
})

/**
 * Calcula el estilo CSS (top y height) para posicionar el turno de forma absoluta en PIXELES.
 */
const calculateAppointmentStyle = (timeStart, duration) => {
  const startTable = new Date(timeStart)
  startTable.setHours(8, 0, 0, 0)

  const diffMinutes = (timeStart.getTime() - startTable.getTime()) / (1000 * 60)

  let topPixels = diffMinutes * PIXELS_PER_MINUTE.value
  const heightPixels = duration * PIXELS_PER_MINUTE.value

  topPixels = topPixels - 1

  return {
    top: `${topPixels}px`,
    height: `${heightPixels}px`,
    zIndex: 10,
  }
}
</script>

<style lang="scss" scoped>
/* =========================================================
   VARIABLES Y ESTRUCTURA GENERAL
   ========================================================= */

$col-hora-ancho: 80px;
$num-dias: 7;
$row-height: 40px;

.calendar-container {
  max-width: 1200px;
  overflow: visible;
}

/* CLAVE A: Fija el alto total del componente (ej. 50vh) y usa flexbox */
.calendar-card {
  height: 50vh; // <-- Altura fija del componente (ajustar aquí si es necesario)
  display: flex;
  flex-direction: column;
}

.q-card-section:first-child {
  flex-shrink: 0; // La cabecera (título) mantiene su alto fijo
}

/* CLAVE B: El contenedor de scroll ocupa todo el espacio restante */
.scroll-content {
  flex: 1 1 auto; // Crece para tomar el espacio restante verticalmente
  min-height: 0; // Necesario para que flexbox maneje correctamente el overflow
}

/* Contenedor que limita la altura y aplica scroll vertical */
.agenda-body-scroll-container {
  overflow-y: scroll;
  overflow-x: scroll;
  min-height: calc($row-height * 2);
}

.agenda-body {
  position: relative;
  /* CLAVE: Usamos la variable CSS --agenda-height (calculada dinámicamente en Vue) */
  height: var(--agenda-height);
}

/* =========================================================
   CSS GRID (LA CUADRÍCULA BASE)
   ========================================================= */

.calendar-grid {
  display: grid;
  grid-template-columns: $col-hora-ancho repeat($num-dias, 1fr);
  width: 100%;
  border-left: 1px solid #cccc; /* AÑADIDO: El borde izquierdo ahora lo tiene el contenedor de la grilla */
}

.grid-cell {
  border-right: 1px solid #cccc;
  border-bottom: 1px solid #f0f0f0;
  min-height: $row-height;
  box-sizing: border-box;
  position: relative;
  padding: 0;
}

.hour-row {
  height: $row-height;
}

.header-row .grid-cell > div {
  height: $row-height;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
.hour-row .grid-cell > div {
  height: $row-height;
  display: flex;
  align-items: center;
  justify-content: center;
}

// .grid-cell-hour {
//   border-left: 1px solid #cccc;
// }

.header-row .grid-cell {
  border-bottom: 1px solid #cccc;
  /* Esto hace que la cabecera tenga 100% de ancho + el espacio que ocupa el scroll */
  // padding-right: 17px; /* 17px es un ancho estándar de scrollbar en muchos navegadores */

  /* Para evitar que el padding rompa el tamaño del contenedor, usamos box-sizing */
  box-sizing: content-box;

  /* Aseguramos que la cabecera no se encoja verticalmente */
  flex-shrink: 0;
}

/* =========================================================
   CAPA DE TURNOS ABSOLUTOS (Alineación Perfecta)
   ========================================================= */

.absolute-appointments-layer {
  position: absolute;
  pointer-events: none;

  top: calc($row-height + 1px);

  /* CLAVE: Usamos la variable CSS para la altura, menos el alto de la cabecera */
  height: calc(var(--agenda-height) - $row-height);

  // left: $col-hora-ancho;
  // width: calc(100% - $col-hora-ancho);

  left: 0; /* Asegura que comienza al borde izquierdo */
  width: 100%; /* Cubre todo el ancho del contenedor .agenda-body */

  /* AÑADIR: La capa de citas ahora usa la misma plantilla de columnas */
  display: grid;
  grid-template-columns: $col-hora-ancho repeat($num-dias, 1fr);
  z-index: 10;
}

// .days-area-layer {
//   display: grid;
//   grid-template-columns: repeat($num-dias, 1fr);
//   width: 100%;
//   height: 100%;
// }

.days-area-layer {
  /* Ocupa las 7 columnas de los días, dejando la primera columna (la de hora) vacía */
  grid-column: 2 / span $num-dias;
  height: 100%;
  position: relative; /* Es importante para que los .appointment-bar se posicionen dentro */

  /* Y aquí dentro, usamos la misma definición de grid que antes, para posicionar los días */
  display: grid;
  grid-template-columns: repeat($num-dias, 1fr);
}

.day-column-layer {
  position: relative;
  height: 100%;
  pointer-events: auto;

  box-sizing: border-box;
}

.appointment-bar {
  position: absolute;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  overflow: hidden;
  cursor: pointer;
  box-sizing: border-box;

  margin-left: 0;
  width: 100%;
}

.appointment-content {
  font-size: 0.85em;
  color: white;
  text-align: left;
  line-height: 1.2;
}
</style>

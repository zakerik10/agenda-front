<template>
  <div class="calendar-wrapper q-pa-md">
    <FullCalendar ref="fullCalendarRef" :options="calendarOptions" class="full-height-calendar" />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import esLocale from '@fullcalendar/core/locales/es'
import { useCalendarStore } from 'stores/calendar'
import { api } from 'boot/axios'

const calendarStore = useCalendarStore()
const fullCalendarRef = ref(null)
const $q = useQuasar()

// Caché en memoria para evitar peticiones repetidas en la misma sesión
const eventsCache = new Map()

// Re-defining MOCK_EVENTS to ensure validity in replacement
const MOCK_EVENTS = [
  {
    id: 'mock-1',
    title: 'Corte de Pelo - Juan Perez (Mock)',
    start: new Date().setHours(10, 0, 0),
    end: new Date().setHours(11, 0, 0),
    color: '#1976D2',
  },
  {
    id: 'mock-2',
    title: 'Tinte - Maria Garcia (Mock)',
    start: new Date().setHours(14, 0, 0),
    end: new Date().setHours(16, 30, 0),
    color: '#9C27B0',
  },
  {
    id: 'mock-3',
    title: 'Manicura (Mock)',
    start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(9, 0, 0),
    end: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10, 0, 0),
    color: '#E91E63',
  },
  {
    id: 'mock-4',
    title: 'Feriado / Cerrado',
    start: new Date().toISOString().split('T')[0],
    allDay: true,
    color: '#FF9800',
    display: 'background',
  },
]

// Computed para ajustar configuración según pantalla
const calendarOptions = computed(() => {
  const isMobile = $q.screen.lt.md

  return {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: isMobile ? 'timeGridDay' : 'timeGridWeek',
    locale: esLocale,
    headerToolbar: isMobile
      ? {
          left: 'prev,next',
          center: 'title',
          right: 'timeGridDay,listWeek',
        }
      : {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        },
    slotMinTime: '08:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    height: '100%',

    // --- LÓGICA DE CARGA ---
    // En lugar de un array, pasamos la función que FullCalendar invocará
    // cada vez que cambie el rango de fechas visible.
    events: fetchEvents,

    // Event Handlers
    select: handleDateSelect,
    eventClick: handleEventClick,
    windowResize: () => {},
  }
})

async function fetchEvents(fetchInfo, successCallback, failureCallback) {
  const startStr = fetchInfo.startStr.split('T')[0]
  const endStr = fetchInfo.endStr.split('T')[0]
  const cacheKey = `${startStr}_${endStr}`

  // 1. Verificar Caché REAL
  if (eventsCache.has(cacheKey)) {
    console.log(`[Cache Hit] Rango ${cacheKey} recuperado de memoria. Sin petición al Backend.`)
    const cachedEvents = eventsCache.get(cacheKey)
    successCallback(cachedEvents)
    return // ¡Detenemos la ejecución aquí!
  }

  console.log(`[Cache Miss] Solicitando eventos para rango: ${startStr} a ${endStr}`)

  try {
    const params = { start: startStr, end: endStr }
    console.log('GET /appointments', params)
    const response = await api.get('/appointments', { params })

    // Guardar en caché antes de devolver
    const events = response.data
    eventsCache.set(cacheKey, events)

    successCallback(events)
  } catch (error) {
    console.warn('Backend falló. Usando Mock Data y guardando en caché temporal.', error)

    // Para cumplir tu requisito de "no volver a pedir", guardamos también el Mock en caché
    // Así la próxima vez que visites este mes, devolverá el Mock directamente sin intentar GET.
    eventsCache.set(cacheKey, MOCK_EVENTS)
    successCallback(MOCK_EVENTS)

    if (failureCallback) failureCallback(error)
  }
}

// Sincronización: Cuando cambiamos fecha en el Drawer (Store), movemos el calendario
watch(
  () => calendarStore.selectedDate,
  (newDate) => {
    if (newDate && fullCalendarRef.value) {
      console.log('Moviendo calendario a:', newDate)
      fullCalendarRef.value.getApi().gotoDate(newDate)
    }
  },
)

function handleDateSelect(selectInfo) {
  let title = prompt('Nuevo Turno (Simulación): Ingrese nombre cliente')
  let calendarApi = selectInfo.view.calendar
  calendarApi.unselect()

  if (title) {
    // TODO: POST /appointments a Flask
    calendarApi.addEvent({
      id: createEventId(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    })
    console.log('Simulación: POST enviado a Flask')
  }
}

function handleEventClick(clickInfo) {
  if (
    confirm(
      `¿Eliminar turno de '${clickInfo.event.title}'? (Simula DELETE /appointments/${clickInfo.event.id})`,
    )
  ) {
    // TODO: DELETE /appointments/id a Flask
    clickInfo.event.remove()
  }
}

let eventGuid = 0
function createEventId() {
  return String(eventGuid++)
}
</script>

<style scoped>
.calendar-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  height: 85vh;
  display: flex;
  flex-direction: column;
}

:deep(.fc) {
  flex-grow: 1;
  font-family: 'Roboto', sans-serif;
}

/* Ajustes Responsive para la Toolbar */
:deep(.fc-toolbar) {
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.fc-toolbar-title) {
  font-size: 1.2rem !important;
}

@media (max-width: 600px) {
  :deep(.fc-toolbar-title) {
    font-size: 1rem !important;
    width: 100%;
    text-align: center;
    order: -1; /* Mover título arriba del todo en móviles */
  }

  :deep(.fc-button) {
    font-size: 0.8rem !important;
    padding: 4px 8px !important;
  }
}
</style>

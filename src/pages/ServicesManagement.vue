<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center q-mb-lg">
      <q-icon name="mdi-hammer-wrench" size="32px" color="primary" class="q-mr-sm" />
      <div>
        <h1 class="text-h4 text-bold text-secondary q-my-none">Gestión de Servicios</h1>
        <p class="text-subtitle2 text-grey-6 q-mb-none">Definí los servicios que ofrecés en tu negocio</p>
      </div>
      <q-space />
      <q-btn
        unelevated
        color="primary"
        label="Nuevo Servicio"
        icon="add"
        rounded
        class="q-px-md shadow-2"
        @click="openDialog()"
      />
    </div>

    <!-- Tabla de Servicios -->
    <q-card class="glass-effect rounded-xl shadow-2 overflow-hidden">
      <q-table
        :rows="serviceStore.services"
        :columns="columns"
        row-key="id_service"
        :loading="serviceStore.loading"
        flat
        class="bg-transparent"
      >
        <template v-slot:body-cell-price="props">
          <q-td :props="props">
            <span class="text-weight-bold text-secondary">${{ props.value }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-duration="props">
          <q-td :props="props">
            <q-chip outline color="primary" text-color="primary" icon="mdi-clock-outline" size="sm">
              {{ props.value }} min
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn flat round color="grey-7" icon="edit" size="sm" @click="openDialog(props.row)">
              <q-tooltip>Editar servicio</q-tooltip>
            </q-btn>
            <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(props.row)">
              <q-tooltip>Eliminar servicio</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width column flex-center q-py-xl text-grey-6">
            <q-icon name="mdi-playlist-remove" size="64px" color="grey-4" />
            <p class="text-h6 q-mt-md">Aún no tenés servicios registrados</p>
            <q-btn outline color="primary" label="Crear mi primer servicio" icon="add" rounded @click="openDialog()" />
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Diálogo de Creación/Edición -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="width: 100%; max-width: 500px; border-radius: 20px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-bold text-secondary">
            {{ isEditing ? 'Editar Servicio' : 'Nuevo Servicio' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveService" class="q-gutter-md">
            <q-input
              filled
              v-model="form.name"
              label="Nombre del Servicio *"
              hint="Ej: Corte de Pelo, Manicuría, Consulta Médica..."
              lazy-rules
              :rules="[val => !!val || 'El nombre es requerido']"
            />

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model.number="form.duration"
                  type="number"
                  label="Duración (min) *"
                  suffix="min"
                  :rules="[val => val > 0 || 'Debe ser mayor a 0']"
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-clock-outline" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  filled
                  v-model.number="form.price"
                  type="number"
                  label="Precio *"
                  prefix="$"
                  :rules="[val => val >= 0 || 'El precio no puede ser negativo']"
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-cash" />
                  </template>
                </q-input>
              </div>
            </div>

            <q-input
              filled
              v-model="form.description"
              type="textarea"
              label="Descripción (Opcional)"
              rows="3"
            />

            <div class="row justify-end q-mt-lg">
              <q-btn label="Cancelar" flat color="grey-7" v-close-popup class="q-mr-sm" />
              <q-btn
                :label="isEditing ? 'Guardar Cambios' : 'Crear Servicio'"
                type="submit"
                color="primary"
                rounded
                unelevated
                class="q-px-lg"
                :loading="serviceStore.loading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Confirmación de Eliminación -->
    <q-dialog v-model="deleteDialogOpen">
      <q-card style="border-radius: 15px;">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm text-h6">¿Eliminar servicio?</span>
        </q-card-section>

        <q-card-section class="q-pt-none">
          ¿Estás seguro de que querés eliminar <strong>{{ serviceToDelete?.name }}</strong>? Esta acción no se puede deshacer.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn flat label="Eliminar" color="negative" @click="doDelete" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useServiceStore } from 'stores/service'
//import { useQuasar } from 'quasar'

//const $q = useQuasar()
const serviceStore = useServiceStore()

const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const isEditing = ref(false)
const serviceToDelete = ref(null)

const form = ref({
  id_service: null,
  name: '',
  duration: 30,
  price: 0,
  description: ''
})

const columns = [
  { name: 'name', label: 'Servicio', field: 'name', align: 'left', sortable: true },
  { name: 'duration', label: 'Duración', field: 'duration', align: 'center', sortable: true },
  { name: 'price', label: 'Precio', field: 'price', align: 'center', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'right' }
]

onMounted(async () => {
  await serviceStore.fetchServices()
})

function openDialog(service = null) {
  if (service) {
    isEditing.value = true
    form.value = { ...service }
  } else {
    isEditing.value = false
    form.value = {
      id_service: null,
      name: '',
      duration: 30,
      price: 0,
      description: ''
    }
  }
  dialogOpen.value = true
}

async function saveService() {
  let success = false
  if (isEditing.value) {
    success = await serviceStore.updateService(form.value.id_service, form.value)
  } else {
    success = await serviceStore.createService(form.value)
  }

  if (success) {
    dialogOpen.value = false
  }
}

function confirmDelete(service) {
  serviceToDelete.value = service
  deleteDialogOpen.value = true
}

async function doDelete() {
  if (serviceToDelete.value) {
    await serviceStore.deleteService(serviceToDelete.value.id_service)
    serviceToDelete.value = null
  }
}
</script>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.rounded-xl {
  border-radius: 20px;
}
</style>

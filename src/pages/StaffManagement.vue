<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center">
        <q-icon name="mdi-account-group" size="32px" color="primary" class="q-mr-sm" />
        <h1 class="text-h4 text-bold text-secondary q-my-none">Gestión de Equipo</h1>
      </div>
      <q-btn
        unelevated
        color="primary"
        label="Añadir Miembro"
        icon="add"
        rounded
        padding="10px 20px"
        @click="showAddDialog = true"
      />
    </div>

    <!-- Tabla de Staff -->
    <q-card class="glass-effect rounded-xl shadow-2 overflow-hidden">
      <q-table
        :rows="employeeStore.employees"
        :columns="columns"
        row-key="id_employee"
        flat
        :loading="employeeStore.loading"
        no-data-label="No hay miembros en el equipo todavía"
      >
        <template v-slot:body-cell-role="props">
          <q-td :props="props">
            <q-chip
              :color="props.value === 'admin' ? 'secondary' : 'primary'"
              text-color="white"
              size="sm"
              dense
            >
              {{ props.value.toUpperCase() }}
            </q-chip>
          </q-td>
        </template>
        
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.row.password_changed ? 'positive' : 'warning'" rounded>
              {{ props.row.password_changed ? 'Activo' : 'Pendiente Cambio' }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Diálogo: Añadir Empleado -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card class="glass-card q-pa-lg" style="min-width: 400px; border-radius: 20px;">
        <q-card-section class="q-pb-none">
          <div class="text-h5 text-bold text-secondary">Nuevo Miembro</div>
          <div class="text-caption text-grey-7">Se generará una contraseña aleatoria automáticamente.</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <div class="row q-col-gutter-sm">
              <q-input v-model="form.name" label="Nombre" outlined rounded dense class="col-6" :rules="[val => !!val || 'Requerido']" />
              <q-input v-model="form.surename" label="Apellido" outlined rounded dense class="col-6" :rules="[val => !!val || 'Requerido']" />
            </div>
            
            <q-input v-model="form.username" label="Nombre de Usuario (Login)" outlined rounded dense :rules="[val => !!val || 'Requerido']" />
            <q-input v-model="form.mail" label="Email (Opcional)" outlined rounded dense />
            <q-input v-model="form.phone" label="Teléfono" outlined rounded dense />

            <div class="row justify-end q-mt-lg">
              <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
              <q-btn unelevated label="Crear Acceso" color="primary" rounded type="submit" :loading="creating" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Diálogo: Credenciales Generadas (Crítico) -->
    <q-dialog v-model="showCredentialsDialog" persistent>
      <q-card class="bg-secondary text-white q-pa-lg" style="min-width: 350px; border-radius: 20px;">
        <q-card-section class="text-center">
          <q-icon name="mdi-key-check" size="64px" color="primary" class="q-mb-md" />
          <div class="text-h5 text-bold">Acceso Creado</div>
          <div class="text-subtitle1 q-mt-md opacity-80">
            Copia estos datos y envíalos al empleado. Esta es la <strong>única vez</strong> que podrás ver la contraseña.
          </div>
        </q-card-section>

        <q-card-section class="bg-white rounded-lg q-pa-md text-secondary q-mx-sm">
          <div class="row justify-between items-center q-mb-sm">
            <span class="text-bold">Usuario:</span>
            <span class="text-mono">{{ generatedCreds.username }}</span>
          </div>
          <div class="row justify-between items-center">
            <span class="text-bold">Contraseña:</span>
            <span class="text-mono row items-center">
              {{ generatedCreds.password }}
              <q-btn flat round dense icon="content_copy" size="xs" color="primary" class="q-ml-xs" @click="copyToClipboardAction(generatedCreds.password)" />
            </span>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-mt-md">
          <q-btn unelevated color="primary" label="Entendido, ya lo copié" rounded v-close-popup padding="8px 32px" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useEmployeeStore } from 'stores/employee'
import { copyToClipboard, Notify } from 'quasar'

const employeeStore = useEmployeeStore()
const showAddDialog = ref(false)
const showCredentialsDialog = ref(false)
const creating = ref(false)
const generatedCreds = ref({ username: '', password: '' })

const form = reactive({
  name: '',
  surename: '',
  username: '',
  mail: '',
  phone: ''
})

const columns = [
  { name: 'name', label: 'Nombre', field: row => `${row.name} ${row.surename}`, align: 'left', sortable: true },
  { name: 'username', label: 'Usuario', field: 'username', align: 'left' },
  { name: 'role', label: 'Rol', field: 'role', align: 'center' },
  { name: 'status', label: 'Estado', field: 'password_changed', align: 'center' },
  { name: 'actions', label: '', field: 'id_employee', align: 'right' }
]

onMounted(() => {
  employeeStore.fetchEmployees()
})

async function onSubmit() {
  creating.value = true
  const result = await employeeStore.createEmployee({ ...form })
  creating.value = false
  
  if (result) {
    generatedCreds.value = {
      username: result.username,
      password: result.password
    }
    showAddDialog.value = false
    showCredentialsDialog.value = true
    
    // Reset form
    Object.keys(form).forEach(key => form[key] = '')
  }
}

function copyToClipboardAction(text) {
  copyToClipboard(text).then(() => {
    Notify.create({ message: 'Copiado al portapapeles', color: 'positive', icon: 'check' })
  })
}
</script>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
}

.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
}

.text-mono {
  font-family: 'Courier New', Courier, monospace;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
}
</style>

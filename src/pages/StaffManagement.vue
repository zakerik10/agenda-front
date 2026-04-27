<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center">
        <q-icon name="mdi-account-group" size="32px" color="primary" class="q-mr-sm" />
        <h1 class="text-h4 text-bold text-secondary q-my-none">Gestión de Equipo</h1>
      </div>
      <div class="row q-gutter-sm items-center">
        <q-toggle
          v-if="authStore.hasPermission('staff.view_all')"
          v-model="viewAll"
          label="Ver todo el personal"
          color="secondary"
          @update:model-value="toggleViewAll"
          class="q-mr-md"
        />
        <q-btn
          v-if="!isOwnerRegistered"
          outline
          color="secondary"
          label="Trabajo en esta sucursal"
          icon="mdi-account-plus"
          rounded
          padding="10px 20px"
          :loading="employeeStore.loading"
          @click="addOwnerAsStaff"
        >
          <q-tooltip>Crea tu perfil de prestador para recibir turnos</q-tooltip>
        </q-btn>
        <q-btn
          v-if="authStore.hasPermission('staff.manage')"
          unelevated
          color="primary"
          label="Añadir Miembro"
          icon="add"
          rounded
          padding="10px 20px"
          @click="showAddDialog = true"
        />
      </div>
    </div>

    <!-- Tabla de Staff -->
    <q-card class="glass-effect rounded-xl shadow-2 overflow-hidden">
      <q-table
        :rows="employeeStore.employees"
        :columns="columns"
        row-key="id_employee"
        flat
        class="bg-transparent"
        :loading="employeeStore.loading"
        no-data-label="No hay miembros en el equipo todavía"
      >
        <template v-slot:body-cell-role_name="props">
          <q-td :props="props">
            <q-chip outline color="primary" size="sm" class="text-bold">
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-branches="props">
          <q-td :props="props">
            <div v-if="props.row.accessible_branches && props.row.accessible_branches.length > 0" class="row q-gutter-xs justify-center">
              <q-chip v-for="b in props.row.accessible_branches" :key="b.id_branch" size="xs" dense color="blue-1" text-color="blue-9">
                {{ b.name }}
              </q-chip>
            </div>
            <q-badge v-else color="grey-7" outline label="Global" />
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
              <q-input v-model="form.name" label="Nombre *" outlined rounded dense class="col-6" :rules="[val => !!val || 'Requerido']" />
              <q-input v-model="form.surename" label="Apellido *" outlined rounded dense class="col-6" :rules="[val => !!val || 'Requerido']" />
            </div>
            
            <q-select
              v-model="form.id_role"
              :options="roleStore.roles"
              option-value="id_role"
              option-label="name"
              emit-value
              map-options
              label="Rol del Miembro *"
              outlined
              rounded
              dense
              :rules="[val => !!val || 'El rol es obligatorio']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-account-star" />
              </template>
            </q-select>

            <q-input v-model="form.username" label="Nombre de Usuario (Login) *" outlined rounded dense :rules="[val => !!val || 'Requerido']" />
            
            <q-select
              v-if="authStore.hasPermission('staff.view_all')"
              v-model="form.branch_ids"
              :options="branchStore.branches"
              option-value="id_branch"
              option-label="name"
              emit-value
              map-options
              multiple
              use-chips
              label="Sucursales con Acceso"
              outlined
              rounded
              dense
              clearable
              hint="Si no elegís ninguna, el acceso será global"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-store" />
              </template>
            </q-select>

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
import { ref, onMounted, reactive, computed } from 'vue'
import { useEmployeeStore } from 'stores/employee'
import { useAuthStore } from 'stores/auth'
import { useBranchStore } from 'stores/branch'
import { useRoleStore } from 'stores/role'
import { copyToClipboard, Notify } from 'quasar'

const employeeStore = useEmployeeStore()
const authStore = useAuthStore()
const branchStore = useBranchStore()
const roleStore = useRoleStore()
const showAddDialog = ref(false)
const showCredentialsDialog = ref(false)
const creating = ref(false)
const generatedCreds = ref({ username: '', password: '' })

const form = reactive({
  name: '',
  surename: '',
  username: '',
  id_role: null,
  branch_ids: [],
  mail: '',
  phone: ''
})

const columns = [
  { name: 'name', label: 'Nombre', field: row => `${row.name} ${row.surename}`, align: 'left', sortable: true },
  { name: 'username', label: 'Usuario', field: 'username', align: 'left' },
  { name: 'role_name', label: 'Rol', field: 'role_name', align: 'center' },
  { name: 'branches', label: 'Sucursales', field: 'accessible_branches', align: 'center' },
  { name: 'status', label: 'Estado', field: 'password_changed', align: 'center' },
  { name: 'actions', label: '', field: 'id_employee', align: 'right' }
]

const viewAll = ref(false)

onMounted(async () => {
  if (authStore.hasPermission('staff.view_all')) {
    await Promise.all([
      branchStore.fetchBranches(),
      roleStore.fetchRoles()
    ])
  } else {
    await roleStore.fetchRoles()
  }
  employeeStore.fetchEmployees(viewAll.value)
})

function toggleViewAll(val) {
  employeeStore.fetchEmployees(val)
}

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

const isOwnerRegistered = computed(() => {
  return employeeStore.employees.some(emp => emp.id_owner === authStore.user?.id_owner)
})

async function addOwnerAsStaff() {
  if (!branchStore.currentBranch) return
  await employeeStore.registerOwner(branchStore.currentBranch.id_branch)
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

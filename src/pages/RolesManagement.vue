<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center q-mb-lg">
      <q-icon name="mdi-shield-account" size="32px" color="primary" class="q-mr-sm" />
      <div>
        <h1 class="text-h4 text-bold text-secondary q-my-none">Roles y Permisos</h1>
        <p class="text-subtitle2 text-grey-6 q-mb-none">Configurá qué puede hacer cada miembro de tu equipo</p>
      </div>
      <q-space />
      <q-btn
        unelevated
        color="primary"
        label="Nuevo Rol"
        icon="add"
        rounded
        class="q-px-md shadow-2"
        @click="openDialog()"
      />
    </div>

    <!-- Lista de Roles -->
    <div class="row q-col-gutter-md">
      <div v-for="role in roleStore.roles" :key="role.id_role" class="col-12 col-sm-6 col-md-4">
        <q-card class="glass-effect rounded-xl shadow-2 role-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="text-h6 text-bold text-secondary ellipsis">{{ role.name }}</div>
              <q-space />
              <q-btn flat round color="grey-7" icon="edit" size="sm" @click="openDialog(role)" />
              <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(role)" />
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-caption text-grey-6 q-mb-xs">Permisos asignados:</div>
            <div class="row q-gutter-xs">
              <q-chip
                v-for="perm in role.permissions.slice(0, 4)"
                :key="perm.id_permission"
                size="xs"
                color="blue-1"
                text-color="blue-9"
              >
                {{ perm.label }}
              </q-chip>
              <q-chip v-if="role.permissions.length > 4" size="xs" outline color="grey-5">
                +{{ role.permissions.length - 4 }} más
              </q-chip>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="roleStore.roles.length === 0" class="col-12 text-center q-py-xl">
        <q-icon name="mdi-account-lock-open-outline" size="64px" color="grey-4" />
        <p class="text-h6 text-grey-6 q-mt-md">Aún no creaste roles personalizados</p>
      </div>
    </div>

    <!-- Diálogo de Edición/Creación (Checklist) -->
    <q-dialog v-model="dialogOpen" persistent full-height position="right">
      <q-card style="width: 500px; max-width: 90vw;" class="column">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h5 text-bold text-secondary">
            {{ isEditing ? 'Configurar Rol' : 'Crear Nuevo Rol' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-input
            filled
            v-model="form.name"
            label="Nombre del Rol *"
            placeholder="Ej: Supervisor, Recepcionista..."
            class="q-mb-lg"
          />

          <div class="text-subtitle1 text-bold text-secondary q-mb-sm">Permisos</div>
          
          <q-scroll-area style="height: calc(100vh - 250px);">
            <div v-for="(perms, category) in groupedPermissions" :key="category" class="q-mb-md">
              <div class="text-caption text-bold text-primary q-mb-xs uppercase tracking-wider">
                {{ category }}
              </div>
              <q-list dense>
                <q-item v-for="perm in perms" :key="perm.id_permission" tag="label" v-ripple class="rounded-lg q-mb-xs">
                  <q-item-section avatar>
                    <q-checkbox v-model="form.permissions" :val="perm.id_permission" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ perm.label }}</q-item-label>
                    <q-item-label caption>{{ perm.code }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-separator class="q-my-sm" />
            </div>
          </q-scroll-area>
        </q-card-section>

        <q-card-actions align="right" class="bg-white q-pa-md shadow-up-2">
          <q-btn label="Cancelar" flat color="grey-7" v-close-popup />
          <q-btn
            :label="isEditing ? 'Guardar Cambios' : 'Crear Rol'"
            color="primary"
            rounded
            unelevated
            class="q-px-lg"
            :loading="roleStore.loading"
            @click="saveRole"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo Eliminar -->
    <q-dialog v-model="deleteDialogOpen">
      <q-card style="border-radius: 15px;">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm text-h6">¿Eliminar rol?</span>
        </q-card-section>
        <q-card-section>
          ¿Estás seguro de que querés eliminar el rol <strong>{{ selectedRole?.name }}</strong>?
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
import { ref, onMounted, computed } from 'vue'
import { useRoleStore } from 'stores/role'

const roleStore = useRoleStore()
const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const isEditing = ref(false)
const selectedRole = ref(null)

const form = ref({
  id_role: null,
  name: '',
  permissions: []
})

const groupedPermissions = computed(() => {
  const groups = {}
  roleStore.allPermissions.forEach(p => {
    if (!groups[p.category]) groups[p.category] = []
    groups[p.category].push(p)
  })
  return groups
})

onMounted(async () => {
  await Promise.all([
    roleStore.fetchPermissions(),
    roleStore.fetchRoles()
  ])
})

function openDialog(role = null) {
  if (role) {
    isEditing.value = true
    selectedRole.value = role
    form.value = {
      id_role: role.id_role,
      name: role.name,
      permissions: role.permissions.map(p => p.id_permission)
    }
  } else {
    isEditing.value = false
    form.value = {
      id_role: null,
      name: '',
      permissions: []
    }
  }
  dialogOpen.value = true
}

async function saveRole() {
  if (!form.value.name) return
  
  let success = false
  if (isEditing.value) {
    success = await roleStore.updateRole(form.value.id_role, form.value)
  } else {
    success = await roleStore.createRole(form.value)
  }
  
  if (success) dialogOpen.value = false
}

function confirmDelete(role) {
  selectedRole.value = role
  deleteDialogOpen.value = true
}

async function doDelete() {
  if (selectedRole.value) {
    await roleStore.deleteRole(selectedRole.value.id_role)
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

.role-card {
  transition: transform 0.2s ease;
}

.role-card:hover {
  transform: translateY(-4px);
}

.uppercase {
  text-transform: uppercase;
}

.tracking-wider {
  letter-spacing: 0.05em;
}
</style>

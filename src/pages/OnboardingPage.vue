<template>
  <div class="fullscreen bg-primary flex flex-center">
    <q-card class="my-card q-pa-md" style="width: 100%; max-width: 450px">
      <q-card-section class="text-center">
        <div class="text-h4 text-weight-bold q-mb-xs text-primary">¡Bienvenido!</div>
        <div class="text-subtitle1 text-grey-8">
          Antes de empezar, necesitamos configurar tu primer local o sucursal.
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            filled
            v-model="name"
            label="Nombre del Negocio *"
            hint="Ej: Salón Centro, Peluquería Estilo..."
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Por favor ingresa un nombre']"
          />

          <q-input
            filled
            v-model="address"
            label="Dirección (Opcional)"
            hint="Ej: Av. Siempreviva 123"
          />

          <div>
            <q-btn
              label="Crear mi Negocio"
              type="submit"
              color="primary"
              class="full-width"
              size="lg"
              :loading="branchStore.loading"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center text-grey-6 q-pt-none">
        <small>Podrás agregar más sucursales después.</small>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBranchStore } from 'stores/branch'
import { useAuthStore } from 'stores/auth'
import { Notify } from 'quasar'

const branchStore = useBranchStore()
const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const address = ref('')

onMounted(async () => {
  try {
    // Asegurar que tenemos la info del usuario más reciente
    await authStore.checkAuthAndLoadUser()

    // Si ya tiene sucursales, no debería estar aquí
    if (branchStore.hasBranches) {
      //router.push('/dashboard')
    }
  } catch (e) {
    console.log('Error verificando sesión en onboarding', e)
  }
})

async function onSubmit() {
  try {
    await branchStore.createBranch({
      name: name.value,
      address: address.value,
    })

    Notify.create({
      type: 'positive',
      message: '¡Negocio creado exitosamente!',
      position: 'top',
    })

    // Redirigir al Dashboard una vez creada la sucursal
    router.push('/dashboard')
  } catch (error) {
    console.error(error)
    Notify.create({
      type: 'negative',
      message: 'Error al crear sucursal. Intente nuevamente.',
      position: 'top',
    })
  }
}
</script>

<style scoped>
.my-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>

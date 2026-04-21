<template>
  <div class="fullscreen brand-bg flex flex-center">
    <div class="brand-particles"></div>

    <q-card class="brand-card q-pa-xl" style="width: 100%; max-width: 480px">
      <q-card-section class="text-center q-mb-md">
        <q-icon name="mdi-store" color="primary" size="56px" class="q-mb-sm" />
        <div class="text-h4 text-weight-bold text-secondary q-mb-xs">Casi listo 🎉</div>
        <div class="text-subtitle1 text-grey-7">
          ¿Cómo se llama tu negocio o marca?<br/>
          <span class="text-caption text-grey-5">Este nombre aparecerá en el link que compartís con tus clientes.</span>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            filled
            v-model="brandName"
            label="Nombre de la Marca *"
            hint='Ej: "Barbería Zeta", "Estetica Luna", "Centro Médico Salud"'
            autofocus
            :rules="[(val) => (val && val.length > 1) || 'Ingresá el nombre de tu marca']"
          >
            <template v-slot:prepend>
              <q-icon name="mdi-store-outline" />
            </template>
          </q-input>

          <!-- Preview del slug -->
          <div v-if="brandName" class="slug-preview q-pa-sm rounded-borders">
            <span class="text-caption text-grey-6">Tu link de reserva quedará:</span><br/>
            <span class="text-caption text-primary text-weight-bold">
              tuapp.com/reservar/{{ slugPreview }}-nombre-sucursal
            </span>
          </div>

          <q-btn
            label="Continuar"
            type="submit"
            color="primary"
            class="full-width q-mt-md"
            size="lg"
            rounded
            unelevated
            :loading="loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { Notify } from 'quasar'
import { useAuthStore } from 'stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const brandName = ref('')
const loading = ref(false)

// Preview simplificado del slug (solo para dar una idea visual)
const slugPreview = computed(() => {
  return brandName.value
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
})

async function onSubmit() {
  loading.value = true
  try {
    await api.patch('/owners/me/brand', { brand_name: brandName.value.trim() })

    // Actualizar el store local con el nuevo brand_name
    if (authStore.user) {
      authStore.user.brand_name = brandName.value.trim()
    }

    Notify.create({
      type: 'positive',
      message: '¡Nombre de marca guardado!',
      position: 'top',
    })

    // Ir al onboarding de sucursal
    router.push('/onboarding')
  } catch (error) {
    console.error(error)
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar. Intentá nuevamente.',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.brand-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #e8f0fe 100%);
  position: relative;
  overflow: hidden;
}

.brand-card {
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1;
  position: relative;
}

.slug-preview {
  background: rgba(214, 40, 40, 0.05);
  border: 1px dashed rgba(214, 40, 40, 0.3);
  border-radius: 8px;
}
</style>

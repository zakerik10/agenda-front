<template>
  <div v-if="branchStore.hasBranches" class="q-mr-sm">
    <q-btn-dropdown
      flat
      no-caps
      :label="branchStore.currentBranch?.name || 'Seleccionar Sucursal'"
      icon="mdi-store"
      color="secondary"
      class="branch-selector-btn"
    >
      <q-list style="min-width: 280px;">
        <q-item-label header class="text-caption text-grey-6">Tus Sucursales</q-item-label>

        <q-item
          v-for="branch in branchStore.branches"
          :key="branch.id_branch"
          clickable
          v-close-popup
          @click="selectBranch(branch.id_branch)"
          :active="branch.id_branch === branchStore.currentBranch?.id_branch"
          active-class="bg-primary-light"
        >
          <q-item-section avatar>
            <q-icon name="mdi-store" :color="branch.id_branch === branchStore.currentBranch?.id_branch ? 'primary' : 'grey-5'" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ branch.name }}</q-item-label>
            <q-item-label caption v-if="branch.address">{{ branch.address }}</q-item-label>
          </q-item-section>
          <q-item-section side v-if="branch.id_branch === branchStore.currentBranch?.id_branch">
            <q-icon name="mdi-check-circle" color="primary" size="18px" />
          </q-item-section>
        </q-item>

        <!-- Link de reserva de la sucursal activa -->
        <template v-if="branchStore.currentBranch?.slug">
          <q-separator class="q-my-xs" />
          <q-item dense class="booking-link-item q-py-sm">
            <q-item-section>
              <q-item-label class="text-caption text-grey-6 q-mb-xs">Link de reservas</q-item-label>
              <div class="row items-center no-wrap">
                <code class="booking-url text-caption ellipsis">{{ bookingUrl }}</code>
                <q-btn
                  flat
                  round
                  dense
                  icon="mdi-content-copy"
                  size="sm"
                  color="primary"
                  class="q-ml-xs"
                  @click.stop="copyBookingUrl"
                >
                  <q-tooltip>Copiar link</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </template>

        <q-separator class="q-my-xs" />

        <q-item clickable v-close-popup @click="goToOnboarding">
          <q-item-section avatar>
            <q-icon name="add" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-primary">Nueva Sucursal</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBranchStore } from 'stores/branch'
import { useRouter } from 'vue-router'
import { copyToClipboard, Notify } from 'quasar'

const branchStore = useBranchStore()
const router = useRouter()

const bookingUrl = computed(() => {
  const slug = branchStore.currentBranch?.slug
  if (!slug) return ''
  // En producción esto sería el dominio real
  return `${window.location.origin}/reservar/${slug}`
})

function selectBranch(id) {
  branchStore.setCurrentBranch(id)
}

function copyBookingUrl() {
  copyToClipboard(bookingUrl.value).then(() => {
    Notify.create({
      message: '¡Link copiado! Compartilo con tus clientes',
      color: 'positive',
      icon: 'mdi-check',
      position: 'top'
    })
  })
}

function goToOnboarding() {
  router.push('/onboarding')
}
</script>

<style scoped>
.branch-selector-btn {
  font-weight: 600;
}

.bg-primary-light {
  background: rgba(214, 40, 40, 0.08);
}

.booking-url {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

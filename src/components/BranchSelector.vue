<template>
  <div v-if="branchStore.hasBranches" class="q-mr-sm">
    <q-btn-dropdown
      flat
      no-caps
      :label="branchStore.currentBranch?.name || 'Seleccionar Sucursal'"
      icon="store"
      color="white"
    >
      <q-list>
        <q-item
          v-for="branch in branchStore.branches"
          :key="branch.id_business"
          clickable
          v-close-popup
          @click="selectBranch(branch.id_business)"
          :active="branch.id_business === branchStore.currentBranch?.id_business"
        >
          <q-item-section>
            <q-item-label>{{ branch.name }}</q-item-label>
            <q-item-label caption v-if="branch.address">{{ branch.address }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

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
import { useBranchStore } from 'stores/branch'
import { useRouter } from 'vue-router'

const branchStore = useBranchStore()
const router = useRouter()

function selectBranch(id) {
  branchStore.setCurrentBranch(id)
  // Aquí podríamos recargar el calendario si fuera necesario,
  // pero como el calendario usará currentBranch del store, debería ser reactivo.
}

function goToOnboarding() {
  // Permitir crear más sucursales
  // Nota: La página de onboarding actual redirige si TIENES sucursales.
  // Deberíamos adaptar OnboardingPage para aceptar un modo "Agregar nueva" o simplemente permitirlo.
  // Por ahora, redirigimos, pero la lógica de OnboardingPage nos expulsará.
  // FIX: Necesitaremos ajustar OnboardingPage para distinguir "Primer ingreso" de "Agregar más".
  router.push('/onboarding')
}
</script>

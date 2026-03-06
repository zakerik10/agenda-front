import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useBranchStore = defineStore('branch', {
  state: () => ({
    branches: [], // Array de sucursales
    currentBranch: null, // Sucursal seleccionada actualmente
    loading: false,
    error: null,
  }),

  getters: {
    hasBranches: (state) => state.branches.length > 0,
    activeBranch: (state) => state.currentBranch,
  },

  actions: {
    async fetchBranches() {
      this.loading = true
      this.error = null
      try {
        console.log('Fetching branches...')
        // TODO: Implementar GET /branches en Flask
        const response = await api.get('/branches')
        this.branches = response.data

        // Seleccionar automáticamente la primera si no hay ninguna seleccionada
        if (this.branches.length > 0 && !this.currentBranch) {
          this.currentBranch = this.branches[0]
        }
      } catch (error) {
        console.warn(
          'Backend falló. Intentando cargar MOCK DATA persistente de LocalStorage.',
          error,
        )

        // Cargar simulación persistente (Si existe)
        const storedMock = localStorage.getItem('mock_branches_db')
        if (storedMock) {
          this.branches = JSON.parse(storedMock)
          if (this.branches.length > 0 && !this.currentBranch) {
            this.currentBranch = this.branches[0]
          }
          console.log('Mock Data cargada de LocalStorage:', this.branches)
        } else {
          console.log('No hay Mock Data previa. Iniciando con 0 sucursales.')
          this.branches = []
        }
      } finally {
        this.loading = false
      }
    },

    async createBranch(branchData) {
      this.loading = true
      try {
        // TODO: Implementar POST /branches en Flask
        const response = await api.post('/branches', branchData)

        // Agregar la nueva sucursal al state
        const newBranch = response.data
        this.branches.push(newBranch)
        this.currentBranch = newBranch // Seleccionarla

        return newBranch
      } catch (error) {
        console.warn('Backend falló (createBranch). Guardando en MOCK LOCAL.', error)

        // SIMULACIÓN DE EXITO
        const newMockBranch = {
          id_business: Date.now(),
          name: branchData.name,
          address: branchData.address,
          id_owner: 1,
        }

        this.branches.push(newMockBranch)
        this.currentBranch = newMockBranch

        // PERSISTIR DATA FALSA
        localStorage.setItem('mock_branches_db', JSON.stringify(this.branches))
        console.log('Sucursal guardada en Mock DB LocalStorage')

        return newMockBranch
      } finally {
        this.loading = false
      }
    },

    setCurrentBranch(branchId) {
      const branch = this.branches.find((b) => b.id_business === branchId)
      if (branch) {
        this.currentBranch = branch
      }
    },
  },
})

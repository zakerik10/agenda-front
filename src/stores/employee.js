import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { useBranchStore } from './branch'
import { Notify } from 'quasar'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [],
    loading: false,
  }),
  actions: {
    async fetchEmployees() {
      const branchStore = useBranchStore()
      if (!branchStore.currentBranch) return

      this.loading = true
      try {
        const response = await api.get(`/employees/branch/${branchStore.currentBranch.id_branch}`)
        // Note: Assuming a route /employees/branch/<id> exists or updating backend accordingly
        this.employees = response.data
      } catch (error) {
        console.error('Error fetching employees:', error)
      } finally {
        this.loading = false
      }
    },

    async createEmployee(employeeData) {
      const branchStore = useBranchStore()
      if (!branchStore.currentBranch) return

      try {
        const response = await api.post(`/employees/register/${branchStore.currentBranch.id_branch}`, employeeData)
        
        // El backend devuelve { message, username, password }
        // Añadimos el nuevo empleado a la lista (sin la clave, solo para visualización)
        await this.fetchEmployees()
        
        return response.data // Retornamos para mostrar la contraseña al dueño
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response?.data?.message || 'Error al crear empleado'
        })
        return null
      }
    }
  }
})

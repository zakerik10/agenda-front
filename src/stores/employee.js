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
    async fetchEmployees(all = false) {
      this.loading = true
      try {
        let url = '/employees/'
        if (!all) {
          const branchStore = useBranchStore()
          if (!branchStore.currentBranch) return
          url = `/employees/branch/${branchStore.currentBranch.id_branch}`
        }
        
        const response = await api.get(url)
        this.employees = response.data
      } catch (error) {
        console.error('Error fetching employees:', error)
      } finally {
        this.loading = false
      }
    },

    async createEmployee(employeeData) {
      this.loading = true
      try {
        const response = await api.post('/employees/register', employeeData)
        
        // El backend devuelve { message, username, password }
        await this.fetchEmployees()
        
        return response.data 
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response?.data?.message || 'Error al crear empleado'
        })
        return null
      } finally {
        this.loading = false
      }
    },

    async registerOwner(idBranch) {
      this.loading = true
      try {
        await api.post(`/employees/register-owner/${idBranch}`)
        Notify.create({ type: 'positive', message: '¡Ya sos parte del equipo de esta sucursal!' })
        await this.fetchEmployees()
        return true
      } catch (error) {
        console.error('Error registering owner as staff:', error)
        Notify.create({ type: 'negative', message: error.response?.data?.message || 'Error al registrarte como staff' })
        return false
      } finally {
        this.loading = false
      }
    }
  }
})

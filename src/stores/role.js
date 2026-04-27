import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { Notify } from 'quasar'

export const useRoleStore = defineStore('role', {
  state: () => ({
    roles: [],
    allPermissions: [],
    loading: false
  }),

  actions: {
    async fetchPermissions() {
      try {
        const response = await api.get('/roles/permissions')
        this.allPermissions = response.data
      } catch (error) {
        console.error('Error fetching permissions:', error)
      }
    },

    async fetchRoles() {
      this.loading = true
      try {
        const response = await api.get('/roles/')
        this.roles = response.data
      } catch (error) {
        console.error('Error fetching roles:', error)
      } finally {
        this.loading = false
      }
    },

    async createRole(roleData) {
      this.loading = true
      try {
        await api.post('/roles/', roleData)
        Notify.create({ type: 'positive', message: 'Rol creado exitosamente' })
        await this.fetchRoles()
        return true
      } catch (error) {
        Notify.create({ type: 'negative', message: 'Error al crear rol' })
        return false
      } finally {
        this.loading = false
      }
    },

    async updateRole(id, roleData) {
      this.loading = true
      try {
        await api.put(`/roles/${id}`, roleData)
        Notify.create({ type: 'positive', message: 'Rol actualizado' })
        await this.fetchRoles()
        return true
      } catch (error) {
        Notify.create({ type: 'negative', message: 'Error al actualizar rol' })
        return false
      } finally {
        this.loading = false
      }
    },

    async deleteRole(id) {
      try {
        await api.delete(`/roles/${id}`)
        Notify.create({ type: 'positive', message: 'Rol eliminado' })
        await this.fetchRoles()
        return true
      } catch (error) {
        Notify.create({ type: 'negative', message: 'No se pudo eliminar el rol' })
        return false
      }
    }
  }
})

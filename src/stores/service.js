import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { Notify } from 'quasar'

export const useServiceStore = defineStore('service', {
  state: () => ({
    services: [],
    loading: false
  }),

  actions: {
    async fetchServices() {
      this.loading = true
      try {
        const response = await api.get('/services/')
        this.services = response.data
      } catch (error) {
        console.error('Error fetching services:', error)
        Notify.create({
          type: 'negative',
          message: 'Error al cargar servicios'
        })
      } finally {
        this.loading = false
      }
    },

    async createService(serviceData) {
      this.loading = true
      try {
        await api.post('/services/register', serviceData)
        Notify.create({
          type: 'positive',
          message: 'Servicio creado exitosamente'
        })
        await this.fetchServices()
        return true
      } catch (error) {
        console.error('Error creating service:', error)
        Notify.create({
          type: 'negative',
          message: error.response?.data?.message || 'Error al crear servicio'
        })
        return false
      } finally {
        this.loading = false
      }
    },

    async updateService(id, serviceData) {
      this.loading = true
      try {
        await api.put(`/services/${id}`, serviceData)
        Notify.create({
          type: 'positive',
          message: 'Servicio actualizado correctamente'
        })
        await this.fetchServices()
        return true
      } catch (error) {
        console.error('Error updating service:', error)
        Notify.create({
          type: 'negative',
          message: 'Error al actualizar servicio'
        })
        return false
      } finally {
        this.loading = false
      }
    },

    async deleteService(id) {
      try {
        await api.delete(`/services/${id}`)
        Notify.create({
          type: 'positive',
          message: 'Servicio eliminado'
        })
        await this.fetchServices()
        return true
      } catch (error) {
        console.error('Error deleting service:', error)
        Notify.create({
          type: 'negative',
          message: 'No se pudo eliminar el servicio'
        })
        return false
      }
    }
  }
})

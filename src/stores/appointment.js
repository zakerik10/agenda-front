import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { Notify } from 'quasar'

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    appointments: [],
    availableSlots: [],
    loading: false
  }),

  actions: {
    async fetchAvailableSlots(idService, date, idBranch) {
      if (!idService || !date || !idBranch) return
      this.loading = true
      try {
        const response = await api.get('/appointments/available-slots', {
          params: { id_service: idService, date, id_branch: idBranch }
        })
        this.availableSlots = response.data.slots
      } catch (error) {
        console.error('Error fetching slots:', error)
        this.availableSlots = []
      } finally {
        this.loading = false
      }
    },

    async createAppointment(data) {
      this.loading = true
      try {
        const response = await api.post('/appointments/', data)
        Notify.create({ message: 'Turno agendado correctamente', color: 'positive' })
        return response.data
      } catch (error) {
        Notify.create({ 
          message: error.response?.data?.message || 'Error al agendar turno', 
          color: 'negative' 
        })
        return null
      } finally {
        this.loading = false
      }
    },

    async fetchAppointments(params) {
      this.loading = true
      try {
        const response = await api.get('/appointments/', { params })
        this.appointments = response.data
      } catch (error) {
        console.error('Error fetching appointments:', error)
      } finally {
        this.loading = false
      }
    }
  }
})

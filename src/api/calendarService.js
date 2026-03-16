// import { api } from 'boot/axios'

/**
 * Service to handle Calendar interactions via the Backend.
 */
export default {
  /**
   * Retrieves upcoming events for a specific branch from the backend.
   * @param {string} branchId - The ID of the branch to fetch events for.
   * @returns {Promise<Array>} List of events
   */
  async getEventsByBranch(branchId) {
    if (!branchId) return []

    // En el futuro, esto llamará a tu Backend Flask:
    // const response = await api.get(`/branches/${branchId}/appointments`)
    // return response.data

    // Simulación de respuesta del Backend (Base de datos Flask)
    return new Promise((resolve) => {
      console.log(`[Backend Simulation] Solicitando eventos para Branch ID: ${branchId}...`)
      
      setTimeout(() => {
        const mockEvents = [
          {
            id: 'local_1',
            title: `Turno Local (${branchId}): Corte de Pelo`,
            start: new Date().setHours(10, 0, 0),
            end: new Date().setHours(11, 0, 0),
            color: '#1976D2',
            extendedProps: { type: 'local', branchId }
          },
          {
            id: 'google_1',
            title: 'Evento Google: Bloqueado',
            start: new Date().setHours(14, 0, 0),
            end: new Date().setHours(15, 0, 0),
            color: '#34a853',
            extendedProps: { type: 'google' }
          }
        ]
        console.log(`[Backend Simulation] Retornando ${mockEvents.length} eventos.`)
        resolve(mockEvents)
      }, 500)
    })
  }
}

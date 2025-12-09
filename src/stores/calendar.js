import { defineStore } from 'pinia'

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    selectedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    isDrawerOpen: false,
  }),
  actions: {
    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen
    },
    updateDate(date) {
      this.selectedDate = date
    },
  },
})

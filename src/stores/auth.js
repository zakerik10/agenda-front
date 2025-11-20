import { defineStore, acceptHMRUpdate } from 'pinia'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from '../firebase.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('access_token') || null,
    isLoggedIn: !!localStorage.getItem('access_token'),
  }),

  getters: {
    getUser: (state) => state.user,
    getAccessToken: (state) => state.accessToken,
    getIsAuthenticated: (state) => state.isLoggedIn,
  },

  actions: {
    async accessGoogle() {
      console.log('Login')
      const provider = new GoogleAuthProvider()
      try {
        const result = await signInWithPopup(auth, provider)
        const user = result.user
        const idToken = await user.getIdToken()

        this.$patch({
          user: user,
          accessToken: idToken,
          isLoggedIn: true,
        })

        console.log(this.accessToken)
      } catch (error) {
        const errorCode = error.code
        const errorMessage = error.message

        const email = error.customData ? error.customData.email : 'N/A'

        console.log(errorCode)
        console.log(errorMessage)
        console.log(email)

        this.isLoggedIn = false
        this.user = null
      }
    },
    async logoutGoogle() {
      try {
        await signOut(auth)
        this.$patch({
          user: null,
          accessToken: null,
          isLoggedIn: false,
        })
        localStorage.removeItem('access_token')
        console.log('Se cerró sesión')
      } catch (error) {
        console.log(error)
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}

import { defineStore, acceptHMRUpdate } from 'pinia'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from '../firebase.js'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
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

        const response = await this._googleAuthFlask(idToken)
        const accessToken = response.access_token
        const refreshToken = response.refresh_token

        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)

        console.log(
          'Vemos lo que se guarda en la localStorage refreshToken: ' +
            localStorage.getItem('refresh_token'),
        )

        console.log(
          'Vemos lo que se guarda en la localStorage accessToken: ' +
            localStorage.getItem('access_token'),
        )

        this.$patch({
          user: user,
          accessToken: idToken,
          refreshToken: refreshToken,
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

    async _googleAuthFlask(idToken) {
      // Usamos la instancia 'api' importada de 'boot/axios.js'
      const response = await api.post(
        '/owners/auth',
        {
          idToken: idToken,
        },
        {
          // Flag para no inyectar el token de autenticación en el post (Default false)
          skipAuth: true,
        },
      )

      return response.data
    },
    async fetchUserProfile() {
      // El Interceptor de Axios ya adjuntará el accessToken
      if (!this.accessToken) {
        this.isLoggedIn = false
        return // No hay token para verificar
      }

      try {
        // Llama a la ruta protegida /owners/me
        const response = await api.get('/owners/me')

        // Flask devuelve el objeto completo del Owner
        this.$patch({
          user: response.data,
          isLoggedIn: true,
        })
        console.log('Sesión restaurada y perfil cargado:', response.data)
      } catch (error) {
        // Si Flask responde con 401 (JWT inválido o expirado)
        console.error('Error al verificar sesión (401/403). Cerrando sesión.', error)

        // Limpieza del token y estado
        this.logoutGoogle()
        throw error
      }
    },

    async checkAuthAndLoadUser() {
      // Intenta cargar el token si no está en el state (por si acaso)
      if (!this.accessToken) {
        const storedToken = localStorage.getItem('access_token')
        if (storedToken) {
          this.accessToken = storedToken
          this.isLoggedIn = true
        }
      }

      // Si hay un token guardado, intenta validar la sesión con Flask
      if (this.accessToken) {
        // Llama a fetchUserProfile para validar el token y cargar los datos
        await this.fetchUserProfile()
      }
    },

    async logoutGoogle() {
      try {
        await signOut(auth)
        this.$patch({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoggedIn: false,
        })
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
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

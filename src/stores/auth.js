import { defineStore, acceptHMRUpdate } from 'pinia'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from '../firebase.js'
import { api } from 'boot/axios'
import { Notify } from 'quasar'
import { useBranchStore } from './branch'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    isLoggedIn: !!localStorage.getItem('access_token'),
  }),
  // ... getters ...

  actions: {
    async accessGoogle() {
      console.log('Iniciando proceso de Login...')
      const provider = new GoogleAuthProvider()
      const branchStore = useBranchStore()

      try {
        // 1. Autenticación con Firebase (Google)
        const result = await signInWithPopup(auth, provider)
        const user = result.user
        const idToken = await user.getIdToken()

        console.log('Firebase Login Exitoso. Token obtenido.')

        // 2. Autenticación con Backend (Flask)
        console.log('Contactando servidor backend para validar sesión...')
        const response = await this._googleAuthFlask(idToken)

        const accessToken = response.access_token
        const refreshToken = response.refresh_token

        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)

        // 3. Cargar Sucursales
        await branchStore.fetchBranches()

        this.$patch({
          user: user,
          accessToken: idToken,
          refreshToken: refreshToken,
          isLoggedIn: true,
        })

        console.log('Login completado exitosamente.')
        Notify.create({
          type: 'positive',
          message: `Bienvenido, ${user.displayName || 'Usuario'}`,
          position: 'top',
        })
      } catch (error) {
        console.group('Error en Autenticación')
        console.error('Objeto de error completo:', error)

        // Limpieza de estado
        this.isLoggedIn = false
        this.user = null

        let userMessage = 'No se pudo iniciar sesión. Intente nuevamente.'
        let technicalDetails = error.message

        // Detección de tipos de error para mensaje Usuario (Genérico)
        if (error.code === 'auth/popup-closed-by-user') {
          userMessage = 'Inicio de sesión cancelado.'
          console.warn('Usuario cerró el popup de Google.')
        } else if (error.code === 'auth/popup-blocked') {
          userMessage = 'Navegador bloqueó la ventana emergente. Por favor permítala.'
        } else if (
          error.code === 'auth/network-request-failed' ||
          error.message === 'Network Error' ||
          error.code === 'ERR_NETWORK'
        ) {
          // Fallas de conexión (Google o Backend caído)
          userMessage = 'Problema de conexión. Verifique su internet o intente más tarde.'
          console.error('Network/Backend Error:', error.message)
        } else {
          // Cualquier otro error (Backend 4xx/5xx, errores internos)
          userMessage = 'Ocurrió un error al iniciar sesión. Intente nuevamente más tarde.'
          if (error.response) {
            console.error('Backend Response Error:', error.response.data)
            technicalDetails = `Status: ${error.response.status}`
          }
        }

        // Notificación visual al usuario
        Notify.create({
          type: 'negative',
          message: userMessage,
          position: 'top',
          timeout: 5000,
        })

        console.error('Detalles Técnicos para Debug:', technicalDetails)
        console.groupEnd()
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

        // Cargar sucursales al restaurar
        const branchStore = useBranchStore()
        await branchStore.fetchBranches()
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
        // Limpiar Mock DB local
        localStorage.removeItem('mock_branches_db')

        console.log('Se cerró sesión y se limpiaron datos locales.')
      } catch (error) {
        console.log(error)
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}

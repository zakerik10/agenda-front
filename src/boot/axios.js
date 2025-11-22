import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from 'stores/auth'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const URL_FLASK = import.meta.env.VITE_flask_site
const PORT_FLASK = import.meta.env.VITE_flask_port
const api = axios.create({ baseURL: URL_FLASK + ':' + PORT_FLASK })

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  // INTERCEPTOR DE REQUEST: Envía el Access Token
  api.interceptors.request.use((config) => {
    const authStore = useAuthStore()

    const token = authStore.accessToken

    const skipAuthHeader = config.skipAuth || false

    // Si existe el token y la URL no es una ruta de autenticación abierta (opcional)
    if (token && !skipAuthHeader) {
      // Adjuntar el token como un header de autorización
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  // INTERCEPTOR DE RESPONSE: Maneja el 401 y Refresca
  api.interceptors.response.use(
    (response) => response, // Petición exitosa, no hacemos nada
    async (error) => {
      const originalRequest = error.config
      const authStore = useAuthStore()
      // Condición de Renovación:
      // 1. Error 401 (Unauthorized)
      // 2. No es un reintento (originalRequest._retry evita bucles)
      // 3. La URL no es ya el endpoint de refresco
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/token/refresh')
      ) {
        originalRequest._retry = true

        // Obtener el Refresh Token de la Store o localStorage
        const refreshToken = authStore.refreshToken || localStorage.getItem('refresh_token')

        if (!refreshToken) {
          // Si no hay Refresh Token, la sesión terminó.
          authStore.logoutGoogle()
          return Promise.reject(error)
        }

        try {
          console.log(`ACCESS TOKEN expirado. Intentando renovar con Refresh Token...`)
          const response = await api.post(
            '/owners/token/refresh',
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
              skipAuth: true,
            },
          )

          const { access_token, refresh_token } = response.data

          // Actualizar tokens en Pinia y localStorage
          authStore.$patch({ accessToken: access_token, refreshToken: refresh_token })
          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', refresh_token)

          // Actualizar el header de la petición original
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`

          // Reintentar la petición original que falló
          console.log('Renovación exitosa. Reintentando petición original.')
          return api(originalRequest)
        } catch (refreshError) {
          // El Refresh Token falló (expiró o fue inválido)
          console.error('Refresh Token falló. Forzando cierre de sesión. error: ' + refreshError)
          authStore.logoutGoogle()
          return Promise.reject(refreshError)
        }
      }

      // Para cualquier otro error (404, 500, etc.) o el error original 401 si ya se reintentó.
      return Promise.reject(error)
    },
  )
})

export { api }

# Documentación del Proyecto: Agenda Front

## 1. Visión General

Este proyecto es el frontend para una aplicación de gestión de turnos y agenda (SaaS), orientada inicialmente a negocios de servicios como peluquerías. Permite a los dueños gestionar sus calendarios y a los clientes reservar turnos.

## 2. Stack Tecnológico

- **Framework Frontend**: [Vue.js 3](https://vuejs.org/) (Composition API)
- **UI Framework**: [Quasar Framework](https://quasar.dev/) (Vite-based)
- **Gestión de Estado**: [Pinia](https://pinia.vuejs.org/)
- **Cliente HTTP**: [Axios](https://axios-http.com/)
- **Autenticación**: Firebase Auth (Google) + JWT propios (Backend Flask)
- **Backend (Referencia)**: API en Python con Flask

## 3. Arquitectura y Flujo de Autenticación

El sistema utiliza un modelo de autenticación híbrido para asegurar la identidad y manejar sesiones con el backend propio.

### Flujo de Login (`src/stores/auth.js`):

1.  **Inicio**: El usuario hace clic en "Ingresar".
2.  **Firebase**: Se invoca `signInWithPopup` con Google provider.
3.  **Token de Intercambio**: Al loguearse exitosamente en Firebase, se obtiene un `idToken`.
4.  **Validación Backend**: Este `idToken` se envía al endpoint `/owners/auth` del backend Flask.
5.  **Sesión Propia**: El backend valida el token de Google y responde con un par de tokens JWT propios (`access_token` y `refresh_token`).
6.  **Persistencia**: Los tokens se guardan en `localStorage` y en el store de Pinia.

### Manejo de Sesión (`src/boot/axios.js`):

- **Interceptor de Request**: Inyecta automáticamente el `Bearer <access_token>` en cada petición a la API (salvo excepciones).
- **Interceptor de Response**: Detecta errores `401 Unauthorized`. Si el token expira:
  - Pausa la petición original.
  - Intenta renovar el token usando el `refresh_token` en `/owners/token/refresh`.
  - Si renueva, actualiza el storage y reintenta la petición original.
  - Si falla, cierra la sesión (`logout`).

## 4. Estructura de Carpetas (`src/`)

- **/boot**: Archivos de inicialización. `axios.js` configura la instancia global de API y los interceptores.
- **/components**: Componentes Vue reutilizables.
  - `AbsolutCalendar.vue`: Componente core de la agenda.
  - `NabVar.vue`: Barra de navegación y botones de acción.
- **/layouts**: Plantillas base. `MainLayout.vue` define la estructura (Header + Page Container) y verifica la sesión al montar.
- **/pages**: Vistas principales.
  - `LandingPage.vue`: Página de inicio pública con información del producto.
  - `DashBoard.vue`: Vista privada del dueño (contiene el calendario).
- **/stores**: Módulos de estado global (Pinia).
  - `auth.js`: Lógica de usuario y tokens.
- **/router**: Configuración de rutas (`routes.js`).

## 5. Componentes Clave

### AbsolutCalendar.vue

Es el componente más complejo y central de la aplicación.

- **Propósito**: Mostrar la grilla semanal de turnos.
- **Implementación**:
  - Usa **CSS Grid** para la estructura base (columnas de días y filas de horas).
  - Usa **Posicionamiento Absoluto** (`absolute-appointments-layer`) para colocar los bloques de turnos (`appointment-bar`) con precisión de píxeles basada en la hora de inicio y duración.
- **Estado Actual**:
  - Fechas y turnos están, por el momento, _hardcodeados_ (variables como `BASE_DATE_STRING` y `rawAppointments`).
  - Calcula dinámicamente el inicio/fin de semana y alturas de celdas.

### LandingPage.vue

Página de presentación (Marketing). Muestra "features" del sistema usando un diseño de grid responsive de Quasar.

## 6. Estado Actual del Desarrollo

- **Autenticación**: ✅ Funcional (Login Google -> Backend JWT -> Refresh Token).
- **Navegación**: ✅ Básica implementada (Landing <-> Dashboard).
- **Calendario**: 🚧 En prototipo. Visualmente avanzado pero desconectado del backend (datos mockeados).
- **API**: Configurada la base y autenticación, falta integración de endpoints de datos de negocio (crear turnos, leer turnos reales).

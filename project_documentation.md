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
  - `DashboardCalendar.vue`: Componente completo de calendario (FullCalendar).
  - `NabVar.vue`: Barra de navegación y botones de acción.
- **/layouts**: Plantillas base.
  - `MainLayout.vue`: Layout para el Dashboard. Incluye Drawer lateral con Date Picker y verificador de sesión.
  - `LandingLayout.vue`: Layout simplificado para la Landing Page (sin drawer).
- **/pages**: Vistas principales.
  - `LandingPage.vue`: Página de inicio pública con información del producto.
  - `DashBoard.vue`: Vista privada del dueño. Contiene el componente `DashboardCalendar`.
- **/stores**: Módulos de estado global (Pinia).
  - `auth.js`: Lógica de usuario y tokens.
  - `calendar.js`: Estado de navegación de fecha y visibilidad del drawer.
- **/router**: Configuración de rutas (`routes.js`).

## 5. Componentes Clave

### DashboardCalendar.vue (FullCalendar)

Componente principal que sustituyó al prototipo manual `AbsolutCalendar`.

- **Librería**: Utiliza `@fullcalendar/vue3`.
- **Características**:
  - Vista semanal (`timeGridWeek`) como predeterminada en escritorio.
  - Vista diaria (`timeGridDay`) y ajustes simplificados en móviles (Responsivo).
  - Configuración regional en español (`esLocale`).
  - **Sincronización**: Escucha cambios en `calendarStore` para navegar a fechas específicas seleccionadas en el Drawer.
- **Manejo de Datos (Lazy Loading & Caché)**:
  - **Carga Diferida**: Pide al backend solo los eventos del rango visible (`GET /appointments?start=...&end=...`).
  - **Caché Temporal**: Implementa un `Map` interno para recordar los rangos de fechas ya visitados y evitar peticiones repetidas durante la sesión.
  - **Offline/Fallback**: Si la API falla, muestra datos de prueba (`MOCK_EVENTS`) y los cachea para simular funcionamiento offline.

### Navegación y Drawer

- **QDate (MainLayout)**: Selector de fecha en el panel lateral. Configurado con máscara `YYYY-MM-DD` para compatibilidad total con el store y persistencia de mes.
- **Store (`calendar.js`)**: Actúa como puente. `QDate` escribe en `selectedDate`, y `DashboardCalendar` vigila esa variable para hacer `calendarApi.gotoDate()`.

## 6. Estado Actual del Desarrollo

- **Autenticación**: ✅ Funcional (Login Google -> Backend JWT -> Refresh Token).
- **UI/UX**: ✅ Layouts separados (Landing vs Dashboard). Responsividad móvil implementada.
- **Calendario**: ✅ Integrado con FullCalendar. Lazy Loading y Caché funcionando.
- **API (Integración)**: 🚧 Frontend listo para consumir endpoint `/appointments` con filtros de fecha. Backend pendiente de desarrollo (Ver `backend_implementation_guide.md`).

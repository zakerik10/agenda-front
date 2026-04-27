# 📱 ZenAgenda - Frontend (Quasar)

### 🚧 Estado del Proyecto: EN DESARROLLO
Esta es la interfaz de usuario de ZenAgenda, construida con un enfoque en diseño premium, fluidez y una experiencia de usuario intuitiva tanto para dueños de negocio como para clientes finales.

---

## 🚀 Tecnologías Principales
*   **Framework**: [Quasar Framework](https://quasar.dev/) (v2)
*   **Core**: [Vue.js 3](https://vuejs.org/) (Composition API)
*   **Estado (State Management)**: [Pinia](https://pinia.vuejs.org/)
*   **Estilos**: Sass/SCSS & Flexbox (Quasar CSS Utilities)
*   **Iconos**: Material Design Icons (MDI) & Font Awesome
*   **Autenticación**: Firebase Client SDK (Social Login)

---

## 📂 Estructura del Proyecto
```bash
agenda-front/
├── src/
│   ├── api/          # Configuración de Axios y llamadas a la API
│   ├── boot/         # Inicialización de librerías (Firebase, Axios)
│   ├── components/   # Componentes reutilizables
│   ├── layouts/      # Estructuras de página (MainLayout, DashboardLayout)
│   ├── pages/        # Vistas principales de la aplicación
│   ├── stores/       # Estados de Pinia (Auth, Branch, Employee, etc.)
│   └── router/       # Configuración de rutas de Vue Router
├── public/           # Archivos estáticos
└── quasar.config.js  # Configuración del framework Quasar
```

---

## ✨ Características Destacadas
1.  **Diseño Glassmorphic**: Interfaz moderna con efectos de transparencia y desenfoque.
2.  **Dashboard Administrativo**: Gestión completa de sucursales, servicios y equipo.
3.  **Gestión de Roles**: Interfaz dinámica para configurar permisos granulares.
4.  **Booking Público**: Página optimizada para que los clientes reserven turnos mediante una URL única (slug).
5.  **Multi-Sucursal**: Cambio rápido entre sedes y visualización de datos filtrados.

---

## 🛠️ Instalación y Desarrollo

### 1. Requisitos Previos
*   Node.js (LTS recomendado)
*   Quasar CLI instalado globalmente: `npm install -g @quasar/cli`

### 2. Preparación
```bash
# Instalar dependencias
npm install
```

### 3. Variables de Entorno (`.env`)
> [!CAUTION]
> No incluyas tus claves reales de Firebase en este archivo si vas a subirlo a un repositorio público.
> Crea un archivo `.env` basado en el siguiente ejemplo:

```env
# Configuración de Firebase (Consola de Firebase)
VITE_apiKey= "tu_api_key"
VITE_authDomain= "tu_proyecto.firebaseapp.com"
VITE_projectId= "tu_proyecto"
VITE_storageBucket= "tu_proyecto.appspot.com"
VITE_messagingSenderId= "tu_sender_id"
VITE_appId= "tu_app_id"

# Configuración del Backend
VITE_flask_site="http://localhost"
VITE_flask_port="5000"
```

### 4. Ejecución
```bash
# Modo desarrollo
quasar dev

# Construcción para producción
quasar build
```

---

## 🎨 Guía de Estilo
El proyecto utiliza una paleta de colores personalizada definida en `src/css/quasar.variables.scss`. Se priorizan las micro-animaciones y las transiciones suaves para mejorar la percepción de calidad de la herramienta.

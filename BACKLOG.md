# Backlog Frontend - Agenda SaaS (Quasar/Vue)

**Focus**: UI/UX Premium, Componentes reutilizables y Tests E2E/Unitarios.

## 🎯 Sprint Actual: MVP Frontend Core

### 📋 To Do (Pendiente)

- [ ] **[Service] Capa de Comunicación API**
  - Implementar `services/appointmentService.js` con manejo de errores tipado.
- [ ] **[UI] Wizard de Reserva**
  - Crear flujo paso a paso:
    1. Seleccionar Sucursal (si aplica)
    2. Seleccionar Servicio
    3. Seleccionar Profesional
    4. Seleccionar Horario (Grid)
    5. Confirmación
- [ ] **[Quality] Configurar Vitest**
  - Asegurar que los componentes críticos tengan Tests Unitarios.
- [ ] **[Técnico] Routing de Sucursales**
  - Implementar soporte para rutas dinámicas `/b/:branch_slug` o similar.

### 🏗️ In Progress (En Curso)

- [x] Integración base de FullCalendar.

### ✅ Done (Terminado)

- [x] Layouts (Landing vs Dashboard).
- [x] Login con Google.

---

## 🧊 Icebox

- Cypress para tests E2E del flujo completo de reserva.
- Personalización de colores por marca (Theming dinámico).

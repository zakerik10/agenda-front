# Guía de Implementación Backend (Flask)

Este documento detalla los requerimientos técnicos para conectar el frontend (Vue/Quasar) con el backend (Flask), centrándose en la gestión de turnos y la sincronización con Google Calendar.

## 1. Endpoints de API Requeridos

El frontend ya está configurado para consumir los siguientes endpoints. El backend debe implementar estas rutas y devolver JSON.

### A. Gestión de Turnos (`/appointments`)

#### 1. Obtener Turnos (`GET /appointments`)

- **Propósito**: Cargar los turnos en el calendario de forma paginada/diferida.
- **Query Params (Requerido)**:
  - `start`: Fecha ISO de inicio de rango (ej: `2025-12-01`).
  - `end`: Fecha ISO de fin de rango (ej: `2026-01-01`).
  - _El backend debe filtrar y devolver solo los eventos que caigan en este rango._
- **Respuesta Esperada (JSON Array)**:
  ```json
  [
    {
      "id": "1",
      "title": "Corte de Pelo - Juan",
      "start": "2025-12-10T10:00:00",
      "end": "2025-12-10T11:00:00",
      "color": "#1976D2",
      "resourceId": "emp_1" // ID del empleado (para columnas)
    }
  ]
  ```

#### 2. Crear Turno (`POST /appointments`)

- **Body Esperado**:
  ```json
  {
    "id_client": 123,
    "id_service": 45,
    "id_employee": 1,
    "start": "2025-12-11T14:00:00"
    // "end" se calcula en backend sumando duración del servicio
  }
  ```

#### 3. Eliminar Turno (`DELETE /appointments/<id>`)

---

## 2. Estructura de Base de Datos (Definida por Usuario)

Basado en tu diagrama ERD, esta es la estructura relacional firme.

### Tablas Principales

1.  **Owner**: Dueño de la cuenta (SaaS).
2.  **Businesses (Sucursales)**:
    - `id_business` (PK)
    - `id_owner` (FK) -> Un dueño tiene N sucursales.
    - `name`, `address`.
3.  **Employees (Empleados)**:
    - `id_employee` (PK)
    - `id_business` (FK) -> Un empleado pertenece a una oficina específica.
    - `name`, `surename`, `mail`.
4.  **Services (Catálogo Global)**:
    - `id_service` (PK)
    - `id_owner` (FK) -> El catálogo es global para el dueño (ej: "Corte" es el mismo item conceptual).
    - `name`, `price`, `duration`.
5.  **Services_offered (Disponibilidad)**:
    - _Solución a tu duda_: Esta tabla intermedia es perfecta.
    - `id_service` (FK)
    - `id_employee` (FK)
    - **Lógica**: Si en la Sucursal A solo trabaja el Empleado 1, y ese empleado NO tiene link en esta tabla con el servicio "Color", entonces la Sucursal A no ofrece Color.
6.  **Clients**:
    - `id_client` (PK)
    - `id_business` (FK) -> Los clientes pertenecen a la sucursal.
7.  **Appointments (Turnos)**:
    - `id_appointment` (PK)
    - `id_business` (FK)
    - `id_employee` (FK) -> **Importante**: Saber QUIÉN atiende.
    - `id_service` (FK) -> Saber QUÉ se hace.
    - `id_client` (FK) -> **AGREGAR (Faltaba en diagrama)**: Saber QUIÉN viene.
    - `time_start` (Datetime)

---

## 3. Integración con Google Calendar

El backend actuará como intermediario (SaaS) entre el usuario y Google.

### Roadmap de Implementación

1.  **Habilitar API**:
    - En Google Cloud Console, habilitar **Google Calendar API**.
2.  **Modificar Autenticación (`/owners/auth`)**:
    - Validar usuario y obtener `refresh_token` de Google.

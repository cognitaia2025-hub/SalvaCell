---
name: agente-frontend-ui
description: Especialista en desarrollo de interfaz React para SalvaCell
---

# INSTRUCCIONES PARA EL AGENTE DESARROLLADOR FRONTEND

## CONTEXTO
Eres el desarrollador frontend del proyecto SalvaCell. Tu responsabilidad es implementar toda la interfaz de usuario en React con diseño responsive y PWA.

## DOCUMENTACIÓN DE REFERENCIA
Lee y analiza cuidadosamente los siguientes documentos en la carpeta `docs/`:
- PRD.md - SECCIÓN 2: HISTORIAS DE USUARIO (todas las US-*)
- PRD.md - SECCIÓN 6: WIREFRAMES Y MOCKUPS
- FSD.md - SECCIÓN 2.1: STACK TECNOLÓGICO (Frontend)
- SRS.md - SECCIÓN 4.4: USABILIDAD
- **docs/BACKEND_IMPLEMENTATION_REPORT.md** (generado por Agente-Backend-API)

## PREREQUISITOS
⚠️ **IMPORTANTE:** Este agente REQUIERE que el **Agente-Backend-API** haya terminado su trabajo.
Verifica que exista el archivo `docs/BACKEND_IMPLEMENTATION_REPORT.md` antes de comenzar.

## TUS RESPONSABILIDADES

### 1. ESTRUCTURA DEL PROYECTO FRONTEND

Crear la siguiente estructura:
```
frontend/
├── public/
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   └── robots.txt
├── src/
│   ├── assets/          # Imágenes, logos
│   ├── components/      # Componentes reutilizables
│   │   ├── ui/          # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── clientes/
│   │   │   ├── ClienteBadge.jsx
│   │   │   ├── ClienteCard.jsx
│   │   │   ├── ClienteTimeline.jsx
│   │   │   └── ClienteStats.jsx
│   │   ├── ordenes/
│   │   │   ├── OrdenCard.jsx
│   │   │   ├── OrdenStatusBadge.jsx
│   │   │   ├── OrdenTimeline.jsx
│   │   │   └── OrdenForm.jsx
│   │   └── shared/
│   │       ├── DataTable.jsx
│   │       ├── SearchBar.jsx
│   │       ├── Pagination.jsx
│   │       └── LoadingSpinner.jsx
│   ├── pages/           # Vistas principales
│   │   ├── Dashboard.jsx
│   │   ├── clientes/
│   │   │   ├── ClientesList.jsx
│   │   │   ├── ClienteProfile.jsx
│   │   │   └── ClienteForm.jsx
│   │   ├── ordenes/
│   │   │   ├── OrdenesList.jsx
│   │   │   ├── OrdenDetail.jsx
│   │   │   └── OrdenForm.jsx
│   │   ├── presupuestos/
│   │   ├── inventario/
│   │   ├── ventas/
│   │   ├── reportes/
│   │   ├── auth/
│   │   │   └── Login.jsx
│   │   └── public/
│   │       └── SeguimientoQR.jsx
│   ├── hooks/           # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useClientes.js
│   │   ├── useOrdenes.js
│   │   ├── useInventario.js
│   │   └── useDebounce.js
│   ├── store/           # Zustand stores
│   │   ├── authStore.js
│   │   ├── clientesStore.js
│   │   ├── ordenesStore.js
│   │   └── uiStore.js
│   ├── services/        # API calls (Axios)
│   │   ├── api.js       # Configuración base de Axios
│   │   ├── authService.js
│   │   ├── clienteService.js
│   │   ├── ordenService.js
│   │   └── reporteService.js
│   ├── utils/           # Helpers
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── vite.config.js
├── package.json
└── .env.example
```

### 2. IMPLEMENTAR TODAS LAS VISTAS

Según PRD.md sección 2 y wireframes sección 6:

#### **Dashboard (US-REP-001)**
- Vista de KPIs principales
- Gráfico de órdenes por estado (donut chart)
- Gráfico de ingresos semanales (line chart)
- Últimas órdenes (tabla)
- Alertas de stock bajo

#### **Clientes**

**Lista de Clientes (US-CLI-001):**
- Tabla con búsqueda por nombre/teléfono
- Badges visuales: 🌟 VIP, 🔄 Frecuente, 🆕 Nuevo
- Contador de órdenes totales
- Fecha de última visita
- Paginación

**Perfil Completo de Cliente (US-CLI-002):**
- Información general con badge de clasificación
- Timeline de reparaciones (todas las órdenes)
- Estadísticas del cliente:
  - Total órdenes
  - Ticket promedio
  - Total gastado (CLV)
  - Frecuencia de visitas
  - Dispositivo más reparado
  - Reparaciones más comunes
- Lista de equipos asociados
- Acciones rápidas: Nueva orden, Enviar mensaje, Ver pagos

**Alertas de Cliente (US-CLI-004):**
- 🔴 Alerta Roja: Órdenes listas para entregar (>3 días)
- 🟠 Alerta Naranja: Saldo pendiente de pago
- 🟢 Info Verde: Garantías activas vigentes

**Fusionar Clientes (US-CLI-005):**
- Herramienta de detección de duplicados
- Vista lado a lado para comparar perfiles
- Confirmación con advertencia de acción irreversible

#### **Presupuestos**

**Crear Presupuesto (US-PRES-001):**
- Formulario con datos de cliente
- Autocompletar si cliente existe
- Descripción del problema
- Estimación de costo y tiempo
- Generación de número de orden

**Aceptar/Rechazar (US-PRES-002):**
- Botones de acción
- Mostrar badge si cliente es recurrente
- Conversión automática a orden si acepta

#### **Órdenes**

**Lista de Órdenes (US-ORD-001):**
- Filtros por estado, cliente, fecha
- Vista de tarjetas con información clave
- Indicador de tiempo transcurrido
- Código de colores por estado

**Detalle de Orden (US-ORD-002, US-ORD-003):**
- Información completa del dispositivo y cliente
- Problema reportado
- Diagnóstico técnico (con opción de agregar fotos)
- Repuestos utilizados
- Timeline de estados
- Acciones: Cambiar estado, Agregar nota, Imprimir

**Historial del Cliente en Orden (US-ORD-006):**
- Sección "Historial del Cliente" dentro del detalle de orden
- Reparaciones previas del mismo cliente
- Destacar problemas similares

#### **Inventario**

**Stock de Repuestos (US-INV-001):**
- Tabla con cantidad actual
- Filtros por categoría
- Búsqueda por modelo compatible
- Indicador visual de stock bajo (<5 unidades)
- Precio unitario y de venta

**Registro de Entrada (US-INV-002):**
- Formulario de entrada de stock
- Búsqueda o creación de producto
- Datos de proveedor

**Alertas (US-INV-003):**
- Lista de productos con stock bajo
- Botón para marcar como "Pedido realizado"

#### **Ventas**

**Registrar Venta (US-VTA-001):**
- Formulario de venta rápida
- Opción de asociar a cliente existente
- Búsqueda de productos
- Agregar múltiples productos
- Descuento automático para clientes VIP
- Métodos de pago
- Generación de ticket

#### **Pagos**

**Registrar Pago (US-PAG-001):**
- Formulario con monto total
- Métodos: Efectivo, Tarjeta, Transferencia, Mixto
- Desglose para pago mixto
- Opción de anticipo
- Generación de recibo

**Arqueo de Caja (US-PAG-002):**
- Resumen por método de pago
- Desglose de ingresos
- Total de descuentos
- Botón "Cerrar Caja"

**Pagos Pendientes (US-PAG-003):**
- Lista de órdenes con saldo pendiente
- Filtros por antigüedad
- Botón de enviar recordatorio

**Historial de Pagos (US-PAG-004):**
- Tabla de todos los pagos del cliente
- Indicadores visuales de estado
- Estadísticas de comportamiento de pago

#### **Reportes**

**Dashboard (US-REP-001):**
- KPIs principales
- Gráficos interactivos

**Reporte de Ventas (US-REP-002):**
- Filtros por rango de fechas
- Desglose por tipo y método de pago
- Exportar a PDF/Excel

**Clientes Recurrentes (US-REP-004):**
- Análisis de retención
- Distribución de frecuencia
- CLV por segmento
- Top 10 clientes
- Tasa de conversión

#### **Seguimiento Público**

**Vista de QR (US-QR-002):**
- Página responsive sin login
- Timeline de progreso
- Estado actual
- Link para contactar al taller

### 3. COMPONENTES REUTILIZABLES (shadcn/ui + Custom)

#### **UI Base (shadcn/ui):**
- Button
- Input
- Select
- Modal/Dialog
- Alert
- Badge
- Card
- Table
- Tabs

#### **Componentes Custom:**

**ClienteBadge.jsx:**
```jsx
// Props: ordenesCount, ticketPromedio
// Lógica: Mostrar 🌟 VIP, 🔄 Frecuente, o 🆕 Nuevo
```

**OrdenTimeline.jsx:**
```jsx
// Props: historialEstados
// Visual: Timeline vertical con estados y timestamps
```

**DataTable.jsx:**
```jsx
// Props: columns, data, pagination, onPageChange
// Features: Ordenamiento, búsqueda, paginación
```

**ClienteTimeline.jsx:**
```jsx
// Props: ordenes (array)
// Visual: Timeline cronológica de todas las reparaciones
```

**LoadingSpinner.jsx:**
```jsx
// Loading state consistente en toda la app
```

### 4. STATE MANAGEMENT (Zustand)

#### **authStore.js:**
```javascript
{
  user: null,
  token: null,
  isAuthenticated: false,
  login: (credentials) => {},
  logout: () => {},
  checkAuth: () => {}
}
```

#### **clientesStore.js:**
```javascript
{
  clientes: [],
  selectedCliente: null,
  isLoading: false,
  fetchClientes: (filters) => {},
  getClienteById: (id) => {},
  createCliente: (data) => {},
  updateCliente: (id, data) => {}
}
```

#### **ordenesStore.js:**
```javascript
{
  ordenes: [],
  selectedOrden: null,
  fetchOrdenes: (filters) => {},
  createOrden: (data) => {},
  updateEstado: (id, estado) => {}
}
```

#### **uiStore.js:**
```javascript
{
  isSidebarOpen: true,
  isOffline: false,
  pendingChanges: 0,
  toggleSidebar: () => {},
  setOfflineStatus: (status) => {}
}
```

### 5. INTEGRACIÓN CON API (Axios)

#### **api.js (configuración base):**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logout automático
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### **Servicios por módulo:**
Implementar funciones para cada endpoint del backend

### 6. RESPONSIVE DESIGN (Tailwind CSS)

**Breakpoints:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

**Prioridad:** Mobile-first

**Testing en:**
- iPhone SE (375px)
- iPad (768px)
- Desktop (1920px)

### 7. GRÁFICOS (Recharts o Chart.js)

**Implementar:**
- Donut chart (órdenes por estado)
- Line chart (ingresos por día)
- Bar chart (top reparaciones)
- Pie chart (métodos de pago)

### 8. VARIABLES DE ENTORNO

Crear `.env.example`:
```
VITE_API_URL=http://localhost:5000/api
VITE_PUBLIC_URL=http://localhost:5173
```

## ENTREGABLES

Al finalizar tu trabajo, debes crear en la carpeta `docs/` el archivo:

**`docs/FRONTEND_IMPLEMENTATION_REPORT.md`** que incluya:

## 1. RESUMEN EJECUTIVO
- Vistas implementadas: [X/15]
- Componentes creados: [X]
- Estado de responsive design: [%]
- Integración con API: [Completa/Parcial]

## 2. VISTAS IMPLEMENTADAS

### Dashboard
- [x] KPIs principales
- [x] Gráfico órdenes por estado
- [x] Gráfico ingresos semanales
- [x] Últimas órdenes
- [x] Alertas de stock

### Clientes
- [x] Lista con búsqueda y paginación
- [x] Perfil completo con timeline
- [x] Estadísticas del cliente
- [x] Equipos asociados
- [x] Alertas de cliente
- [x] Herramienta de fusión

(Listar todas las vistas con estado)

## 3. COMPONENTES REUTILIZABLES

### UI Base (shadcn/ui)
- Button.jsx
- Input.jsx
- Select.jsx
- Modal.jsx
- Badge.jsx
- Card.jsx
- Table.jsx

### Custom Components
- ClienteBadge.jsx
- ClienteTimeline.jsx
- OrdenCard.jsx
- OrdenTimeline.jsx
- DataTable.jsx
- SearchBar.jsx
- Pagination.jsx
- LoadingSpinner.jsx

## 4. HISTORIAS DE USUARIO COMPLETADAS

- [x] US-CLI-001: Ver lista de clientes
- [x] US-CLI-002: Ver perfil completo
- [x] US-CLI-004: Alertas de cliente
- [x] US-CLI-005: Fusionar clientes
- [x] US-ORD-001: Ver lista de órdenes
- [x] US-ORD-002: Actualizar estado
- [x] US-ORD-006: Historial del cliente en orden
... 

## 5. INTEGRACIÓN CON API BACKEND

### Servicios implementados:
- authService.js (login, register, me)
- clienteService.js (CRUD + historial + estadísticas + fusionar)
- ordenService.js (CRUD + cambio de estado + refacciones)
- inventarioService.js (CRUD + movimientos + alertas)
- ventaService.js (crear venta, listar)
- pagoService.js (registrar, arqueo, historial)
- reporteService.js (dashboard, ventas, clientes recurrentes)

### Manejo de errores:
- Toast notifications para errores
- Loading states en todos los requests
- Retry automático en fallos de red

## 6. STATE MANAGEMENT (Zustand)

Stores implementados:
- authStore.js
- clientesStore.js
- ordenesStore.js
- inventarioStore.js
- uiStore.js

Persistencia en localStorage: Sí/No

## 7. RESPONSIVE DESIGN

| Vista | Mobile (375px) | Tablet (768px) | Desktop (1920px) |
|-------|----------------|----------------|------------------|
| Dashboard | ✅ | ✅ | ✅ |
| Clientes Lista | ✅ | ✅ | ✅ |
| Cliente Perfil | ✅ | ⚠️ | ✅ |
| Órdenes Lista | ✅ | ✅ | ✅ |
| Orden Detalle | ✅ | ✅ | ✅ |
| Reportes | ⚠️ | ✅ | ✅ |

## 8. GRÁFICOS IMPLEMENTADOS

| Gráfico | Tipo | Biblioteca | Responsive | Estado |
|---------|------|------------|-----------|--------|
| Órdenes por estado | Donut | Recharts | ✅ | ✅ |
| Ingresos semana | Line | Recharts | ✅ | ✅ |
| Top reparaciones | Bar | Chart.js | ✅ | ⚠️ |
| Métodos de pago | Pie | Recharts | ✅ | ✅ |

## 9. LIGHTHOUSE SCORE

### Desktop:
- Performance: [X/100]
- Accessibility: [X/100]
- Best Practices: [X/100]
- SEO: [X/100]

### Mobile:
- Performance: [X/100]
- Accessibility: [X/100]
- Best Practices: [X/100]
- SEO: [X/100]

## 10. ACCESIBILIDAD

- [x] Alt text en imágenes
- [x] Labels en inputs
- [x] ARIA labels en componentes interactivos
- [x] Navegación por teclado
- [x] Contraste de colores WCAG AA
- [x] Focus visible en elementos interactivos

## 11. OPTIMIZACIONES

- Lazy loading de componentes pesados
- Debounce en búsquedas
- Memoization con React.memo
- Paginación en listas largas
- Imágenes optimizadas
- Code splitting por rutas

## 12. BUGS CONOCIDOS

### Críticos:
- [Ninguno / Listar]

### Medios:
- [Listar si aplica]

### Bajos:
- [Listar si aplica]

## 13. DEPENDENCIAS PRINCIPALES

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-*": "shadcn/ui components",
    "recharts": "^2.10.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0"
  }
}
```

## 14. INTEGRACIÓN CON OTROS AGENTES

- **Backend-API:** Integración completa con todos los endpoints ✅
- **PWA-Offline:** Pendiente integrar Service Worker y sincronización
- **Notificaciones:** UI para ver log de notificaciones ✅

## 15. PRÓXIMOS PASOS

- [ ] Integrar Service Worker (coordinar con Agente-PWA)
- [ ] Agregar tests E2E con Playwright
- [ ] Mejorar animaciones y transiciones
- [ ] Dark mode
- [ ] Internacionalización (i18n)
- [ ] Optimizar bundle size

## CRITERIOS DE ÉXITO
✅ 15+ vistas funcionales
✅ 100% responsive (mobile, tablet, desktop)
✅ Integración completa con API backend
✅ Lighthouse score > 90
✅ Todas las US-* implementadas
✅ Gráficos interactivos funcionando
✅ State management con Zustand operativo
✅ Documentación completa en docs/

## NOTAS IMPORTANTES
- Este agente DEPENDE del Agente-Backend-API
- Coordina con Agente-PWA para integración de Service Worker
- Usa exactamente los mismos nombres de campos que el backend
- Sigue las convenciones de Tailwind CSS y shadcn/ui
- Prioriza UX mobile-first
# SRS - Software Requirements Specification
## SalvaCell - Sistema de Gestión de Reparaciones

**Versión:** 1.0  
**Fecha:** 2026-01-01  
**Basado en:** BRD v1.0, PRD v1.1, FSD v1.0

---

## 1. INTRODUCCIÓN

### 1.1 Propósito
Este documento especifica los requerimientos de software para SalvaCell, definiendo arquitectura, tecnologías, integraciones y requisitos no funcionales.

### 1.2 Alcance
Sistema web progresivo (PWA) para gestión integral de taller de reparación de celulares con capacidad offline, notificaciones automáticas y seguimiento por QR.

### 1.3 Definiciones y Acrónimos
- **PWA:** Progressive Web App
- **JWT:** JSON Web Token
- **RBAC:** Role-Based Access Control
- **CLV:** Customer Lifetime Value
- **ORM:** Object-Relational Mapping
- **CORS:** Cross-Origin Resource Sharing

---

## 2. DESCRIPCIÓN GENERAL DEL SISTEMA

### 2.1 Perspectiva del Producto
Sistema standalone con arquitectura cliente-servidor, deployado en servicios cloud gratuitos/económicos.

### 2.2 Funciones del Producto
1. Gestión de clientes con historial completo
2. Gestión de órdenes de reparación
3. Control de inventario (refacciones y accesorios)
4. Sistema de pagos y caja
5. Generación de reportes y estadísticas
6. Seguimiento público por QR
7. Notificaciones automáticas WhatsApp
8. Modo offline con sincronización

### 2.3 Características de Usuarios
- **Administrador:** Control total del sistema
- **Técnico:** Gestión de reparaciones e inventario
- **Recepcionista:** Atención al cliente, presupuestos, pagos
- **Cliente:** Solo acceso público a seguimiento

### 2.4 Restricciones
- Presupuesto limitado (servicios gratuitos prioritarios)
- Deploy en servicios cloud (Vercel + Railway)
- Un solo idioma (español)
- Sin facturación electrónica (fase 1)

---

## 3. REQUERIMIENTOS FUNCIONALES ESPECÍFICOS

### 3.1 Autenticación y Autorización

**RF-AUTH-001:** El sistema debe implementar autenticación con JWT
- Token expira en 8 horas
- Password hasheado con bcrypt
- Middleware de verificación en todas las rutas protegidas

**RF-AUTH-002:** El sistema debe implementar RBAC con 3 roles
- ADMIN: Acceso completo
- TECNICO: Órdenes, inventario (salidas), clientes (lectura)
- RECEPCIONISTA: Presupuestos, clientes, ventas, pagos

**RF-AUTH-003:** El sistema debe registrar actividad de usuarios en tabla de auditoría

---

### 3.2 Gestión de Clientes

**RF-CLI-001:** El sistema debe permitir búsqueda de clientes por:
- Nombre (parcial, case-insensitive)
- Teléfono (normalizado sin formato)
- Email

**RF-CLI-002:** El sistema debe calcular y mostrar badges automáticamente:
- VIP: >10 órdenes O ticket promedio >$500
- Frecuente: 5-10 órdenes
- Nuevo: <5 órdenes

**RF-CLI-003:** El sistema debe mostrar perfil completo del cliente con:
- Información de contacto
- Estadísticas: total órdenes, ticket promedio, CLV, frecuencia de visitas
- Timeline de reparaciones (paginado)
- Lista de equipos asociados
- Historial de pagos

**RF-CLI-004:** El sistema debe detectar duplicados por:
- Similitud de nombre (Levenshtein distance)
- Mismo teléfono con formato diferente

**RF-CLI-005:** El sistema debe permitir fusión de clientes duplicados:
- Transferir todas las órdenes al cliente principal
- Consolidar equipos sin duplicar IMEI
- Sumar estadísticas
- Registrar acción en auditoría

**RF-CLI-006:** El sistema debe mostrar alertas al buscar cliente:
- Órdenes pendientes de entrega
- Adeudos pendientes
- Garantías activas

---

### 3.3 Gestión de Presupuestos

**RF-PRE-001:** El sistema debe generar folio automático: PRE-{YYYY}{MM}{###}

**RF-PRE-002:** El sistema debe calcular fecha de vencimiento basado en vigenciaDias

**RF-PRE-003:** El sistema debe permitir convertir presupuesto ACEPTADO a orden:
- Copiar datos del cliente y equipo
- Generar nuevo folio de orden
- Marcar presupuesto como ACEPTADO
- Vincular orden al presupuesto (presupuestoId)

**RF-PRE-004:** El sistema debe permitir envío por WhatsApp con plantilla personalizable

---

### 3.4 Gestión de Órdenes

**RF-ORD-001:** El sistema debe generar folio automático: ORD-{YYYY}{MM}{###}

**RF-ORD-002:** El sistema debe calcular adeudo automáticamente: costoTotal - anticipo

**RF-ORD-003:** El sistema debe asignar garantía automática según tipo de refacción:
- Original: 30 días
- Genérica: 15 días
- Reparación local: 15 días

**RF-ORD-004:** El sistema debe registrar cada cambio de estado en HistorialEstadoOrden:
- Estado anterior
- Estado nuevo
- Usuario que realizó el cambio
- Fecha/hora
- Notas opcionales

**RF-ORD-005:** El sistema NO debe permitir cambiar a ENTREGADO si adeudo > 0

**RF-ORD-006:** El sistema debe enviar notificación automática al cambiar a TERMINADO

**RF-ORD-007:** El sistema debe mostrar historial del cliente al abrir una orden:
- Órdenes previas del mismo cliente
- Destacar reparaciones del mismo equipo (IMEI)
- Destacar reparaciones del mismo tipo

**RF-ORD-008:** El sistema debe permitir agregar refacciones a la orden:
- Validar stock disponible
- Descontar de stockActual
- Registrar en OrdenRefaccion
- Actualizar costoTotal

---

### 3.5 Gestión de Inventario

**RF-INV-001:** El sistema debe generar alerta cuando stockActual < stockMinimo

**RF-INV-002:** El sistema debe registrar cada movimiento en MovimientoInventario:
- ENTRADA: Compra de nuevos productos
- SALIDA: Uso en reparación
- AJUSTE: Corrección manual

**RF-INV-003:** El sistema NO debe permitir salida si stockActual < cantidad solicitada

**RF-INV-004:** El sistema debe mostrar lista de "Refacciones a reabastecer" en dashboard

---

### 3.6 Ventas y Accesorios

**RF-VTA-001:** El sistema debe generar folio automático para ventas: VTA-{YYYY}{MM}{###}

**RF-VTA-002:** El sistema debe permitir ventas asociadas a cliente o anónimas

**RF-VTA-003:** El sistema debe aplicar descuento automático a clientes VIP (configurable)

**RF-VTA-004:** El sistema debe descontar stock de accesorios al registrar venta

**RF-VTA-005:** El sistema debe registrar ventas en historial del cliente (si aplica)

---

### 3.7 Pagos

**RF-PAG-001:** El sistema debe permitir métodos de pago: EFECTIVO, TARJETA, TRANSFERENCIA

**RF-PAG-002:** El sistema debe permitir pagos parciales (anticipos)

**RF-PAG-003:** El sistema debe actualizar campo adeudo en Orden al registrar pago

**RF-PAG-004:** El sistema debe generar recibo de pago con:
- Folio de orden/venta
- Datos del cliente
- Detalle del pago
- Método de pago
- Fecha y hora

**RF-PAG-005:** El sistema debe generar reporte de arqueo de caja:
- Total por método de pago
- Desglose: órdenes, anticipos, ventas
- Total de descuentos
- Diferencia vs efectivo esperado

---

### 3.8 Reportes y Estadísticas

**RF-REP-001:** Dashboard debe mostrar KPIs en tiempo real:
- Órdenes activas
- Ingresos del día
- Ingresos del mes
- Stock crítico
- Órdenes por estado (gráfico)

**RF-REP-002:** Reporte de ventas debe incluir:
- Filtros por rango de fechas
- Desglose por tipo (reparaciones vs accesorios)
- Desglose por método de pago
- Total ingresos, costos, utilidad

**RF-REP-003:** Reporte de clientes recurrentes debe incluir:
- Lista de clientes con >3 visitas
- Clientes nuevos vs recurrentes por período
- Tasa de retención (%)
- CLV promedio por segmento
- Top 10 clientes por valor total
- Exportable a PDF y Excel

**RF-REP-004:** Reporte de reparaciones comunes debe incluir:
- Top 10 tipos de reparación
- Cantidad de cada una
- Porcentaje del total
- Gráfico de barras

---

### 3.9 QR y Seguimiento Público

**RF-QR-001:** El sistema debe generar QR único por orden con formato:
```
https://app.salvacell.com/public/orden/{ordenId}
```

**RF-QR-002:** El endpoint público `/public/orden/:ordenId` debe:
- NO requerir autenticación
- Mostrar solo: folio, estado, fechaEstimadaEntrega, historial de estados
- NO exponer datos sensibles (teléfono, dirección, costos detallados)

**RF-QR-003:** La página de seguimiento debe ser responsive y mobile-first

**RF-QR-004:** El QR debe imprimirse en el ticket de recepción

---

### 3.10 Notificaciones

**RF-NOT-001:** El sistema debe enviar notificación automática al cliente cuando:
- Orden cambia a EN_REPARACION
- Orden cambia a TERMINADO
- Equipo no se retira en 48h de estar listo (recordatorio)

**RF-NOT-002:** El sistema debe soportar canales:
- WhatsApp (prioritario)
- SMS (opcional)
- Email (opcional)

**RF-NOT-003:** Las plantillas de mensajes deben ser configurables

**RF-NOT-004:** El sistema debe personalizar mensajes para clientes recurrentes:
- Incluir nombre del cliente
- Mencionar "nuevamente" o "de nuevo"

**RF-NOT-005:** El sistema debe registrar log de notificaciones enviadas:
- Fecha/hora
- Canal
- Estado (enviado/fallido)
- Respuesta del proveedor

---

### 3.11 Modo Offline (PWA)

**RF-OFF-001:** El sistema debe funcionar offline para:
- Consultar clientes existentes (cached)
- Crear nuevas órdenes (guardadas en IndexedDB)
- Consultar inventario (cached)

**RF-OFF-002:** El sistema debe sincronizar al reconectar:
- Enviar cambios pendientes en orden FIFO
- Mostrar indicador de sincronización
- Notificar éxito/error de sincronización

**RF-OFF-003:** El sistema debe manejar conflictos:
- Estrategia: último cambio gana (basado en timestamp)
- Registrar conflictos en log

**RF-OFF-004:** El sistema debe mostrar indicador visual de estado:
- Verde: Online
- Amarillo: Sincronizando
- Gris: Offline

---

## 4. REQUERIMIENTOS NO FUNCIONALES

### 4.1 Rendimiento

**RNF-PER-001:** Tiempo de respuesta API < 500ms (percentil 95)

**RNF-PER-002:** Tiempo de carga inicial (FCP) < 2 segundos

**RNF-PER-003:** Tiempo de búsqueda de cliente con >50 órdenes < 1 segundo

**RNF-PER-004:** Generación de reportes complejos < 5 segundos

**RNF-PER-005:** Soporte para mínimo 50 usuarios concurrentes

---

### 4.2 Escalabilidad

**RNF-ESC-001:** Base de datos debe soportar:
- 10,000+ órdenes sin degradación
- 5,000+ clientes
- 1,000+ productos en inventario

**RNF-ESC-002:** Índices de base de datos en:
- clientes.telefono
- clientes.nombre + apellido
- ordenes.folio
- ordenes.clienteId
- ordenes.fechaIngreso
- equipos.imei
- refacciones.stockActual

**RNF-ESC-003:** Paginación obligatoria en listas con >100 registros

---

### 4.3 Disponibilidad

**RNF-DIS-001:** Sistema disponible 99% del tiempo (permite ~7h downtime/mes)

**RNF-DIS-002:** Backup automático diario de base de datos

**RNF-DIS-003:** Tiempo de recuperación ante fallas < 1 hora

**RNF-DIS-004:** Modo offline debe cubrir interrupciones de internet

---

### 4.4 Usabilidad

**RNF-USA-001:** Interfaz en español (México)

**RNF-USA-002:** Diseño responsive: móvil (320px+), tablet (768px+), desktop (1024px+)

**RNF-USA-003:** Accesibilidad WCAG 2.1 nivel AA

**RNF-USA-004:** Atajos de teclado para acciones frecuentes

**RNF-USA-005:** Confirmación obligatoria antes de acciones destructivas (eliminar, cancelar)

**RNF-USA-006:** Mensajes de error claros y accionables

---

### 4.5 Seguridad

**RNF-SEG-001:** Contraseñas hasheadas con bcrypt (10 salt rounds)

**RNF-SEG-002:** JWT firmado con secret seguro (min 256 bits)

**RNF-SEG-003:** HTTPS obligatorio en producción

**RNF-SEG-004:** CORS configurado para origen específico (no wildcard)

**RNF-SEG-005:** Rate limiting en endpoints críticos:
- Login: 5 intentos por minuto por IP
- APIs públicas: 100 requests por minuto

**RNF-SEG-006:** Validación de entrada en todas las APIs (Zod)

**RNF-SEG-007:** SQL injection prevention (Prisma ORM)

**RNF-SEG-008:** XSS prevention (sanitización de inputs)

**RNF-SEG-009:** Auditoría de acciones críticas:
- Creación/edición/eliminación de usuarios
- Fusión de clientes
- Cambios en configuración

---

### 4.6 Mantenibilidad

**RNF-MAN-001:** Código versionado en Git (GitHub)

**RNF-MAN-002:** Arquitectura modular y separación de capas:
- Presentación (React)
- Lógica de negocio (Backend services)
- Acceso a datos (Prisma)

**RNF-MAN-003:** Documentación de APIs con Swagger/OpenAPI

**RNF-MAN-004:** Comentarios en código para lógica compleja

**RNF-MAN-005:** Logs estructurados con niveles (error, warn, info, debug)

**RNF-MAN-006:** Variables de entorno para configuración sensible

---

### 4.7 Portabilidad

**RNF-POR-001:** Frontend ejecutable en cualquier navegador moderno

**RNF-POR-002:** Backend ejecutable en cualquier entorno con Node.js 18+

**RNF-POR-003:** Base de datos PostgreSQL (portable entre proveedores)

---

### 4.8 Compatibilidad

**RNF-COM-001:** Navegadores soportados:
- Chrome/Edge 100+
- Firefox 100+
- Safari 15+

**RNF-COM-002:** Sistemas operativos:
- Windows 10+
- macOS 11+
- Linux (distribuciones modernas)
- Android 10+ (móvil)
- iOS 14+ (móvil)

---

## 5. ARQUITECTURA DEL SISTEMA

### 5.1 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────┐
│                   CLIENTE                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Desktop │  │  Tablet  │  │   Móvil  │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │             │              │            │
│       └─────────────┴──────────────┘            │
│                     │                            │
│          React App (PWA) + Service Worker       │
│                     │                            │
└─────────────────────┼────────────────────────────┘
                      │ HTTPS
                      │
┌─────────────────────▼────────────────────────────┐
│              API REST (Express.js)               │
│  ┌────────────┐  ┌────────────┐  ┌───────────┐ │
│  │ Controllers│  │  Services  │  │Middleware │ │
│  └────────────┘  └────────────┘  └───────────┘ │
│         │              │                │        │
│         └──────────────┴────────────────┘        │
│                        │                         │
│              ┌─────────▼─────────┐               │
│              │   Prisma ORM      │               │
│              └─────────┬─────────┘               │
└────────────────────────┼─────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────┐
│            PostgreSQL Database                   │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │Clientes│ │Órdenes │ │Inventar│ │ Pagos  │   │
│  └────────┘ └────────┘ └────────┘ └────────┘   │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│          SERVICIOS EXTERNOS                      │
│  ┌────────────┐        ┌──────────────┐         │
│  │  WhatsApp  │        │   Storage    │         │
│  │ (WAHA/Twilio)│      │  (Backups)   │         │
│  └────────────┘        └──────────────┘         │
└──────────────────────────────────────────────────┘
```

### 5.2 Tecnologías por Capa

**Frontend:**
- React 18 + Vite
- Tailwind CSS + shadcn/ui
- Zustand (state)
- React Router
- Axios
- Workbox (Service Worker)
- Dexie.js (IndexedDB)

**Backend:**
- Node.js 18 LTS
- Express.js
- Prisma ORM
- JWT (jsonwebtoken)
- Zod (validation)
- Multer (uploads)
- Winston (logging)

**Base de Datos:**
- PostgreSQL 15+

**Hosting:**
- Frontend: Vercel
- Backend: Railway
- Database: Railway/Supabase

**CI/CD:**
- GitHub Actions

---

## 6. MODELO DE DESPLIEGUE

### 6.1 Entornos

**Desarrollo:**
- Local (localhost:3000 frontend, localhost:5000 backend)
- SQLite o PostgreSQL local

**Staging:**
- Vercel (preview deployments)
- Railway (staging branch)
- Base de datos de prueba

**Producción:**
- Vercel (main branch)
- Railway (main branch)
- PostgreSQL en Railway/Supabase
- Dominio custom (opcional)

### 6.2 Variables de Entorno

**Backend (.env):**
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
PORT=5000
NODE_ENV=production
WHATSAPP_API_URL=...
WHATSAPP_API_KEY=...
```

**Frontend (.env):**
```
VITE_API_URL=https://api.salvacell.com
VITE_PUBLIC_URL=https://app.salvacell.com
```

---

## 7. ESTRATEGIA DE TESTING

### 7.1 Tests Unitarios

**Cobertura mínima:** 70%

**Herramientas:**
- Frontend: Vitest + React Testing Library
- Backend: Jest

**Prioridad alta:**
- Reglas de negocio (cálculos, validaciones)
- Utilidades (formateo, normalización)
- Hooks custom

### 7.2 Tests de Integración

**Herramientas:**
- Supertest (APIs)
- Playwright (E2E)

**Escenarios críticos:**
- Flujo completo de orden (crear → actualizar estado → pagar → entregar)
- Flujo de presupuesto → orden
- Fusión de clientes duplicados
- Sincronización offline

### 7.3 Tests de Performance

**Herramientas:**
- Lighthouse (frontend)
- Artillery (backend load testing)

**Métricas objetivo:**
- Lighthouse score > 90
- API p95 < 500ms
- 50 usuarios concurrentes sin degradación

---

## 8. PLAN DE MIGRACIÓN Y DATOS INICIALES

### 8.1 Seed Data

**Usuarios iniciales:**
- Admin (email: admin@salvacell.com, password: configurable)

**Configuración inicial:**
```javascript
{
  nombre_taller: "SalvaCell",
  telefono_taller: "555-1234",
  direccion_taller: "Calle Principal #123",
  dias_garantia_default: 15,
  stock_minimo_default: 5,
  mensaje_whatsapp_listo: "Hola {cliente}, tu {equipo} está listo..."
}
```

**Categorías de refacciones:**
- Pantallas
- Baterías
- Conectores de carga
- Cámaras
- Bocinas
- Micrófonos
- Otros

**Tipos de reparación comunes:**
- Cambio de pantalla
- Cambio de batería
- Reparación de centro de carga
- Actualización de software
- Liberación de equipo

### 8.2 Migración de Datos Existentes (si aplica)

**Proceso:**
1. Exportar datos de sistema actual (CSV/JSON)
2. Script de transformación
3. Validación de integridad
4. Importación incremental
5. Verificación post-migración

---

## 9. MONITOREO Y MANTENIMIENTO

### 9.1 Logs

**Eventos a loggear:**
- Errores de API (level: error)
- Autenticación fallida (level: warn)
- Creación de órdenes (level: info)
- Cambios de estado de orden (level: info)
- Notificaciones enviadas (level: info)

**Herramienta:** Winston (local) o Sentry (producción)

### 9.2 Métricas

**KPIs Técnicos:**
- Uptime (%)
- Tiempo de respuesta promedio API
- Tasa de errores (%)
- Uso de CPU y memoria

**KPIs de Negocio:**
- Órdenes creadas por día
- Tasa de conversión presupuesto → orden
- Tiempo promedio de reparación
- Clientes nuevos vs recurrentes

### 9.3 Backups

**Frecuencia:** Diaria (automático)
**Retención:** 30 días
**Pruebas de restauración:** Mensual

---

## 10. ROADMAP DE IMPLEMENTACIÓN

### 10.1 Fase 1: MVP (Semanas 1-4) ⭐ PRIORIDAD
- Setup de proyecto (repos, CI/CD)
- Base de datos (Prisma schema + migraciones)
- Autenticación y usuarios
- **CRUD Clientes con badges y historial**
- CRUD Órdenes básicas
- Dashboard simple
- Deploy inicial

### 10.2 Fase 2: Operaciones Completas (Semanas 5-7)
- Gestión de inventario (refacciones + accesorios)
- Sistema de pagos
- Ventas de accesorios
- Presupuestos
- Generación de tickets/recibos

### 10.3 Fase 3: Automatización (Semanas 8-9)
- QR y seguimiento público
- Notificaciones WhatsApp
- PWA y modo offline

### 10.4 Fase 4: Reportes y Optimización (Semanas 10-11)
- Dashboard completo con KPIs
- Reportes de ventas, productividad, clientes
- Herramienta de fusión de clientes
- Optimización de performance

### 10.5 Fase 5: Testing y Launch (Semana 12)
- Tests E2E
- Testing de carga
- Documentación de usuario
- Capacitación
- Go Live

---

## 11. CRITERIOS DE ACEPTACIÓN FINAL

### 11.1 Funcionales
- ✅ Todos los RF implementados y funcionando
- ✅ Flujo completo de orden probado
- ✅ Historial de cliente con timeline funcional
- ✅ Notificaciones automáticas operativas
- ✅ Modo offline funcional

### 11.2 No Funcionales
- ✅ RNF-PER: API < 500ms, carga < 2s
- ✅ RNF-SEG: HTTPS, JWT, RBAC implementado
- ✅ RNF-DIS: Backup diario configurado
- ✅ Lighthouse score > 90
- ✅ Cobertura de tests > 70%

### 11.3 Documentación
- ✅ README con instrucciones de instalación
- ✅ API documentada (Swagger)
- ✅ Manual de usuario
- ✅ Guía de deployment

---

## 12. APÉNDICES

### 12.1 Glosario Técnico
- **Service Worker:** Script que corre en background del navegador, permite funcionalidad offline
- **IndexedDB:** Base de datos del navegador para almacenamiento local
- **Prisma:** ORM moderno para Node.js y TypeScript
- **JWT:** Estándar abierto para tokens de autenticación
- **shadcn/ui:** Colección de componentes React reutilizables

### 12.2 Referencias
- [Prisma Docs](https://www.prisma.io/docs)
- [React PWA Guide](https://create-react-app.dev/docs/making-a-progressive-web-app/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 13. APROBACIONES

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Product Owner | Salvador | | 2026-01-01 |
| Tech Lead | | | |
| QA Lead | | | |

---

**Estado del Documento:** ✅ APROBADO PARA DESARROLLO

**Fin del SRS**
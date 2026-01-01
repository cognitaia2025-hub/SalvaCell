# 📋 LISTA COMPLETA DE AGENTES - SalvaCell

## 📊 EQUIPO DATABASE (4 agentes)

### ✅ 01.1-database-architect.md
**Tareas:**
- Diseño completo del schema de base de datos
- Definir todas las tablas y relaciones
- Crear migraciones de Prisma
- Establecer índices y constraints
- Documentar modelo de datos

---

### ❌ 01.2-db-clientes-equipos.md
**Tareas:**
- Implementar tabla `clientes` con todos sus campos
- Implementar tabla `equipos` y su relación con clientes
- Crear seeds de datos de prueba para clientes
- Implementar queries optimizadas para búsqueda de clientes
- Crear índices en teléfono, nombre, email

---

### ❌ 01.3-db-ordenes-presupuestos.md
**Tareas:**
- Implementar tablas `presupuestos` y `ordenes`
- Implementar tabla `historial_estados` para auditoría
- Implementar tabla `controles_entrega`
- Crear relaciones con clientes y equipos
- Generar seeds para estados de órdenes

---

### ❌ 01.4-db-inventario-pagos.md
**Tareas:**
- Implementar tabla `refacciones_catalogo`
- Implementar tabla `refacciones_usadas` (relación N:N con órdenes)
- Implementar tabla `pagos`
- Implementar tabla `ventas_accesorios`
- Crear seeds de refacciones comunes

---

## 🔌 EQUIPO BACKEND (4 agentes)

### ✅ 02.1-backend-setup. md
**Tareas:**
- Configuración inicial del proyecto Node.js + Express
- Setup de Prisma ORM
- Configuración de middleware (CORS, body-parser, compression)
- Setup de variables de entorno
- Estructura de carpetas del backend

---

### ✅ 03-auth-security.md
**Tareas:**
- Sistema de autenticación con JWT
- Middleware de autorización por roles
- Manejo de sesiones
- Encriptación de contraseñas
- Rate limiting y protección CSRF

---

### ✅ 04.1-clientes-backend.md
**Tareas:**
- CRUD completo de clientes (GET, POST, PUT, DELETE)
- Endpoint:  Ver historial completo del cliente
- Endpoint: Buscar cliente por nombre/teléfono
- Endpoint:  Detectar duplicados
- Endpoint: Fusionar clientes duplicados
- Endpoint: Estadísticas del cliente (CLV, frecuencia, equipos)
- Validaciones con Zod

---

### ✅ 05.1-presupuestos-backend.md
**Tareas:**
- CRUD de presupuestos
- Generación automática de folios PRE-{YYYY}{MM}{###}
- Endpoint: Convertir presupuesto en orden
- Endpoint: Enviar presupuesto por WhatsApp/Email
- Validación de vigencia
- Cambio de estados (Pendiente, Aceptado, Rechazado, Vencido)

---

## (Continuación BACKEND - reorganizados según tu estructura actual)

### ✅ 06.1-ordenes-backend.md
**Tareas:**
- CRUD completo de órdenes
- Generación automática de folios ORD-{YYYY}{MM}{###}
- Gestión de estados con historial
- Vinculación con refacciones (descuento automático de stock)
- Cálculo automático de adeudos
- Control de recepción del equipo
- Validación: no entregar si hay adeudo

---

### ❌ 07.1-inventario-backend.md
**Tareas:**
- CRUD de refacciones (catálogo)
- Endpoint: Registrar entrada de stock
- Endpoint: Consultar stock disponible
- Endpoint: Alertas de stock bajo
- Endpoint:  Historial de movimientos de inventario
- CRUD de ventas de accesorios
- Descuento automático de stock al vender

---

### ❌ 08.1-pagos-reportes-backend.md
**Tareas:**
- CRUD de pagos
- Endpoint: Registrar anticipo
- Endpoint: Registrar liquidación
- Endpoint: Ver órdenes con adeudo
- Endpoint:  Historial de pagos por cliente
- Endpoint: Arqueo de caja diario
- Endpoint: Reportes de ventas por período
- Endpoint: Reporte de clientes recurrentes vs nuevos
- Endpoint: Reporte de reparaciones más comunes

---

### ❌ 09.1-notificaciones-backend.md
**Tareas:**
- Sistema de envío de notificaciones
- Integración con WhatsApp (API o WAHA)
- Integración con Email (Nodemailer)
- Plantillas de mensajes personalizables
- Queue de notificaciones (opcional:  Bull/BeeQueue)
- Endpoint: Enviar notificación manual
- Logs de notificaciones enviadas

---

## 🎨 EQUIPO FRONTEND (4 agentes)

### ✅ 04.2-clientes-frontend. md
**Tareas:**
- Página:  Lista de clientes con búsqueda
- Página:  Perfil completo del cliente
- Componente: Timeline de reparaciones
- Componente:  Estadísticas del cliente
- Componente: Equipos asociados
- Formulario:  Editar datos de cliente
- Modal: Fusionar clientes duplicados
- Badges visuales (VIP, Frecuente, Nuevo)

---

### ✅ 05.2-presupuestos-frontend.md
**Tareas:**
- Página: Lista de presupuestos
- Formulario: Crear presupuesto
- Formulario: Editar presupuesto
- Botón: Convertir presupuesto en orden
- Modal: Enviar presupuesto (WhatsApp/Email)
- Filtros por estado y fecha

---

### ✅ 06.2-ordenes-frontend.md
**Tareas:**
- Página: Lista de órdenes con filtros
- Formulario: Crear orden (desde cero o desde presupuesto)
- Formulario: Editar orden
- Componente:  Cambio de estado de orden
- Componente:  Agregar refacciones a orden
- Componente: Control de recepción del equipo
- Vista:  Detalle completo de orden
- Botón: Imprimir orden
- Integración:  Historial del cliente desde orden

---

### ❌ 07.2-inventario-frontend.md
**Tareas:**
- Página:  Catálogo de refacciones
- Formulario: Agregar/editar refacción
- Formulario: Registrar entrada de stock
- Componente: Alertas de stock bajo
- Página: Historial de movimientos
- Página: Ventas de accesorios
- Formulario: Registrar venta rápida
- Componente:  Selector de productos con búsqueda

---

### ❌ 08.2-pagos-reportes-frontend.md
**Tareas:**
- Modal: Registrar pago (anticipo o liquidación)
- Página: Órdenes con adeudo pendiente
- Página: Arqueo de caja
- Dashboard: Métricas principales (KPIs)
- Página: Reporte de ventas
- Página: Reporte de clientes recurrentes
- Gráficos: Chart.js o Recharts
- Componente:  Exportar reportes a PDF/CSV

---

### ❌ 10.1-pwa-offline. md
**Tareas:**
- Configuración de Service Workers
- Setup de Workbox
- Configuración de manifest.json
- Estrategia de caché
- Sincronización offline → online
- IndexedDB para almacenamiento local (Dexie.js)
- Indicador visual de modo offline
- Queue de cambios pendientes

---

## 🧪 EQUIPO TESTING (3 agentes)

### ❌ 11.1-testing-unit.md
**Tareas:**
- Tests unitarios para servicios de backend
- Tests unitarios para utilidades
- Tests unitarios para validadores (Zod)
- Setup de Jest
- Mocks de Prisma
- Cobertura mínima:  70%

---

### ❌ 11.2-testing-integration.md
**Tareas:**
- Tests de integración de APIs
- Tests de endpoints completos
- Setup de base de datos de prueba
- Tests de transacciones
- Tests de autenticación y autorización
- Postman/Thunder Client collections

---

### ❌ 11.3-testing-e2e.md
**Tareas:**
- Tests end-to-end con Playwright o Cypress
- Flujos completos: 
  - Crear cliente → presupuesto → orden → pago → entrega
  - Ver historial de cliente
  - Registro de venta de accesorio
- Tests de interfaz de usuario
- Tests de formularios

---

## 🚀 EQUIPO DEVOPS (4 agentes)

### ❌ 12.1-devops-ci-cd.md
**Tareas:**
- Configurar GitHub Actions para CI/CD
- Pipeline de build automático
- Pipeline de tests automáticos
- Linting y formateo (ESLint + Prettier)
- Deploy automático en staging
- Deploy manual/aprobado en producción

---

### ❌ 12.2-devops-database-backups.md
**Tareas:**
- Script de backup automático de PostgreSQL
- Programación diaria con cron
- Almacenamiento de backups (local o cloud)
- Script de restauración
- Pruebas de recuperación
- Documentación de procedimientos

---

### ❌ 12.3-devops-deployment.md
**Tareas:**
- Configuración de hosting (Vercel para frontend)
- Configuración de hosting (Railway/Render para backend)
- Configuración de PostgreSQL en producción
- Variables de entorno en producción
- Dominios y DNS
- HTTPS/SSL
- Documentación de deployment

---

### ❌ 12.4-devops-monitoring.md
**Tareas:**
- Setup de logs (Winston o Pino)
- Monitoreo de errores (Sentry - opcional)
- Monitoreo de performance
- Alertas por email/Slack en caso de errores críticos
- Dashboard de salud del sistema
- Documentación de troubleshooting

---

## 🎯 EQUIPO FEATURES ESPECIALES (4 agentes)

### ❌ 13.1-feature-qr-tracking.md
**Tareas:**
- Generación de QR único por orden
- Endpoint público:  Consultar estado por QR (sin auth)
- Página pública responsive de seguimiento
- Mostrar:  estado, fecha estimada, timeline
- Imprimir QR en ticket de orden
- Librería:  qrcode. react o similar

---

### ❌ 13.2-feature-chatbot.md
**Tareas:**
- Chatbot simple para consulta de órdenes
- Integración con WhatsApp Business API o webhook
- Comandos básicos: 
  - "Estado orden [folio]"
  - "Reglamento"
  - "Contacto"
- Respuestas automáticas
- Fallback a atención humana

---

### ❌ 13.3-feature-whatsapp-integration.md
**Tareas:**
- Integración con WAHA (WhatsApp HTTP API) o Twilio
- Función:  Enviar presupuesto
- Función: Notificar equipo listo
- Función: Enviar recordatorios de pago
- Plantillas de mensajes
- Personalización para clientes recurrentes
- Logs de mensajes enviados

---

### ❌ 13.4-feature-data-export-cleanup.md
**Tareas:**
- Endpoint:  Exportar datos a JSON
- Endpoint: Exportar datos a CSV
- Función: Limpieza de datos antiguos (>2 años)
- Alerta automática al llegar a 2000 órdenes
- Interfaz de usuario para exportar
- Confirmación antes de limpiar
- Backup automático antes de limpieza

---

## 📊 RESUMEN

✅ **Completados:** 9 agentes  
❌ **Pendientes:** 12 agentes  
📦 **Total:** 21 agentes

# Business Requirements Document (BRD)
## Sistema de Gestión de Reparaciones - SalvaCell

**Versión:** 1.0  
**Fecha:** 2024-12-31  
**Preparado para:** SalvaCell - Taller de Reparación de Celulares

---

## 1. Resumen Ejecutivo

### 1.1 Propósito del Documento
Este documento define los requisitos de negocio para el desarrollo de un sistema de gestión integral para SalvaCell, un taller de reparación de dispositivos móviles. El sistema permitirá automatizar y optimizar los procesos de recepción, seguimiento y entrega de reparaciones.

### 1.2 Alcance del Proyecto
El sistema abarcará:
- Gestión completa de órdenes de reparación
- Control de inventario de repuestos
- Administración de clientes
- Seguimiento de estado de reparaciones
- Generación de reportes y estadísticas
- Gestión de usuarios y permisos

---

## 2. Contexto del Negocio

### 2.1 Descripción del Negocio
SalvaCell es un taller especializado en reparación de dispositivos móviles que ofrece:
- Reparación de pantallas
- Cambio de baterías
- Reparaciones de software
- Reparación de componentes internos
- Servicio de diagnóstico

### 2.2 Problemas Actuales
1. Gestión manual de órdenes mediante hojas de papel
2. Dificultad para rastrear el estado de las reparaciones
3. Pérdida de información de clientes
4. Control inadecuado de inventario
5. Sin historial de clientes recurrentes ni seguimiento de múltiples reparaciones por cliente
6. Falta de reportes para toma de decisiones

### 2.3 Objetivos del Negocio
- Reducir tiempo de procesamiento de órdenes en 50%
- Mejorar satisfacción del cliente mediante mejor comunicación
- Optimizar control de inventario
- Aumentar capacidad de atención sin contratar más personal
- Generar insights para mejora continua del negocio

---

## 3. Requisitos Funcionales

### 3.1 Módulo de Órdenes de Reparación

#### 3.1.1 Creación de Órdenes
- **Información del Cliente:**
  - Nombre completo
  - Teléfono principal
  - Teléfono alternativo (opcional)
  - Email (opcional)

- **Información del Dispositivo:**
  - Marca
  - Modelo
  - IMEI/Serial
  - Contraseña/PIN (si aplica)
  - Accesorios incluidos

- **Detalles de la Reparación:**
  - Descripción del problema reportado
  - Diagnóstico técnico
  - Servicios/reparaciones a realizar
  - Costo estimado
  - Fecha estimada de entrega
  - Prioridad (Normal, Urgente)

#### 3.1.2 Seguimiento de Órdenes
- Estados del servicio:
  - Recibido
  - En diagnóstico
  - Esperando repuestos
  - En reparación
  - Reparado - Pendiente de entrega
  - Entregado
  - Cancelado

- Historial de cambios de estado con:
  - Usuario que realizó el cambio
  - Fecha y hora
  - Notas/comentarios

#### 3.1.3 Gestión de Clientes
- Base de datos centralizada de clientes (un cliente puede tener múltiples órdenes)
- **Historial completo de reparaciones por cliente:**
  - Todas las órdenes asociadas al mismo cliente
  - Visualización cronológica de servicios prestados
  - Equipos diferentes del mismo cliente (pueden traer varios dispositivos)
  - Totales acumulados: número de visitas, monto gastado total
- Teléfonos de contacto (principal y alterno)
- **Identificación de clientes recurrentes:**
  - Badge visual "Cliente VIP" (>5 órdenes)
  - Badge "Cliente Frecuente" (3-5 órdenes)
  - Primera visita claramente identificada
- **Relación cliente-equipos:** Un cliente puede tener múltiples equipos registrados
- **Relación cliente-órdenes:** Una orden siempre está vinculada a un cliente específico
- Búsqueda rápida por nombre, teléfono o equipo asociado

#### 3.1.4 Búsqueda y Filtros
- Búsqueda por:
  - Número de orden
  - Nombre del cliente
  - Teléfono
  - IMEI/Serial
  - Estado

- Filtros por:
  - Rango de fechas
  - Estado
  - Técnico asignado
  - Prioridad

### 3.2 Módulo de Inventario

#### 3.2.1 Gestión de Repuestos
- Catálogo de repuestos:
  - Código/SKU
  - Nombre/descripción
  - Categoría
  - Precio de compra
  - Precio de venta
  - Stock mínimo
  - Stock actual
  - Ubicación en bodega

#### 3.2.2 Control de Movimientos
- Registro de:
  - Entradas (compras)
  - Salidas (uso en reparaciones)
  - Ajustes de inventario
  - Devoluciones

- Para cada movimiento:
  - Fecha y hora
  - Usuario responsable
  - Cantidad
  - Motivo/referencia

#### 3.2.3 Alertas
- Notificación cuando stock alcanza nivel mínimo
- Reporte de productos sin movimiento
- Análisis de rotación de inventario

### 3.3 Módulo de Facturación

#### 3.3.1 Generación de Comprobantes
- Emisión de:
  - Recibos de recepción
  - Cotizaciones
  - Facturas/Tickets de venta

- Información incluida:
  - Datos del taller
  - Datos del cliente
  - Detalle de servicios y repuestos
  - Subtotal, impuestos, total
  - Método de pago
  - Garantía aplicable

#### 3.3.2 Métodos de Pago
- Soporte para:
  - Efectivo
  - Tarjeta
  - Transferencia
  - Pagos parciales (anticipos)

#### 3.3.3 Control de Caja
- Registro de ingresos y egresos
- Arqueo de caja
- Cierre diario

### 3.4 Módulo de Reportes

#### 3.4.1 Reportes Operativos
- Órdenes por período
- Servicios más solicitados
- Tiempo promedio de reparación
- Órdenes pendientes por técnico

#### 3.4.2 Reportes Financieros
- Ventas por período
- Ingresos por tipo de servicio
- Margen de utilidad
- Cuentas por cobrar

#### 3.4.3 Reportes de Inventario
- Valor del inventario
- Productos más utilizados
- Necesidades de reabastecimiento

#### 3.4.4 Reportes de Clientes
- Clientes más frecuentes
- Clientes nuevos vs recurrentes
- Satisfacción del cliente

### 3.5 Módulo de Administración

#### 3.5.1 Gestión de Usuarios
- Roles definidos:
  - Administrador (acceso completo)
  - Técnico (gestión de órdenes y reparaciones)
  - Recepcionista (recepción y entrega)
  - Bodeguero (gestión de inventario)

- Control de acceso por rol
- Registro de actividad de usuarios

#### 3.5.2 Configuración del Sistema
- Datos del negocio
- Parámetros de operación
- Plantillas de documentos
- Configuración de notificaciones

---

## 4. Requisitos No Funcionales

### 4.1 Usabilidad
- Interfaz intuitiva y fácil de usar
- Capacitación mínima requerida (< 2 horas)
- Soporte para dispositivos táctiles
- Responsive design (adaptable a tablets)

### 4.2 Rendimiento
- Tiempo de respuesta < 2 segundos para operaciones comunes
- Soporte para al menos 50 usuarios concurrentes
- Capacidad para almacenar historial de 5 años

### 4.3 Seguridad
- Autenticación de usuarios
- Encriptación de datos sensibles
- Respaldos automáticos diarios
- Registro de auditoría de acciones críticas

### 4.4 Disponibilidad
- Sistema disponible 99% del tiempo
- Modo offline básico para registro de órdenes
- Recuperación ante fallas < 1 hora

### 4.5 Compatibilidad
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Compatible con Windows 10+
- Acceso remoto seguro

---

## 5. Restricciones

### 5.1 Técnicas
- Desarrollo en tecnologías web modernas
- Base de datos relacional
- Hosting en servidor local o nube

### 5.2 Presupuestarias
- Inversión inicial limitada
- Preferencia por soluciones de código abierto
- Modelo de pago por suscripción si es cloud

### 5.3 Temporales
- Implementación fase 1: 3 meses
- Capacitación y puesta en marcha: 2 semanas

---

## 6. Supuestos

1. SalvaCell cuenta con:
   - Computadora con acceso a internet
   - Impresora para tickets/facturas
   - Personal básico capacitado en uso de computadoras

2. El negocio opera de lunes a sábado
3. Promedio de 15-25 órdenes diarias
4. Equipo de 2-3 técnicos

---

## 7. Dependencias

- Proveedor de hosting (si es solución cloud)
- Soporte técnico para implementación
- Capacitación del personal
- Migración de datos existentes (si aplica)

---

## 8. Criterios de Aceptación

### 8.1 Funcionalidad
- ✓ Todas las funcionalidades descritas operan correctamente
- ✓ Flujo completo de orden (creación → seguimiento → entrega) funcional
- ✓ Reportes generan información correcta

### 8.2 Rendimiento
- ✓ Sistema responde en tiempos establecidos
- ✓ Soporta carga de usuarios definida

### 8.3 Capacitación
- ✓ Personal puede operar sistema con supervisión mínima
- ✓ Documentación de usuario disponible

### 8.4 Migración
- ✓ Datos históricos migrados correctamente (si aplica)
- ✓ Operación en paralelo exitosa durante período de transición

---

## 9. Plan de Implementación

### Fase 1: Módulos Core (Mes 1-2)
- Órdenes de reparación
- Gestión básica de clientes
- Estados y seguimiento

### Fase 2: Inventario y Facturación (Mes 3)
- Control de inventario
- Generación de comprobantes
- Integración con órdenes

### Fase 3: Reportes y Optimización (Mes 4)
- Módulo de reportes
- Ajustes basados en feedback
- Capacitación final

---

## 10. Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Resistencia al cambio del personal | Media | Alto | Capacitación continua, involucrar al equipo desde el inicio |
| Pérdida de datos durante migración | Baja | Alto | Respaldos múltiples, pruebas exhaustivas |
| Fallas de internet/sistema | Media | Medio | Modo offline, respaldos automáticos |
| Costo mayor al presupuestado | Media | Medio | Desarrollo por fases, priorizar funcionalidades core |

---

## 11. Aprobaciones

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Dueño/Gerente SalvaCell | | | |
| Líder de Proyecto | | | |
| Representante Técnico | | | |

---

## 12. Anexos

### 12.1 Glosario
- **Orden:** Registro de servicio de reparación
- **IMEI:** Identificador único de dispositivo móvil
- **SKU:** Código de identificación de producto
- **Arqueo:** Conteo físico de efectivo en caja

### 12.2 Referencias
- Flujos de proceso actuales de SalvaCell
- Benchmarking de sistemas similares
- Normativa fiscal aplicable

---

**Fin del Documento**
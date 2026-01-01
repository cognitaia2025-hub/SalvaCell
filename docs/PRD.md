# PRD - SalvaCell
## Documento de Requerimientos del Producto

**Versión:** 1.1  
**Fecha:** 2026-01-01  
**Autor:** Equipo SalvaCell  

---

## 1. VISIÓN DEL PRODUCTO

SalvaCell es un sistema integral de gestión para talleres de reparación de celulares que optimiza el flujo de trabajo desde la recepción del equipo hasta la entrega final. El sistema centraliza información de órdenes, clientes, inventario y pagos, mejorando la eficiencia operativa y la experiencia del cliente.

**Nota v1.1:** Esta versión enfatiza el **seguimiento y análisis del historial de clientes**, permitiendo identificar clientes recurrentes, patrones de reparación y oportunidades de fidelización.

---

## 2. HISTORIAS DE USUARIO

### 2.1 MÓDULO DE PRESUPUESTO Y RECEPCIÓN

#### US-PRES-001: Crear Presupuesto Inicial
**Como** recepcionista  
**Quiero** crear un presupuesto rápido cuando un cliente llega con un dispositivo  
**Para** documentar el problema reportado y dar un estimado inicial

**Criterios de Aceptación:**
- Formulario con datos básicos del cliente (nombre, teléfono, email opcional)
- Sistema verifica si el cliente ya existe y ofrece autocompletar datos
- Selección rápida de tipo de dispositivo (marca, modelo)
- Campo de texto para descripción del problema
- Estimación de costo y tiempo de reparación
- Genera número de orden único
- Imprime ticket con número de orden y resumen

---

#### US-PRES-002: Aceptar o Rechazar Presupuesto
**Como** recepcionista  
**Quiero** registrar si el cliente acepta el presupuesto  
**Para** convertirlo en orden de trabajo o archivarlo

**Criterios de Aceptación:**
- Opción de marcar presupuesto como "Aceptado" o "Rechazado"
- Si acepta: orden pasa a estado "Pendiente de Reparación"
- Si rechaza: orden se archiva con motivo opcional
- Si el cliente tiene historial, muestra badge indicando cliente recurrente
- Notificación al técnico cuando hay nueva orden aceptada
- Registro de fecha y hora de aceptación/rechazo

---

### 2.2 MÓDULO DE ÓRDENES DE TRABAJO

#### US-ORD-001: Ver Lista de Órdenes Activas
**Como** técnico o recepcionista  
**Quiero** ver todas las órdenes activas en el sistema  
**Para** priorizar y gestionar el trabajo pendiente

**Criterios de Aceptación:**
- Lista con filtros por estado (Pendiente, En Proceso, Listo para Entregar)
- Búsqueda por número de orden, cliente o dispositivo
- Orden por antigüedad o prioridad
- Vista de tarjetas con información clave visible
- Indicador de tiempo transcurrido desde recepción
- Código de colores por estado

---

#### US-ORD-002: Actualizar Estado de Orden
**Como** técnico  
**Quiero** actualizar el progreso de una orden  
**Para** mantener informados al cliente y al equipo

**Criterios de Aceptación:**
- Estados disponibles: Pendiente → En Proceso → Listo para Entregar → Entregado
- Campo para agregar notas de progreso
- Registro de fecha/hora de cada cambio de estado
- Posibilidad de agregar fotos del proceso
- Notificación automática al cliente en ciertos estados
- Historial de cambios visible

---

#### US-ORD-003: Registrar Diagnóstico Técnico
**Como** técnico  
**Quiero** documentar el diagnóstico real del equipo  
**Para** justificar cambios en el presupuesto inicial

**Criterios de Aceptación:**
- Sección dedicada para diagnóstico técnico detallado
- Posibilidad de agregar imágenes del problema
- Campo para listar componentes que requieren reemplazo
- Actualización de costo si difiere del presupuesto inicial
- Opción de notificar al cliente si hay cambio significativo
- Registro de tiempo invertido en diagnóstico

---

#### US-ORD-004: Gestionar Repuestos Utilizados
**Como** técnico  
**Quiero** registrar los repuestos que utilizo en cada reparación  
**Para** mantener control de inventario y costos

**Criterios de Aceptación:**
- Buscador de repuestos disponibles en inventario
- Agregar múltiples repuestos a una orden
- Actualización automática de stock al asignar repuesto
- Cálculo automático de costo total de repuestos
- Validación de disponibilidad antes de asignar
- Opción de registrar repuesto usado pero no en inventario

---

#### US-ORD-005: Marcar Orden Como Lista para Entrega
**Como** técnico  
**Quiero** indicar cuando una reparación está completa  
**Para** que el cliente sea notificado y pueda recoger su equipo

**Criterios de Aceptación:**
- Botón visible de "Marcar como Listo"
- Validación de que diagnóstico y repuestos estén registrados
- Cambio automático de estado a "Listo para Entregar"
- Envío de notificación al cliente (SMS/Email/WhatsApp)
- Cálculo final de costo total
- Generación de checklist de calidad

---

#### US-ORD-006: Consultar Historial de Problemas Similares
**Como** técnico  
**Quiero** ver rápidamente si el cliente que estoy atendiendo ha tenido problemas similares antes  
**Para** acelerar el diagnóstico y brindar mejor servicio

**Criterios de Aceptación:**
- Al abrir una orden, mostrar sección "Historial del Cliente"
- Timeline visual de reparaciones previas del cliente
- Destacar reparaciones del mismo tipo de dispositivo
- Mostrar reparaciones con problemas similares (mismo componente/falla)
- Acceso rápido a diagnósticos anteriores y notas técnicas
- Indicador de tiempo desde última visita

---

### 2.3 MÓDULO DE CLIENTES

#### US-CLI-001: Ver Lista de Clientes
**Como** recepcionista o administrador  
**Quiero** ver el listado completo de clientes  
**Para** acceder a su información y historial

**Criterios de Aceptación:**
- Lista paginada de todos los clientes registrados
- Búsqueda por nombre, teléfono o email
- Indicadores visuales para tipos de cliente:
  - 🌟 Badge "VIP" para clientes con >10 órdenes o ticket promedio >$500
  - 🔄 Badge "Frecuente" para clientes con >5 órdenes
  - 🆕 Badge "Nuevo" para clientes con 1-2 órdenes
- Contador de órdenes totales por cliente
- Fecha de última visita visible
- Acceso rápido a perfil detallado
- Exportar lista a CSV/Excel

---

#### US-CLI-002: Ver Perfil Completo del Cliente
**Como** recepcionista o técnico  
**Quiero** ver el perfil completo de un cliente con todo su historial  
**Para** brindar servicio personalizado y tomar mejores decisiones

**Criterios de Aceptación:**

**Sección 1: Información General**
- Datos de contacto (nombre, teléfono, email, dirección)
- Fecha de primer visita y última visita
- Badges de clasificación:
  - 🌟 **VIP**: >10 órdenes o ticket promedio >$500
  - 🔄 **Frecuente**: 5-10 órdenes
  - 👤 **Regular**: <5 órdenes
- Botón de editar información de contacto

**Sección 2: Timeline de Reparaciones**
- Vista cronológica de TODAS las reparaciones (más reciente primero)
- Para cada reparación mostrar:
  - Fecha y número de orden
  - Dispositivo reparado
  - Problema reportado y diagnóstico
  - Estado actual
  - Monto pagado
  - Técnico asignado
- Filtros por: dispositivo, estado, rango de fechas
- Expandir/colapsar detalles de cada orden

**Sección 3: Equipos Asociados**
- Lista de todos los dispositivos que el cliente ha traído
- Agrupados por tipo (Marca - Modelo)
- Contador de veces que cada equipo ha sido reparado
- Acceso directo a órdenes de cada equipo

**Sección 4: Estadísticas del Cliente**
- **Dispositivo más reparado:** [Marca - Modelo] (X veces)
- **Reparaciones más comunes:** Top 3 tipos de falla
- **Frecuencia de visitas:** Promedio cada X días/semanas/meses
- **Ticket promedio:** $XXX
- **Total gastado:** $XXX (suma de todas las órdenes pagadas)
- **Última interacción:** Hace X días

**Sección 5: Acciones Rápidas**
- Botón "Nueva Orden para este Cliente"
- Botón "Enviar Mensaje"
- Botón "Ver Historial de Pagos"
- Botón "Generar Reporte del Cliente"

---

#### US-CLI-003: Analizar Patrones de Clientes Recurrentes
**Como** administrador  
**Quiero** identificar patrones en clientes recurrentes  
**Para** desarrollar estrategias de retención y mejorar el servicio

**Criterios de Aceptación:**
- Reporte de "Análisis de Clientes Recurrentes" con:
  - Lista de clientes con >3 visitas en últimos 6 meses
  - Tipos de problemas más frecuentes por cliente
  - Dispositivos con mayor tasa de re-reparación
  - Clientes con patrones de falla similares (posible defecto de fabricación)
  - Clientes que regresan en <30 días (posible garantía)
- Gráficos de:
  - Distribución de tiempo entre visitas
  - Tasa de retorno por tipo de reparación
  - Evolución del ticket promedio por cliente
- Exportar reporte a PDF
- Sugerencias automáticas (ej: "5 clientes candidatos a plan de mantenimiento")

---

#### US-CLI-004: Alertas de Cliente al Atender
**Como** recepcionista  
**Quiero** ver si un cliente tiene órdenes pendientes al atenderlo  
**Para** recordarle entregas pendientes o cobros

**Criterios de Aceptación:**
- Al buscar cliente en nueva orden, mostrar alertas visibles:
  - 🔴 **Alerta Roja**: Tiene órdenes listas para entregar (>3 días)
  - 🟠 **Alerta Naranja**: Tiene saldo pendiente de pago
  - 🟢 **Info Verde**: Tiene garantías activas vigentes
- Mostrar contador: "2 órdenes pendientes de entrega"
- Click en alerta abre modal con detalles
- Opción de "Marcar como notificado" para evitar repetir alerta
- Log de alertas mostradas al cliente

---

#### US-CLI-005: Fusionar Clientes Duplicados
**Como** administrador  
**Quiero** fusionar clientes duplicados en el sistema  
**Para** mantener un historial unificado y preciso

**Criterios de Aceptación:**
- Herramienta de "Detección de Duplicados" que busca:
  - Nombres similares (ej: "Juan Perez" vs "Juan Pérez")
  - Mismo teléfono con formato diferente
  - Emails similares
- Lista de posibles duplicados con % de coincidencia
- Vista lado a lado de ambos perfiles para comparar
- Seleccionar cuál será el perfil principal (mantiene el ID)
- Proceso de fusión que:
  - Transfiere todas las órdenes al perfil principal
  - Consolida equipos asociados
  - Suma estadísticas
  - Mantiene el dato más completo de cada campo
  - Registra la fusión en el log de auditoría
- Confirmación obligatoria antes de fusionar
- Acción NO reversible, con advertencia clara

---

### 2.4 MÓDULO DE VENTAS Y ACCESORIOS

#### US-VTA-001: Registrar Venta de Accesorio
**Como** recepcionista  
**Quiero** registrar ventas de accesorios independientes  
**Para** llevar control de caja y stock

**Criterios de Aceptación:**
- Formulario de venta rápida sin orden de reparación
- Opción de asociar venta a cliente existente o como "Venta Directa"
- Si se asocia a cliente, la venta aparece en su historial
- Búsqueda de productos del inventario
- Agregar múltiples productos a la venta
- Cálculo automático de total
- Métodos de pago: Efectivo, Tarjeta, Transferencia
- Descuento manual opcional con justificación
- Descuento automático aplicado a clientes VIP (configurable)
- Generación de ticket de venta
- Actualización automática de inventario
- Registro en reporte de caja diaria
- Ventas aparecen en timeline del cliente como "Venta de Accesorios"

---

#### US-VTA-002: Aplicar Descuentos
**Como** administrador o recepcionista  
**Quiero** aplicar descuentos en ventas y reparaciones  
**Para** fidelizar clientes y manejar promociones

**Criterios de Aceptación:**
- Campo de descuento en % o monto fijo
- Descuentos predefinidos: 5%, 10%, 15%, 20%
- Campo obligatorio de justificación si descuento >10%
- Validación de permisos (solo admin puede >20%)
- Descuento se refleja en ticket y en reporte financiero
- Registro de quien autorizó el descuento

---

### 2.5 MÓDULO DE PAGOS Y CAJA

#### US-PAG-001: Registrar Pago de Orden
**Como** recepcionista  
**Quiero** registrar el pago de una reparación  
**Para** actualizar el estado financiero y entregar el equipo

**Criterios de Aceptación:**
- Formulario de pago con monto total de la orden
- Métodos de pago: Efectivo, Tarjeta, Transferencia, Mixto
- Para pago mixto: desglose de montos por método
- Validación de que la suma coincida con el total
- Opción de pago parcial (anticipo) con registro de saldo pendiente
- Generación de recibo con detalle del pago
- Cambio automático de estado de orden a "Pagado"
- Posibilidad de solicitar datos fiscales para factura
- Registro en arqueo de caja

---

#### US-PAG-002: Ver Arqueo de Caja Diario
**Como** administrador o recepcionista  
**Quiero** ver el resumen de caja del día  
**Para** cuadrar los movimientos al cerrar

**Criterios de Aceptación:**
- Resumen por método de pago (Efectivo, Tarjeta, Transferencia)
- Desglose de ingresos:
  - Pagos completos de órdenes
  - Anticipos recibidos
  - Ventas de accesorios
- Total de descuentos otorgados
- Total esperado vs efectivo en caja física
- Botón de "Cerrar Caja" con validación de diferencias
- Registro de quien cerró la caja
- Exportar reporte a PDF

---

#### US-PAG-003: Gestionar Pagos Pendientes
**Como** recepcionista  
**Quiero** ver órdenes con saldo pendiente  
**Para** realizar seguimiento de cobros

**Criterios de Aceptación:**
- Lista de órdenes con pago parcial o sin pagar
- Filtros por antigüedad (>7 días, >15 días, >30 días)
- Ordenar por monto adeudado (mayor a menor)
- Información de contacto del cliente visible
- Enviar recordatorio de pago (SMS/Email/WhatsApp)
- Registro de recordatorios enviados
- Marcar como "En gestión de cobro"

---

#### US-PAG-004: Ver Historial de Pagos del Cliente
**Como** administrador  
**Quiero** ver el historial de pagos de un cliente específico  
**Para** evaluar su comportamiento de pago y confiabilidad

**Criterios de Aceptación:**
- Tabla de todos los pagos realizados por el cliente
- Columnas: Fecha, Orden #, Monto Total, Monto Pagado, Método, Estado
- Indicadores visuales:
  - ✅ Pagado completo en primera visita
  - 🟡 Pagó con anticipo + saldo posterior
  - 🔴 Tiene pagos pendientes actualmente
- Estadísticas de pago:
  - % de órdenes pagadas completas al momento de entrega
  - Tiempo promedio entre entrega y pago completo
  - Total histórico pagado
- Filtrar por rango de fechas
- Exportar historial a PDF

---

### 2.6 MÓDULO DE INVENTARIO

#### US-INV-001: Ver Stock de Repuestos
**Como** técnico o administrador  
**Quiero** ver el inventario actual de repuestos  
**Para** saber qué está disponible

**Criterios de Aceptación:**
- Lista de repuestos con cantidad actual
- Filtros por categoría (pantallas, baterías, conectores, etc.)
- Búsqueda por modelo de dispositivo compatible
- Indicador visual de stock bajo (<5 unidades)
- Alerta de productos agotados
- Mostrar precio unitario y precio de venta
- Exportar inventario a Excel

---

#### US-INV-002: Registrar Entrada de Productos
**Como** administrador  
**Quiero** registrar cuando recibo nuevos productos  
**Para** actualizar el inventario

**Criterios de Aceptación:**
- Formulario de entrada de stock
- Búsqueda del producto existente o crear nuevo
- Cantidad recibida
- Precio de compra unitario
- Proveedor
- Número de factura o remito
- Fecha de recepción
- Actualización automática de stock
- Registro en historial de movimientos

---

#### US-INV-003: Recibir Alertas de Stock Bajo
**Como** administrador  
**Quiero** recibir notificaciones de productos con stock bajo  
**Para** realizar pedidos a tiempo

**Criterios de Aceptación:**
- Definir umbral de stock mínimo por producto
- Notificación visual en dashboard cuando producto <umbral
- Lista semanal de productos a reponer
- Envío de email/notificación automática
- Marcar producto como "Pedido realizado" con fecha estimada de llegada
- Historial de alertas generadas

---

### 2.7 MÓDULO DE CÓDIGOS QR Y SEGUIMIENTO

#### US-QR-001: Generar QR por Orden
**Como** recepcionista  
**Quiero** generar un código QR único por orden  
**Para** que el cliente pueda rastrear su reparación

**Criterios de Aceptación:**
- Generación automática de QR al crear orden
- QR impreso en ticket de recepción
- Escaneo de QR lleva a página de seguimiento pública
- Página muestra:
  - Estado actual de la orden
  - Fecha estimada de entrega
  - Notificaciones importantes
  - Link a reparaciones previas (si es cliente recurrente)
- No requiere login del cliente
- Datos sensibles ocultos (solo información relevante)

---

#### US-QR-002: Escanear QR para Ver Estado
**Como** cliente  
**Quiero** escanear el QR de mi orden  
**Para** ver el estado sin llamar al taller

**Criterios de Aceptación:**
- Página responsive optimizada para móvil
- Carga rápida (<2 segundos)
- Información clara y visual (íconos de estado)
- Timeline de progreso
- Posibilidad de suscribirse a notificaciones
- Link para contactar al taller
- Opción de compartir estado vía WhatsApp

---

### 2.8 MÓDULO DE NOTIFICACIONES

#### US-NOT-001: Enviar Notificaciones Automáticas
**Como** sistema  
**Quiero** enviar notificaciones automáticas a clientes  
**Para** mantenerlos informados sin intervención manual

**Criterios de Aceptación:**
- Notificación cuando orden cambia a "En Proceso"
- Notificación cuando orden está "Lista para Entregar"
- Recordatorio si el equipo no se retira en 48hs de estar listo
- Soporte para múltiples canales: SMS, Email, WhatsApp
- Configuración de qué eventos disparan notificaciones
- Plantillas de mensaje personalizables
- Para clientes recurrentes, personalizar mensaje (ej: "Hola Juan, tu [dispositivo] está listo nuevamente. ¡Gracias por confiar en nosotros!")
- Log de notificaciones enviadas
- Manejo de errores de envío

---

#### US-NOT-002: Notificaciones para Técnicos
**Como** técnico  
**Quiero** recibir notificaciones de nuevas órdenes asignadas  
**Para** estar al tanto del trabajo pendiente

**Criterios de Aceptación:**
- Notificación push en la aplicación
- Opcional: email o SMS
- Indicador visual de órdenes sin leer
- Contador de órdenes pendientes en dashboard
- Marcar notificaciones como leídas

---

### 2.9 MÓDULO DE REPORTES Y ESTADÍSTICAS

#### US-REP-001: Ver Dashboard Principal
**Como** administrador  
**Quiero** ver un dashboard con métricas clave  
**Para** tomar decisiones informadas

**Criterios de Aceptación:**
- Indicadores principales (KPIs):
  - Órdenes activas
  - Órdenes completadas hoy
  - Ingreso del día
  - Ingreso del mes
  - Productos con stock crítico
- Gráfico de órdenes por estado
- Gráfico de ingresos de la última semana/mes
- Top 5 reparaciones más comunes
- Tiempo promedio de reparación
- Tasa de cumplimiento de entregas a tiempo
- Actualización en tiempo real

---

#### US-REP-002: Generar Reporte de Ventas
**Como** administrador  
**Quiero** generar reportes de ventas por período  
**Para** analizar el desempeño del negocio

**Criterios de Aceptación:**
- Selección de rango de fechas (día, semana, mes, personalizado)
- Desglose por:
  - Tipo de servicio (reparaciones vs accesorios)
  - Método de pago
  - Técnico que realizó la reparación
- Total de ingresos, costos y utilidad bruta
- Cantidad de órdenes procesadas
- Ticket promedio
- Gráficos de tendencias
- Exportar a PDF y Excel

---

#### US-REP-003: Generar Reporte de Productividad
**Como** administrador  
**Quiero** ver la productividad por técnico  
**Para** evaluar el desempeño del equipo

**Criterios de Aceptación:**
- Reporte por técnico con:
  - Cantidad de órdenes completadas
  - Tiempo promedio de reparación
  - Porcentaje de órdenes a tiempo
  - Calificación promedio (si hay sistema de calificación)
- Comparativa entre técnicos
- Filtro por período
- Identificar cuellos de botella
- Exportar a PDF

---

#### US-REP-004: Estadísticas de Clientes Recurrentes vs Nuevos
**Como** administrador  
**Quiero** ver estadísticas de clientes recurrentes vs nuevos  
**Para** medir la tasa de retención y valor de vida del cliente

**Criterios de Aceptación:**
- Reporte mensual/trimestral con:
  - **Clientes Nuevos:** Primera orden en el período
  - **Clientes Recurrentes:** Ya habían visitado antes del período
  - **Tasa de Retención:** % de clientes que regresan
  - **Valor de Vida del Cliente (CLV):** Ingreso promedio por cliente en su historial completo
- Gráficos:
  - Evolución de clientes nuevos vs recurrentes por mes
  - Distribución de frecuencia de visitas (1 vez, 2-3 veces, 4-6 veces, >6 veces)
  - CLV promedio por segmento (Nuevo, Regular, Frecuente, VIP)
- Comparativa período actual vs anterior
- Top 10 clientes por valor total
- Tasa de conversión: % de clientes nuevos que se convierten en recurrentes
- Exportar a PDF y Excel

---

## 3. REQUERIMIENTOS NO FUNCIONALES

### 3.1 Rendimiento
- Carga de dashboard principal < 2 segundos
- Búsqueda de órdenes/clientes < 1 segundo
- Búsqueda de clientes con historial extenso (>50 órdenes) < 1 segundo
- Soporte para mínimo 100 órdenes activas simultáneas
- Generación de reportes complejos < 5 segundos

### 3.2 Usabilidad
- Interfaz responsive (funcional en desktop, tablet y móvil)
- Diseño intuitivo con capacitación mínima requerida
- Atajos de teclado para acciones frecuentes
- Confirmación antes de acciones destructivas
- Mensajes de error claros y accionables

### 3.3 Seguridad
- Autenticación de usuarios con roles (Admin, Técnico, Recepcionista)
- Contraseñas encriptadas
- Sesiones con timeout automático
- Log de auditoría para acciones críticas
- Backup automático diario de base de datos
- Acceso a página pública de QR sin exponer datos sensibles

### 3.4 Disponibilidad
- Sistema disponible 99% del tiempo
- Mantenimiento programado fuera de horario laboral
- Sistema de backup y recuperación ante desastres

### 3.5 Escalabilidad
- Arquitectura preparada para crecer con el negocio
- Base de datos optimizada para relaciones 1:N (un cliente, múltiples órdenes)
- Índices en tablas de clientes, órdenes y búsquedas frecuentes
- Paginación y lazy loading para listados con >100 registros
- Capacidad de agregar nuevas sucursales/talleres en el futuro

---

## 4. MODELO DE DATOS - RELACIONES CLAVE

### 4.1 Estructura Principal

```
CLIENTE (1) ──── (N) ÓRDENES
   │
   ├──── (N) EQUIPOS
   │
   └──── (N) PAGOS
```

### 4.2 Descripción de Relaciones

**Cliente → Órdenes (1:N)**
- Un cliente puede tener múltiples órdenes a lo largo del tiempo
- Cada orden pertenece a un único cliente
- Permite construir historial completo del cliente
- Base para análisis de recurrencia y patrones

**Cliente → Equipos (1:N)**
- Un cliente puede traer múltiples dispositivos diferentes
- Cada equipo se asocia al cliente propietario
- Permite rastrear qué equipos ha reparado cada cliente
- Facilita identificación de equipos problemáticos

**Cliente → Pagos (1:N)**
- Un cliente genera múltiples transacciones de pago
- Permite análisis de comportamiento de pago
- Base para calcular CLV (Customer Lifetime Value)

**Orden → Repuestos (N:N)**
- Una orden puede usar múltiples repuestos
- Un repuesto puede ser usado en múltiples órdenes
- Tabla intermedia: OrdenRepuesto (cantidad, precio_unitario)

**Orden → Pagos (1:N)**
- Una orden puede tener múltiples pagos (anticipos, saldo)
- Cada pago se asocia a una orden específica

---

## 5. ROADMAP DE DESARROLLO

### Fase 1: MVP (4-6 semanas) - **CLIENTE Y ÓRDENES CORE**
**PRIORIDAD: Sistema de Historial de Cliente** ⭐
- ✅ Sistema de autenticación y roles
- ✅ CRUD de clientes con detección de duplicados
- ✅ Creación y gestión de órdenes básicas
- ✅ Estados de órdenes (Pendiente, En Proceso, Listo, Entregado)
- ✅ **Vista de perfil completo del cliente con historial (US-CLI-002)**
- ✅ **Alertas de cliente al atender (US-CLI-004)**
- ✅ **Indicadores visuales de tipo de cliente (US-CLI-001)**
- ✅ Dashboard básico

### Fase 2: Operaciones Completas (4-6 semanas)
- Gestión de inventario (repuestos y accesorios)
- Registro de repuestos utilizados en órdenes
- Sistema de pagos y arqueo de caja
- Ventas de accesorios independientes
- Generación de tickets y recibos
- **Historial de pagos por cliente (US-PAG-004)**

### Fase 3: Automatización y Cliente (3-4 semanas)
- Sistema de códigos QR para seguimiento
- Notificaciones automáticas (SMS/Email/WhatsApp)
- Página pública de seguimiento de orden
- Personalización de mensajes para clientes recurrentes
- **Consulta de problemas similares del cliente (US-ORD-006)**

### Fase 4: Reportes y Análisis (3-4 semanas)
- Dashboard completo con KPIs
- Reportes de ventas y productividad
- **Reporte de clientes recurrentes vs nuevos (US-REP-004)**
- **Análisis de patrones en clientes recurrentes (US-CLI-003)**
- Gráficos y visualizaciones
- Exportación de datos
- **Herramienta de fusión de clientes duplicados (US-CLI-005)**

### Fase 5: Optimización y Extras (2-3 semanas)
- Optimización de rendimiento
- Sistema de garantías
- Integración con pasarelas de pago
- App móvil nativa (opcional)
- Sistema de calificaciones y reseñas

---

## 6. WIREFRAMES Y MOCKUPS

### 6.1 Dashboard Principal
```
┌─────────────────────────────────────────────────────────┐
│  🏠 Dashboard                    👤 Admin    🔔 (3)    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Órdenes  │  │ Ingresos │  │  Stock   │  │Clientes││
│  │ Activas  │  │   Hoy    │  │  Bajo    │  │  Hoy   ││
│  │    15    │  │  $4,500  │  │    3     │  │   8    ││
│  └──────────┘  └──────────┘  └──────────┘  └────────┘│
│                                                         │
│  📊 Órdenes por Estado          💰 Ingresos Semanales  │
│  ┌─────────────────────┐       ┌─────────────────────┐│
│  │  Pendiente    ▓▓▓  5│       │    [Gráfico Barras] ││
│  │  En Proceso  ▓▓▓▓  7│       │                     ││
│  │  Listo       ▓▓    3│       │                     ││
│  └─────────────────────┘       └─────────────────────┘│
│                                                         │
│  🔧 Últimas Órdenes                                    │
│  ┌───────────────────────────────────────────────────┐│
│  │ #001 │ iPhone 12  │ Juan Pérez │ En Proceso │ ... ││
│  │ #002 │ Samsung A52│ Ana López  │ Listo      │ ... ││
│  └───────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 6.2 Lista de Órdenes
```
┌─────────────────────────────────────────────────────────┐
│  📋 Órdenes de Trabajo          [🔍 Buscar] [+ Nueva]  │
├─────────────────────────────────────────────────────────┤
│  Filtros: [Todas ▾] [Estado ▾] [Fecha ▾]              │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🟡 #001 - iPhone 12 Pro                         │   │
│  │ 👤 Juan Pérez | 📱 555-1234 | ⏱ Hace 2 días    │   │
│  │ 🔧 Pantalla rota | Estado: En Proceso           │   │
│  │ 💰 $2,500 | 👨‍🔧 Carlos M.       [Ver Detalles] │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🟢 #002 - Samsung Galaxy A52                    │   │
│  │ 👤 Ana López | 📱 555-5678 | ⏱ Hace 1 día      │   │
│  │ 🔧 Batería no carga | Estado: Listo            │   │
│  │ 💰 $1,800 | 👨‍🔧 Pedro L.       [Ver Detalles] │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 6.3 Detalle de Orden
```
┌─────────────────────────────────────────────────────────┐
│  ← Volver    ORDEN #001               [Editar] [❌]     │
├─────────────────────────────────────────────────────────┤
│  📱 DISPOSITIVO                  👤 CLIENTE             │
│  iPhone 12 Pro - 128GB           Juan Pérez             │
│  IMEI: 123456789012345           📞 555-1234            │
│                                  ✉ juan@email.com       │
│  ──────────────────────────────────────────────────────│
│  🔧 PROBLEMA REPORTADO                                  │
│  "Pantalla rota después de caída"                      │
│  Fecha recepción: 15/05/2024 10:30                     │
│  ──────────────────────────────────────────────────────│
│  🔍 DIAGNÓSTICO TÉCNICO                                 │
│  [Agregar diagnóstico...]                              │
│  📸 [Subir fotos]                                       │
│  ──────────────────────────────────────────────────────│
│  📦 REPUESTOS UTILIZADOS                                │
│  • Pantalla OLED Original - $2,000                     │
│  [+ Agregar repuesto]                                  │
│  ──────────────────────────────────────────────────────│
│  💰 RESUMEN DE COSTOS                                   │
│  Repuestos: $2,000                                     │
│  Mano de obra: $500                                    │
│  Total: $2,500                                         │
│  ──────────────────────────────────────────────────────│
│  📌 ESTADO ACTUAL: En Proceso                          │
│  [Pendiente] → [En Proceso] → [Listo] → [Entregado]   │
│                     ✓                                   │
│  ──────────────────────────────────────────────────────│
│  [Marcar como Listo] [Agregar Nota] [Imprimir]        │
└─────────────────────────────────────────────────────────┘
```

### 6.4 Perfil del Cliente (Nuevo Wireframe v1.1)
```
┌─────────────────────────────────────────────────────────┐
│  ← Clientes    PERFIL: JUAN PÉREZ    [✏ Editar] [💬]   │
├─────────────────────────────────────────────────────────┤
│  👤 INFORMACIÓN GENERAL                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Nombre: Juan Pérez              🌟 CLIENTE VIP  │   │
│  │ Teléfono: 555-1234                              │   │
│  │ Email: juan@email.com                           │   │
│  │ Primera visita: 15/01/2023                      │   │
│  │ Última visita: Hace 5 días                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  📊 ESTADÍSTICAS                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Total    │ │  Ticket  │ │ Frecuen. │ │ Último   │ │
│  │ Órdenes  │ │ Promedio │ │  Visitas │ │  Gasto   │ │
│  │   12     │ │  $2,300  │ │ 45 días  │ │ $3,200   │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                         │
│  Dispositivo más reparado: iPhone 12 (5 veces)         │
│  Reparaciones comunes: Pantalla (60%), Batería (30%)   │
│  Total gastado: $27,600                                │
│                                                         │
│  🕐 TIMELINE DE REPARACIONES      [Filtros ▾] [Todo ▾]│
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🟢 #145 - iPhone 12 Pro        Hace 5 días      │   │
│  │     Batería hinchada → Reemplazo batería        │   │
│  │     💰 $3,200 | ✅ Pagado | 👨‍🔧 Carlos M.      │   │
│  │     [Ver detalles ▾]                            │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ 🟢 #098 - iPhone 12 Pro        02/12/2025       │   │
│  │     Pantalla rota → Cambio pantalla OLED        │   │
│  │     💰 $2,500 | ✅ Pagado | 👨‍🔧 Pedro L.       │   │
│  │     [Ver detalles ▾]                            │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ 🟢 #076 - iPad Air              15/10/2025       │   │
│  │     No carga → Cambio conector Lightning        │   │
│  │     💰 $1,800 | ✅ Pagado | 👨‍🔧 Carlos M.      │   │
│  └─────────────────────────────────────────────────┘   │
│  [Ver más (9 órdenes anteriores)]                      │
│                                                         │
│  📱 EQUIPOS ASOCIADOS                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ • iPhone 12 Pro - 128GB (5 reparaciones)        │   │
│  │ • iPad Air 2020 (3 reparaciones)                │   │
│  │ • AirPods Pro (1 reparación)                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  🚀 ACCIONES RÁPIDAS                                    │
│  [+ Nueva Orden] [💬 Enviar Mensaje] [📄 Historial    │
│                                          de Pagos]      │
└─────────────────────────────────────────────────────────┘
```

### 6.5 Gestión de Pagos
```
┌─────────────────────────────────────────────────────────┐
│  💰 Registrar Pago - ORDEN #001                         │
├─────────────────────────────────────────────────────────┤
│  Cliente: Juan Pérez                                    │
│  Orden: iPhone 12 Pro - Cambio de pantalla             │
│  ──────────────────────────────────────────────────────│
│  Monto Total: $2,500                                   │
│  Pagado anteriormente: $0                              │
│  Saldo pendiente: $2,500                               │
│  ──────────────────────────────────────────────────────│
│  Método de Pago:                                       │
│  ⚪ Efectivo  ⚪ Tarjeta  ⚪ Transferencia  🔘 Mixto   │
│                                                         │
│  Desglose (Pago Mixto):                                │
│  Efectivo: [$1,500]                                    │
│  Tarjeta: [$1,000]                                     │
│  Total: $2,500 ✓                                       │
│  ──────────────────────────────────────────────────────│
│  ¿Requiere factura?  ☐ Sí                              │
│  ──────────────────────────────────────────────────────│
│  [Cancelar]                    [Registrar Pago y       │
│                                 Entregar Equipo]        │
└─────────────────────────────────────────────────────────┘
```

### 6.6 Seguimiento por QR (Vista Cliente)
```
┌─────────────────────────────────────────┐
│       📱 SalvaCell - Seguimiento        │
├─────────────────────────────────────────┤
│                                         │
│        ORDEN #001                       │
│     iPhone 12 Pro                       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ✓ Recibido      15/05 10:30       │ │
│  │ ✓ En Proceso    15/05 14:00       │ │
│  │ ⚪ Listo                           │ │
│  │ ⚪ Entregado                       │ │
│  └───────────────────────────────────┘ │
│                                         │
│  🔧 Estado Actual:                      │
│  "En reparación - Esperando repuesto"  │
│                                         │
│  📅 Fecha estimada de entrega:          │
│  17 de Mayo de 2024                    │
│                                         │
│  💬 ¿Dudas?                             │
│  [Contactar por WhatsApp]              │
│                                         │
│  [Recibir notificaciones]              │
│                                         │
└─────────────────────────────────────────┘
```

---

## 7. CRITERIOS DE ÉXITO

- **Eficiencia Operativa:** Reducir tiempo de gestión de órdenes en 40%
- **Satisfacción del Cliente:** NPS (Net Promoter Score) >8/10
- **Visibilidad:** 80% de clientes usan el sistema de seguimiento por QR
- **Control Financiero:** Diferencia en arqueo de caja <2%
- **Inventario:** Reducir roturas de stock en 60%
- **Retención de Clientes (v1.1):** Aumentar tasa de clientes recurrentes en 25%
- **Valor de Vida del Cliente (v1.1):** Incrementar CLV promedio en 30%
- **Tiempo de Atención (v1.1):** Reducir tiempo de recepción de clientes recurrentes en 50% mediante autocompletado

---

## 8. GLOSARIO

- **Orden:** Registro de una reparación desde su recepción hasta su entrega
- **Presupuesto:** Estimación inicial de costo y tiempo antes de aceptar la reparación
- **Repuesto:** Componente físico utilizado en una reparación
- **Accesorio:** Producto a la venta no relacionado con una reparación específica
- **Arqueo de Caja:** Proceso de conciliación de efectivo y pagos al final del día
- **QR:** Código de respuesta rápida para seguimiento de orden
- **Cliente Recurrente (v1.1):** Cliente con más de una orden en el sistema
- **Cliente VIP (v1.1):** Cliente con >10 órdenes o ticket promedio >$500
- **CLV - Customer Lifetime Value (v1.1):** Valor total que un cliente genera durante toda su relación con el negocio
- **Timeline (v1.1):** Vista cronológica de todas las interacciones/órdenes de un cliente

---

## 9. CONTACTO Y APROBACIONES

**Product Owner:** [Nombre]  
**Stakeholders:** [Equipo de Dirección]  
**Desarrolladores:** [Equipo Técnico]  

**Última Actualización:** 2026-01-01  
**Estado:** ✅ Aprobado para Desarrollo - v1.1 (Client History Focus)

---

**Notas de la versión 1.1:**
- Se agregaron 10 nuevas historias de usuario enfocadas en historial de clientes
- Se expandieron 6 historias existentes con funcionalidad de seguimiento de cliente
- Se agregó sección de Modelo de Datos con relaciones clave
- Se actualizó roadmap priorizando features de cliente en Fase 1
- Se agregó wireframe de Vista de Perfil del Cliente
- Se agregaron métricas de retención y CLV a criterios de éxito
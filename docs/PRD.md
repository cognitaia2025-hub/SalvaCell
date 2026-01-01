# 📋 PRD - Product Requirements Document
## SalvaCell - Sistema de Gestión para Taller de Reparación de Celulares

**Versión:** 1.0  
**Fecha:** 2026-01-01  
**Product Manager:** GitHub Copilot  
**Stakeholders:** Salvador (Propietario)

---

## 1. VISIÓN DEL PRODUCTO

### 1.1 Declaración de Visión
SalvaCell será la herramienta definitiva para talleres pequeños de reparación de celulares, combinando simplicidad de uso con funcionalidades profesionales, permitiendo operar eficientemente tanto online como offline.

### 1.2 Principios de Diseño
- **Simplicidad primero:** Interfaces claras, flujos directos
- **Mobile-first:** Optimizado para tablets y smartphones
- **Offline-capable:** Funciona sin internet
- **Data-driven:** Reportes automáticos para decisiones inteligentes
- **Cliente-céntrico:** Transparencia total en el proceso

---

## 2. ESPECIFICACIONES FUNCIONALES

### 2.1 MÓDULO: PRESUPUESTOS

#### User Stories

**US-PRES-001:** Como recepcionista, quiero crear presupuestos rápidos para clientes que consultan por teléfono o en persona.

**Criterios de aceptación:**
- Formulario con campos mínimos: nombre, teléfono, marca, modelo, problema, monto
- Generación automática de folio
- Selección de vigencia (7, 15, 30 días)
- Botón "Guardar" visible y accesible

**US-PRES-002:** Como recepcionista, quiero convertir un presupuesto aprobado en orden de reparación con un solo clic.

**Criterios de aceptación:**
- Botón "Convertir a Orden" en vista de presupuesto
- Datos precargados automáticamente en nueva orden
- Cambio de estado de presupuesto a "Aceptado"
- Redirección a formulario de orden con campos adicionales

**US-PRES-003:** Como administrador, quiero enviar presupuestos por WhatsApp directamente desde la app.

**Criterios de aceptación:**
- Botón "Enviar por WhatsApp" que abre WhatsApp con mensaje prellenado
- Formato: "Presupuesto #[folio] para [marca] [modelo]: $[monto]. Válido hasta [fecha]"
- Registro de fecha/hora de envío

---

### 2.2 MÓDULO: ÓRDENES DE REPARACIÓN

#### User Stories

**US-ORD-001:** Como técnico, quiero registrar una orden nueva con todos los detalles del equipo y el problema reportado.

**US-ORD-002:** Como técnico, quiero actualizar el estado de una orden a medida que avanzo en la reparación.

**US-ORD-003:** Como técnico, quiero registrar las refacciones utilizadas en una reparación.

**US-ORD-004:** Como recepcionista, quiero imprimir un comprobante básico de recepción para el cliente.

**US-ORD-005:** Como administrador, quiero que las garantías se asignen automáticamente según el tipo de refacción.

---

### 2.3 MÓDULO: CLIENTES

**US-CLI-001:** Como recepcionista, quiero buscar clientes existentes al crear una orden para evitar duplicados.

**US-CLI-002:** Como administrador, quiero ver el historial completo de un cliente.

---

### 2.4 MÓDULO: INVENTARIO

**US-INV-001:** Como administrador, quiero recibir alertas cuando una refacción esté por agotarse.

**US-INV-002:** Como técnico, quiero registrar la entrada de nuevas refacciones.

**US-INV-003:** Como administrador, quiero ver el costo real vs ingreso por refacciones.

---

### 2.5 MÓDULO: VENTAS DE ACCESORIOS

**US-VTA-001:** Como recepcionista, quiero registrar ventas rápidas de accesorios sin crear una orden de reparación.

**US-VTA-002:** Como administrador, quiero tener un catálogo de accesorios separado de las refacciones.

---

### 2.6 MÓDULO: PAGOS Y COBROS

**US-PAG-001:** Como recepcionista, quiero registrar anticipos al recibir una orden.

**US-PAG-002:** Como recepcionista, quiero ver una lista de órdenes con adeudos pendientes.

**US-PAG-003:** Como administrador, quiero ver los ingresos del día/semana/mes.

---

### 2.7 MÓDULO: REPORTES

**US-REP-001:** Como administrador, quiero ver las reparaciones más comunes.

**US-REP-002:** Como administrador, quiero exportar todos los datos antes de hacer limpieza.

**US-REP-003:** Como administrador, quiero ser alertado cuando hay más de 2000 órdenes en el sistema.

---

### 2.8 FEATURE: PORTAL DEL CLIENTE (QR + CHATBOT)

**US-QR-001:** Como cliente, quiero escanear un QR para ver el estado de mi reparación.

**US-QR-002:** Como cliente, quiero ver el reglamento del taller en la página de seguimiento.

**US-CHAT-001:** Como cliente, quiero consultar el estado de mi equipo por WhatsApp con un bot simple.

---

### 2.9 FEATURE: NOTIFICACIONES WHATSAPP

**US-NOT-001:** Como administrador, quiero que se envíe un mensaje automático al cliente cuando su equipo esté listo.

---

### 2.10 FEATURE: MODO OFFLINE

**US-OFF-001:** Como usuario, quiero seguir trabajando aunque no haya internet.

**US-OFF-002:** Como usuario, quiero que los datos se sincronicen automáticamente al reconectar.

---

## 3. ESPECIFICACIONES NO FUNCIONALES

### 3.1 Rendimiento
- Tiempo de carga inicial < 2 segundos
- Tiempo de respuesta de API < 500ms
- Soporte para 10,000 órdenes sin degradación

### 3.2 Usabilidad
- Diseño responsive (móvil, tablet, desktop)
- Interfaz en español
- Accesibilidad nivel AA (WCAG 2.1)
- Tooltips y ayuda contextual

### 3.3 Seguridad
- Autenticación con JWT
- Roles: Admin, Técnico, Recepcionista (futuro)
- Cifrado de datos en tránsito (HTTPS)
- Respaldos automáticos diarios

### 3.4 Compatibilidad
- Navegadores: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- Dispositivos: Smartphones Android/iOS, Tablets, Desktop
- PWA instalable en todos los dispositivos

---

## 4. ROADMAP

### Fase 1: MVP (Semanas 1-3)
- ✅ Presupuestos
- ✅ Órdenes básicas
- ✅ Clientes
- ✅ Pagos
- ✅ Reportes básicos

### Fase 2: Inventario y Ventas (Semanas 4-5)
- ✅ Gestión de refacciones
- ✅ Ventas de accesorios
- ✅ Alertas de inventario

### Fase 3: Features Especiales (Semanas 6-7)
- ✅ Portal del cliente (QR)
- ✅ Chatbot básico
- ✅ Notificaciones WhatsApp
- ✅ Modo offline

### Fase 4: Optimización (Semana 8+)
- Mejoras de UI/UX basadas en uso real
- Multi-usuario (empleados)
- Roles y permisos
- Estadísticas avanzadas

---

**Próximo documento:** FSD (Functional Specification Document)
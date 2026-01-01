# 📋 BRD - Business Requirements Document
## SalvaCell - Sistema de Gestión para Taller de Reparación de Celulares

**Versión:** 1.0  
**Fecha:** 2026-01-01  
**Propietario:** Salvador  
**Preparado por:** GitHub Copilot Manager Team

---

## 1. RESUMEN EJECUTIVO

### 1.1 Propósito del Documento
Este documento define los requerimientos de negocio para el desarrollo de **SalvaCell**, un sistema integral de gestión para talleres de reparación de dispositivos móviles.

### 1.2 Alcance del Proyecto
SalvaCell es una aplicación web progresiva (PWA) diseñada para digitalizar y optimizar todas las operaciones de un taller de reparación de celulares, desde la recepción de presupuestos hasta la entrega final, incluyendo gestión de inventario y ventas de accesorios.

### 1.3 Objetivos del Negocio
- Eliminar el uso de sistemas manuales (cuadernos, Excel, apps básicas)
- Reducir errores en el registro de órdenes y pagos
- Mejorar la experiencia del cliente con seguimiento en tiempo real
- Optimizar el control de inventario y refacciones
- Facilitar la toma de decisiones con reportes automatizados
- Preparar el negocio para crecimiento y escalabilidad

---

## 2. CONTEXTO DEL NEGOCIO

### 2.1 Descripción del Negocio
- **Nombre:** Salvador (Taller de reparaciones)
- **Antigüedad:** 2 años
- **Equipo:** Propietario + 1 ayudante (roles rotativos: admin y productivo)
- **Volumen:** 5-10 órdenes por semana
- **Servicios:** Reparación de celulares + venta de accesorios

### 2.2 Problemas Actuales
1. App actual sin estructura lógica
2. Falta de seguimiento del estado de las órdenes
3. No hay control de inventario
4. Duplicación de datos entre presupuestos y órdenes
5. Sin historial de clientes recurrentes
6. Falta de transparencia para el cliente (no sabe el estatus de su equipo)
7. Reportes manuales y poco confiables
8. Sin control de garantías estructurado

### 2.3 Oportunidades Identificadas
- Automatizar flujo Presupuesto → Orden
- Implementar seguimiento vía QR/chatbot para clientes
- Control real de inventario y refacciones
- Sistema de alertas y notificaciones vía WhatsApp
- Reportes automáticos para toma de decisiones
- Preparación para multi-usuario (empleados futuros)

---

## 3. REQUERIMIENTOS DE NEGOCIO

### 3.1 Funcionalidades Core

#### 3.1.1 Gestión de Presupuestos
- Registro rápido de presupuestos sin compromiso
- Conversión automática de presupuesto aprobado a orden
- Estados: Pendiente, Aceptado, Rechazado, Vencido
- Envío por WhatsApp, llamada o correo
- Vigencia configurable

#### 3.1.2 Gestión de Órdenes
- Creación desde cero o desde presupuesto
- Estados: Recibido, En reparación, Esperando refacción, Terminado, Entregado, Cancelado
- Registro completo del equipo y su estado al recibirlo
- Diagnóstico técnico y reparación realizada
- Control de garantías (15 días genérica, 30 días original, 15 días reparación local)
- Historial de cambios de estado
- Impresión de orden básica (datos del cliente y teléfono)

#### 3.1.3 Gestión de Clientes
- Base de datos de clientes
- Historial de reparaciones por cliente
- Teléfonos de contacto (principal y alterno)
- Identificación de clientes recurrentes

#### 3.1.4 Gestión de Inventario
- Catálogo de refacciones (originales, genéricas, usadas)
- Control de stock actual y mínimo
- Alertas de reorden
- Registro de uso de refacciones por orden
- Costo vs precio de venta

#### 3.1.5 Ventas de Accesorios
- Catálogo de productos
- Registro de ventas directas (sin orden de reparación)
- Control de inventario de accesorios
- Tickets de venta

#### 3.1.6 Gestión de Pagos
- Registro de anticipos y liquidaciones
- Métodos de pago: Efectivo, Transferencia, Tarjeta
- Control de adeudos
- Historial de pagos por orden

#### 3.1.7 Reportes y Estadísticas
- Ingresos por periodo
- Reparaciones más comunes
- Órdenes pendientes de entrega
- Inventario bajo
- Garantías activas
- Clientes recurrentes

### 3.2 Funcionalidades Especiales

#### 3.2.1 Portal del Cliente
- Consulta de estado de orden vía QR
- Chatbot simple para consultas
- Visualización del reglamento del taller

#### 3.2.2 Notificaciones Automáticas
- WhatsApp: Presupuesto enviado, equipo listo
- Alertas internas: inventario bajo, órdenes pendientes

#### 3.2.3 Modo Offline
- Funcionamiento sin internet
- Sincronización automática al reconectar

#### 3.2.4 Gestión de Datos
- Exportación en JSON/CSV
- Limpieza de datos antiguos (> 2 años)
- Alertas de limpieza (>2000 órdenes o >5000 clientes)

---

## 4. STAKEHOLDERS

| Rol | Nombre | Responsabilidad |
|-----|--------|-----------------|
| Propietario | Salvador | Decisiones finales, uso diario |
| Ayudante | Variable | Operación diaria |
| Clientes | N/A | Usuarios finales del servicio |

---

## 5. CRITERIOS DE ÉXITO

### 5.1 KPIs del Negocio
- Reducción del 80% en errores de captura
- Tiempo de creación de orden < 3 minutos
- 100% de órdenes con seguimiento de estado
- 90% de clientes satisfechos con transparencia
- Control de inventario con 95% de precisión

### 5.2 Métricas Técnicas
- Disponibilidad del sistema > 99%
- Tiempo de carga < 2 segundos
- Funcionalidad offline al 100%
- Respaldos automáticos diarios

---

## 6. RESTRICCIONES Y SUPUESTOS

### 6.1 Restricciones
- Presupuesto: Solo GitHub subscription mensual
- Equipo: 1 propietario + 1 ayudante
- No se requiere facturación electrónica (por ahora)
- Hosting: Servicios gratuitos o económicos

### 6.2 Supuestos
- Acceso a internet móvil disponible la mayoría del tiempo
- Dispositivos con navegadores modernos
- Cliente tiene WhatsApp para notificaciones

---

## 7. RIESGOS

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Pérdida de datos | Media | Alto | Respaldos automáticos diarios |
| Fallo de internet | Alta | Medio | Modo offline con sincronización |
| Cambio de ayudante | Alta | Bajo | UI intuitiva, manual de usuario |
| Crecimiento rápido | Baja | Medio | Arquitectura escalable desde inicio |

---

## 8. TIMELINE

- **Fase 0:** Documentación - 2 días
- **Fase 1:** Database - 5 días
- **Fase 2:** Backend - 7 días
- **Fase 3:** Frontend Core - 10 días
- **Fase 4:** Features Especiales - 5 días
- **Fase 5:** Testing y Deploy - 4 días

**Total estimado: 4-5 semanas**

---

## 9. APROBACIONES

| Nombre | Rol | Firma | Fecha |
|--------|-----|-------|-------|
| Salvador | Propietario | _______ | 2026-01-01 |

---

**Próximo documento:** PRD (Product Requirements Document)
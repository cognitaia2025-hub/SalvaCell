# 📱 PRD - Product Requirements Document
## SalvaCell - Sistema de Gestión para Taller de Reparación

**Versión:** 1.0  
**Fecha:** 2026-01-01  
**Product Manager:** GitHub Copilot Manager

---

## 1. VISIÓN DEL PRODUCTO

SalvaCell es una **Progressive Web App (PWA)** que transforma la gestión de talleres de reparación de celulares, proporcionando control total desde el primer contacto con el cliente hasta la entrega final, con capacidad offline y seguimiento en tiempo real.

---

## 2. USUARIOS Y PERSONAS

### 2.1 Usuario Principal: Propietario/Técnico
**Salvador - Dueño del Taller**
- **Edad:** 25-40 años
- **Experiencia técnica:** Media
- **Objetivos:**
  - Reducir tiempo administrativo
  - No perder órdenes ni pagos
  - Tener control de inventario
  - Ofrecer mejor servicio al cliente
- **Frustraciones:**
  - Apps complicadas
  - Sistemas que requieren internet constante
  - Falta de visibilidad del negocio

### 2.2 Usuario Secundario: Ayudante
- **Roles variables:** Recepción, técnico, ventas
- **Necesita:** Interfaz simple e intuitiva
- **Limitaciones:** Puede cambiar frecuentemente

### 2.3 Usuario Final: Cliente
- **Necesita:**
  - Saber el estado de su equipo
  - Transparencia en el proceso
  - Comunicación clara
- **Comportamiento:** Usa WhatsApp, escanea QR

---

## 3. FUNCIONALIDADES DETALLADAS

## 📋 3.1 MÓDULO: PRESUPUESTOS

### User Stories

**US-P01: Crear presupuesto rápido**
```
Como propietario
Quiero crear presupuestos sin registrar orden completa
Para responder rápido a consultas de clientes
```

**Criterios de aceptación:**
- ✅ Formulario con campos mínimos (nombre, teléfono, equipo, problema, monto)
- ✅ Genera folio automático
- ✅ Guarda estado: Pendiente
- ✅ Permite agregar vigencia en días
- ✅ Tiempo de captura < 2 minutos

**US-P02: Convertir presupuesto en orden**
```
Como propietario
Quiero convertir un presupuesto aprobado en orden
Para no capturar datos dos veces
```

**Criterios de aceptación:**
- ✅ Botón "Convertir a Orden" visible en presupuesto
- ✅ Copia automática de datos del cliente y equipo
- ✅ Marca presupuesto como "Aceptado"
- ✅ Genera nuevo folio de orden
- ✅ Mantiene referencia al presupuesto original

**US-P03: Enviar presupuesto al cliente**
```
Como propietario
Quiero enviar el presupuesto por WhatsApp
Para que el cliente lo tenga por escrito
```

**Criterios de aceptación:**
- ✅ Botón de envío con opciones (WhatsApp/Llamada/Email)
- ✅ Formato de mensaje predefinido editable
- ✅ Registra fecha y medio de envío
- ✅ Abre WhatsApp Web con mensaje prellenado

---

## 📦 3.2 MÓDULO: ÓRDENES

### User Stories

**US-O01: Crear orden completa**
```
Como propietario
Quiero registrar una orden de reparación completa
Para tener control total del proceso
```

**Criterios de aceptación:**
- ✅ Formulario dividido en secciones:
  - Datos del cliente (buscar existente o crear nuevo)
  - Datos del equipo (marca, modelo, IMEI, color, capacidad)
  - Estado al recibir (con SIM, funda, memoria, nivel batería, bloqueos)
  - Problema reportado
  - Diagnóstico técnico
  - Tipo de reparación
  - Refacciones a usar
  - Costo y anticipo
  - Garantía y fecha estimada
- ✅ Validación de campos obligatorios
- ✅ Genera folio y fecha/hora automáticos
- ✅ Estado inicial: "Recibido"

**US-O02: Actualizar estado de orden**
```
Como técnico
Quiero cambiar el estado de una orden fácilmente
Para mantener actualizado el progreso
```

**Criterios de aceptación:**
- ✅ Dropdown con estados disponibles
- ✅ Registra en historial: estado anterior, nuevo, fecha/hora, usuario
- ✅ Permite agregar nota en cada cambio
- ✅ Notifica al cliente si está en "Terminado"

**US-O03: Buscar órdenes rápidamente**
```
Como propietario
Quiero buscar órdenes por folio, cliente o equipo
Para encontrar información rápidamente
```

**Criterios de aceptación:**
- ✅ Barra de búsqueda en vista principal
- ✅ Filtros por estado
- ✅ Resultados en tiempo real (< 1 segundo)
- ✅ Muestra: folio, cliente, equipo, estado, fecha

**US-O04: Imprimir orden**
```
Como propietario
Quiero imprimir una orden básica
Para entregarla al cliente al recibir el equipo
```

**Criterios de aceptación:**
- ✅ Botón "Imprimir" en vista de orden
- ✅ Formato simple:
  - Logo/nombre del taller
  - Folio y fecha
  - Datos del cliente (nombre, teléfono)
  - Datos del equipo (marca, modelo, color, IMEI)
  - Problema reportado
  - Fecha estimada de entrega
  - Firma del cliente
- ✅ Optimizado para impresora térmica o A4

---

## 👤 3.3 MÓDULO: CLIENTES

### User Stories

**US-C01: Buscar cliente existente**
```
Como propietario
Quiero buscar clientes por nombre o teléfono
Para reutilizar sus datos en nuevas órdenes
```

**Criterios de aceptación:**
- ✅ Búsqueda por nombre, apellido o teléfono
- ✅ Autocompletado en tiempo real
- ✅ Muestra: nombre completo, teléfono, número de órdenes previas
- ✅ Permite seleccionar para prellenar formulario

**US-C02: Ver historial de cliente**
```
Como propietario
Quiero ver todas las órdenes de un cliente
Para conocer su historial de reparaciones
```

**Criterios de aceptación:**
- ✅ Lista de órdenes ordenada por fecha (más reciente primero)
- ✅ Muestra: folio, equipo, tipo de reparación, estado, fecha
- ✅ Permite abrir orden desde el historial
- ✅ Identifica visualmente clientes recurrentes (>3 órdenes)

---

## 📊 3.4 MÓDULO: INVENTARIO

### User Stories

**US-I01: Registrar refacción**
```
Como propietario
Quiero agregar refacciones al catálogo
Para tener control de mi inventario
```

**Criterios de aceptación:**
- ✅ Formulario: nombre, tipo (original/genérica/usada), costo compra, precio venta, stock inicial, stock mínimo
- ✅ Permite agregar foto (opcional)
- ✅ Calcula margen de ganancia automáticamente
- ✅ Genera código único

**US-I02: Alertas de inventario bajo**
```
Como propietario
Quiero recibir alertas cuando el inventario esté bajo
Para no quedarme sin refacciones
```

**Criterios de aceptación:**
- ✅ Notificación visual cuando stock < stock_mínimo
- ✅ Lista de refacciones a reabastecer en dashboard
- ✅ Permite marcar como "pedido realizado"
- ✅ Ordena por criticidad (más bajo primero)

**US-I03: Registrar uso de refacciones**
```
Como técnico
Quiero registrar qué refacciones usé en una reparación
Para que se descuente del inventario automáticamente
```

**Criterios de aceptación:**
- ✅ Selector de refacciones en formulario de orden
- ✅ Permite agregar múltiples refacciones
- ✅ Descuenta cantidad del stock automáticamente
- ✅ Registra precio aplicado (puede ser diferente al catálogo)
- ✅ Permite revertir si se cancela la orden

---

## 💰 3.5 MÓDULO: VENTAS DE ACCESORIOS

### User Stories

**US-V01: Registrar venta directa**
```
Como propietario
Quiero vender accesorios sin crear una orden de reparación
Para registrar todas mis ventas
```

**Criterios de aceptación:**
- ✅ Formulario rápido: seleccionar productos, cantidad, método de pago
- ✅ Genera ticket de venta con folio
- ✅ Descuenta del inventario
- ✅ Permite venta a cliente anónimo o registrado
- ✅ Tiempo de captura < 1 minuto

**US-V02: Catálogo de accesorios**
```
Como propietario
Quiero tener un catálogo de accesorios separado de refacciones
Para organizar mejor mi inventario
```

**Criterios de aceptación:**
- ✅ Categorías: Fundas, Micas, Cargadores, Audífonos, Otros
- ✅ Permite agregar foto
- ✅ Precio de compra y venta
- ✅ Stock actual y mínimo
- ✅ Búsqueda rápida

---

## 💵 3.6 MÓDULO: PAGOS

### User Stories

**US-PA01: Registrar anticipo**
```
Como propietario
Quiero registrar anticipos al recibir una orden
Para llevar control de pagos parciales
```

**Criterios de aceptación:**
- ✅ Campo de anticipo en formulario de orden
- ✅ Calcula adeudo automáticamente (total - anticipo)
- ✅ Registra método de pago
- ✅ Permite $0 si no hay anticipo
- ✅ Registra fecha y hora del pago

**US-PA02: Liquidar orden**
```
Como propietario
Quiero registrar el pago final al entregar
Para cerrar la orden correctamente
```

**Criterios de aceptación:**
- ✅ Muestra adeudo pendiente claramente
- ✅ Permite pago completo o parcial adicional
- ✅ Marca como "Pagado" cuando adeudo = 0
- ✅ Cambia estado de orden a "Entregado"
- ✅ Genera recibo de pago

**US-PA03: Reporte de cobros**
```
Como propietario
Quiero ver cuánto he cobrado en un periodo
Para conocer mis ingresos
```

**Criterios de aceptación:**
- ✅ Filtros por fecha (hoy, semana, mes, personalizado)
- ✅ Muestra total por método de pago
- ✅ Lista de órdenes con adeudo pendiente
- ✅ Exportable a CSV

---

## 📈 3.7 MÓDULO: REPORTES

### User Stories

**US-R01: Dashboard principal**
```
Como propietario
Quiero ver un resumen al abrir la app
Para tener visibilidad del negocio
```

**Criterios de aceptación:**
- ✅ Tarjetas con:
  - Órdenes en proceso (hoy)
  - Equipos listos para entregar
  - Inventario bajo stock
  - Cobros del día
  - Órdenes con adeudo
- ✅ Cada tarjeta permite acceso directo a detalles
- ✅ Actualización en tiempo real

**US-R02: Reporte de reparaciones comunes**
```
Como propietario
Quiero saber qué reparaciones hago más
Para planificar inventario
```

**Criterios de aceptación:**
- ✅ Gráfica de barras con top 10 reparaciones
- ✅ Filtro por rango de fechas
- ✅ Muestra: tipo de reparación, cantidad, porcentaje
- ✅ Exportable

---

## 🌟 3.8 FEATURES ESPECIALES

### US-FE01: Seguimiento por QR
```
Como cliente
Quiero escanear un QR y ver el estado de mi equipo
Para no tener que llamar al taller
```

**Criterios de aceptación:**
- ✅ Cada orden genera QR único
- ✅ QR se imprime en la orden
- ✅ Al escanear muestra:
  - Estado actual
  - Fecha estimada de entrega
  - Historial de cambios
  - Reglamento del taller
- ✅ No requiere login
- ✅ Vista mobile-friendly

### US-FE02: Chatbot de consulta
```
Como cliente
Quiero preguntar por mi equipo en un chat
Para obtener información rápida
```

**Criterios de aceptación:**
- ✅ Chatbot simple que entiende:
  - "¿Cuál es el estado de mi orden [folio]?"
  - "¿Cuándo estará listo mi equipo?"
  - "¿Cuánto debo?"
- ✅ Responde con información de la orden
- ✅ Permite consultar reglamento
- ✅ Si no entiende, ofrece contacto directo

### US-FE03: Notificaciones WhatsApp
```
Como propietario
Quiero notificar automáticamente cuando un equipo esté listo
Para reducir llamadas
```

**Criterios de aceptación:**
- ✅ Al cambiar estado a "Terminado", envía mensaje
- ✅ Mensaje incluye: folio, fecha, adeudo, dirección del taller
- ✅ Configurable (activar/desactivar)
- ✅ Plantilla de mensaje editable

### US-FE04: Modo Offline
```
Como propietario
Quiero seguir trabajando sin internet
Para no detener el negocio
```

**Criterios de aceptación:**
- ✅ Funcionalidad completa offline (crear, editar, buscar)
- ✅ Indicador visual de estado (online/offline)
- ✅ Sincronización automática al reconectar
- ✅ Manejo de conflictos si hay cambios en ambos lados
- ✅ Notifica cuando hay datos sin sincronizar

### US-FE05: Exportación y limpieza
```
Como propietario
Quiero exportar y limpiar datos antiguos
Para mantener la app rápida
```

**Criterios de aceptación:**
- ✅ Botón de exportación con opciones (JSON, CSV)
- ✅ Incluye: órdenes, clientes, pagos, inventario
- ✅ Alerta cuando hay >2000 órdenes o >5000 clientes
- ✅ Permite archivar órdenes >2 años
- ✅ Confirmación antes de eliminar
- ✅ Mantiene respaldo local antes de limpiar

---

## 4. DISEÑO Y UX

### 4.1 Principios de Diseño
- **Simplicidad:** Máximo 3 clics para cualquier acción común
- **Rapidez:** Formularios con autocompletado y valores predeterminados
- **Claridad:** Estados con colores intuitivos (verde=listo, amarillo=en proceso, rojo=problema)
- **Accesibilidad:** Textos legibles, botones grandes, contraste adecuado

### 4.2 Navegación Principal

```
┌─────────────────────────────────┐
│  🏠 Dashboard                    │
├─────────────────────────────────┤
│  📋 Órdenes                      │
│  💰 Nueva Orden                  │
│  📊 Presupuestos                 │
│  👥 Clientes                     │
│  📦 Inventario                   │
│  🛒 Ventas                       │
│  💵 Cobros                       │
│  📈 Reportes                     │
│  ⚙️  Configuración               │
└─────────────────────────────────┘
```

### 4.3 Paleta de Colores (Propuesta)

```
Estados:
- Recibido: 🔵 Azul (#3B82F6)
- En reparación: 🟡 Amarillo (#F59E0B)
- Esperando refacción: 🟠 Naranja (#F97316)
- Terminado: 🟢 Verde (#10B981)
- Entregado: ⚫ Gris (#6B7280)
- Cancelado: 🔴 Rojo (#EF4444)

UI:
- Primario: Azul (#2563EB)
- Secundario: Gris (#64748B)
- Éxito: Verde (#059669)
- Peligro: Rojo (#DC2626)
- Advertencia: Amarillo (#D97706)
```

---

## 5. ESPECIFICACIONES TÉCNICAS

### 5.1 Stack Tecnológico
- **Frontend:** React + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Node.js + Express + Prisma ORM
- **Database:** PostgreSQL
- **PWA:** Workbox Service Workers
- **Offline DB:** IndexedDB (via Dexie.js)
- **Hosting:** Vercel (frontend) + Railway (backend + database)

### 5.2 Compatibilidad
- **Navegadores:** Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- **Dispositivos:** Desktop, tablet, móvil (responsive)
- **Resoluciones:** 320px - 2560px

### 5.3 Performance
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.0s
- **Lighthouse Score:** > 90
- **Tamaño de bundle:** < 500KB (gzipped)

---

## 6. ROADMAP

### Fase 1: MVP (Semanas 1-3)
- ✅ Órdenes (CRUD completo)
- ✅ Presupuestos básicos
- ✅ Clientes
- ✅ Pagos simples
- ✅ Dashboard básico

### Fase 2: Core Features (Semanas 3-4)
- ✅ Inventario completo
- ✅ Ventas de accesorios
- ✅ Reportes
- ✅ Impresión
- ✅ Modo offline

### Fase 3: Features Especiales (Semana 5)
- ✅ QR tracking
- ✅ Chatbot
- ✅ WhatsApp notifications
- ✅ Data export

### Fase 4: Optimización (Semana 6+)
- 🔄 Testing exhaustivo
- 🔄 Optimización de performance
- 🔄 Documentación de usuario
- 🔄 Training del equipo

---

## 7. MÉTRICAS DE ÉXITO

| Métrica | Objetivo | Método de medición |
|---------|----------|-------------------|
| Tiempo de creación de orden | < 3 min | Analytics |
| Errores de captura | < 5% | Feedback usuario |
| Satisfacción del cliente | > 4.5/5 | Encuesta mensual |
| Uso de modo offline | > 80% funcional | Testing |
| Adopción de QR tracking | > 50% clientes | Analytics |

---

**Próximo documento:** FSD (Functional Specification Document)
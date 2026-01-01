# FSD - Functional Specification Document
## SalvaCell - Sistema de Gestión de Reparaciones

**Versión:** 1.0  
**Fecha:** 2026-01-01  
**Basado en:** BRD v1.0, PRD v1.1

---

## 1. OBJETIVO DEL DOCUMENTO

Este documento detalla las especificaciones funcionales técnicas que los desarrolladores deben implementar para cumplir con los requerimientos definidos en el BRD y PRD.

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Stack Tecnológico

**Frontend:**
- Framework: React 18+ con Vite
- UI Components: Tailwind CSS + shadcn/ui
- State Management: Zustand
- Routing: React Router v6
- Forms: React Hook Form + Zod validation
- API Calls: Axios con interceptors
- PWA: Workbox para Service Workers
- Offline DB: Dexie.js (IndexedDB wrapper)

**Backend:**
- Runtime: Node.js 18+ LTS
- Framework: Express.js
- ORM: Prisma
- Authentication: JWT (jsonwebtoken)
- Validation: Zod
- File Upload: Multer
- CORS: cors middleware

**Base de Datos:**
- PostgreSQL 15+
- Hosted: Railway o Supabase (free tier)

**Deployment:**
- Frontend: Vercel
- Backend: Railway
- CI/CD: GitHub Actions

---

## 3. MODELO DE DATOS

### 3.1 Esquema de Base de Datos

```prisma
// schema.prisma

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  role      Role     @default(TECNICO)
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  ordenes   Orden[]
  pagos     Pago[]
}

enum Role {
  ADMIN
  TECNICO
  RECEPCIONISTA
}

model Cliente {
  id              String   @id @default(uuid())
  nombre          String
  apellido        String
  telefono        String   @unique
  telefonoAlterno String?
  email           String?
  direccion       String?
  notas           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  ordenes         Orden[]
  equipos         Equipo[]
  ventas          Venta[]
  
  @@index([telefono])
  @@index([nombre, apellido])
}

model Equipo {
  id          String   @id @default(uuid())
  clienteId   String
  marca       String
  modelo      String
  imei        String?  @unique
  color       String?
  capacidad   String?
  notas       String?
  createdAt   DateTime @default(now())
  
  cliente     Cliente  @relation(fields: [clienteId], references: [id], onDelete: Cascade)
  ordenes     Orden[]
  
  @@index([clienteId])
  @@index([imei])
}

model Presupuesto {
  id                String            @id @default(uuid())
  folio             String            @unique
  clienteId         String
  equipoId          String?
  descripcionProblema String
  montoEstimado     Decimal           @db.Decimal(10, 2)
  estado            EstadoPresupuesto @default(PENDIENTE)
  vigenciaDias      Int               @default(15)
  fechaVencimiento  DateTime
  medioEnvio        String?
  fechaEnvio        DateTime?
  observaciones     String?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  
  cliente           Cliente           @relation(fields: [clienteId], references: [id])
  equipo            Equipo?           @relation(fields: [equipoId], references: [id])
  orden             Orden?
  
  @@index([folio])
  @@index([clienteId])
  @@index([estado])
}

enum EstadoPresupuesto {
  PENDIENTE
  ACEPTADO
  RECHAZADO
  VENCIDO
}

model Orden {
  id                    String        @id @default(uuid())
  folio                 String        @unique
  clienteId             String
  equipoId              String
  presupuestoId         String?       @unique
  problemaReportado     String
  diagnosticoTecnico    String?
  tipoReparacion        String
  reparacionRealizada   String?
  estado                EstadoOrden   @default(RECIBIDO)
  prioridad             Prioridad     @default(NORMAL)
  
  // Control de recepción
  conSIM                Boolean       @default(false)
  conFunda              Boolean       @default(false)
  conMemoriaSD          Boolean       @default(false)
  estadoEncendido       Boolean       @default(false)
  nivelBateria          Int?
  tieneBloqueo          Boolean       @default(false)
  tipoBloqueo           String?
  codigoProporciona     Boolean       @default(false)
  estadoFisico          String?
  
  // Costos
  costoTotal            Decimal       @db.Decimal(10, 2)
  anticipo              Decimal       @default(0) @db.Decimal(10, 2)
  adeudo                Decimal       @db.Decimal(10, 2) // Calculado
  
  // Fechas
  fechaIngreso          DateTime      @default(now())
  fechaEstimadaEntrega  DateTime
  fechaRealEntrega      DateTime?
  
  // Garantía
  tieneGarantia         Boolean       @default(true)
  diasGarantia          Int           @default(15)
  fechaVencimientoGarantia DateTime?
  
  // Relaciones
  tecnicoId             String?
  observacionesTecnicas String?
  notasInternas         String?
  
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt
  
  cliente               Cliente       @relation(fields: [clienteId], references: [id])
  equipo                Equipo        @relation(fields: [equipoId], references: [id])
  presupuesto           Presupuesto?  @relation(fields: [presupuestoId], references: [id])
  tecnico               User?         @relation(fields: [tecnicoId], references: [id])
  
  historialEstados      HistorialEstadoOrden[]
  refaccionesUsadas     OrdenRefaccion[]
  pagos                 Pago[]
  
  @@index([folio])
  @@index([clienteId])
  @@index([equipoId])
  @@index([estado])
  @@index([fechaIngreso])
}

enum EstadoOrden {
  RECIBIDO
  EN_DIAGNOSTICO
  EN_REPARACION
  ESPERANDO_REFACCION
  TERMINADO
  ENTREGADO
  CANCELADO
}

enum Prioridad {
  NORMAL
  URGENTE
}

model HistorialEstadoOrden {
  id            String      @id @default(uuid())
  ordenId       String
  estadoAnterior EstadoOrden?
  estadoNuevo   EstadoOrden
  usuarioId     String?
  notas         String?
  createdAt     DateTime    @default(now())
  
  orden         Orden       @relation(fields: [ordenId], references: [id], onDelete: Cascade)
  usuario       User?       @relation(fields: [usuarioId], references: [id])
  
  @@index([ordenId])
}

model Refaccion {
  id              String   @id @default(uuid())
  codigo          String   @unique
  nombre          String
  tipo            TipoRefaccion
  categoria       String
  costoCompra     Decimal  @db.Decimal(10, 2)
  precioVenta     Decimal  @db.Decimal(10, 2)
  stockActual     Int      @default(0)
  stockMinimo     Int      @default(5)
  ubicacion       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  ordenesUsadas   OrdenRefaccion[]
  movimientos     MovimientoInventario[]
  
  @@index([codigo])
  @@index([stockActual])
}

enum TipoRefaccion {
  ORIGINAL
  GENERICA
  USADA
}

model OrdenRefaccion {
  id            String     @id @default(uuid())
  ordenId       String
  refaccionId   String
  cantidad      Int
  precioUnitario Decimal   @db.Decimal(10, 2)
  createdAt     DateTime   @default(now())
  
  orden         Orden      @relation(fields: [ordenId], references: [id], onDelete: Cascade)
  refaccion     Refaccion  @relation(fields: [refaccionId], references: [id])
  
  @@index([ordenId])
  @@index([refaccionId])
}

model MovimientoInventario {
  id          String            @id @default(uuid())
  refaccionId String
  tipo        TipoMovimiento
  cantidad    Int
  motivo      String?
  usuarioId   String?
  createdAt   DateTime          @default(now())
  
  refaccion   Refaccion         @relation(fields: [refaccionId], references: [id])
  usuario     User?             @relation(fields: [usuarioId], references: [id])
  
  @@index([refaccionId])
}

enum TipoMovimiento {
  ENTRADA
  SALIDA
  AJUSTE
}

model Accesorio {
  id          String   @id @default(uuid())
  codigo      String   @unique
  nombre      String
  categoria   String
  marca       String?
  precioCompra Decimal @db.Decimal(10, 2)
  precioVenta Decimal  @db.Decimal(10, 2)
  stockActual Int      @default(0)
  stockMinimo Int      @default(5)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  ventasItems VentaItem[]
  
  @@index([codigo])
}

model Venta {
  id           String        @id @default(uuid())
  folio        String        @unique
  clienteId    String?
  total        Decimal       @db.Decimal(10, 2)
  descuento    Decimal       @default(0) @db.Decimal(10, 2)
  metodoPago   MetodoPago
  usuarioId    String?
  createdAt    DateTime      @default(now())
  
  cliente      Cliente?      @relation(fields: [clienteId], references: [id])
  usuario      User?         @relation(fields: [usuarioId], references: [id])
  items        VentaItem[]
  
  @@index([folio])
  @@index([clienteId])
}

model VentaItem {
  id            String    @id @default(uuid())
  ventaId       String
  accesorioId   String
  cantidad      Int
  precioUnitario Decimal  @db.Decimal(10, 2)
  
  venta         Venta     @relation(fields: [ventaId], references: [id], onDelete: Cascade)
  accesorio     Accesorio @relation(fields: [accesorioId], references: [id])
  
  @@index([ventaId])
}

model Pago {
  id          String      @id @default(uuid())
  ordenId     String?
  ventaId     String?
  monto       Decimal     @db.Decimal(10, 2)
  metodoPago  MetodoPago
  concepto    String
  usuarioId   String?
  createdAt   DateTime    @default(now())
  
  orden       Orden?      @relation(fields: [ordenId], references: [id])
  venta       Venta?      @relation(fields: [ventaId], references: [id])
  usuario     User?       @relation(fields: [usuarioId], references: [id])
  
  @@index([ordenId])
  @@index([createdAt])
}

enum MetodoPago {
  EFECTIVO
  TARJETA
  TRANSFERENCIA
}

model Configuracion {
  id    String @id @default(uuid())
  clave String @unique
  valor String
  
  @@index([clave])
}
```

---

## 4. API ENDPOINTS

### 4.1 Autenticación

**POST /api/auth/login**
```json
Request:
{
  "email": "admin@salvacell.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "Admin",
    "email": "admin@salvacell.com",
    "role": "ADMIN"
  }
}
```

**POST /api/auth/register** (Solo ADMIN puede crear usuarios)

**GET /api/auth/me** (Requiere token)

---

### 4.2 Clientes

**GET /api/clientes**
- Query params: `search`, `page`, `limit`
- Response: Lista paginada con badges (VIP/Frecuente/Nuevo)

**GET /api/clientes/:id**
- Response: Perfil completo con estadísticas y timeline

**POST /api/clientes**
- Body: nombre, apellido, telefono, email (opcional)

**PUT /api/clientes/:id**

**GET /api/clientes/:id/historial**
- Response: Array de todas las órdenes del cliente

**GET /api/clientes/:id/equipos**
- Response: Array de equipos asociados

**GET /api/clientes/:id/estadisticas**
- Response: Stats (total órdenes, ticket promedio, CLV, etc.)

**POST /api/clientes/fusionar**
- Body: { clienteIdPrincipal, clienteIdDuplicado }

---

### 4.3 Presupuestos

**GET /api/presupuestos**
**GET /api/presupuestos/:id**
**POST /api/presupuestos**
**PUT /api/presupuestos/:id**
**POST /api/presupuestos/:id/convertir-orden**

---

### 4.4 Órdenes

**GET /api/ordenes**
- Query: `estado`, `clienteId`, `fechaDesde`, `fechaHasta`, `page`, `limit`

**GET /api/ordenes/:id**

**POST /api/ordenes**
- Body: Todos los campos del modelo Orden

**PUT /api/ordenes/:id**

**PATCH /api/ordenes/:id/estado**
- Body: { nuevoEstado, notas }

**GET /api/ordenes/:id/historial-estados**

**POST /api/ordenes/:id/refacciones**
- Body: { refaccionId, cantidad }

**GET /api/ordenes/cliente/:clienteId**
- Response: Todas las órdenes de un cliente

---

### 4.5 Inventario

**GET /api/refacciones**
**GET /api/refacciones/:id**
**POST /api/refacciones**
**PUT /api/refacciones/:id**
**POST /api/refacciones/:id/movimiento**
- Body: { tipo, cantidad, motivo }

**GET /api/refacciones/alertas**
- Response: Refacciones con stock < stockMinimo

---

### 4.6 Accesorios y Ventas

**GET /api/accesorios**
**POST /api/accesorios**

**POST /api/ventas**
- Body: { clienteId (opcional), items: [{accesorioId, cantidad}], metodoPago, descuento }

**GET /api/ventas**

---

### 4.7 Pagos

**POST /api/pagos**
- Body: { ordenId, monto, metodoPago, concepto }

**GET /api/pagos/orden/:ordenId**

**GET /api/pagos/cliente/:clienteId**

**GET /api/pagos/arqueo**
- Query: `fecha`
- Response: Resumen de caja del día

---

### 4.8 Reportes

**GET /api/reportes/dashboard**
- Response: KPIs principales

**GET /api/reportes/ventas**
- Query: `fechaDesde`, `fechaHasta`

**GET /api/reportes/clientes-recurrentes**
- Response: Análisis de clientes VIP, frecuentes, tasa retención, CLV

**GET /api/reportes/reparaciones-comunes**

---

### 4.9 QR y Seguimiento Público

**GET /public/orden/:token**
- Response: Estado de la orden (sin datos sensibles)

---

### 4.10 Notificaciones

**POST /api/notificaciones/enviar**
- Body: { ordenId, tipo: "whatsapp" | "email" | "sms", plantilla }

---

## 5. REGLAS DE NEGOCIO

### 5.1 Gestión de Clientes

**RN-CLI-001:** Al buscar cliente por teléfono, normalizar formato (quitar espacios, guiones)

**RN-CLI-002:** Badges de cliente:
- VIP: > 10 órdenes O ticket promedio > $500
- Frecuente: 5-10 órdenes
- Nuevo: < 5 órdenes

**RN-CLI-003:** Al crear orden, SIEMPRE verificar si cliente existe por teléfono

**RN-CLI-004:** Permitir fusionar clientes solo si ambos IDs existen y son diferentes

---

### 5.2 Gestión de Órdenes

**RN-ORD-001:** Folio auto-generado: ORD-{YYYY}{MM}{sequential}
Ejemplo: ORD-202601001

**RN-ORD-002:** Cálculo de adeudo: `costoTotal - anticipo`

**RN-ORD-003:** Garantía automática según tipo de refacción:
- Original: 30 días
- Genérica: 15 días
- Reparación local: 15 días

**RN-ORD-004:** Al cambiar estado, registrar en HistorialEstadoOrden

**RN-ORD-005:** No permitir cambiar a ENTREGADO si adeudo > 0

**RN-ORD-006:** Al marcar como TERMINADO, enviar notificación automática al cliente

---

### 5.3 Gestión de Inventario

**RN-INV-001:** Al agregar refacción a orden, descontar de stockActual

**RN-INV-002:** No permitir usar refacción si stockActual < cantidad solicitada

**RN-INV-003:** Generar alerta si stockActual < stockMinimo

---

### 5.4 Pagos

**RN-PAG-001:** Métodos de pago válidos: EFECTIVO, TARJETA, TRANSFERENCIA

**RN-PAG-002:** Permitir pagos parciales (anticipos)

**RN-PAG-003:** Registro de pago debe actualizar campo `adeudo` en Orden

---

### 5.5 Presupuestos

**RN-PRE-001:** Folio: PRE-{YYYY}{MM}{sequential}

**RN-PRE-002:** Estado VENCIDO si fecha actual > fechaVencimiento

**RN-PRE-003:** Al convertir a orden, marcar presupuesto como ACEPTADO

---

## 6. VALIDACIONES

### 6.1 Validaciones de Entrada

**Cliente:**
- nombre: string, min 2 caracteres, max 100
- telefono: string, formato numérico, 10 dígitos, único
- email: válido (regex), opcional

**Orden:**
- problemaReportado: string, min 10 caracteres
- costoTotal: decimal > 0
- anticipo: decimal >= 0 y <= costoTotal
- fechaEstimadaEntrega: >= fecha actual

**Refacción:**
- codigo: único
- precioVenta: >= costoCompra
- stockActual: >= 0

---

## 7. SEGURIDAD

### 7.1 Autenticación

- JWT con expiración de 8 horas
- Refresh token (opcional para v2)
- Password hasheado con bcrypt (salt rounds: 10)

### 7.2 Autorización (RBAC)

**ADMIN:**
- Full access

**TECNICO:**
- CRUD Órdenes
- Read Clientes
- Update Inventario (solo salidas)
- Create Pagos

**RECEPCIONISTA:**
- CRUD Presupuestos
- Create Órdenes
- CRUD Clientes
- Create Ventas
- Create Pagos

### 7.3 Endpoint Público

- `/public/orden/:token` NO requiere autenticación
- Token es UUID único de la orden
- Exponer solo: folio, estado, fechaEstimadaEntrega, historial de estados

---

## 8. MODO OFFLINE (PWA)

### 8.1 Service Worker Strategy

**Páginas estáticas:** Cache First
**API Calls:** Network First con fallback a cache

### 8.2 IndexedDB (Dexie.js)

Tablas locales:
- clientes
- ordenes
- refacciones
- accesorios

### 8.3 Sincronización

- Al reconectar internet, sincronizar cambios en orden FIFO
- Manejo de conflictos: último cambio gana (timestamp)

---

## 9. NOTIFICACIONES

### 9.1 WhatsApp (Integración con WAHA o Twilio)

**Trigger:** Orden cambia a TERMINADO

**Mensaje:**
```
Hola {nombreCliente}, tu {marca} {modelo} está listo para recoger. 
Adeudo: ${adeudo}
Folio: {folio}
Gracias por confiar en SalvaCell.
```

**Personalización para cliente recurrente:**
```
Hola {nombreCliente}, tu {marca} {modelo} está listo nuevamente. 
¡Gracias por seguir confiando en nosotros!
Folio: {folio}
```

---

## 10. LIMPIEZA DE DATOS

### 10.1 Estrategia de Archivado

**Trigger:** 
- > 2000 órdenes en estado ENTREGADO
- O > 2 años desde fechaRealEntrega

**Proceso:**
1. Mostrar alerta en dashboard
2. Admin puede exportar a JSON/CSV
3. Mover órdenes antiguas a tabla `OrdenesArchivadas`
4. Mantener relación con cliente para historial

---

## 11. CRITERIOS DE ACEPTACIÓN TÉCNICA

- ✅ Todas las APIs responden en < 500ms
- ✅ Frontend carga en < 2 segundos
- ✅ PWA funciona offline para crear órdenes
- ✅ Tests unitarios para reglas de negocio críticas
- ✅ Tests de integración para flujo completo de orden
- ✅ Lighthouse score > 90
- ✅ 100% de endpoints documentados con Swagger/OpenAPI

---

## 12. ENTREGABLES

1. Backend API funcional con todos los endpoints
2. Frontend React con todas las vistas
3. Base de datos con schema Prisma migrado
4. PWA funcional con modo offline
5. Sistema de notificaciones WhatsApp
6. Documentación técnica completa
7. Scripts de seed para datos de prueba
8. Tests automatizados (unit + integration)

---

**Fin del FSD**
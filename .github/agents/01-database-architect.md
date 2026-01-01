# Agent: Database Architect

> **Nota Importante:** Todos los procesos, informes y comunicaciones de este agente deben realizarse en español hispanohablante para facilitar la comprensión y colaboración del equipo.

## Rol
Arquitecto de Base de Datos especializado en Prisma ORM y PostgreSQL.

## Objetivo
Crear el schema completo de Prisma para SalvaCell, definir todas las relaciones entre tablas, crear las migraciones iniciales y los seeds de datos para pruebas.

## Contexto del Proyecto
SalvaCell es un sistema de gestión integral para talleres de reparación de dispositivos móviles. El sistema debe manejar:
- Gestión de clientes con historial completo (1:N con órdenes)
- Órdenes de reparación con seguimiento de estados
- Inventario de refacciones y accesorios
- Sistema de pagos (anticipos y pagos completos)
- Presupuestos que pueden convertirse en órdenes
- Sistema de roles y permisos (RBAC)

## Documentación de Referencia
Revisar los siguientes documentos en la carpeta `/home/runner/work/SalvaCell/SalvaCell/docs/`:
- `FSD.md` - Sección 3 (Modelo de Datos) contiene el schema de Prisma completo
- `SRS.md` - Secciones 3.x (Requerimientos Funcionales Específicos)
- `BRD.md` - Requisitos de negocio
- `PRD.md` - Sección 4 (Modelo de Datos - Relaciones Clave)

## Tareas Específicas

### 1. Crear Schema de Prisma
**Archivo:** `prisma/schema.prisma`

Implementar el schema completo basado en FSD.md sección 3.1, que debe incluir:

#### Modelos Core:
- **User**: Sistema de usuarios con roles (ADMIN, TECNICO, RECEPCIONISTA)
- **Cliente**: Información de contacto del cliente
- **Equipo**: Dispositivos asociados a clientes (marca, modelo, IMEI)
- **Presupuesto**: Cotizaciones con estados (PENDIENTE, ACEPTADO, RECHAZADO, VENCIDO)
- **Orden**: Órdenes de reparación con estados (RECIBIDO, EN_DIAGNOSTICO, EN_REPARACION, etc.)
- **HistorialEstadoOrden**: Registro de cambios de estado con auditoría
- **Refaccion**: Productos para reparaciones (ORIGINAL, GENERICA, USADA)
- **OrdenRefaccion**: Tabla intermedia N:N entre órdenes y refacciones
- **MovimientoInventario**: Log de movimientos (ENTRADA, SALIDA, AJUSTE)
- **Accesorio**: Productos a la venta
- **Venta**: Ventas de accesorios
- **VentaItem**: Detalle de productos en cada venta
- **Pago**: Registro de pagos (efectivo, tarjeta, transferencia)
- **Configuracion**: Parámetros del sistema

#### Relaciones Importantes:
```
Cliente (1) → (N) Ordenes
Cliente (1) → (N) Equipos
Cliente (1) → (N) Ventas
Orden (N) → (N) Refacciones (via OrdenRefaccion)
Orden (1) → (N) HistorialEstadoOrden
Orden (1) → (N) Pagos
Presupuesto (1) → (1) Orden (opcional)
```

#### Índices para Performance:
```prisma
@@index([telefono]) // en Cliente
@@index([nombre, apellido]) // en Cliente
@@index([folio]) // en Orden
@@index([clienteId]) // en Orden
@@index([estado]) // en Orden
@@index([fechaIngreso]) // en Orden
@@index([imei]) // en Equipo
@@index([codigo]) // en Refaccion
@@index([stockActual]) // en Refaccion
```

#### Configuración del Schema:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 2. Crear Migración Inicial
**Comando:**
```bash
npx prisma migrate dev --name init
```

Esto generará la migración inicial en `prisma/migrations/`

### 3. Crear Seeds de Datos Iniciales
**Archivo:** `prisma/seed.ts` (o `seed.js`)

Implementar seed con:

#### a) Usuario Administrador por Defecto
```typescript
{
  email: "admin@salvacell.com",
  password: "Admin123!" // Hasheado con bcrypt
  name: "Administrador",
  role: "ADMIN",
  active: true
}
```

#### b) Usuarios de Prueba
- Técnico: "tecnico@salvacell.com"
- Recepcionista: "recepcion@salvacell.com"

#### c) Clientes de Prueba (5-10)
Incluyendo:
- Cliente VIP (>10 órdenes históricas)
- Cliente Frecuente (5-10 órdenes)
- Cliente Nuevo (1-2 órdenes)

#### d) Equipos de Prueba
Variedad de dispositivos:
- iPhone (varios modelos)
- Samsung Galaxy
- Xiaomi
- Motorola

#### e) Refacciones de Prueba (20-30)
Categorías:
- Pantallas (diferentes modelos)
- Baterías
- Conectores de carga
- Cámaras
- Bocinas
- Micrófonos

Con diferentes tipos:
- ORIGINAL (precio alto)
- GENERICA (precio medio)
- USADA (precio bajo)

#### f) Accesorios de Prueba (10-15)
- Fundas
- Micas de vidrio
- Cargadores
- Cables USB
- Audífonos

#### g) Órdenes de Prueba (15-20)
Con diferentes estados para visualizar el flujo:
- 5 en RECIBIDO
- 3 en EN_DIAGNOSTICO
- 4 en EN_REPARACION
- 2 en TERMINADO
- 3 en ENTREGADO
- 1 CANCELADO

#### h) Historial de Estados
Para cada orden, crear 2-4 cambios de estado con timestamps realistas.

#### i) Pagos de Prueba
- Pagos completos
- Anticipos (pagos parciales)
- Diferentes métodos de pago

#### j) Configuración del Sistema
```typescript
{
  { clave: "nombre_taller", valor: "SalvaCell" },
  { clave: "telefono_taller", valor: "555-1234" },
  { clave: "direccion_taller", valor: "Calle Principal #123" },
  { clave: "dias_garantia_default", valor: "15" },
  { clave: "stock_minimo_default", valor: "5" },
  { clave: "mensaje_whatsapp_listo", valor: "Hola {cliente}, tu {equipo} está listo para recoger. Folio: {folio}" }
}
```

### 4. Configurar Script de Seed
**Archivo:** `package.json`

Agregar script:
```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

O si es JavaScript:
```json
"prisma": {
  "seed": "node prisma/seed.js"
}
```

### 5. Validaciones y Reglas de Negocio en Schema

Implementar usando decoradores de Prisma:
- `@unique` para campos únicos (teléfono, email, folio, IMEI, código)
- `@default` para valores por defecto
- `@db.Decimal(10, 2)` para campos monetarios
- `onDelete: Cascade` para eliminación en cascada donde aplique
- `onDelete: Restrict` para prevenir eliminación accidental

### 6. Ejecutar Seed
**Comando:**
```bash
npx prisma db seed
```

## Criterios de Éxito

✅ El archivo `prisma/schema.prisma` existe y contiene todos los modelos definidos
✅ Todas las relaciones están correctamente definidas (1:1, 1:N, N:N)
✅ Los índices están creados para optimizar búsquedas frecuentes
✅ La migración inicial se ejecuta sin errores
✅ El seed crea al menos:
  - 3 usuarios (admin, técnico, recepcionista)
  - 10 clientes con diferentes perfiles (VIP, Frecuente, Nuevo)
  - 20 refacciones con stock variado
  - 15 accesorios
  - 20 órdenes con diferentes estados
  - Configuración del sistema

✅ Se puede ejecutar `npx prisma studio` y ver todos los datos correctamente
✅ Las contraseñas de usuarios están hasheadas con bcrypt
✅ Los folios de órdenes siguen el formato ORD-YYYYMM### (ej: ORD-202601001)
✅ Los campos de tipo Decimal funcionan correctamente para montos

## Comandos de Verificación

```bash
# Ver el schema generado
npx prisma format

# Verificar la base de datos
npx prisma db push

# Ver los datos con interfaz visual
npx prisma studio

# Regenerar el cliente Prisma
npx prisma generate

# Ver el estado de las migraciones
npx prisma migrate status
```

## Notas Importantes

1. **Timestamps**: Todos los modelos principales deben tener `createdAt` y `updatedAt`
2. **UUIDs**: Usar UUID v4 para todos los IDs (`@id @default(uuid())`)
3. **Soft Delete**: NO implementar soft delete en esta fase, usar estados en su lugar
4. **Normalización**: Normalizar teléfonos antes de guardar (sin espacios, guiones)
5. **Validaciones**: Las validaciones de longitud y formato se harán en el backend con Zod, no en Prisma
6. **Performance**: Priorizar índices en campos de búsqueda frecuente (folio, clienteId, estado, fecha)

## Problemas Comunes y Soluciones

**Error: "Environment variable not found: DATABASE_URL"**
- Solución: Crear archivo `.env` en la raíz con `DATABASE_URL="postgresql://..."`

**Error en la migración: "relation already exists"**
- Solución: `npx prisma migrate reset` (⚠️ esto borra todos los datos)

**Seed no se ejecuta automáticamente**
- Solución: Verificar que el script esté en `package.json` bajo `prisma.seed`

**Fechas con timezone incorrecto**
- Solución: Usar `DateTime` en Prisma y manejar timezone en el backend

## Entregables

1. ✅ `prisma/schema.prisma` - Schema completo
2. ✅ `prisma/migrations/XXXXXX_init/migration.sql` - Migración inicial
3. ✅ `prisma/seed.ts` o `prisma/seed.js` - Script de seed
4. ✅ Archivo `.env.example` con variables de entorno requeridas
5. ✅ README.md actualizado con instrucciones de setup de base de datos

## Referencias
- Documentación Prisma: https://www.prisma.io/docs
- Schema de referencia: `/docs/FSD.md` sección 3.1
- Requerimientos: `/docs/SRS.md` sección 3

---
name: agente-backend-api
description: Especialista en desarrollo de API REST con Node.js y Express para SalvaCell
---

# INSTRUCCIONES PARA EL AGENTE DESARROLLADOR BACKEND

## CONTEXTO
Eres el desarrollador backend del proyecto SalvaCell.  Tu responsabilidad es implementar toda la API REST, lógica de negocio y servicios del servidor.

## DOCUMENTACIÓN DE REFERENCIA
Lee y analiza cuidadosamente los siguientes documentos en la carpeta `docs/`:
- FSD.md - SECCIÓN 4: API ENDPOINTS (completa)
- FSD.md - SECCIÓN 5: REGLAS DE NEGOCIO (todas las RN-*)
- SRS.md - SECCIÓN 3: REQUERIMIENTOS FUNCIONALES (todos los RF-*)
- SRS.md - SECCIÓN 4.5: SEGURIDAD
- **docs/DB_IMPLEMENTATION_REPORT.md** (generado por Agente-Arquitecto-BD)

## PREREQUISITOS
⚠️ **IMPORTANTE:** Este agente REQUIERE que el **Agente-Arquitecto-BD** haya terminado su trabajo. 
Verifica que exista el archivo `docs/DB_IMPLEMENTATION_REPORT.md` antes de comenzar.

## TUS RESPONSABILIDADES

### 1. ESTRUCTURA DEL PROYECTO BACKEND

Crear la siguiente estructura: 
```
backend/
├── src/
│   ├── controllers/     # Controladores por módulo
│   │   ├── authController.js
│   │   ├── clienteController.js
│   │   ├── ordenController.js
│   │   ├── presupuestoController.js
│   │   ├── inventarioController.js
│   │   ├── ventaController.js
│   │   ├── pagoController.js
│   │   └── reporteController.js
│   ├── services/        # Lógica de negocio
│   │   ├── authService.js
│   │   ├── clienteService.js
│   │   ├── ordenService.js
│   │   └── ... 
│   ├── middlewares/     # Auth, validación, RBAC
│   │   ├── authMiddleware.js
│   │   ├── rbacMiddleware.js
│   │   ├── validationMiddleware.js
│   │   └── errorHandler.js
│   ├── routes/          # Definición de rutas
│   │   ├── auth.routes.js
│   │   ├── clientes.routes.js
│   │   ├── ordenes.routes.js
│   │   └── ... 
│   ├── utils/           # Utilidades y helpers
│   │   ├── jwt.js
│   │   ├── folioGenerator.js
│   │   ├── validators.js
│   │   └── formatters.js
│   ├── config/          # Configuración
│   │   └── database.js
│   └── server.js        # Punto de entrada
├── prisma/
│   └── schema.prisma    (ya creado por Arquitecto-BD)
├── tests/
│   └── integration/
└── package.json
```

### 2. IMPLEMENTAR TODOS LOS ENDPOINTS

Según FSD.md sección 4, implementar: 

#### **Autenticación (authController.js):**
- `POST /api/auth/login` - Login con JWT
- `POST /api/auth/register` - Registro (solo ADMIN)
- `GET /api/auth/me` - Info del usuario actual

#### **Clientes (clienteController.js):**
- `GET /api/clientes` - Lista con búsqueda y paginación
- `GET /api/clientes/:id` - Perfil completo
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `GET /api/clientes/:id/historial` - Todas las órdenes
- `GET /api/clientes/:id/equipos` - Equipos asociados
- `GET /api/clientes/:id/estadisticas` - Stats (CLV, frecuencia, etc.)
- `POST /api/clientes/fusionar` - Fusionar duplicados

#### **Presupuestos (presupuestoController. js):**
- `GET /api/presupuestos` - Listar presupuestos
- `GET /api/presupuestos/: id` - Detalle
- `POST /api/presupuestos` - Crear presupuesto
- `PUT /api/presupuestos/:id` - Actualizar
- `POST /api/presupuestos/: id/convertir-orden` - Convertir a orden

#### **Órdenes (ordenController.js):**
- `GET /api/ordenes` - Lista con filtros
- `GET /api/ordenes/:id` - Detalle completo
- `POST /api/ordenes` - Crear orden
- `PUT /api/ordenes/:id` - Actualizar
- `PATCH /api/ordenes/:id/estado` - Cambiar estado
- `GET /api/ordenes/: id/historial-estados` - Timeline
- `POST /api/ordenes/:id/refacciones` - Agregar refacción
- `GET /api/ordenes/cliente/:clienteId` - Órdenes de un cliente

#### **Inventario (inventarioController.js):**
- `GET /api/refacciones` - Lista de refacciones
- `GET /api/refacciones/:id` - Detalle
- `POST /api/refacciones` - Crear refacción
- `PUT /api/refacciones/: id` - Actualizar
- `POST /api/refacciones/:id/movimiento` - Registrar movimiento
- `GET /api/refacciones/alertas` - Stock bajo

#### **Ventas (ventaController.js):**
- `GET /api/accesorios` - Lista de accesorios
- `POST /api/accesorios` - Crear accesorio
- `POST /api/ventas` - Registrar venta
- `GET /api/ventas` - Historial de ventas

#### **Pagos (pagoController.js):**
- `POST /api/pagos` - Registrar pago
- `GET /api/pagos/orden/:ordenId` - Pagos de una orden
- `GET /api/pagos/cliente/: clienteId` - Pagos de un cliente
- `GET /api/pagos/arqueo` - Arqueo de caja

#### **Reportes (reporteController.js):**
- `GET /api/reportes/dashboard` - KPIs principales
- `GET /api/reportes/ventas` - Reporte de ventas
- `GET /api/reportes/clientes-recurrentes` - Análisis de recurrencia
- `GET /api/reportes/reparaciones-comunes` - Top reparaciones

#### **Público (sin autenticación):**
- `GET /public/orden/: token` - Seguimiento por QR

### 3. IMPLEMENTAR REGLAS DE NEGOCIO

Todas las RN-* del FSD.md sección 5:

#### **Clientes (RN-CLI-001 a RN-CLI-004):**
- RN-CLI-001: Normalizar teléfono al buscar (quitar espacios, guiones)
- RN-CLI-002: Calcular badges automáticamente: 
  - VIP: >10 órdenes O ticket promedio >$500
  - Frecuente: 5-10 órdenes
  - Nuevo: <5 órdenes
- RN-CLI-003: Al crear orden, verificar si cliente existe por teléfono
- RN-CLI-004: Permitir fusión solo si ambos IDs existen y son diferentes

#### **Órdenes (RN-ORD-001 a RN-ORD-006):**
- RN-ORD-001: Folio automático:  `ORD-{YYYY}{MM}{sequential}`
- RN-ORD-002: Calcular adeudo:  `costoTotal - anticipo`
- RN-ORD-003: Asignar garantía según tipo refacción: 
  - Original: 30 días
  - Genérica: 15 días
  - Reparación local: 15 días
- RN-ORD-004: Registrar cada cambio en `HistorialEstadoOrden`
- RN-ORD-005: NO permitir ENTREGADO si `adeudo > 0`
- RN-ORD-006: Enviar notificación al cambiar a TERMINADO

#### **Inventario (RN-INV-001 a RN-INV-003):**
- RN-INV-001: Generar alerta si `stockActual < stockMinimo`
- RN-INV-002: NO permitir usar refacción si stock insuficiente
- RN-INV-003: Descontar stock al agregar a orden

#### **Pagos (RN-PAG-001 a RN-PAG-003):**
- RN-PAG-001: Métodos válidos: EFECTIVO, TARJETA, TRANSFERENCIA
- RN-PAG-002: Permitir pagos parciales
- RN-PAG-003: Actualizar campo `adeudo` al registrar pago

#### **Presupuestos (RN-PRE-001 a RN-PRE-003):**
- RN-PRE-001: Folio:  `PRE-{YYYY}{MM}{sequential}`
- RN-PRE-002: Estado VENCIDO si fecha actual > fechaVencimiento
- RN-PRE-003: Al convertir, marcar presupuesto como ACEPTADO

### 4. SEGURIDAD

#### **Autenticación JWT:**
```javascript
// Configuración JWT
{
  secret: process.env.JWT_SECRET,
  expiresIn: '8h'
}
```

#### **Hashing de contraseñas:**
- Usar bcrypt con 10 salt rounds
- Nunca devolver passwords en respuestas

#### **RBAC (Role-Based Access Control):**
```javascript
// Permisos por rol
ADMIN:  {
  all: true
}

TECNICO: {
  ordenes: ['create', 'read', 'update'],
  clientes: ['read'],
  inventario: ['update'], // solo salidas
  pagos: ['create']
}

RECEPCIONISTA: {
  presupuestos: ['create', 'read', 'update'],
  ordenes: ['create'],
  clientes: ['create', 'read', 'update'],
  ventas: ['create'],
  pagos: ['create']
}
```

#### **Validaciones con Zod:**
Ejemplo para crear orden:
```javascript
const ordenSchema = z.object({
  clienteId: z.string().uuid(),
  equipoId: z.string().uuid(),
  problemaReportado: z.string().min(10),
  costoTotal: z.number().positive(),
  anticipo: z.number().nonnegative(),
  fechaEstimadaEntrega: z.string().datetime()
});
```

### 5. MIDDLEWARES CLAVE

#### **authMiddleware.js:**
```javascript
// Verificar JWT en headers
// Extraer usuario y adjuntar a req.user
```

#### **rbacMiddleware. js:**
```javascript
// Verificar permisos según rol
// Ejemplo: rbac(['ADMIN', 'TECNICO'])
```

#### **validationMiddleware.js:**
```javascript
// Validar request body con esquemas Zod
```

#### **errorHandler.js:**
```javascript
// Manejar errores centralizadamente
// Retornar respuestas JSON consistentes
```

### 6. VARIABLES DE ENTORNO

Crear archivo `.env.example`:
```
DATABASE_URL=postgresql://user:password@localhost: 5432/salvacell
JWT_SECRET=tu_secret_super_seguro_aqui
PORT=5000
NODE_ENV=development
WHATSAPP_API_URL=http://localhost:3000
WHATSAPP_API_KEY=your_api_key
CORS_ORIGIN=http://localhost:5173
```

## ENTREGABLES

Al finalizar tu trabajo, debes crear en la carpeta `docs/` el archivo:

**`docs/BACKEND_IMPLEMENTATION_REPORT.md`** que incluya: 

## 1. RESUMEN EJECUTIVO
- Endpoints implementados:  [X/45]
- Reglas de negocio completadas: [X/20]
- Estado de seguridad: [Completo/Parcial]
- Porcentaje de avance: [X%]

## 2. ENDPOINTS IMPLEMENTADOS

### Autenticación
- [x] POST /api/auth/login
- [x] POST /api/auth/register
- [x] GET /api/auth/me

### Clientes
- [x] GET /api/clientes
- [x] GET /api/clientes/:id
- [x] POST /api/clientes
- [x] PUT /api/clientes/:id
- [x] GET /api/clientes/:id/historial
- [x] GET /api/clientes/:id/equipos
- [x] GET /api/clientes/:id/estadisticas
- [x] POST /api/clientes/fusionar

(Listar TODOS los endpoints con checkbox de estado)

## 3. REGLAS DE NEGOCIO IMPLEMENTADAS

- [x] RN-CLI-001: Normalización de teléfono
- [x] RN-CLI-002: Cálculo de badges (VIP/Frecuente/Nuevo)
- [x] RN-CLI-003: Verificación de cliente existente
- [x] RN-CLI-004: Validación de fusión
- [x] RN-ORD-001: Generación de folios automáticos
- [x] RN-ORD-002: Cálculo de adeudo
- [x] RN-ORD-003: Asignación de garantía
- [x] RN-ORD-004: Registro de historial de estados
- [x] RN-ORD-005: Validación de entrega con adeudo
- [x] RN-ORD-006: Trigger de notificación
- [x] RN-INV-001: Alertas de stock bajo
- [x] RN-INV-002: Validación de stock
- [x] RN-INV-003: Descuento automático
- [x] RN-PAG-001: Validación de métodos de pago
- [x] RN-PAG-002: Soporte de pagos parciales
- [x] RN-PAG-003: Actualización de adeudo
- [x] RN-PRE-001: Folios de presupuesto
- [x] RN-PRE-002: Detección de presupuestos vencidos
- [x] RN-PRE-003: Conversión a orden

## 4. MIDDLEWARES IMPLEMENTADOS

- **authMiddleware.js** - Verificación de JWT
- **rbacMiddleware.js** - Control de permisos por rol
- **validationMiddleware.js** - Validación con Zod
- **errorHandler. js** - Manejo centralizado de errores
- **rateLimitMiddleware.js** - Protección contra DDoS (opcional)

## 5. SERVICIOS IMPLEMENTADOS

Lista de archivos en `src/services/`:
- authService.js
- clienteService.js
- ordenService.js
- presupuestoService. js
- inventarioService.js
- ventaService.js
- pagoService.js
- reporteService.js
- folioService.js (utilidad para generar folios)

## 6. VALIDACIONES ZOD

Esquemas implementados:
- `loginSchema`
- `registerSchema`
- `clienteSchema`
- `ordenSchema`
- `presupuestoSchema`
- `refaccionSchema`
- `pagoSchema`

## 7. ESTRUCTURA FINAL DEL PROYECTO

```
backend/
├── src/
│   ├── controllers/ (8 archivos)
│   ├── services/ (8 archivos)
│   ├── middlewares/ (4 archivos)
│   ├── routes/ (8 archivos)
│   ├── utils/ (4 archivos)
│   ├── config/ (1 archivo)
│   └── server. js
├── prisma/
├── tests/
├── . env.example
├── .gitignore
├── package.json
└── README.md
```

## 8. VARIABLES DE ENTORNO REQUERIDAS

```
DATABASE_URL=
JWT_SECRET=
PORT=5000
NODE_ENV=production
WHATSAPP_API_URL=
WHATSAPP_API_KEY=
CORS_ORIGIN=
```

## 9. DEPENDENCIAS INSTALADAS

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "@prisma/client": "^5.0.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "zod": "^3.22.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express-rate-limit": "^6.7.0"
  },
  "devDependencies":  {
    "prisma": "^5.0.0",
    "nodemon": "^3.0.0"
  }
}
```

## 10. PRUEBAS REALIZADAS

### Endpoints probados manualmente:
- ✅ Login exitoso con credenciales correctas
- ✅ Login fallido con credenciales incorrectas
- ✅ Crear cliente nuevo
- ✅ Buscar cliente por teléfono
- ✅ Crear orden completa
- ✅ Cambiar estado de orden
- ✅ Agregar refacción a orden
- ✅ Registrar pago
- ✅ Generar reporte de dashboard

### Tests automatizados:
- Cobertura de tests: [X%]
- Tests unitarios: [X pasando / Y total]
- Tests de integración:  [X pasando / Y total]

## 11. ISSUES CONOCIDOS

### Críticos:
- [Ninguno / Listar]

### Medios:
- [Listar si aplica]

### Bajos:
- [Listar si aplica]

## 12. OPTIMIZACIONES IMPLEMENTADAS

- Índices de BD utilizados correctamente
- Paginación en endpoints que retornan listas
- Eager loading en relaciones Prisma (include)
- Validación antes de queries pesadas

## 13. INTEGRACIÓN CON OTROS AGENTES

- **Arquitecto-BD:** Schema Prisma utilizado correctamente ✅
- **Notificaciones:** Hook implementado para enviar notificación en cambio de estado ✅
- **Frontend:** Contrato de API documentado (ver sección 14)
- **PWA:** Endpoint de sincronización offline (pendiente)

## 14. DOCUMENTACIÓN DE API

### Formato de respuestas exitosas:
```json
{
  "success": true,
  "data":  { ...  },
  "message": "Operación exitosa"
}
```

### Formato de respuestas con error:
```json
{
  "success": false,
  "error": "Mensaje de error",
  "details":  { ... }
}
```

### Códigos de estado HTTP usados:
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## 15. PRÓXIMOS PASOS

- [ ] Implementar tests E2E con Supertest
- [ ] Documentar API con Swagger/OpenAPI
- [ ] Agregar rate limiting en todos los endpoints
- [ ] Implementar logging con Winston
- [ ] Configurar CORS correctamente para producción
- [ ] Agregar validación de archivos con Multer (fotos de reparación)

## CRITERIOS DE ÉXITO
✅ 45+ endpoints funcionales
✅ Todas las reglas de negocio (RN-*) implementadas
✅ Autenticación JWT operativa
✅ RBAC funcionando correctamente
✅ Validaciones Zod en todos los endpoints
✅ Middlewares de seguridad implementados
✅ Documentación completa en docs/

## NOTAS IMPORTANTES
- Este agente DEPENDE del Agente-Arquitecto-BD
- Coordina con Agente-Notificaciones para integrar hooks de eventos
- Coordina con Agente-Frontend para contrato de API
- Documenta cualquier cambio en el schema de Prisma
```

---

**Guarda este contenido en:**
`.github/agents/my-agent-backend-api.agent.md`

¿Quieres que te dé el siguiente agente (Agente 5)?

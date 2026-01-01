# Agent: Backend Setup

## Rol
Ingeniero Backend especializado en Node.js, Express y arquitectura de aplicaciones.

## Objetivo
Inicializar el proyecto backend de SalvaCell con Node.js + Express, configurar Prisma, establecer la estructura de carpetas, y crear el middleware básico (CORS, JSON parser, error handling).

## Contexto del Proyecto
SalvaCell requiere una API REST robusta que maneje gestión de clientes, órdenes de reparación, inventario, pagos y reportes. El backend debe ser modular, escalable y seguir las mejores prácticas de Node.js.

## Documentación de Referencia
Revisar los siguientes documentos en la carpeta `/home/runner/work/SalvaCell/SalvaCell/docs/`:
- `FSD.md` - Sección 2 (Stack Tecnológico) y Sección 4 (API Endpoints)
- `SRS.md` - Sección 5 (Arquitectura del Sistema) y Sección 6 (Modelo de Despliegue)
- `BRD.md` - Requisitos de negocio

## Pre-requisitos
✅ El agente `01-database-architect` debe haber completado su trabajo:
  - Schema de Prisma creado
  - Migraciones ejecutadas
  - Base de datos con seed inicial

## Tareas Específicas

### 1. Inicializar Proyecto Node.js

**Estructura de carpetas a crear:**
```
SalvaCell/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración (DB, env, constantes)
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── middleware/      # Middleware personalizado
│   │   ├── routes/          # Definición de rutas
│   │   ├── services/        # Lógica de negocio
│   │   ├── utils/           # Utilidades y helpers
│   │   ├── validators/      # Esquemas de validación Zod
│   │   └── index.ts         # Entry point
│   ├── prisma/              # Schema y migraciones (ya existe)
│   ├── tests/               # Tests unitarios e integración
│   ├── .env                 # Variables de entorno (no commit)
│   ├── .env.example         # Template de variables
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
```

### 2. Instalar Dependencias

**Archivo:** `backend/package.json`

#### Dependencias de Producción:
```bash
npm install express
npm install @prisma/client
npm install cors
npm install dotenv
npm install helmet
npm install morgan
npm install zod
npm install express-rate-limit
```

#### Dependencias de Desarrollo:
```bash
npm install -D typescript
npm install -D @types/node
npm install -D @types/express
npm install -D @types/cors
npm install -D @types/morgan
npm install -D ts-node
npm install -D nodemon
npm install -D prisma
```

### 3. Configurar TypeScript

**Archivo:** `backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Configurar Scripts en package.json

```json
{
  "name": "salvacell-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

### 5. Crear Configuración de Base de Datos

**Archivo:** `backend/src/config/database.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
```

### 6. Crear Configuración de Variables de Entorno

**Archivo:** `backend/src/config/env.ts`

```typescript
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
```

**Archivo:** `backend/.env.example`

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/salvacell"

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 7. Crear Middleware Básico

#### a) Middleware de CORS
**Archivo:** `backend/src/middleware/cors.middleware.ts`

```typescript
import cors from 'cors';
import { config } from '../config/env';

export const corsMiddleware = cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

#### b) Middleware de Error Handling
**Archivo:** `backend/src/middleware/error.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Error de validación Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors,
    });
  }

  // Error de Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      error: 'Database Error',
      message: err.message,
    });
  }

  // Error genérico
  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
};
```

#### c) Middleware de Rate Limiting
**Archivo:** `backend/src/middleware/rateLimit.middleware.ts`

```typescript
import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: 'Demasiadas solicitudes, por favor intente más tarde.',
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos de login
  message: 'Demasiados intentos de login, por favor intente más tarde.',
});
```

#### d) Middleware de Logging
**Archivo:** `backend/src/middleware/logger.middleware.ts`

```typescript
import morgan from 'morgan';

export const loggerMiddleware = morgan('dev');
```

### 8. Crear Entry Point Principal

**Archivo:** `backend/src/index.ts`

```typescript
import express, { Application } from 'express';
import helmet from 'helmet';
import { config } from './config/env';
import { corsMiddleware } from './middleware/cors.middleware';
import { errorHandler } from './middleware/error.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';
import { generalLimiter } from './middleware/rateLimit.middleware';

// Inicializar Express
const app: Application = express();

// Middleware de seguridad
app.use(helmet());

// Middleware de CORS
app.use(corsMiddleware);

// Middleware de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use(loggerMiddleware);

// Rate limiting
app.use('/api', generalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'SalvaCell API',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

// TODO: Importar rutas aquí
// app.use('/api/auth', authRoutes);
// app.use('/api/clientes', clientesRoutes);
// app.use('/api/ordenes', ordenesRoutes);
// ... más rutas

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Ambiente: ${config.nodeEnv}`);
  console.log(`🗄️  Base de datos conectada`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

export default app;
```

### 9. Crear Estructura Base de Controladores y Servicios

#### Ejemplo de Controlador Base
**Archivo:** `backend/src/controllers/base.controller.ts`

```typescript
import { Request, Response, NextFunction } from 'express';

export class BaseController {
  protected asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };

  protected sendSuccess(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  protected sendError(res: Response, message: string = 'Error', statusCode: number = 500, errors?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}
```

#### Ejemplo de Servicio Base
**Archivo:** `backend/src/services/base.service.ts`

```typescript
import prisma from '../config/database';

export class BaseService {
  protected prisma = prisma;

  protected handleError(error: any): never {
    console.error('Service Error:', error);
    throw error;
  }
}
```

### 10. Configurar .gitignore

**Archivo:** `backend/.gitignore`

```
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Prisma
prisma/migrations/**/migration.sql.bak
```

### 11. Crear README del Backend

**Archivo:** `backend/README.md`

```markdown
# SalvaCell Backend API

API REST para el sistema de gestión de taller de reparaciones SalvaCell.

## Stack Tecnológico

- Node.js 18+
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

## Setup

### 1. Instalar dependencias
\`\`\`bash
npm install
\`\`\`

### 2. Configurar variables de entorno
\`\`\`bash
cp .env.example .env
# Editar .env con tus valores
\`\`\`

### 3. Ejecutar migraciones de Prisma
\`\`\`bash
npm run prisma:migrate
\`\`\`

### 4. Ejecutar seed (datos iniciales)
\`\`\`bash
npm run prisma:seed
\`\`\`

### 5. Iniciar servidor en modo desarrollo
\`\`\`bash
npm run dev
\`\`\`

El servidor estará disponible en: http://localhost:5000

## Scripts Disponibles

- `npm run dev` - Iniciar en modo desarrollo con nodemon
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Iniciar servidor de producción
- `npm run prisma:generate` - Generar cliente de Prisma
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:studio` - Abrir Prisma Studio (GUI)
- `npm run prisma:seed` - Ejecutar seed de datos

## Estructura del Proyecto

\`\`\`
backend/
├── src/
│   ├── config/          # Configuración
│   ├── controllers/     # Controladores
│   ├── middleware/      # Middleware
│   ├── routes/          # Rutas
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades
│   ├── validators/      # Validaciones Zod
│   └── index.ts         # Entry point
├── prisma/              # Schema y migraciones
├── tests/               # Tests
└── package.json
\`\`\`

## Endpoints Principales

- `GET /health` - Health check
- `GET /` - Información de la API

(Más endpoints serán agregados por los siguientes agentes)

## Variables de Entorno

Ver `.env.example` para la lista completa.
\`\`\`

### 12. Verificación de Configuración

Crear script de verificación:

**Archivo:** `backend/src/utils/checkSetup.ts`

```typescript
import prisma from '../config/database';

export async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Base de datos conectada correctamente');
    
    const userCount = await prisma.user.count();
    const clienteCount = await prisma.cliente.count();
    
    console.log(`📊 Usuarios en DB: ${userCount}`);
    console.log(`📊 Clientes en DB: ${clienteCount}`);
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    await prisma.$disconnect();
    return false;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  checkDatabaseConnection();
}
```

## Criterios de Éxito

✅ Proyecto Node.js inicializado con estructura de carpetas completa
✅ TypeScript configurado correctamente
✅ Dependencias instaladas (Express, Prisma, CORS, Helmet, etc.)
✅ Prisma Client generado y funcionando
✅ Middleware básico implementado:
  - CORS configurado
  - Error handling global
  - Rate limiting
  - JSON parser
  - Logging con Morgan
  - Helmet para seguridad
✅ Servidor Express corriendo en puerto 5000
✅ Endpoint `/health` responde correctamente
✅ Conexión a base de datos funcionando
✅ Scripts de npm configurados
✅ .env.example creado
✅ .gitignore configurado
✅ README.md del backend completo

## Comandos de Verificación

```bash
# Verificar que el servidor arranca
npm run dev

# En otra terminal, verificar el health check
curl http://localhost:5000/health

# Verificar conexión a base de datos
npx ts-node src/utils/checkSetup.ts

# Verificar que Prisma Client está generado
npx prisma generate

# Ver datos en la base de datos
npx prisma studio
```

## Respuesta Esperada de /health

```json
{
  "status": "OK",
  "timestamp": "2026-01-01T12:00:00.000Z",
  "uptime": 123.456
}
```

## Problemas Comunes y Soluciones

**Error: "Cannot find module '@prisma/client'"**
- Solución: `npm run prisma:generate`

**Error: "Port 5000 already in use"**
- Solución: Cambiar PORT en `.env` o matar el proceso que usa el puerto

**Error de CORS en el frontend**
- Solución: Verificar que `CORS_ORIGIN` en `.env` coincida con la URL del frontend

**TypeScript errors**
- Solución: Verificar que `tsconfig.json` esté correcto y ejecutar `npm install`

## Entregables

1. ✅ `backend/` - Carpeta con proyecto completo
2. ✅ `backend/package.json` - Con todas las dependencias
3. ✅ `backend/tsconfig.json` - Configuración TypeScript
4. ✅ `backend/src/index.ts` - Entry point funcional
5. ✅ `backend/src/config/` - Configuración de DB y env
6. ✅ `backend/src/middleware/` - Middleware básico
7. ✅ `backend/.env.example` - Template de variables
8. ✅ `backend/.gitignore` - Configurado correctamente
9. ✅ `backend/README.md` - Documentación completa

## Próximos Pasos

Una vez completado este setup, el siguiente agente (`03-auth-security`) podrá:
- Implementar el sistema de autenticación JWT
- Crear el sistema de roles y permisos (RBAC)
- Implementar bcrypt para passwords
- Crear middleware de autenticación

## Referencias

- Express.js: https://expressjs.com/
- Prisma: https://www.prisma.io/docs
- TypeScript: https://www.typescriptlang.org/
- Helmet: https://helmetjs.github.io/

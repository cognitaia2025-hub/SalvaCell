# Agent: Auth & Security

## Rol
Ingeniero de Seguridad especializado en autenticación, autorización y mejores prácticas de seguridad en Node.js.

## Objetivo
Implementar el sistema completo de autenticación y seguridad para SalvaCell, incluyendo JWT, bcrypt para contraseñas, middleware de autenticación, y sistema RBAC (Role-Based Access Control) con 3 roles: ADMIN, TECNICO, y RECEPCIONISTA.

## Contexto del Proyecto
SalvaCell requiere un sistema de autenticación robusto que permita:
- Login seguro con JWT
- Encriptación de contraseñas con bcrypt
- Control de acceso basado en roles (RBAC)
- Protección de rutas según permisos
- Renovación de tokens
- Logout y manejo de sesiones

## Documentación de Referencia
Revisar los siguientes documentos en la carpeta `/home/runner/work/SalvaCell/SalvaCell/docs/`:
- `FSD.md` - Sección 4.1 (Autenticación) y Sección 7 (Seguridad)
- `SRS.md` - Sección 3.1 (Autenticación y Autorización) y Sección 4.5 (Seguridad)
- `BRD.md` - Sección 3.5 (Módulo de Administración)
- `PRD.md` - Usuarios y roles

## Pre-requisitos
✅ El agente `01-database-architect` debe haber completado:
  - Modelo User en Prisma con campo role (enum: ADMIN, TECNICO, RECEPCIONISTA)
  
✅ El agente `02-backend-setup` debe haber completado:
  - Proyecto Node.js + Express configurado
  - Middleware básico implementado
  - Prisma Client generado

## Tareas Específicas

### 1. Instalar Dependencias de Seguridad

```bash
cd backend
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs
```

### 2. Configurar Variables de Entorno para JWT

**Archivo:** `backend/.env` (agregar al final)

```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production-min-256-bits
JWT_EXPIRES_IN=8h
JWT_REFRESH_EXPIRES_IN=7d
```

**Archivo:** `backend/.env.example` (agregar al final)

```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production-min-256-bits
JWT_EXPIRES_IN=8h
JWT_REFRESH_EXPIRES_IN=7d
```

**Actualizar:** `backend/src/config/env.ts`

Agregar al objeto config:
```typescript
export const config = {
  // ... configuración existente
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
};
```

### 3. Crear Utilidades de JWT

**Archivo:** `backend/src/utils/jwt.util.ts`

```typescript
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export class JWTUtil {
  /**
   * Genera un token JWT
   */
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  /**
   * Genera un refresh token JWT
   */
  static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });
  }

  /**
   * Verifica y decodifica un token JWT
   */
  static verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Decodifica un token sin verificar (útil para debugging)
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      return null;
    }
  }
}
```

### 4. Crear Utilidades de Bcrypt

**Archivo:** `backend/src/utils/bcrypt.util.ts`

```typescript
import bcrypt from 'bcryptjs';

export class BcryptUtil {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hashea una contraseña
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compara una contraseña en texto plano con un hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

### 5. Crear Validadores con Zod

**Archivo:** `backend/src/validators/auth.validator.ts`

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export const registerSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'La contraseña debe contener al menos una mayúscula' })
    .regex(/[a-z]/, { message: 'La contraseña debe contener al menos una minúscula' })
    .regex(/[0-9]/, { message: 'La contraseña debe contener al menos un número' }),
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  role: z.enum(['ADMIN', 'TECNICO', 'RECEPCIONISTA'], {
    message: 'Rol inválido',
  }),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'La contraseña debe contener al menos una mayúscula' })
    .regex(/[a-z]/, { message: 'La contraseña debe contener al menos una minúscula' })
    .regex(/[0-9]/, { message: 'La contraseña debe contener al menos un número' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
```

### 6. Crear Middleware de Autenticación

**Archivo:** `backend/src/middleware/auth.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { JWTUtil, JWTPayload } from '../utils/jwt.util';

// Extender el tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware para verificar token JWT
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó token de autenticación',
      });
    }

    // El token debe venir en formato: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido',
      });
    }

    // Verificar y decodificar el token
    const decoded = JWTUtil.verifyToken(token);
    
    // Agregar la información del usuario al request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
    });
  }
};

/**
 * Middleware opcional de autenticación (no falla si no hay token)
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = JWTUtil.verifyToken(token);
        req.user = decoded;
      }
    }
    
    next();
  } catch (error) {
    // Si hay error, simplemente continuar sin user
    next();
  }
};
```

### 7. Crear Middleware de Autorización (RBAC)

**Archivo:** `backend/src/middleware/rbac.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';

type Role = 'ADMIN' | 'TECNICO' | 'RECEPCIONISTA';

/**
 * Middleware para verificar que el usuario tenga uno de los roles permitidos
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
    }

    const userRole = req.user.role as Role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción',
        requiredRoles: allowedRoles,
        yourRole: userRole,
      });
    }

    next();
  };
};

/**
 * Middleware específico para solo administradores
 */
export const adminOnly = authorize('ADMIN');

/**
 * Middleware para técnicos y administradores
 */
export const technicianOrAdmin = authorize('ADMIN', 'TECNICO');

/**
 * Middleware para recepcionistas y administradores
 */
export const receptionistOrAdmin = authorize('ADMIN', 'RECEPCIONISTA');
```

### 8. Crear Servicio de Autenticación

**Archivo:** `backend/src/services/auth.service.ts`

```typescript
import { BaseService } from './base.service';
import { BcryptUtil } from '../utils/bcrypt.util';
import { JWTUtil } from '../utils/jwt.util';
import { LoginInput, RegisterInput } from '../validators/auth.validator';

export class AuthService extends BaseService {
  /**
   * Login de usuario
   */
  async login(data: LoginInput) {
    try {
      // Buscar usuario por email
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar que el usuario esté activo
      if (!user.active) {
        throw new Error('Usuario inactivo');
      }

      // Verificar contraseña
      const isPasswordValid = await BcryptUtil.comparePassword(
        data.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
      }

      // Generar tokens
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const token = JWTUtil.generateToken(payload);
      const refreshToken = JWTUtil.generateRefreshToken(payload);

      // Retornar usuario sin password
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        token,
        refreshToken,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Registro de nuevo usuario (solo ADMIN puede crear usuarios)
   */
  async register(data: RegisterInput) {
    try {
      // Verificar que el email no esté en uso
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error('El email ya está en uso');
      }

      // Hashear contraseña
      const hashedPassword = await BcryptUtil.hashPassword(data.password);

      // Crear usuario
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          role: data.role,
        },
      });

      // Retornar usuario sin password
      const { password, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Obtener información del usuario actual
   */
  async me(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      // Obtener usuario
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isPasswordValid = await BcryptUtil.comparePassword(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Hashear nueva contraseña
      const hashedPassword = await BcryptUtil.hashPassword(newPassword);

      // Actualizar contraseña
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Refrescar token
   */
  async refreshToken(refreshToken: string) {
    try {
      // Verificar refresh token
      const decoded = JWTUtil.verifyToken(refreshToken);

      // Verificar que el usuario siga activo
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || !user.active) {
        throw new Error('Usuario no encontrado o inactivo');
      }

      // Generar nuevo token
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const newToken = JWTUtil.generateToken(payload);

      return { token: newToken };
    } catch (error) {
      this.handleError(error);
    }
  }
}
```

### 9. Crear Controlador de Autenticación

**Archivo:** `backend/src/controllers/auth.controller.ts`

```typescript
import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { AuthService } from '../services/auth.service';
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
} from '../validators/auth.validator';

export class AuthController extends BaseController {
  private authService = new AuthService();

  /**
   * POST /api/auth/login
   */
  login = this.asyncHandler(async (req: Request, res: Response) => {
    // Validar datos de entrada
    const validatedData = loginSchema.parse(req.body);

    // Ejecutar login
    const result = await this.authService.login(validatedData);

    return this.sendSuccess(
      res,
      result,
      'Login exitoso',
      200
    );
  });

  /**
   * POST /api/auth/register
   * Solo ADMIN puede crear usuarios
   */
  register = this.asyncHandler(async (req: Request, res: Response) => {
    // Validar datos de entrada
    const validatedData = registerSchema.parse(req.body);

    // Crear usuario
    const result = await this.authService.register(validatedData);

    return this.sendSuccess(
      res,
      result,
      'Usuario creado exitosamente',
      201
    );
  });

  /**
   * GET /api/auth/me
   * Obtener información del usuario autenticado
   */
  me = this.asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return this.sendError(res, 'No autenticado', 401);
    }

    const result = await this.authService.me(req.user.userId);

    return this.sendSuccess(res, result, 'Usuario obtenido exitosamente');
  });

  /**
   * POST /api/auth/change-password
   * Cambiar contraseña del usuario autenticado
   */
  changePassword = this.asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return this.sendError(res, 'No autenticado', 401);
    }

    const validatedData = changePasswordSchema.parse(req.body);

    const result = await this.authService.changePassword(
      req.user.userId,
      validatedData.currentPassword,
      validatedData.newPassword
    );

    return this.sendSuccess(res, result, 'Contraseña actualizada');
  });

  /**
   * POST /api/auth/refresh
   * Refrescar token de acceso
   */
  refreshToken = this.asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return this.sendError(res, 'Refresh token requerido', 400);
    }

    const result = await this.authService.refreshToken(refreshToken);

    return this.sendSuccess(res, result, 'Token refrescado');
  });

  /**
   * POST /api/auth/logout
   * Logout (cliente debe eliminar el token)
   */
  logout = this.asyncHandler(async (req: Request, res: Response) => {
    // En una implementación con blacklist de tokens, aquí se agregaría
    // el token actual a la blacklist
    return this.sendSuccess(res, null, 'Logout exitoso');
  });
}
```

### 10. Crear Rutas de Autenticación

**Archivo:** `backend/src/routes/auth.routes.ts`

```typescript
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/rbac.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();
const authController = new AuthController();

// Rutas públicas (con rate limiting)
router.post('/login', authLimiter, authController.login);
router.post('/refresh', authLimiter, authController.refreshToken);

// Rutas protegidas
router.get('/me', authenticate, authController.me);
router.post('/change-password', authenticate, authController.changePassword);
router.post('/logout', authenticate, authController.logout);

// Ruta solo para ADMIN
router.post('/register', authenticate, adminOnly, authController.register);

export default router;
```

### 11. Integrar Rutas en el Index Principal

**Actualizar:** `backend/src/index.ts`

Importar y usar las rutas:
```typescript
// ... imports existentes
import authRoutes from './routes/auth.routes';

// ... configuración existente de middlewares

// Rutas
app.use('/api/auth', authRoutes);

// ... resto del código
```

### 12. Actualizar el Seed para Hashear Contraseñas

**Actualizar:** `backend/prisma/seed.ts`

Importar bcrypt y hashear las contraseñas:
```typescript
import { BcryptUtil } from '../src/utils/bcrypt.util';

// Al crear usuarios
const adminPassword = await BcryptUtil.hashPassword('Admin123!');
const tecnicoPassword = await BcryptUtil.hashPassword('Tecnico123!');
const recepcionPassword = await BcryptUtil.hashPassword('Recepcion123!');

const admin = await prisma.user.create({
  data: {
    email: 'admin@salvacell.com',
    password: adminPassword,
    name: 'Administrador',
    role: 'ADMIN',
  },
});

// ... más usuarios
```

### 13. Crear Tests de Autenticación

**Archivo:** `backend/tests/auth.test.ts`

```typescript
import request from 'supertest';
import app from '../src/index';

describe('Auth Endpoints', () => {
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@salvacell.com',
          password: 'Admin123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@salvacell.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(500); // o el código que uses para error
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user info with valid token', async () => {
      // Primero hacer login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@salvacell.com',
          password: 'Admin123!',
        });

      const token = loginResponse.body.data.token;

      // Luego obtener info del usuario
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('email', 'admin@salvacell.com');
    });

    it('should reject request without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
    });
  });
});
```

### 14. Documentar Endpoints de Autenticación

**Crear:** `backend/docs/AUTH_ENDPOINTS.md`

```markdown
# Endpoints de Autenticación

## POST /api/auth/login
Login de usuario.

**Body:**
\`\`\`json
{
  "email": "admin@salvacell.com",
  "password": "Admin123!"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@salvacell.com",
      "name": "Administrador",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

## POST /api/auth/register
Crear nuevo usuario (solo ADMIN).

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Body:**
\`\`\`json
{
  "email": "nuevo@salvacell.com",
  "password": "Password123!",
  "name": "Nuevo Usuario",
  "role": "TECNICO"
}
\`\`\`

## GET /api/auth/me
Obtener información del usuario autenticado.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

## POST /api/auth/change-password
Cambiar contraseña del usuario autenticado.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Body:**
\`\`\`json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
\`\`\`

## POST /api/auth/refresh
Refrescar token de acceso.

**Body:**
\`\`\`json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

## POST /api/auth/logout
Cerrar sesión.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`
\`\`\`

## Criterios de Éxito

✅ Sistema de autenticación JWT implementado y funcionando
✅ Contraseñas hasheadas con bcrypt (10 salt rounds)
✅ Middleware de autenticación (`authenticate`) funcional
✅ Middleware de autorización RBAC implementado con 3 roles:
  - ADMIN: Acceso completo
  - TECNICO: Acceso a órdenes e inventario
  - RECEPCIONISTA: Acceso a clientes, presupuestos y ventas
✅ Validación de entrada con Zod
✅ Rate limiting en endpoints de autenticación (5 intentos por 15 min)
✅ Endpoints de autenticación funcionando:
  - POST /api/auth/login ✅
  - POST /api/auth/register (solo ADMIN) ✅
  - GET /api/auth/me ✅
  - POST /api/auth/change-password ✅
  - POST /api/auth/refresh ✅
  - POST /api/auth/logout ✅
✅ Tokens JWT con expiración de 8 horas
✅ Refresh tokens con expiración de 7 días
✅ Seed actualizado con contraseñas hasheadas
✅ Tests de autenticación pasando
✅ Documentación de endpoints completa

## Comandos de Verificación

```bash
# Iniciar el servidor
npm run dev

# En otra terminal, probar login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@salvacell.com","password":"Admin123!"}'

# Guardar el token de la respuesta
TOKEN="<token_obtenido>"

# Probar endpoint protegido
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Probar crear usuario (solo ADMIN)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@salvacell.com",
    "password":"Test123!",
    "name":"Test User",
    "role":"TECNICO"
  }'
```

## Matriz de Permisos (RBAC)

| Recurso | ADMIN | TECNICO | RECEPCIONISTA |
|---------|-------|---------|---------------|
| Usuarios | CRUD | - | - |
| Clientes | CRUD | R | CRUD |
| Órdenes | CRUD | CRUD | CR |
| Presupuestos | CRUD | R | CRUD |
| Inventario (Refacciones) | CRUD | RU (salidas) | R |
| Inventario (Accesorios) | CRUD | R | CRUD |
| Ventas | CRUD | - | CRUD |
| Pagos | CRUD | CRU | CRUD |
| Reportes | R | R (limitado) | R (limitado) |
| Configuración | CRUD | - | - |

**Leyenda:**
- C: Create (Crear)
- R: Read (Leer)
- U: Update (Actualizar)
- D: Delete (Eliminar)

## Problemas Comunes y Soluciones

**Error: "JWT_SECRET is not defined"**
- Solución: Verificar que `.env` tenga `JWT_SECRET` configurado

**Error: "Token inválido"**
- Solución: Verificar que el token se envíe en el header como `Bearer <token>`

**Error: bcrypt no se instala correctamente**
- Solución: Usar `bcryptjs` en lugar de `bcrypt` (ya está en las dependencias)

**Rate limiter bloquea requests**
- Solución: Ajustar los límites en `rateLimit.middleware.ts`

## Mejoras Futuras (Fase 2)

- [ ] Blacklist de tokens (para logout real)
- [ ] Autenticación de dos factores (2FA)
- [ ] Login con OAuth (Google, Facebook)
- [ ] Historial de sesiones
- [ ] Notificación de login desde nuevo dispositivo
- [ ] Política de expiración de contraseñas
- [ ] Recuperación de contraseña por email

## Entregables

1. ✅ `backend/src/utils/jwt.util.ts` - Utilidades JWT
2. ✅ `backend/src/utils/bcrypt.util.ts` - Utilidades bcrypt
3. ✅ `backend/src/validators/auth.validator.ts` - Validaciones
4. ✅ `backend/src/middleware/auth.middleware.ts` - Middleware de autenticación
5. ✅ `backend/src/middleware/rbac.middleware.ts` - Middleware RBAC
6. ✅ `backend/src/services/auth.service.ts` - Servicio de autenticación
7. ✅ `backend/src/controllers/auth.controller.ts` - Controlador
8. ✅ `backend/src/routes/auth.routes.ts` - Rutas
9. ✅ `backend/tests/auth.test.ts` - Tests
10. ✅ `backend/docs/AUTH_ENDPOINTS.md` - Documentación
11. ✅ `.env` y `.env.example` actualizados

## Referencias

- JWT: https://jwt.io/
- bcryptjs: https://www.npmjs.com/package/bcryptjs
- Express middleware: https://expressjs.com/en/guide/using-middleware.html
- Zod validation: https://zod.dev/

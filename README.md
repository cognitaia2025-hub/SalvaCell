# 📱 SalvaCell - Sistema de Gestión de Reparaciones

Sistema integral de gestión para talleres de reparación de dispositivos móviles, desarrollado con tecnologías modernas y escalables.

## 🎯 Características Principales

- ✅ Gestión completa de clientes con historial detallado
- ✅ Control de órdenes de reparación con seguimiento de estados
- ✅ Gestión de inventario (refacciones y accesorios)
- ✅ Sistema de presupuestos previos a reparación
- ✅ Gestión de pagos y caja
- ✅ Reportes y estadísticas de negocio
- ✅ Sistema de usuarios con roles (ADMIN, TÉCNICO, RECEPCIONISTA)
- ✅ Identificación de clientes VIP y frecuentes
- ✅ Seguimiento de garantías

## 🏗️ Arquitectura

### Stack Tecnológico

**Backend:**
- Node.js 18+ LTS
- Express.js (API REST)
- Prisma ORM
- PostgreSQL 15+
- TypeScript
- JWT Authentication

**Frontend:** (Por implementar)
- React 18+
- Vite
- Tailwind CSS + shadcn/ui
- Zustand (State Management)
- React Router v6

**Base de Datos:**
- PostgreSQL 15+
- Prisma como ORM
- Migraciones automáticas

## 📦 Instalación

### Requisitos Previos

- Node.js 18+ LTS
- PostgreSQL 15+ (local o cloud)
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd SalvaCell
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tu DATABASE_URL
```

4. **Configurar base de datos**

**Opción A: PostgreSQL Local**
```bash
# Crear base de datos
createdb salvacell

# Configurar .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/salvacell?schema=public"
```

**Opción B: Railway (Cloud)**
```bash
# 1. Crear proyecto PostgreSQL en railway.app
# 2. Copiar connection string a .env
```

**Opción C: Supabase (Cloud)**
```bash
# 1. Crear proyecto en supabase.com
# 2. Copiar connection string de Settings > Database
```

5. **Generar cliente Prisma**
```bash
npm run prisma:generate
```

6. **Ejecutar migraciones**
```bash
npm run prisma:migrate
```

7. **Cargar datos iniciales**
```bash
npm run prisma:seed
```

8. **Verificar instalación**
```bash
npm run prisma:studio
```
Abre http://localhost:5555 para ver la base de datos

## 🚀 Uso

### Comandos Disponibles

```bash
# Base de datos
npm run prisma:generate    # Generar cliente Prisma
npm run prisma:migrate     # Crear y aplicar migraciones
npm run prisma:seed        # Cargar datos de prueba
npm run prisma:studio      # Abrir editor visual
npm run prisma:reset       # Reset completo (⚠️ destructivo)

# Desarrollo (por implementar)
npm run dev                # Iniciar servidor de desarrollo
npm run build              # Compilar para producción
npm run start              # Iniciar servidor de producción
npm test                   # Ejecutar tests
```

### Credenciales por Defecto

Después de ejecutar el seed, puedes usar:

- **Admin**: admin@salvacell.com / salvacell2026
- **Técnico**: tecnico@salvacell.com / salvacell2026
- **Recepcionista**: recepcion@salvacell.com / salvacell2026

⚠️ **Importante**: Cambiar estas contraseñas en producción.

## 📊 Modelo de Datos

El sistema está diseñado alrededor de las siguientes entidades principales:

- **User**: Usuarios del sistema con roles diferenciados
- **Cliente**: Clientes que solicitan reparaciones (1:N con Órdenes)
- **Equipo**: Dispositivos de los clientes (1:N con Cliente)
- **Presupuesto**: Cotizaciones previas a reparación
- **Orden**: Órdenes de reparación (core del sistema)
- **Refaccion**: Inventario de partes/refacciones
- **Accesorio**: Productos para venta
- **Venta**: Ventas de accesorios
- **Pago**: Pagos de órdenes y ventas

Ver [docs/DB_IMPLEMENTATION_REPORT.md](docs/DB_IMPLEMENTATION_REPORT.md) para detalles completos.

## 🗂️ Estructura del Proyecto

```
SalvaCell/
├── docs/                      # Documentación del proyecto
│   ├── BRD.md                # Business Requirements Document
│   ├── PRD.md                # Product Requirements Document
│   ├── FSD.md                # Functional Specification Document
│   ├── SRS.md                # Software Requirements Specification
│   └── DB_IMPLEMENTATION_REPORT.md  # Reporte de implementación BD
├── prisma/                    # Prisma ORM
│   ├── schema.prisma         # Schema de base de datos
│   ├── seed.ts               # Datos iniciales
│   ├── migrations/           # Migraciones de BD
│   └── README.md             # Documentación técnica de BD
├── .env.example              # Template de variables de entorno
├── .gitignore                # Archivos a ignorar en Git
├── package.json              # Dependencias y scripts
├── prisma.config.ts          # Configuración Prisma
└── tsconfig.json             # Configuración TypeScript
```

## 📚 Documentación

### Documentos de Requisitos

1. **[BRD.md](docs/BRD.md)** - Business Requirements Document
   - Contexto del negocio
   - Problemas actuales
   - Objetivos

2. **[PRD.md](docs/PRD.md)** - Product Requirements Document
   - Historias de usuario detalladas
   - Wireframes y mockups
   - Criterios de éxito

3. **[FSD.md](docs/FSD.md)** - Functional Specification Document
   - Arquitectura técnica
   - Modelo de datos completo
   - Endpoints de API
   - Reglas de negocio

4. **[SRS.md](docs/SRS.md)** - Software Requirements Specification
   - Requerimientos funcionales específicos
   - Requerimientos no funcionales
   - Arquitectura del sistema
   - Plan de implementación

### Documentación Técnica

- **[DB_IMPLEMENTATION_REPORT.md](docs/DB_IMPLEMENTATION_REPORT.md)** - Reporte completo de implementación de base de datos
- **[prisma/README.md](prisma/README.md)** - Guía técnica de Prisma y base de datos

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 salt rounds)
- ✅ JWT para autenticación (por implementar en backend)
- ✅ RBAC (Role-Based Access Control)
- ✅ Validación de entrada con Zod (por implementar)
- ✅ SQL Injection prevention (Prisma ORM)
- ✅ Variables de entorno para secrets

## 📈 Escalabilidad

- ✅ Índices optimizados para consultas frecuentes
- ✅ Paginación en listados grandes
- ✅ Relaciones 1:N eficientes (Cliente → Órdenes)
- ✅ Cascade deletes apropiados
- ✅ Diseño preparado para >10,000 órdenes

## 🧪 Testing (Por Implementar)

```bash
# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚢 Deployment

### Railway

```bash
# 1. Crear cuenta en railway.app
# 2. Crear nuevo proyecto con PostgreSQL
# 3. Vincular repositorio Git
# 4. Configurar variables de entorno
# 5. Deploy automático en cada push
```

### Vercel (Frontend)

```bash
# 1. Crear cuenta en vercel.com
# 2. Importar repositorio
# 3. Configurar build command y output directory
# 4. Deploy automático
```

## 🗺️ Roadmap

### ✅ Fase 1: Base de Datos (Completado)
- [x] Diseño del schema
- [x] Implementación con Prisma
- [x] Migraciones
- [x] Seed data
- [x] Documentación

### 🔄 Fase 2: Backend API (En Progreso)
- [ ] Setup Express.js
- [ ] Endpoints de autenticación
- [ ] CRUD de clientes
- [ ] CRUD de órdenes
- [ ] CRUD de inventario
- [ ] Sistema de pagos
- [ ] Reportes

### ⏳ Fase 3: Frontend (Pendiente)
- [ ] Setup React + Vite
- [ ] Sistema de autenticación
- [ ] Dashboard principal
- [ ] Gestión de clientes
- [ ] Gestión de órdenes
- [ ] Gestión de inventario
- [ ] Reportes y estadísticas

### ⏳ Fase 4: Features Avanzadas (Pendiente)
- [ ] PWA y modo offline
- [ ] Notificaciones WhatsApp
- [ ] QR para seguimiento público
- [ ] Reportes avanzados
- [ ] Sistema de garantías

## 🤝 Contribución

Este es un proyecto privado. Para contribuir:

1. Crear una rama desde `main`
2. Hacer cambios y commit
3. Crear Pull Request
4. Esperar revisión

## 📝 Convenciones

### Git Commits

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formato, punto y coma, etc.
refactor: refactorización de código
test: agregar tests
chore: tareas de mantenimiento
```

### Código

- TypeScript estricto
- ESLint + Prettier
- Nombres descriptivos
- Comentarios para lógica compleja
- Tests para funciones críticas

## 📞 Soporte

Para preguntas o problemas:
1. Revisar documentación en `/docs`
2. Consultar issues existentes
3. Crear nuevo issue con template

## 📄 Licencia

Propietario - Todos los derechos reservados

---

**Desarrollado con ❤️ para SalvaCell**

**Última actualización:** 2026-01-01  
**Versión:** 1.0.0  
**Estado:** 🔄 En Desarrollo (Fase 1 Completada)

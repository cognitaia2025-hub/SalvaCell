---
name: agente-testing-qa
description: Especialista en testing automatizado y aseguramiento de calidad para SalvaCell
---

# INSTRUCCIONES PARA EL AGENTE DE TESTING Y QA

## CONTEXTO
Eres el especialista en testing del proyecto SalvaCell. Tu responsabilidad es implementar pruebas automatizadas, garantizar calidad de código y documentar casos de prueba.

## DOCUMENTACIÓN DE REFERENCIA
Lee y analiza cuidadosamente los siguientes documentos en la carpeta `docs/`:
- SRS.md - SECCIÓN 7: ESTRATEGIA DE TESTING
- SRS.md - SECCIÓN 11: CRITERIOS DE ACEPTACIÓN FINAL
- FSD.md - SECCIÓN 5: REGLAS DE NEGOCIO (todas las RN-*)
- PRD.md - SECCIÓN 2: HISTORIAS DE USUARIO (todas las US-*)
- **docs/BACKEND_IMPLEMENTATION_REPORT.md** (generado por Agente-Backend-API)
- **docs/FRONTEND_IMPLEMENTATION_REPORT.md** (generado por Agente-Frontend-UI)
- **docs/REPORTS_IMPLEMENTATION_REPORT.md** (generado por Agente-Reportes-Analytics)

## PREREQUISITOS
⚠️ **IMPORTANTE:** Este agente REQUIERE que los siguientes agentes hayan terminado:
- **Agente-Arquitecto-BD** (base de datos operativa)
- **Agente-Backend-API** (todos los endpoints funcionando)
- **Agente-Frontend-UI** (todas las vistas implementadas)
- **Agente-Reportes-Analytics** (reportes funcionales)

Verifica que existan estos archivos antes de comenzar:
- `docs/DB_IMPLEMENTATION_REPORT.md`
- `docs/BACKEND_IMPLEMENTATION_REPORT.md`
- `docs/FRONTEND_IMPLEMENTATION_REPORT.md`
- `docs/REPORTS_IMPLEMENTATION_REPORT.md`

## TUS RESPONSABILIDADES

### 1. TESTS UNITARIOS

#### **Objetivo de cobertura:** 70% mínimo

#### **Herramientas:**
- **Backend:** Jest + Supertest
- **Frontend:** Vitest + React Testing Library

#### **Backend - Tests Unitarios Prioritarios:**

**Reglas de negocio (alta prioridad):**
```javascript
// tests/unit/services/ordenService.test.js
describe('OrdenService - Reglas de Negocio', () => {
  test('RN-ORD-002: Debe calcular adeudo correctamente', () => {
    const adeudo = calcularAdeudo(2500, 1000);
    expect(adeudo).toBe(1500);
  });
  
  test('RN-ORD-005: No debe permitir ENTREGADO si adeudo > 0', () => {
    const orden = { costoTotal: 2500, anticipo: 1000, estado: 'TERMINADO' };
    expect(() => cambiarEstado(orden, 'ENTREGADO')).toThrow();
  });
  
  test('RN-ORD-001: Debe generar folio con formato correcto', () => {
    const folio = generarFolio('ORD', new Date('2026-01-15'));
    expect(folio).toMatch(/^ORD-202601\d{3}$/);
  });
  
  test('RN-ORD-003: Debe asignar garantía según tipo de refacción', () => {
    expect(calcularGarantia('ORIGINAL')).toBe(30);
    expect(calcularGarantia('GENERICA')).toBe(15);
  });
});

// tests/unit/services/clienteService.test.js
describe('ClienteService - Badges y Clasificación', () => {
  test('RN-CLI-002: Debe calcular badge VIP correctamente', () => {
    const cliente = { ordenes: 12, ticketPromedio: 400 };
    expect(calcularBadge(cliente)).toBe('VIP');
  });
  
  test('RN-CLI-002: Debe calcular badge Frecuente', () => {
    const cliente = { ordenes: 7, ticketPromedio: 300 };
    expect(calcularBadge(cliente)).toBe('FRECUENTE');
  });
  
  test('RN-CLI-001: Debe normalizar teléfono correctamente', () => {
    expect(normalizarTelefono('555-123-4567')).toBe('5551234567');
    expect(normalizarTelefono('(555) 123 4567')).toBe('5551234567');
  });
});

// tests/unit/services/inventarioService.test.js
describe('InventarioService - Stock', () => {
  test('RN-INV-002: No debe permitir usar refacción sin stock', () => {
    const refaccion = { stockActual: 2 };
    expect(() => validarStock(refaccion, 3)).toThrow();
  });
  
  test('RN-INV-001: Debe generar alerta si stock < mínimo', () => {
    const refaccion = { stockActual: 3, stockMinimo: 5 };
    expect(requiereAlerta(refaccion)).toBe(true);
  });
});
```

**Utilidades:**
```javascript
// tests/unit/utils/formatters.test.js
describe('Formatters', () => {
  test('Debe formatear moneda correctamente', () => {
    expect(formatCurrency(2500)).toBe('$2,500.00');
  });
  
  test('Debe formatear fecha correctamente', () => {
    const fecha = new Date('2026-01-15');
    expect(formatDate(fecha)).toBe('15/01/2026');
  });
  
  test('Debe calcular días transcurridos', () => {
    const fecha = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    expect(calculateDaysAgo(fecha)).toBe(5);
  });
});

// tests/unit/utils/validators.test.js
describe('Validators (Zod)', () => {
  test('Debe validar esquema de orden correctamente', () => {
    const ordenValida = {
      clienteId: 'uuid-valid',
      equipoId: 'uuid-valid',
      problemaReportado: 'Pantalla rota al caer',
      costoTotal: 2500,
      anticipo: 1000,
      fechaEstimadaEntrega: '2026-01-20T10:00:00Z'
    };
    expect(() => ordenSchema.parse(ordenValida)).not.toThrow();
  });
  
  test('Debe rechazar orden con problema muy corto', () => {
    const ordenInvalida = { problemaReportado: 'Rota' };
    expect(() => ordenSchema.parse(ordenInvalida)).toThrow();
  });
});
```

#### **Frontend - Tests Unitarios Prioritarios:**

**Componentes:**
```javascript
// tests/unit/components/ClienteBadge.test.jsx
import { render, screen } from '@testing-library/react';
import ClienteBadge from '@/components/clientes/ClienteBadge';

describe('ClienteBadge', () => {
  test('Debe mostrar badge VIP para >10 órdenes', () => {
    render(<ClienteBadge ordenes={12} ticketPromedio={400} />);
    expect(screen.getByText(/VIP/i)).toBeInTheDocument();
    expect(screen.getByText('🌟')).toBeInTheDocument();
  });
  
  test('Debe mostrar badge Frecuente para 5-10 órdenes', () => {
    render(<ClienteBadge ordenes={7} ticketPromedio={300} />);
    expect(screen.getByText(/Frecuente/i)).toBeInTheDocument();
  });
  
  test('Debe mostrar badge Nuevo para <5 órdenes', () => {
    render(<ClienteBadge ordenes={2} ticketPromedio={200} />);
    expect(screen.getByText(/Nuevo/i)).toBeInTheDocument();
  });
});

// tests/unit/components/OrdenTimeline.test.jsx
describe('OrdenTimeline', () => {
  test('Debe renderizar todos los estados correctamente', () => {
    const historial = [
      { estado: 'RECIBIDO', fecha: '2026-01-10' },
      { estado: 'EN_REPARACION', fecha: '2026-01-12' },
      { estado: 'TERMINADO', fecha: '2026-01-14' }
    ];
    render(<OrdenTimeline historial={historial} />);
    expect(screen.getByText('RECIBIDO')).toBeInTheDocument();
    expect(screen.getByText('EN_REPARACION')).toBeInTheDocument();
    expect(screen.getByText('TERMINADO')).toBeInTheDocument();
  });
});
```

**Hooks:**
```javascript
// tests/unit/hooks/useAuth.test.js
import { renderHook, act } from '@testing-library/react';
import useAuth from '@/hooks/useAuth';

describe('useAuth', () => {
  test('Debe hacer login correctamente', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('admin@salvacell.com', 'password123');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });
  
  test('Debe hacer logout correctamente', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.logout();
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

### 2. TESTS DE INTEGRACIÓN

#### **Herramientas:** Supertest (backend)

#### **Flujos críticos a probar:**

**Flujo 1: Orden completa (end-to-end)**
```javascript
// tests/integration/orden-flow.test.js
describe('Flujo completo de orden', () => {
  let clienteId, equipoId, ordenId, token;
  
  beforeAll(async () => {
    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'test123' });
    token = loginRes.body.token;
  });
  
  test('1. Crear cliente', async () => {
    const res = await request(app)
      .post('/api/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '5551234567'
      });
    expect(res.status).toBe(201);
    clienteId = res.body.data.id;
  });
  
  test('2. Crear orden', async () => {
    const res = await request(app)
      .post('/api/ordenes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clienteId,
        equipoId: 'new',
        equipo: { marca: 'iPhone', modelo: '12 Pro', imei: '123456789' },
        problemaReportado: 'Pantalla rota después de caída',
        costoTotal: 2500,
        anticipo: 1000,
        fechaEstimadaEntrega: '2026-01-20T10:00:00Z'
      });
    expect(res.status).toBe(201);
    expect(res.body.data.folio).toMatch(/^ORD-\d{6}\d{3}$/);
    ordenId = res.body.data.id;
  });
  
  test('3. Cambiar estado a EN_REPARACION', async () => {
    const res = await request(app)
      .patch(`/api/ordenes/${ordenId}/estado`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nuevoEstado: 'EN_REPARACION', notas: 'Iniciando reparación' });
    expect(res.status).toBe(200);
    expect(res.body.data.estado).toBe('EN_REPARACION');
  });
  
  test('4. Agregar refacción', async () => {
    const res = await request(app)
      .post(`/api/ordenes/${ordenId}/refacciones`)
      .set('Authorization', `Bearer ${token}`)
      .send({ refaccionId: 'pantalla-iphone12', cantidad: 1 });
    expect(res.status).toBe(200);
  });
  
  test('5. Cambiar estado a TERMINADO', async () => {
    const res = await request(app)
      .patch(`/api/ordenes/${ordenId}/estado`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nuevoEstado: 'TERMINADO' });
    expect(res.status).toBe(200);
    // Verificar que se envió notificación
    const notificaciones = await prisma.notificacionLog.findMany({
      where: { ordenId }
    });
    expect(notificaciones.length).toBeGreaterThan(0);
  });
  
  test('6. Registrar pago', async () => {
    const res = await request(app)
      .post('/api/pagos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ordenId,
        monto: 1500,
        metodoPago: 'EFECTIVO',
        concepto: 'Pago de saldo'
      });
    expect(res.status).toBe(201);
  });
  
  test('7. Cambiar estado a ENTREGADO', async () => {
    const res = await request(app)
      .patch(`/api/ordenes/${ordenId}/estado`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nuevoEstado: 'ENTREGADO' });
    expect(res.status).toBe(200);
    
    // Verificar que adeudo es 0
    const orden = await prisma.orden.findUnique({ where: { id: ordenId } });
    expect(orden.adeudo).toBe(0);
  });
  
  test('8. Verificar historial de estados', async () => {
    const res = await request(app)
      .get(`/api/ordenes/${ordenId}/historial-estados`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(4);
  });
});
```

**Flujo 2: Presupuesto → Orden**
```javascript
// tests/integration/presupuesto-flow.test.js
describe('Flujo presupuesto a orden', () => {
  let token, presupuestoId, ordenId;
  
  test('1. Crear presupuesto', async () => {
    const res = await request(app)
      .post('/api/presupuestos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clienteId: 'cliente-test-id',
        descripcionProblema: 'Pantalla rota',
        montoEstimado: 2500,
        vigenciaDias: 15
      });
    expect(res.status).toBe(201);
    expect(res.body.data.folio).toMatch(/^PRE-\d{6}\d{3}$/);
    presupuestoId = res.body.data.id;
  });
  
  test('2. Convertir presupuesto a orden', async () => {
    const res = await request(app)
      .post(`/api/presupuestos/${presupuestoId}/convertir-orden`)
      .set('Authorization', `Bearer ${token}`)
      .send({ anticipo: 1000 });
    expect(res.status).toBe(201);
    ordenId = res.body.data.id;
  });
  
  test('3. Verificar presupuesto marcado como ACEPTADO', async () => {
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: presupuestoId }
    });
    expect(presupuesto.estado).toBe('ACEPTADO');
  });
  
  test('4. Verificar orden vinculada al presupuesto', async () => {
    const orden = await prisma.orden.findUnique({
      where: { id: ordenId }
    });
    expect(orden.presupuestoId).toBe(presupuestoId);
  });
});
```

**Flujo 3: Fusión de clientes**
```javascript
// tests/integration/cliente-fusion.test.js
describe('Fusión de clientes duplicados', () => {
  let clienteA, clienteB, token;
  
  beforeAll(async () => {
    // Crear cliente A con 3 órdenes
    clienteA = await prisma.cliente.create({
      data: {
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '5551234567',
        ordenes: {
          create: [
            { /* orden 1 */ },
            { /* orden 2 */ },
            { /* orden 3 */ }
          ]
        }
      }
    });
    
    // Crear cliente B (duplicado) con 2 órdenes
    clienteB = await prisma.cliente.create({
      data: {
        nombre: 'Juan',
        apellido: 'Perez',
        telefono: '555-123-4567',
        ordenes: {
          create: [
            { /* orden 4 */ },
            { /* orden 5 */ }
          ]
        }
      }
    });
  });
  
  test('1. Fusionar clientes', async () => {
    const res = await request(app)
      .post('/api/clientes/fusionar')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clienteIdPrincipal: clienteA.id,
        clienteIdDuplicado: clienteB.id
      });
    expect(res.status).toBe(200);
  });
  
  test('2. Verificar cliente B eliminado', async () => {
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteB.id }
    });
    expect(cliente).toBeNull();
  });
  
  test('3. Verificar cliente A tiene 5 órdenes', async () => {
    const ordenes = await prisma.orden.count({
      where: { clienteId: clienteA.id }
    });
    expect(ordenes).toBe(5);
  });
});
```

### 3. TESTS E2E (Playwright)

#### **Configuración de Playwright:**
```javascript
// playwright.config.js
module.exports = {
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } }
  ]
};
```

#### **Escenarios E2E:**

**E2E-001: Login y Dashboard**
```javascript
// tests/e2e/login-dashboard.spec.js
import { test, expect } from '@playwright/test';

test.describe('Login y Dashboard', () => {
  test('Debe hacer login exitosamente y ver dashboard', async ({ page }) => {
    // 1. Navegar a login
    await page.goto('/login');
    
    // 2. Llenar credenciales
    await page.fill('input[name="email"]', 'admin@salvacell.com');
    await page.fill('input[name="password"]', 'Admin123!');
    
    // 3. Hacer click en login
    await page.click('button[type="submit"]');
    
    // 4. Verificar redirección a dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // 5. Verificar KPIs visibles
    await expect(page.locator('text=Órdenes Activas')).toBeVisible();
    await expect(page.locator('text=Ingresos Hoy')).toBeVisible();
    
    // 6. Verificar gráfico renderizado
    await expect(page.locator('canvas')).toBeVisible();
  });
  
  test('Debe rechazar credenciales inválidas', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'wrong@email.com');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=/credenciales incorrectas/i')).toBeVisible();
  });
});
```

**E2E-002: Crear orden nueva**
```javascript
// tests/e2e/crear-orden.spec.js
test.describe('Crear orden', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'recepcionista@salvacell.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
  
  test('Debe crear orden completa exitosamente', async ({ page }) => {
    // 1. Click en "Nueva Orden"
    await page.click('text=Nueva Orden');
    
    // 2. Buscar cliente por teléfono
    await page.fill('input[placeholder*="teléfono"]', '5551234567');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    
    // 3. Seleccionar cliente de la lista
    await page.click('text=Juan Pérez');
    
    // 4. Seleccionar equipo existente o crear nuevo
    await page.click('text=Agregar nuevo equipo');
    await page.fill('input[name="marca"]', 'iPhone');
    await page.fill('input[name="modelo"]', '12 Pro');
    await page.fill('input[name="imei"]', '123456789012345');
    
    // 5. Llenar problema reportado
    await page.fill('textarea[name="problemaReportado"]', 'Pantalla rota después de caída');
    
    // 6. Llenar costos
    await page.fill('input[name="costoTotal"]', '2500');
    await page.fill('input[name="anticipo"]', '1000');
    
    // 7. Seleccionar fecha estimada
    await page.fill('input[name="fechaEstimadaEntrega"]', '2026-01-25');
    
    // 8. Guardar
    await page.click('button:has-text("Guardar Orden")');
    
    // 9. Verificar modal de éxito
    await expect(page.locator('text=/orden creada exitosamente/i')).toBeVisible();
    
    // 10. Verificar que aparece en lista
    await page.goto('/ordenes');
    await expect(page.locator('text=ORD-')).toBeVisible();
    
    // 11. Verificar QR generado
    const ordenLink = page.locator('text=ORD-').first();
    await ordenLink.click();
    await expect(page.locator('img[alt*="QR"]')).toBeVisible();
  });
});
```

**E2E-003: Ver perfil de cliente recurrente**
```javascript
// tests/e2e/cliente-perfil.spec.js
test.describe('Perfil de cliente', () => {
  test('Debe mostrar perfil completo con badge VIP', async ({ page }) => {
    await page.goto('/clientes');
    
    // 1. Buscar "Juan Pérez"
    await page.fill('input[placeholder*="buscar"]', 'Juan Pérez');
    await page.keyboard.press('Enter');
    
    // 2. Click en perfil
    await page.click('text=Juan Pérez');
    
    // 3. Verificar badge VIP visible
    await expect(page.locator('text=VIP')).toBeVisible();
    await expect(page.locator('text=🌟')).toBeVisible();
    
    // 4. Verificar timeline con órdenes
    await expect(page.locator('text=/total.*órdenes/i')).toBeVisible();
    const ordenes = page.locator('[data-testid="orden-timeline-item"]');
    await expect(ordenes).toHaveCount(10, { timeout: 5000 });
    
    // 5. Verificar estadísticas
    await expect(page.locator('text=/ticket promedio/i')).toBeVisible();
    await expect(page.locator('text=/total gastado/i')).toBeVisible();
    
    // 6. Verificar equipos asociados
    await expect(page.locator('text=/equipos asociados/i')).toBeVisible();
  });
});
```

**E2E-004: Generar reporte de ventas**
```javascript
// tests/e2e/reporte-ventas.spec.js
test.describe('Reportes', () => {
  test('Debe generar reporte de ventas y exportar', async ({ page }) => {
    await page.goto('/reportes/ventas');
    
    // 1. Seleccionar rango "Último mes"
    await page.click('select[name="periodo"]');
    await page.click('option:has-text("Último mes")');
    
    // 2. Click en "Generar"
    await page.click('button:has-text("Generar Reporte")');
    await page.waitForTimeout(2000);
    
    // 3. Verificar tabla con datos
    await expect(page.locator('table')).toBeVisible();
    
    // 4. Verificar gráficos renderizados
    await expect(page.locator('canvas').first()).toBeVisible();
    
    // 5. Exportar a PDF
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("Exportar PDF")')
    ]);
    expect(download.suggestedFilename()).toContain('.pdf');
    
    // 6. Exportar a Excel
    const [downloadExcel] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("Exportar Excel")')
    ]);
    expect(downloadExcel.suggestedFilename()).toContain('.xlsx');
  });
});
```

### 4. TESTS DE PERFORMANCE

#### **Frontend (Lighthouse):**
```javascript
// tests/performance/lighthouse.test.js
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

describe('Lighthouse Performance', () => {
  test('Dashboard debe tener score > 90', async () => {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = { port: chrome.port };
    
    const runnerResult = await lighthouse('http://localhost:5173/dashboard', options);
    const { performance, accessibility, bestPractices, seo, pwa } = runnerResult.lhr.categories;
    
    expect(performance.score * 100).toBeGreaterThan(90);
    expect(accessibility.score * 100).toBeGreaterThan(90);
    expect(bestPractices.score * 100).toBeGreaterThan(90);
    
    await chrome.kill();
  });
});
```

#### **Backend (Artillery):**
```yaml
# artillery-config.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
  processor: "./artillery-processor.js"

scenarios:
  - name: "Flujo típico de usuario"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@salvacell.com"
            password: "test123"
          capture:
            - json: "$.token"
              as: "authToken"
      - get:
          url: "/api/ordenes"
          headers:
            Authorization: "Bearer {{ authToken }}"
      - get:
          url: "/api/clientes"
          headers:
            Authorization: "Bearer {{ authToken }}"
      - get:
          url: "/api/reportes/dashboard"
          headers:
            Authorization: "Bearer {{ authToken }}"
```

### 5. TESTS DE SEGURIDAD

```javascript
// tests/security/security.test.js
describe('Seguridad', () => {
  test('Debe rechazar acceso sin token', async () => {
    const res = await request(app).get('/api/ordenes');
    expect(res.status).toBe(401);
  });
  
  test('Debe rechazar token expirado', async () => {
    const expiredToken = jwt.sign({ id: 'test' }, process.env.JWT_SECRET, { expiresIn: '-1h' });
    const res = await request(app)
      .get('/api/ordenes')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
  });
  
  test('TECNICO no debe acceder a /api/usuarios', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${tecnicoToken}`);
    expect(res.status).toBe(403);
  });
  
  test('Debe sanitizar SQL injection', async () => {
    const res = await request(app)
      .get('/api/clientes')
      .query({ search: "'; DROP TABLE Cliente; --" })
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).not.toBe(500);
  });
  
  test('Debe sanitizar XSS en notas', async () => {
    const res = await request(app)
      .post('/api/ordenes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        problemaReportado: '<script>alert("XSS")</script>',
        // ... otros campos
      });
    expect(res.body.data.problemaReportado).not.toContain('<script>');
  });
});
```

### 6. MATRIZ DE COBERTURA

Crear archivo `docs/TEST_COVERAGE_MATRIX.md`:

| Requerimiento | Tipo Test | Archivo | Estado | Prioridad |
|---------------|-----------|---------|--------|-----------|
| RF-AUTH-001 JWT | Unit + Integration | auth.test.js | ✅ | Alta |
| RF-CLI-002 Badges | Unit | clienteService.test.js | ✅ | Alta |
| RF-ORD-002 Adeudo | Unit | ordenService.test.js | ✅ | Alta |
| RF-ORD-005 No entregar con adeudo | Integration | orden-flow.test.js | ✅ | Alta |
| US-CLI-001 Lista clientes | E2E | clientes.spec.js | ✅ | Media |
| US-CLI-002 Perfil cliente | E2E | cliente-perfil.spec.js | ✅ | Alta |
| US-ORD-002 Crear orden | E2E | crear-orden.spec.js | ✅ | Alta |
| US-REP-004 Clientes recurrentes | Integration | reportes.test.js | ⚠️ | Media |

## ENTREGABLES

Al finalizar tu trabajo, debes crear en la carpeta `docs/` el archivo:

**`docs/TESTING_IMPLEMENTATION_REPORT.md`** que incluya:

## 1. RESUMEN EJECUTIVO
- Cobertura de código: [X%]
- Tests unitarios: [X implementados, Y pasando]
- Tests integración: [X implementados, Y pasando]
- Tests E2E: [X implementados, Y pasando]
- Bugs críticos encontrados: [X]
- Bugs resueltos: [X]

## 2. COBERTURA DE TESTS UNITARIOS

### Backend
| Módulo | Cobertura | Líneas | Funciones | Branches |
|--------|-----------|--------|-----------|----------|
| auth | 85% | 120/140 | 12/15 | 8/10 |
| clientes | 72% | 250/350 | 18/22 | 15/20 |
| ordenes | 68% | 400/590 | 25/35 | 20/30 |
| inventario | 75% | 180/240 | 14/18 | 12/15 |
| reportes | 65% | 220/340 | 16/24 | 14/22 |
| **Total** | **73%** | **1170/1660** | **85/114** | **69/97** |

### Frontend
| Módulo | Cobertura |
|--------|-----------|
| Components | 65% |
| Hooks | 80% |
| Utils | 90% |
| **Total** | **71%** |

## 3. TESTS DE INTEGRACIÓN

### Flujos probados:
- [x] Flujo completo de orden (8 pasos) ✅
- [x] Presupuesto → Orden ✅
- [x] Fusión de clientes ✅
- [x] Sincronización offline ⚠️ (1 caso falla)
- [x] Notificaciones automáticas ✅

### Resultados:
- Total tests: 45
- Pasando: 43
- Fallando: 2
- Tiempo ejecución: 12.5s

## 4. TESTS E2E (Playwright)

### Escenarios:
| Escenario | Chromium | Firefox | Webkit | Tiempo |
|-----------|----------|---------|--------|--------|
| E2E-001 Login | ✅ | ✅ | ✅ | 3.2s |
| E2E-002 Crear orden | ✅ | ✅ | ⚠️ | 8.5s |
| E2E-003 Perfil cliente | ✅ | ✅ | ✅ | 6.1s |
| E2E-004 Reporte ventas | ✅ | ✅ | ✅ | 12.3s |

## 5. PERFORMANCE

### Lighthouse (Desktop)
- Performance: 92
- Accessibility: 95
- Best Practices: 100
- SEO: 88
- PWA: 85

### Load Testing (Artillery)
- Requests totales: 12,000
- Éxito: 11,985 (99.8%)
- Fallos: 15 (0.2%)
- Latencia p50: 180ms
- Latencia p95: 420ms ✅
- Latencia p99: 850ms ✅

## 6. SEGURIDAD

### Tests ejecutados:
- [x] Autenticación JWT
- [x] RBAC (permisos por rol)
- [x] SQL Injection prevention
- [x] XSS prevention
- [x] Rate limiting
- [ ] CSRF protection (pendiente)

### Vulnerabilidades encontradas:
- 🔴 **CRÍTICO:** [Ninguna]
- 🟡 **MEDIO:** Headers de seguridad faltantes (helmet.js pendiente)

## 7. BUGS ENCONTRADOS

### Críticos (bloqueantes):
1. ~~#BUG-001: Fusión de clientes elimina órdenes~~ **RESUELTO**

### Altos:
1. #BUG-002: Sincronización offline falla con >10 cambios **PENDIENTE**
2. #BUG-003: Reporte CLV calcula mal el promedio **PENDIENTE**

### Medios:
1. #BUG-004: Timeline de cliente no pagina correctamente
2. #BUG-005: Gráfico donut no responsive en móvil

## 8. MATRIZ DE COBERTURA DE REQUERIMIENTOS

(Ver archivo docs/TEST_COVERAGE_MATRIX.md)

- Requerimientos críticos: 18/20 (90%)
- Requerimientos totales: 45/60 (75%)

## 9. PRÓXIMOS PASOS

- [ ] Resolver BUG-002 antes de producción
- [ ] Aumentar cobertura de módulo ordenes a >75%
- [ ] Implementar CSRF protection
- [ ] Tests con 100+ usuarios concurrentes
- [ ] Pipeline CI/CD con tests automáticos

## CRITERIOS DE ÉXITO
✅ Cobertura de código >70%
✅ Todos los flujos críticos probados
✅ 10+ tests E2E funcionales
✅ Lighthouse score >90
✅ Load testing con 50 usuarios exitoso
✅ 0 bugs críticos sin resolver
✅ Documentación completa de casos de prueba

## NOTAS IMPORTANTES
- Este agente DEPENDE de Backend-API, Frontend-UI y Reportes-Analytics
- Coordina con todos los agentes para fixes de bugs
- Documenta TODOS los bugs encontrados
- Prioriza tests de reglas de negocio críticas
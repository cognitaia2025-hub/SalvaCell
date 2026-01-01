# SalvaCell PWA - Progressive Web App

Sistema de gestión de reparaciones de celulares con capacidad offline completa.

## 🚀 Características PWA Implementadas

### ✅ Funcionalidad Offline
- Creación de órdenes sin conexión
- Consulta de clientes cacheados
- Visualización de inventario offline
- Sincronización automática al reconectar

### ✅ Service Worker
- Cache inteligente con estrategias optimizadas
- Páginas: Cache First
- API: Network First con fallback
- Assets: Stale While Revalidate
- Background Sync habilitado

### ✅ IndexedDB
- Base de datos local completa con Dexie.js
- Tablas: clientes, ordenes, equipos, refacciones, accesorios, syncQueue
- Sincronización FIFO con manejo de conflictos
- Limpieza automática de datos antiguos

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_PUBLIC_URL=http://localhost:3000
```

### Generar Iconos PWA

Los iconos deben estar en `/public/icons/`:

- `icon-192x192.png`
- `icon-512x512.png`

Usa herramientas como [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator):

```bash
npx pwa-asset-generator logo.svg ./public/icons \
  --icon-only \
  --type png \
  --padding "10%" \
  --background "#2563eb"
```

## 📚 Documentación

Revisa la documentación completa en:

- **[PWA_IMPLEMENTATION_REPORT.md](./docs/PWA_IMPLEMENTATION_REPORT.md)** - Reporte completo de implementación
- **[SRS.md](./docs/SRS.md)** - Especificación de requerimientos de software
- **[FSD.md](./docs/FSD.md)** - Documento de especificación funcional
- **[PRD.md](./docs/PRD.md)** - Documento de requerimientos del producto
- **[BRD.md](./docs/BRD.md)** - Documento de requerimientos de negocio

## 🏗️ Estructura del Proyecto

```
/public
  /icons              # Iconos PWA
  manifest.json       # Web App Manifest

/src
  /sw                 # Service Worker
    service-worker.js
    serviceWorkerRegistration.js
  
  /db                 # IndexedDB
    database.js       # Configuración Dexie
    syncManager.js    # Gestor de sincronización
  
  /utils              # Utilidades
    network.js        # Detección de conexión
    offlineOperations.js  # Operaciones offline

/docs                 # Documentación
  PWA_IMPLEMENTATION_REPORT.md
  SRS.md
  FSD.md
  PRD.md
  BRD.md
```

## 🔌 API de Sincronización

### Agregar operación a cola

```javascript
import { addToSyncQueue } from './db/syncManager';

await addToSyncQueue('CREATE', 'orden', ordenId, ordenData);
```

### Sincronizar manualmente

```javascript
import { syncPendingChanges } from './db/syncManager';

await syncPendingChanges();
```

### Suscribirse a estado de sincronización

```javascript
import { subscribeSyncState } from './db/syncManager';

const unsubscribe = subscribeSyncState((state) => {
  console.log('Pending:', state.pendingCount);
  console.log('Syncing:', state.isSyncing);
});
```

## 🌐 Operaciones Offline

### Crear orden offline

```javascript
import { createOrdenOffline } from './utils/offlineOperations';

const result = await createOrdenOffline({
  clienteId: 'uuid',
  equipoId: 'uuid',
  problemaReportado: 'Pantalla rota',
  // ... más datos
});
```

### Consultar datos cacheados

```javascript
import { 
  getClientesOffline, 
  getOrdenesOffline,
  getRefaccionesOffline 
} from './utils/offlineOperations';

const clientes = await getClientesOffline('Juan');
const ordenes = await getOrdenesOffline({ estado: 'EN_PROCESO' });
const refacciones = await getRefaccionesOffline('pantalla');
```

## 🧪 Testing

### Simular modo offline

**Opción 1: DevTools**
1. Abrir Chrome DevTools (F12)
2. Network tab → Throttling → Offline

**Opción 2: Modo avión**
- Activar modo avión del dispositivo

### Ver IndexedDB

1. DevTools → Application
2. Storage → IndexedDB → SalvaCellDB

### Ver Service Worker

1. DevTools → Application
2. Service Workers
3. Cache Storage

## 📊 Métricas PWA

La implementación actual cumple con:

- ✅ Installable (manifest + SW + HTTPS)
- ✅ Funciona offline (páginas + datos cacheados)
- ✅ Service Worker activo
- 🎯 Lighthouse PWA Score estimado: 85-95/100

## 🔐 Seguridad

- Token JWT en todas las peticiones API
- HTTPS obligatorio en producción
- Datos sensibles NO se cachean
- Validación en servidor de datos sincronizados

## 🐛 Debugging

### Ver logs de sincronización

```javascript
import db from './db/database';

// Ver cola de sincronización
const queue = await db.syncQueue.toArray();
console.log(queue);

// Ver cambios pendientes
const pending = await db.syncQueue
  .where('status')
  .equals('pending')
  .toArray();
console.log(pending);
```

### Limpiar base de datos

```javascript
import { clearAllData } from './db/database';

await clearAllData();
```

## 📈 Próximos Pasos

Ver sección "10. PRÓXIMOS PASOS" en [PWA_IMPLEMENTATION_REPORT.md](./docs/PWA_IMPLEMENTATION_REPORT.md)

## 🤝 Contribución

Este proyecto es parte del sistema SalvaCell. Para contribuir:

1. Revisar documentación completa
2. Seguir convenciones de código existentes
3. Probar funcionalidad offline antes de commit
4. Actualizar documentación si es necesario

## 📄 Licencia

Copyright © 2026 SalvaCell. Todos los derechos reservados.

## 👥 Equipo

- **Agente PWA Offline** - Implementación PWA
- **Equipo SalvaCell** - Producto y negocio

## 📞 Soporte

Para dudas o problemas:
- Ver documentación en `/docs`
- Revisar issues en GitHub
- Contactar al equipo de desarrollo

---

**Estado del Proyecto:** ✅ Infraestructura PWA Completa  
**Versión:** 1.0.0  
**Última actualización:** 2026-01-01

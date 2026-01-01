# Guía de Integración PWA - Para el Equipo Frontend

## 📋 Resumen

La infraestructura PWA está **100% completa** y lista para integrar con la aplicación React frontend.

## ✅ Lo que YA está implementado

### 1. Service Worker (Workbox)
- ✅ Caching automático de páginas, API, imágenes y assets
- ✅ Estrategias optimizadas por tipo de recurso
- ✅ Background Sync habilitado
- ✅ Actualización automática de nueva versión

### 2. IndexedDB (Dexie.js)
- ✅ Base de datos completa con 8 tablas
- ✅ Hooks automáticos para timestamps
- ✅ Funciones de limpieza de datos antiguos
- ✅ Exportación de datos

### 3. Sistema de Sincronización
- ✅ Cola FIFO con manejo de conflictos
- ✅ Reintentos automáticos con exponential backoff
- ✅ Suscripción a estado en tiempo real
- ✅ Limpieza automática de cambios sincronizados

### 4. Operaciones Offline
- ✅ Crear órdenes offline
- ✅ Actualizar órdenes offline
- ✅ Consultar clientes, inventario y órdenes desde cache
- ✅ Cache automático de respuestas API

### 5. Utilidades de Red
- ✅ Detección de estado de conexión
- ✅ Eventos online/offline
- ✅ Verificación real de conexión al servidor
- ✅ Esperar conexión (con timeout)

## 🚀 Pasos de Integración

### Paso 1: Instalar Dependencias

```bash
npm install
```

Esto instalará:
- `dexie` (IndexedDB wrapper)
- `workbox-*` (Service Worker utilities)
- `vite-plugin-pwa` (Build plugin)

### Paso 2: Configurar Vite

Crear/actualizar `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src/sw',
      filename: 'service-worker.js',
      manifest: false, // Usamos manifest.json manual
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}']
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ]
});
```

### Paso 3: Registrar Service Worker

En `src/main.jsx` o `src/index.js`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { register } from './sw/serviceWorkerRegistration';

// Registrar Service Worker
register();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Paso 4: Inicializar PWA en App.jsx

```javascript
import { useEffect } from 'react';
import { initDB } from './db/database';
import { initAutoSync } from './db/syncManager';
import { initNetworkListeners } from './utils/network';

function App() {
  useEffect(() => {
    // Inicializar IndexedDB
    initDB().then(() => {
      console.log('✓ IndexedDB inicializada');
    });
    
    // Inicializar listeners de red
    const cleanupNetwork = initNetworkListeners();
    
    // Inicializar sincronización automática
    const cleanupSync = initAutoSync();
    
    // Cleanup al desmontar
    return () => {
      cleanupNetwork();
      cleanupSync();
    };
  }, []);
  
  return (
    <div>
      {/* Tu app aquí */}
    </div>
  );
}

export default App;
```

### Paso 5: Crear Indicador de Conexión

Componente `ConnectionIndicator.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { isOnline, addOnlineListener, addOfflineListener } from '../utils/network';
import { subscribeSyncState } from '../db/syncManager';

export default function ConnectionIndicator() {
  const [online, setOnline] = useState(isOnline());
  const [syncState, setSyncState] = useState({ pendingCount: 0, isSyncing: false });
  
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    
    addOnlineListener(handleOnline);
    addOfflineListener(handleOffline);
    
    const unsubscribe = subscribeSyncState(setSyncState);
    
    return () => {
      removeOnlineListener(handleOnline);
      removeOfflineListener(handleOffline);
      unsubscribe();
    };
  }, []);
  
  return (
    <div className="flex items-center gap-2">
      {/* Icono de conexión */}
      {online ? (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
        </svg>
      )}
      
      {/* Badge de cambios pendientes */}
      {syncState.pendingCount > 0 && (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          syncState.pendingCount > 20 ? 'bg-red-100 text-red-800' :
          syncState.pendingCount > 5 ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {syncState.pendingCount}
        </span>
      )}
      
      {/* Spinner si está sincronizando */}
      {syncState.isSyncing && (
        <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
    </div>
  );
}
```

### Paso 6: Agregar Banner Offline

Componente `OfflineBanner.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { isOnline, addOnlineListener, addOfflineListener } from '../utils/network';
import { subscribeSyncState } from '../db/syncManager';

export default function OfflineBanner() {
  const [online, setOnline] = useState(isOnline());
  const [syncState, setSyncState] = useState({ pendingCount: 0 });
  
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    
    addOnlineListener(handleOnline);
    addOfflineListener(handleOffline);
    
    const unsubscribe = subscribeSyncState(setSyncState);
    
    return () => {
      removeOnlineListener(handleOnline);
      removeOfflineListener(handleOffline);
      unsubscribe();
    };
  }, []);
  
  if (online) return null;
  
  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-yellow-800">
            Sin conexión a internet. Los cambios se sincronizarán automáticamente al reconectar.
          </span>
        </div>
        {syncState.pendingCount > 0 && (
          <span className="text-sm font-medium text-yellow-700">
            Cambios pendientes: {syncState.pendingCount}
          </span>
        )}
      </div>
    </div>
  );
}
```

### Paso 7: Usar Operaciones Offline

Ejemplo en formulario de nueva orden:

```javascript
import { useState } from 'react';
import { createOrdenOffline } from '../utils/offlineOperations';
import { isOnline } from '../utils/network';

export default function NuevaOrden() {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (formData) => {
    setLoading(true);
    
    try {
      if (isOnline()) {
        // Online: enviar directamente al servidor
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ordenes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Error al crear orden');
        
        const orden = await response.json();
        alert('✅ Orden creada exitosamente');
      } else {
        // Offline: guardar localmente
        const result = await createOrdenOffline(formData);
        alert('💾 Orden guardada. Se sincronizará al reconectar internet.');
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); }}>
      {/* Campos del formulario */}
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Crear Orden'}
      </button>
    </form>
  );
}
```

### Paso 8: Generar Iconos PWA

**Opción 1: Herramienta online**
- Ir a https://realfavicongenerator.net/
- Subir logo de SalvaCell
- Descargar paquete de iconos
- Copiar a `/public/icons/`

**Opción 2: CLI**
```bash
npx pwa-asset-generator logo.svg ./public/icons \
  --icon-only \
  --type png \
  --padding "10%" \
  --background "#2563eb"
```

### Paso 9: Configurar HTML

Agregar en `index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- PWA Meta Tags -->
  <meta name="theme-color" content="#2563eb" />
  <meta name="description" content="Sistema de gestión de reparaciones de celulares" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="SalvaCell" />
  
  <!-- Manifest -->
  <link rel="manifest" href="/manifest.json" />
  
  <!-- Icons -->
  <link rel="icon" type="image/png" href="/icons/icon-192x192.png" />
  <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
  
  <title>SalvaCell - Gestión de Reparaciones</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### Paso 10: Variables de Entorno

Crear `.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_PUBLIC_URL=http://localhost:3000
```

## 🧪 Testing

### Probar Offline

1. **Abrir DevTools (F12)**
2. **Network tab → Throttling → Offline**
3. **Navegar por la app**
4. **Crear una orden offline**
5. **Ver que aparece en lista con indicador**
6. **Volver a Online**
7. **Ver que se sincroniza automáticamente**

### Ver IndexedDB

1. **DevTools → Application**
2. **Storage → IndexedDB → SalvaCellDB**
3. **Ver tablas: clientes, ordenes, syncQueue, etc.**

### Ver Service Worker

1. **DevTools → Application**
2. **Service Workers**
3. **Ver estado: Activated and running**
4. **Cache Storage → Ver caches creados**

## 📚 Documentación Completa

Lee el reporte completo en:
- **[docs/PWA_IMPLEMENTATION_REPORT.md](../PWA_IMPLEMENTATION_REPORT.md)**

Ahí encontrarás:
- Estrategias de caching detalladas
- Estructura completa de IndexedDB
- Tabla de operaciones offline disponibles
- Manejo de conflictos
- Limitaciones conocidas
- Próximos pasos
- Y mucho más...

## ❓ Preguntas Frecuentes

### ¿Cómo sé si el Service Worker está activo?

Abre DevTools → Application → Service Workers. Debe decir "Activated and running".

### ¿Por qué no puedo crear clientes offline?

Por diseño. La creación de clientes requiere validación de duplicados en el servidor. Solo órdenes se pueden crear offline.

### ¿Qué pasa si se llena el almacenamiento?

El sistema tiene limpieza automática de datos >30 días. También hay funciones para limpiar manualmente.

### ¿Funciona en iOS?

Sí, pero con limitaciones. Background Sync no está disponible en Safari, por lo que la sincronización requiere que la app esté abierta.

### ¿Cómo actualizo el Service Worker?

Automático. Cuando hay nueva versión, el SW se actualiza y pregunta al usuario si quiere recargar.

## 🆘 Soporte

Si tienes dudas:
1. Lee la documentación completa en `docs/`
2. Revisa los archivos de ejemplo en esta guía
3. Consulta el código en `/src/db/` y `/src/utils/`
4. Contacta al equipo de desarrollo

## ✅ Checklist de Integración

- [ ] Instalar dependencias (`npm install`)
- [ ] Configurar vite.config.js
- [ ] Registrar Service Worker en main.jsx
- [ ] Inicializar PWA en App.jsx
- [ ] Agregar ConnectionIndicator en Navbar
- [ ] Agregar OfflineBanner en Layout
- [ ] Usar operaciones offline en formularios
- [ ] Generar iconos PWA reales
- [ ] Actualizar index.html con meta tags
- [ ] Configurar variables de entorno
- [ ] Probar funcionalidad offline
- [ ] Verificar Service Worker activo
- [ ] Probar sincronización al reconectar

## 🎉 ¡Listo!

Con estos pasos, tu aplicación SalvaCell tendrá capacidad offline completa y será una verdadera PWA instalable.

**¡Éxito con la integración!** 🚀

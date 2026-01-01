/**
 * IndexedDB Configuration with Dexie.js
 * Base de datos local para funcionalidad offline
 */

import Dexie from 'dexie';

// Definir la base de datos
export const db = new Dexie('SalvaCellDB');

// Versión 1: Esquema inicial
db.version(1).stores({
  // Tabla de clientes (cacheados de API)
  clientes: 'id, telefono, nombre, apellido, &email, createdAt, updatedAt',
  
  // Tabla de órdenes (incluye órdenes creadas offline)
  ordenes: 'id, folio, clienteId, equipoId, estado, fechaIngreso, _syncStatus, _syncTimestamp',
  
  // Tabla de equipos asociados a clientes
  equipos: 'id, clienteId, marca, modelo, imei',
  
  // Tabla de refacciones (inventario cacheado)
  refacciones: 'id, codigo, nombre, stockActual, categoria, _lastSync',
  
  // Tabla de accesorios (inventario cacheado)
  accesorios: 'id, codigo, nombre, stockActual, categoria, _lastSync',
  
  // Cola de sincronización para cambios offline
  syncQueue: '++id, action, entity, entityId, timestamp, data, status, retryCount, lastAttempt, error',
  
  // Configuración local
  config: 'key, value, updatedAt',
  
  // Cache de respuestas API
  apiCache: 'url, data, timestamp, expiresAt'
});

// Hooks para agregar timestamps automáticamente
db.clientes.hook('creating', (primKey, obj) => {
  if (!obj.createdAt) obj.createdAt = new Date().toISOString();
  if (!obj.updatedAt) obj.updatedAt = new Date().toISOString();
});

db.clientes.hook('updating', (mods, primKey, obj) => {
  mods.updatedAt = new Date().toISOString();
});

db.ordenes.hook('creating', (primKey, obj) => {
  if (!obj.createdAt) obj.createdAt = new Date().toISOString();
  if (!obj.updatedAt) obj.updatedAt = new Date().toISOString();
  // Marcar como pendiente de sincronización si se crea offline
  if (!navigator.onLine) {
    obj._syncStatus = 'pending';
    obj._syncTimestamp = new Date().toISOString();
  }
});

db.ordenes.hook('updating', (mods, primKey, obj) => {
  mods.updatedAt = new Date().toISOString();
});

/**
 * Inicializar base de datos
 */
export async function initDB() {
  try {
    await db.open();
    console.log('IndexedDB inicializada correctamente');
    return true;
  } catch (error) {
    console.error('Error inicializando IndexedDB:', error);
    return false;
  }
}

/**
 * Limpiar datos antiguos (>30 días)
 */
export async function cleanOldData() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const threshold = thirtyDaysAgo.toISOString();

    // Limpiar cache API expirado
    await db.apiCache
      .where('expiresAt')
      .below(new Date().toISOString())
      .delete();

    // Limpiar órdenes sincronizadas antiguas
    await db.ordenes
      .where('_syncStatus')
      .equals('synced')
      .and(orden => orden.updatedAt < threshold)
      .delete();

    console.log('Limpieza de datos antiguos completada');
  } catch (error) {
    console.error('Error limpiando datos antiguos:', error);
  }
}

/**
 * Obtener tamaño estimado de la base de datos
 */
export async function getStorageInfo() {
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentUsed = (used / quota) * 100;

      return {
        used: (used / 1024 / 1024).toFixed(2) + ' MB',
        quota: (quota / 1024 / 1024).toFixed(2) + ' MB',
        percentUsed: percentUsed.toFixed(2) + '%',
        available: ((quota - used) / 1024 / 1024).toFixed(2) + ' MB'
      };
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo información de almacenamiento:', error);
    return null;
  }
}

/**
 * Exportar datos para respaldo
 */
export async function exportData() {
  try {
    const data = {
      clientes: await db.clientes.toArray(),
      ordenes: await db.ordenes.toArray(),
      equipos: await db.equipos.toArray(),
      refacciones: await db.refacciones.toArray(),
      accesorios: await db.accesorios.toArray(),
      syncQueue: await db.syncQueue.toArray(),
      timestamp: new Date().toISOString()
    };

    return data;
  } catch (error) {
    console.error('Error exportando datos:', error);
    throw error;
  }
}

/**
 * Borrar toda la base de datos
 */
export async function clearAllData() {
  try {
    await db.clientes.clear();
    await db.ordenes.clear();
    await db.equipos.clear();
    await db.refacciones.clear();
    await db.accesorios.clear();
    await db.syncQueue.clear();
    await db.config.clear();
    await db.apiCache.clear();
    
    console.log('Todos los datos locales han sido borrados');
    return true;
  } catch (error) {
    console.error('Error borrando datos:', error);
    return false;
  }
}

export default db;

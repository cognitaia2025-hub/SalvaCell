/**
 * Sync Manager
 * Gestiona la sincronización de datos entre IndexedDB y el servidor
 */

import db from './database';
import { isOnline, addOnlineListener, removeOnlineListener } from '../utils/network';

// Estado de sincronización
let syncState = {
  isSyncing: false,
  pendingCount: 0,
  lastSync: null,
  errors: []
};

// Listeners de cambio de estado
const stateListeners = new Set();

/**
 * Notificar cambio de estado a listeners
 */
function notifyStateChange() {
  stateListeners.forEach(listener => listener(syncState));
}

/**
 * Suscribirse a cambios de estado de sincronización
 */
export function subscribeSyncState(listener) {
  stateListeners.add(listener);
  // Enviar estado actual inmediatamente
  listener(syncState);
  
  return () => stateListeners.delete(listener);
}

/**
 * Obtener estado actual de sincronización
 */
export function getSyncState() {
  return { ...syncState };
}

/**
 * Agregar operación a la cola de sincronización
 */
export async function addToSyncQueue(action, entity, entityId, data) {
  try {
    const item = {
      action, // 'CREATE', 'UPDATE', 'DELETE'
      entity, // 'orden', 'cliente', 'pago', etc.
      entityId,
      timestamp: new Date().toISOString(),
      data,
      status: 'pending',
      retryCount: 0,
      lastAttempt: null,
      error: null
    };

    const id = await db.syncQueue.add(item);
    
    // Actualizar contador
    syncState.pendingCount = await db.syncQueue
      .where('status')
      .equals('pending')
      .count();
    
    notifyStateChange();

    console.log(`Operación agregada a cola de sincronización: ${action} ${entity} ${entityId}`);
    
    // Intentar sincronizar si hay conexión
    if (isOnline()) {
      syncPendingChanges();
    }

    return id;
  } catch (error) {
    console.error('Error agregando a cola de sincronización:', error);
    throw error;
  }
}

/**
 * Sincronizar cambios pendientes con el servidor
 */
export async function syncPendingChanges() {
  // Evitar sincronizaciones simultáneas
  if (syncState.isSyncing) {
    console.log('Sincronización ya en progreso...');
    return;
  }

  if (!isOnline()) {
    console.log('Sin conexión. No se puede sincronizar.');
    return;
  }

  syncState.isSyncing = true;
  syncState.errors = [];
  notifyStateChange();

  try {
    // Obtener todos los cambios pendientes ordenados por timestamp (FIFO)
    const pendingChanges = await db.syncQueue
      .where('status')
      .anyOf(['pending', 'error'])
      .sortBy('timestamp');

    if (pendingChanges.length === 0) {
      console.log('No hay cambios pendientes para sincronizar');
      syncState.isSyncing = false;
      notifyStateChange();
      return;
    }

    console.log(`Sincronizando ${pendingChanges.length} cambios pendientes...`);

    // Procesar cada cambio
    for (const change of pendingChanges) {
      try {
        await syncSingleChange(change);
      } catch (error) {
        console.error(`Error sincronizando cambio ${change.id}:`, error);
        
        // Actualizar registro con error
        await db.syncQueue.update(change.id, {
          status: 'error',
          error: error.message,
          lastAttempt: new Date().toISOString(),
          retryCount: (change.retryCount || 0) + 1
        });

        syncState.errors.push({
          changeId: change.id,
          action: change.action,
          entity: change.entity,
          error: error.message
        });
      }
    }

    syncState.lastSync = new Date().toISOString();
    syncState.pendingCount = await db.syncQueue
      .where('status')
      .equals('pending')
      .count();

  } catch (error) {
    console.error('Error en proceso de sincronización:', error);
  } finally {
    syncState.isSyncing = false;
    notifyStateChange();
  }
}

/**
 * Sincronizar un cambio individual
 */
async function syncSingleChange(change) {
  const { action, entity, entityId, data } = change;

  // Construir URL y método HTTP
  const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';
  let url = `${apiUrl}/api/${entity}s`;
  let method = 'POST';

  switch (action) {
    case 'CREATE':
      method = 'POST';
      break;
    case 'UPDATE':
      method = 'PUT';
      url = `${url}/${entityId}`;
      break;
    case 'DELETE':
      method = 'DELETE';
      url = `${url}/${entityId}`;
      break;
    default:
      throw new Error(`Acción desconocida: ${action}`);
  }

  // Obtener token de autenticación
  const token = localStorage.getItem('token');
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: action !== 'DELETE' ? JSON.stringify(data) : undefined
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  const result = await response.json();

  // Actualizar dato local con respuesta del servidor
  if (action === 'CREATE' && result.id) {
    // Actualizar ID local con ID del servidor
    await updateLocalEntity(entity, data.tempId || entityId, result.id, result);
  } else if (action === 'UPDATE') {
    await updateLocalEntity(entity, entityId, entityId, result);
  } else if (action === 'DELETE') {
    await deleteLocalEntity(entity, entityId);
  }

  // Marcar como sincronizado
  await db.syncQueue.update(change.id, {
    status: 'synced',
    lastAttempt: new Date().toISOString()
  });

  console.log(`✓ Sincronizado: ${action} ${entity} ${entityId}`);
}

/**
 * Actualizar entidad local después de sincronizar
 */
async function updateLocalEntity(entity, localId, serverId, serverData) {
  try {
    const table = db[entity + 's']; // clientes, ordenes, etc.
    
    if (!table) {
      console.warn(`Tabla no encontrada: ${entity}s`);
      return;
    }

    // Actualizar con datos del servidor
    await table.put({
      ...serverData,
      _syncStatus: 'synced',
      _syncTimestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`Error actualizando entidad local ${entity}:`, error);
  }
}

/**
 * Eliminar entidad local después de sincronizar
 */
async function deleteLocalEntity(entity, entityId) {
  try {
    const table = db[entity + 's'];
    
    if (!table) {
      console.warn(`Tabla no encontrada: ${entity}s`);
      return;
    }

    await table.delete(entityId);
  } catch (error) {
    console.error(`Error eliminando entidad local ${entity}:`, error);
  }
}

/**
 * Reintentar cambios fallidos
 */
export async function retryFailedChanges() {
  try {
    const failedChanges = await db.syncQueue
      .where('status')
      .equals('error')
      .and(change => (change.retryCount || 0) < 5) // Máximo 5 reintentos
      .toArray();

    if (failedChanges.length === 0) {
      console.log('No hay cambios fallidos para reintentar');
      return;
    }

    // Resetear estado a pending para que se intente de nuevo
    for (const change of failedChanges) {
      await db.syncQueue.update(change.id, { status: 'pending' });
    }

    // Iniciar sincronización
    await syncPendingChanges();

  } catch (error) {
    console.error('Error reintentando cambios fallidos:', error);
  }
}

/**
 * Limpiar cambios ya sincronizados
 */
export async function cleanSyncedChanges() {
  try {
    const count = await db.syncQueue
      .where('status')
      .equals('synced')
      .delete();
    
    console.log(`${count} cambios sincronizados limpiados de la cola`);
    
    syncState.pendingCount = await db.syncQueue
      .where('status')
      .equals('pending')
      .count();
    
    notifyStateChange();
  } catch (error) {
    console.error('Error limpiando cambios sincronizados:', error);
  }
}

/**
 * Inicializar sincronización automática
 */
export function initAutoSync() {
  // Sincronizar al detectar conexión
  const handleOnline = () => {
    console.log('Conexión detectada. Iniciando sincronización...');
    syncPendingChanges();
  };

  addOnlineListener(handleOnline);

  // Sincronizar al cargar si hay conexión
  if (isOnline()) {
    // Esperar 2 segundos para que la app se inicialice
    setTimeout(() => {
      syncPendingChanges();
    }, 2000);
  }

  // Actualizar contador inicial
  db.syncQueue
    .where('status')
    .equals('pending')
    .count()
    .then(count => {
      syncState.pendingCount = count;
      notifyStateChange();
    });

  // Limpiar cambios sincronizados cada 5 minutos
  const cleanInterval = setInterval(() => {
    cleanSyncedChanges();
  }, 5 * 60 * 1000);

  // Retornar función de limpieza
  return () => {
    removeOnlineListener(handleOnline);
    clearInterval(cleanInterval);
  };
}

export default {
  addToSyncQueue,
  syncPendingChanges,
  retryFailedChanges,
  cleanSyncedChanges,
  subscribeSyncState,
  getSyncState,
  initAutoSync
};

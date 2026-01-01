/**
 * Network Utilities
 * Gestión del estado de conexión y eventos de red
 */

// Estado de conexión
let isCurrentlyOnline = navigator.onLine;

// Listeners de cambio de estado
const onlineListeners = new Set();
const offlineListeners = new Set();

/**
 * Verificar si hay conexión a internet
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Agregar listener para evento online
 */
export function addOnlineListener(callback) {
  onlineListeners.add(callback);
}

/**
 * Remover listener de evento online
 */
export function removeOnlineListener(callback) {
  onlineListeners.delete(callback);
}

/**
 * Agregar listener para evento offline
 */
export function addOfflineListener(callback) {
  offlineListeners.add(callback);
}

/**
 * Remover listener de evento offline
 */
export function removeOfflineListener(callback) {
  offlineListeners.delete(callback);
}

/**
 * Manejar evento de conexión online
 */
function handleOnline() {
  isCurrentlyOnline = true;
  console.log('🟢 Conexión a internet restaurada');
  
  onlineListeners.forEach(callback => {
    try {
      callback();
    } catch (error) {
      console.error('Error en listener online:', error);
    }
  });
}

/**
 * Manejar evento de pérdida de conexión
 */
function handleOffline() {
  isCurrentlyOnline = false;
  console.log('🔴 Conexión a internet perdida');
  
  offlineListeners.forEach(callback => {
    try {
      callback();
    } catch (error) {
      console.error('Error en listener offline:', error);
    }
  });
}

/**
 * Inicializar listeners de red
 */
export function initNetworkListeners() {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  console.log('Network listeners inicializados');
  
  // Retornar función de limpieza
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Verificar conexión real (no solo navigator.onLine)
 * Intenta hacer una petición ligera al servidor
 */
export async function checkRealConnection(timeout = 5000) {
  if (!navigator.onLine) {
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/health`, {
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('Verificación de conexión falló:', error.message);
    return false;
  }
}

/**
 * Obtener estado de conexión detallado
 */
export async function getConnectionInfo() {
  const basicOnline = navigator.onLine;
  
  let effectiveType = 'unknown';
  let downlink = null;
  let rtt = null;

  // API de Connection disponible en algunos navegadores
  if ('connection' in navigator) {
    const conn = navigator.connection;
    effectiveType = conn.effectiveType || 'unknown';
    downlink = conn.downlink || null;
    rtt = conn.rtt || null;
  }

  const realConnection = basicOnline ? await checkRealConnection() : false;

  return {
    online: basicOnline,
    realConnection,
    effectiveType,
    downlink,
    rtt,
    quality: getConnectionQuality(effectiveType, downlink)
  };
}

/**
 * Clasificar calidad de conexión
 */
function getConnectionQuality(effectiveType, downlink) {
  if (!navigator.onLine) return 'offline';
  
  if (effectiveType === '4g' || (downlink && downlink > 5)) {
    return 'excellent';
  } else if (effectiveType === '3g' || (downlink && downlink > 1.5)) {
    return 'good';
  } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
    return 'poor';
  }
  
  return 'unknown';
}

/**
 * Esperar a que haya conexión
 */
export function waitForConnection(timeout = 30000) {
  return new Promise((resolve, reject) => {
    if (navigator.onLine) {
      resolve(true);
      return;
    }

    let timeoutId;
    
    const handleOnlineEvent = () => {
      clearTimeout(timeoutId);
      window.removeEventListener('online', handleOnlineEvent);
      resolve(true);
    };

    window.addEventListener('online', handleOnlineEvent);

    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        window.removeEventListener('online', handleOnlineEvent);
        reject(new Error('Timeout esperando conexión'));
      }, timeout);
    }
  });
}

/**
 * Ejecutar función cuando haya conexión
 */
export async function executeOnline(fn, options = {}) {
  const { timeout = 30000, fallback = null } = options;

  if (navigator.onLine) {
    try {
      return await fn();
    } catch (error) {
      if (fallback) {
        return fallback();
      }
      throw error;
    }
  }

  // Si no hay conexión, esperar
  try {
    await waitForConnection(timeout);
    return await fn();
  } catch (error) {
    if (fallback) {
      return fallback();
    }
    throw error;
  }
}

export default {
  isOnline,
  addOnlineListener,
  removeOnlineListener,
  addOfflineListener,
  removeOfflineListener,
  initNetworkListeners,
  checkRealConnection,
  getConnectionInfo,
  waitForConnection,
  executeOnline
};

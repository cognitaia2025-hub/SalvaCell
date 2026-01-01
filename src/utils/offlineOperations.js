/**
 * Offline Operations Handler
 * Maneja operaciones específicas que se pueden realizar offline
 */

import db from '../db/database';
import { addToSyncQueue } from '../db/syncManager';
import { isOnline } from './network';

/**
 * Crear orden offline
 * Guarda la orden en IndexedDB y la agrega a la cola de sincronización
 */
export async function createOrdenOffline(ordenData) {
  try {
    // Generar ID temporal
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const orden = {
      ...ordenData,
      id: tempId,
      _syncStatus: 'pending',
      _syncTimestamp: new Date().toISOString(),
      _isOfflineCreated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Guardar en IndexedDB
    await db.ordenes.add(orden);

    // Agregar a cola de sincronización
    await addToSyncQueue('CREATE', 'orden', tempId, {
      ...ordenData,
      tempId // Para mapear el ID temporal con el ID real después
    });

    console.log('✓ Orden creada offline:', tempId);

    return { success: true, id: tempId, orden };
  } catch (error) {
    console.error('Error creando orden offline:', error);
    throw error;
  }
}

/**
 * Actualizar orden offline
 */
export async function updateOrdenOffline(ordenId, updates) {
  try {
    // Obtener orden actual
    const ordenActual = await db.ordenes.get(ordenId);
    
    if (!ordenActual) {
      throw new Error('Orden no encontrada');
    }

    // Actualizar en IndexedDB
    await db.ordenes.update(ordenId, {
      ...updates,
      _syncStatus: 'pending',
      _syncTimestamp: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Agregar a cola de sincronización
    await addToSyncQueue('UPDATE', 'orden', ordenId, {
      ...ordenActual,
      ...updates
    });

    console.log('✓ Orden actualizada offline:', ordenId);

    return { success: true, id: ordenId };
  } catch (error) {
    console.error('Error actualizando orden offline:', error);
    throw error;
  }
}

/**
 * Obtener clientes (desde cache)
 */
export async function getClientesOffline(searchTerm = '') {
  try {
    let clientes;

    if (searchTerm) {
      // Búsqueda por nombre, apellido o teléfono
      clientes = await db.clientes
        .filter(cliente => {
          const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`.toLowerCase();
          const term = searchTerm.toLowerCase();
          return (
            nombreCompleto.includes(term) ||
            cliente.telefono?.includes(searchTerm) ||
            cliente.email?.toLowerCase().includes(term)
          );
        })
        .toArray();
    } else {
      clientes = await db.clientes.toArray();
    }

    return clientes;
  } catch (error) {
    console.error('Error obteniendo clientes offline:', error);
    throw error;
  }
}

/**
 * Obtener cliente por ID (desde cache)
 */
export async function getClienteOffline(clienteId) {
  try {
    const cliente = await db.clientes.get(clienteId);
    return cliente || null;
  } catch (error) {
    console.error('Error obteniendo cliente offline:', error);
    throw error;
  }
}

/**
 * Obtener órdenes (incluyendo las creadas offline)
 */
export async function getOrdenesOffline(filters = {}) {
  try {
    let query = db.ordenes.toCollection();

    // Aplicar filtros
    if (filters.estado) {
      query = query.filter(orden => orden.estado === filters.estado);
    }

    if (filters.clienteId) {
      query = query.filter(orden => orden.clienteId === filters.clienteId);
    }

    if (filters.fechaDesde) {
      query = query.filter(orden => orden.fechaIngreso >= filters.fechaDesde);
    }

    if (filters.fechaHasta) {
      query = query.filter(orden => orden.fechaIngreso <= filters.fechaHasta);
    }

    const ordenes = await query.toArray();

    // Ordenar por fecha de ingreso (más reciente primero)
    ordenes.sort((a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso));

    return ordenes;
  } catch (error) {
    console.error('Error obteniendo órdenes offline:', error);
    throw error;
  }
}

/**
 * Obtener orden por ID (desde cache)
 */
export async function getOrdenOffline(ordenId) {
  try {
    const orden = await db.ordenes.get(ordenId);
    return orden || null;
  } catch (error) {
    console.error('Error obteniendo orden offline:', error);
    throw error;
  }
}

/**
 * Obtener inventario (refacciones, desde cache)
 */
export async function getRefaccionesOffline(searchTerm = '') {
  try {
    let refacciones;

    if (searchTerm) {
      refacciones = await db.refacciones
        .filter(refaccion => {
          const term = searchTerm.toLowerCase();
          return (
            refaccion.nombre?.toLowerCase().includes(term) ||
            refaccion.codigo?.toLowerCase().includes(term) ||
            refaccion.categoria?.toLowerCase().includes(term)
          );
        })
        .toArray();
    } else {
      refacciones = await db.refacciones.toArray();
    }

    return refacciones;
  } catch (error) {
    console.error('Error obteniendo refacciones offline:', error);
    throw error;
  }
}

/**
 * Obtener accesorios (desde cache)
 */
export async function getAccesoriosOffline(searchTerm = '') {
  try {
    let accesorios;

    if (searchTerm) {
      accesorios = await db.accesorios
        .filter(accesorio => {
          const term = searchTerm.toLowerCase();
          return (
            accesorio.nombre?.toLowerCase().includes(term) ||
            accesorio.codigo?.toLowerCase().includes(term) ||
            accesorio.categoria?.toLowerCase().includes(term)
          );
        })
        .toArray();
    } else {
      accesorios = await db.accesorios.toArray();
    }

    return accesorios;
  } catch (error) {
    console.error('Error obteniendo accesorios offline:', error);
    throw error;
  }
}

/**
 * Cache datos de API en IndexedDB
 */
export async function cacheAPIData(url, data, ttl = 300000) { // TTL default: 5 minutos
  try {
    const expiresAt = new Date(Date.now() + ttl).toISOString();

    await db.apiCache.put({
      url,
      data,
      timestamp: new Date().toISOString(),
      expiresAt
    });

    console.log(`✓ Datos cacheados: ${url}`);
  } catch (error) {
    console.error('Error cacheando datos de API:', error);
  }
}

/**
 * Obtener datos cacheados de API
 */
export async function getCachedAPIData(url) {
  try {
    const cached = await db.apiCache.get(url);

    if (!cached) {
      return null;
    }

    // Verificar si expiró
    if (new Date(cached.expiresAt) < new Date()) {
      await db.apiCache.delete(url);
      return null;
    }

    return cached.data;
  } catch (error) {
    console.error('Error obteniendo datos cacheados:', error);
    return null;
  }
}

/**
 * Sincronizar clientes desde API a cache local
 */
export async function syncClientesToCache() {
  if (!isOnline()) {
    console.log('Sin conexión. No se pueden sincronizar clientes.');
    return;
  }

  try {
    const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    const response = await fetch(`${apiUrl}/api/clientes`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener clientes del servidor');
    }

    const clientes = await response.json();

    // Guardar en IndexedDB
    await db.clientes.clear();
    await db.clientes.bulkAdd(clientes);

    console.log(`✓ ${clientes.length} clientes sincronizados a cache local`);
  } catch (error) {
    console.error('Error sincronizando clientes:', error);
  }
}

/**
 * Sincronizar inventario desde API a cache local
 */
export async function syncInventarioToCache() {
  if (!isOnline()) {
    console.log('Sin conexión. No se puede sincronizar inventario.');
    return;
  }

  try {
    const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    // Sincronizar refacciones
    const refaccionesRes = await fetch(`${apiUrl}/api/refacciones`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    if (refaccionesRes.ok) {
      const refacciones = await refaccionesRes.json();
      await db.refacciones.clear();
      await db.refacciones.bulkAdd(refacciones.map(r => ({
        ...r,
        _lastSync: new Date().toISOString()
      })));
      console.log(`✓ ${refacciones.length} refacciones sincronizadas`);
    }

    // Sincronizar accesorios
    const accesoriosRes = await fetch(`${apiUrl}/api/accesorios`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    if (accesoriosRes.ok) {
      const accesorios = await accesoriosRes.json();
      await db.accesorios.clear();
      await db.accesorios.bulkAdd(accesorios.map(a => ({
        ...a,
        _lastSync: new Date().toISOString()
      })));
      console.log(`✓ ${accesorios.length} accesorios sincronizados`);
    }

  } catch (error) {
    console.error('Error sincronizando inventario:', error);
  }
}

export default {
  createOrdenOffline,
  updateOrdenOffline,
  getClientesOffline,
  getClienteOffline,
  getOrdenesOffline,
  getOrdenOffline,
  getRefaccionesOffline,
  getAccesoriosOffline,
  cacheAPIData,
  getCachedAPIData,
  syncClientesToCache,
  syncInventarioToCache
};

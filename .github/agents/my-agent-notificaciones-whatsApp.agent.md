---
name: Agente-Notificaciones-WhatsApp
description: Especialista en integración de notificaciones automáticas para SalvaCell
---

# INSTRUCCIONES PARA EL AGENTE DE NOTIFICACIONES

## CONTEXTO
Eres el especialista en notificaciones del proyecto SalvaCell. Tu responsabilidad es investigar, diseñar e implementar el sistema de notificaciones automáticas por WhatsApp, SMS y Email.

## DOCUMENTACIÓN DE REFERENCIA
Lee y analiza cuidadosamente los siguientes documentos en la carpeta `docs/`:
- SRS.md - SECCIÓN 3.10: NOTIFICACIONES (todos los RF-NOT-*)
- FSD.md - SECCIÓN 9: NOTIFICACIONES
- PRD.md - Historias US-NOT-001 y US-NOT-002

## TUS RESPONSABILIDADES

### 1. INVESTIGACIÓN Y SELECCIÓN DE PROVEEDOR

**Evaluar opciones de WhatsApp:**
- **WAHA (WhatsApp HTTP API):** Open source, autohospedado, gratis
- **Twilio WhatsApp Business API:** Pago, oficial, escalable
- **Baileys:** Biblioteca Node.js, requiere mantenimiento
- **WhatsApp Business API Oficial:** Requiere aprobación de Meta

**Criterios de evaluación:**
- Costo (priorizar opciones gratuitas/económicas)
- Facilidad de implementación
- Confiabilidad y uptime
- Límites de mensajes por día
- Soporte y documentación

**Decisión recomendada:** Documentar en el reporte

### 2. DISEÑO DE PLANTILLAS DE MENSAJES (RF-NOT-003)

**Plantillas configurables en base de datos (tabla Configuracion):**

**ORDEN_TERMINADA (Cliente nuevo/regular):**
```
Hola {nombreCliente}, tu {marca} {modelo} está listo para recoger. 
Adeudo: ${adeudo}
Folio: {folio}
¡Gracias por confiar en SalvaCell!
```

**ORDEN_TERMINADA_RECURRENTE (RF-NOT-004):**
```
Hola {nombreCliente}, tu {marca} {modelo} está listo nuevamente. 
¡Gracias por seguir confiando en nosotros! 
Folio: {folio}
Adeudo: ${adeudo}
```

**ORDEN_EN_REPARACION:**
```
Hola {nombreCliente}, tu {equipo} ya está en reparación.
Te avisaremos cuando esté listo.
Folio: {folio}
```

**RECORDATORIO_ENTREGA:**
```
Hola {nombreCliente}, tu {equipo} sigue esperándote.
Por favor pasa a recogerlo. 
Folio: {folio}
Adeudo: ${adeudo}
```

### 3. MOTOR DE PLANTILLAS

**Implementar función de reemplazo de variables:**
```javascript
function renderizarPlantilla(plantilla, datos) {
  // Reemplazar {nombreCliente}, {marca}, {modelo}, etc.
  // Formatear montos con símbolo de pesos
  // Retornar mensaje final
}
```

**Variables disponibles:**
- {nombreCliente}
- {marca}
- {modelo}
- {equipo} (marca + modelo)
- {folio}
- {adeudo} (formateado como moneda)
- {fechaEstimadaEntrega}

### 4. TRIGGERS AUTOMÁTICOS (RF-NOT-001)

**Eventos que disparan notificaciones:**

1. **Orden cambia a estado EN_REPARACION**
   - Enviar plantilla:  ORDEN_EN_REPARACION
   - Destinatario: Cliente de la orden

2. **Orden cambia a estado TERMINADO**
   - Verificar si cliente es recurrente (>3 órdenes previas)
   - Si recurrente: plantilla ORDEN_TERMINADA_RECURRENTE
   - Si no:  plantilla ORDEN_TERMINADA
   - Destinatario: Cliente de la orden

3. **Cron job diario (10: 00 AM)**
   - Buscar órdenes con estado TERMINADO
   - Filtrar las que NO han sido entregadas
   - Filtrar las que están listas hace >48 horas
   - Enviar plantilla:  RECORDATORIO_ENTREGA

### 5. ESTRUCTURA DEL SERVICIO

**Crear en backend:**
```
backend/src/services/notifications/
├── notificationService.js      # Servicio principal
├── whatsappProvider.js         # Integración WhatsApp
├── smsProvider.js              # Integración SMS (placeholder)
├── emailProvider.js            # Integración Email (placeholder)
├── templateEngine.js           # Motor de plantillas
└── queueManager.js             # Cola de mensajes
```

**Funciones principales a implementar:**
- `enviarNotificacion(tipo, destinatario, datos)`
- `renderizarPlantilla(evento, variables)`
- `esClienteRecurrente(clienteId)`
- `agregarACola(mensaje)`
- `procesarCola()`
- `registrarLog(notificacion, resultado)`

### 6. LOG DE NOTIFICACIONES (RF-NOT-005)

**Agregar modelo Prisma:**
```prisma
model NotificacionLog {
  id          String   @id @default(uuid())
  ordenId     String? 
  clienteId   String
  canal       String   // WHATSAPP, SMS, EMAIL
  evento      String   // ORDEN_TERMINADA, etc.
  mensaje     String   // Mensaje renderizado final
  telefono    String
  estado      String   // ENVIADO, FALLIDO, PENDIENTE
  respuestaAPI String?  // Response del proveedor
  errorMensaje String?  // Si falló, descripción del error
  createdAt   DateTime @default(now())

  @@index([ordenId])
  @@index([clienteId])
  @@index([estado])
}
```

### 7. ENDPOINTS DE ADMINISTRACIÓN

**Crear rutas API:**
- `GET /api/notificaciones/plantillas` - Listar todas las plantillas
- `PUT /api/notificaciones/plantillas/:evento` - Actualizar plantilla
- `POST /api/notificaciones/test` - Enviar mensaje de prueba
- `GET /api/notificaciones/log` - Historial de notificaciones enviadas
- `GET /api/notificaciones/estadisticas` - Tasa de entrega, fallos, etc.

### 8. CRON JOBS

**Implementar con node-cron:**
```javascript
const cron = require('node-cron');

// Recordatorio diario a las 10:00 AM
cron.schedule('0 10 * * *', async () => {
  const fechaLimite = new Date(Date.now() - 48 * 60 * 60 * 1000);
  
  const ordenesNoRecogidas = await prisma.orden.findMany({
    where: {
      estado:  'TERMINADO',
      fechaRealEntrega: null,
      fechaEstimadaEntrega: { lt: fechaLimite }
    },
    include: { cliente: true, equipo: true }
  });
  
  for (const orden of ordenesNoRecogidas) {
    await notificationService.enviarRecordatorio(orden);
  }
});
```

### 9. MANEJO DE ERRORES Y REINTENTOS

**Estrategia:**
- Si falla el envío, registrar en log con estado FALLIDO
- Reintentar automáticamente 3 veces con delay de 30 segundos
- Después de 3 fallos, marcar como FALLIDO_PERMANENTE
- Notificar al administrador si hay >10 fallos consecutivos

## ENTREGABLES

Al finalizar tu trabajo, debes crear en la carpeta `docs/` el archivo:

**`docs/NOTIFICATIONS_IMPLEMENTATION_REPORT.md`** que incluya:

## 1. RESUMEN EJECUTIVO
- Proveedor de WhatsApp seleccionado:  [Nombre]
- Justificación de la elección
- Canales implementados:  WhatsApp / SMS / Email
- Plantillas creadas: [Número]
- Estado de implementación: [%]

## 2. PROVEEDOR WHATSAPP

### Evaluación realizada:
| Proveedor | Costo | Facilidad | Límites | Decisión |
|-----------|-------|-----------|---------|----------|
| WAHA | Gratis | Alta | Ilimitado* | ✅ Elegido |
| Twilio | $$ | Media | 1000/día | ❌ |
| Baileys | Gratis | Baja | Ilimitado | ❌ |

### Configuración del proveedor elegido:
- URL de API: [URL]
- Método de autenticación: [API Key / Token / OAuth]
- Rate limits: [X mensajes/minuto]
- Documentación: [Link]

## 3. PLANTILLAS IMPLEMENTADAS

| Evento | Plantilla | Variables | Destinatarios |
|--------|-----------|-----------|---------------|
| ORDEN_TERMINADA | "Hola {nombreCliente}..." | 5 variables | Cliente nuevo/regular |
| ORDEN_TERMINADA_RECURRENTE | "Hola {nombreCliente}...  nuevamente" | 4 variables | Cliente recurrente |
| ORDEN_EN_REPARACION | "...  ya está en reparación" | 3 variables | Todos |
| RECORDATORIO_ENTREGA | "...  sigue esperándote" | 4 variables | Clientes con orden lista >48h |

## 4. MOTOR DE PLANTILLAS
- Función `renderizarPlantilla()` implementada:  Sí/No
- Manejo de variables faltantes: [Default value / Error]
- Formato de moneda: $X,XXX.XX
- Escape de caracteres especiales: Sí/No

## 5. TRIGGERS AUTOMÁTICOS
- [x] Cambio de estado a EN_REPARACION → Notificación enviada
- [x] Cambio de estado a TERMINADO → Notificación con lógica de recurrencia
- [x] Cron job recordatorios configurado (diario 10:00 AM)
- [ ] Notificación de pago recibido (opcional - fase 2)

## 6. PERSONALIZACIÓN PARA CLIENTES RECURRENTES
- Lógica implementada: Verificar si cliente. ordenes. length > 3
- Plantilla alternativa aplicada:  Sí/No
- Ejemplo de mensaje personalizado: 
  ```
  [Incluir screenshot o texto del mensaje generado]
  ```

## 7. LOG DE NOTIFICACIONES
- Modelo `NotificacionLog` creado en Prisma:  Sí/No
- Campos implementados: id, ordenId, clienteId, canal, evento, mensaje, estado, respuestaAPI, createdAt
- Índices creados: ordenId, clienteId, estado
- Retención de logs: [30/60/90 días]

## 8. ENDPOINTS ADMINISTRATIVOS

| Endpoint | Método | Funcionalidad | Estado |
|----------|--------|---------------|--------|
| /api/notificaciones/plantillas | GET | Listar plantillas | ✅ |
| /api/notificaciones/plantillas/:evento | PUT | Editar plantilla | ✅ |
| /api/notificaciones/test | POST | Enviar prueba | ✅ |
| /api/notificaciones/log | GET | Ver historial | ✅ |
| /api/notificaciones/estadisticas | GET | Métricas | ⚠️ |

## 9. CRON JOBS
- Biblioteca utilizada: node-cron / agenda / bull
- Schedule configurado: 0 10 * * * (diario 10:00 AM)
- Cantidad de órdenes procesadas en última ejecución: [X]
- Log de ejecuciones: [Ubicación del archivo]

## 10. PRUEBAS REALIZADAS

### Casos de prueba:
- ✅ Orden TERMINADO → WhatsApp enviado correctamente
- ✅ Cliente recurrente → Mensaje personalizado aplicado
- ✅ Error de API → Reintento automático ejecutado
- ✅ Cron job ejecutado a las 10:00 AM
- ✅ Plantilla renderizada con todas las variables
- ⚠️ Límite de 1000 mensajes/día (verificar en producción)

### Mensajes de prueba enviados:
- Cantidad total: [X]
- Exitosos: [X]
- Fallidos: [X]
- Tasa de éxito: [X%]

## 11. MANEJO DE ERRORES
- Estrategia de reintentos:  3 intentos con delay de 30s
- Tiempo total de reintentos: 90 segundos
- Fallback:  Registrar en log como FALLIDO_PERMANENTE
- Notificación a admin: Si >10 fallos consecutivos

## 12. MÉTRICAS
- Tasa de entrega exitosa: [X%]
- Tiempo promedio de envío: [X]ms
- Fallos en últimas 24 horas: [X]
- Canal más usado: WhatsApp / SMS / Email

## 13. LIMITACIONES CONOCIDAS
- WhatsApp requiere número verificado del negocio
- Rate limit de [X] mensajes por minuto/día
- SMS y Email aún no implementados (fase 2)
- No hay confirmación de lectura de mensajes

## 14. PRÓXIMOS PASOS
- Implementar SMS como canal alternativo si WhatsApp falla
- Agregar email para notificaciones de reportes mensuales
- Dashboard visual de estadísticas de notificaciones
- Permitir al cliente elegir canal de preferencia

## CRITERIOS DE ÉXITO
✅ Proveedor de WhatsApp integrado y funcional
✅ 4 plantillas configurables implementadas
✅ Triggers automáticos operativos (cambio de estado + cron)
✅ Personalización para clientes recurrentes funcionando
✅ Log de notificaciones registrando correctamente
✅ Cron job de recordatorios activo
✅ Tasa de entrega >90%
✅ Documentación completa en docs/

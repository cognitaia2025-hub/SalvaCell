import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ============================================================================
  // 1. USUARIOS
  // ============================================================================
  console.log('Creating users...');

  const hashedPassword = await bcrypt.hash('salvacell2026', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@salvacell.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
      active: true,
    },
  });

  const tecnicoUser = await prisma.user.create({
    data: {
      email: 'tecnico@salvacell.com',
      password: hashedPassword,
      name: 'Carlos Méndez',
      role: 'TECNICO',
      active: true,
    },
  });

  const recepcionistaUser = await prisma.user.create({
    data: {
      email: 'recepcion@salvacell.com',
      password: hashedPassword,
      name: 'María García',
      role: 'RECEPCIONISTA',
      active: true,
    },
  });

  console.log('✓ Users created');

  // ============================================================================
  // 2. CONFIGURACIÓN INICIAL
  // ============================================================================
  console.log('Creating initial configuration...');

  await prisma.configuracion.createMany({
    data: [
      { clave: 'nombre_taller', valor: 'SalvaCell' },
      { clave: 'telefono_taller', valor: '555-1234-5678' },
      { clave: 'direccion_taller', valor: 'Calle Principal #123, Colonia Centro' },
      { clave: 'dias_garantia_default', valor: '15' },
      { clave: 'stock_minimo_default', valor: '5' },
      {
        clave: 'mensaje_whatsapp_listo',
        valor: 'Hola {cliente}, tu {equipo} está listo para recoger. Adeudo: ${adeudo}. Folio: {folio}. ¡Gracias por confiar en SalvaCell!',
      },
      {
        clave: 'mensaje_whatsapp_recurrente',
        valor: 'Hola {cliente}, tu {equipo} está listo nuevamente. ¡Gracias por seguir confiando en nosotros! Folio: {folio}',
      },
    ],
  });

  console.log('✓ Configuration created');

  // ============================================================================
  // 3. CLIENTES
  // ============================================================================
  console.log('Creating sample clients...');

  const cliente1 = await prisma.cliente.create({
    data: {
      nombre: 'Juan',
      apellido: 'Pérez García',
      telefono: '5551234567',
      telefonoAlterno: '5559876543',
      email: 'juan.perez@email.com',
      direccion: 'Av. Insurgentes 456, Col. Roma',
      notas: 'Cliente frecuente, prefiere reparaciones con refacciones originales',
    },
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      nombre: 'María',
      apellido: 'López Sánchez',
      telefono: '5552345678',
      email: 'maria.lopez@email.com',
      direccion: 'Calle Reforma 789, Col. Juárez',
    },
  });

  const cliente3 = await prisma.cliente.create({
    data: {
      nombre: 'Pedro',
      apellido: 'Martínez Rodríguez',
      telefono: '5553456789',
      telefonoAlterno: '5558765432',
    },
  });

  const cliente4 = await prisma.cliente.create({
    data: {
      nombre: 'Ana',
      apellido: 'González Torres',
      telefono: '5554567890',
      email: 'ana.gonzalez@email.com',
    },
  });

  const cliente5 = await prisma.cliente.create({
    data: {
      nombre: 'Luis',
      apellido: 'Hernández Flores',
      telefono: '5555678901',
    },
  });

  console.log('✓ Clients created');

  // ============================================================================
  // 4. EQUIPOS
  // ============================================================================
  console.log('Creating sample equipment...');

  const equipo1 = await prisma.equipo.create({
    data: {
      clienteId: cliente1.id,
      marca: 'Apple',
      modelo: 'iPhone 12 Pro',
      imei: '123456789012345',
      color: 'Azul Pacífico',
      capacidad: '128GB',
      notas: 'Tiene funda de cuero',
    },
  });

  const equipo2 = await prisma.equipo.create({
    data: {
      clienteId: cliente1.id,
      marca: 'Apple',
      modelo: 'iPad Air',
      imei: '123456789012346',
      color: 'Space Gray',
      capacidad: '64GB',
    },
  });

  const equipo3 = await prisma.equipo.create({
    data: {
      clienteId: cliente2.id,
      marca: 'Samsung',
      modelo: 'Galaxy A52',
      imei: '123456789012347',
      color: 'Negro',
      capacidad: '128GB',
    },
  });

  const equipo4 = await prisma.equipo.create({
    data: {
      clienteId: cliente3.id,
      marca: 'Xiaomi',
      modelo: 'Redmi Note 10',
      imei: '123456789012348',
      color: 'Blanco',
      capacidad: '64GB',
    },
  });

  const equipo5 = await prisma.equipo.create({
    data: {
      clienteId: cliente4.id,
      marca: 'Apple',
      modelo: 'iPhone 11',
      imei: '123456789012349',
      color: 'Rojo',
      capacidad: '64GB',
    },
  });

  console.log('✓ Equipment created');

  // ============================================================================
  // 5. REFACCIONES
  // ============================================================================
  console.log('Creating sample refacciones...');

  const refaccion1 = await prisma.refaccion.create({
    data: {
      codigo: 'REF-001',
      nombre: 'Pantalla OLED iPhone 12 Pro',
      tipo: 'ORIGINAL',
      categoria: 'Pantallas',
      costoCompra: 2000.0,
      precioVenta: 2800.0,
      stockActual: 5,
      stockMinimo: 3,
      ubicacion: 'Estante A-1',
    },
  });

  const refaccion2 = await prisma.refaccion.create({
    data: {
      codigo: 'REF-002',
      nombre: 'Batería iPhone 12 Pro',
      tipo: 'ORIGINAL',
      categoria: 'Baterías',
      costoCompra: 600.0,
      precioVenta: 900.0,
      stockActual: 10,
      stockMinimo: 5,
      ubicacion: 'Estante A-2',
    },
  });

  const refaccion3 = await prisma.refaccion.create({
    data: {
      codigo: 'REF-003',
      nombre: 'Pantalla Samsung A52',
      tipo: 'GENERICA',
      categoria: 'Pantallas',
      costoCompra: 800.0,
      precioVenta: 1200.0,
      stockActual: 8,
      stockMinimo: 4,
      ubicacion: 'Estante B-1',
    },
  });

  const refaccion4 = await prisma.refaccion.create({
    data: {
      codigo: 'REF-004',
      nombre: 'Conector de carga Lightning',
      tipo: 'GENERICA',
      categoria: 'Conectores',
      costoCompra: 150.0,
      precioVenta: 250.0,
      stockActual: 15,
      stockMinimo: 8,
      ubicacion: 'Estante C-1',
    },
  });

  const refaccion5 = await prisma.refaccion.create({
    data: {
      codigo: 'REF-005',
      nombre: 'Batería Xiaomi Redmi Note 10',
      tipo: 'GENERICA',
      categoria: 'Baterías',
      costoCompra: 300.0,
      precioVenta: 500.0,
      stockActual: 2,
      stockMinimo: 5,
      ubicacion: 'Estante A-3',
    },
  });

  const refaccion6 = await prisma.refaccion.create({
    data: {
      codigo: 'REF-006',
      nombre: 'Cámara trasera iPhone 11',
      tipo: 'ORIGINAL',
      categoria: 'Cámaras',
      costoCompra: 1200.0,
      precioVenta: 1800.0,
      stockActual: 3,
      stockMinimo: 2,
      ubicacion: 'Estante D-1',
    },
  });

  console.log('✓ Refacciones created');

  // ============================================================================
  // 6. ACCESORIOS
  // ============================================================================
  console.log('Creating sample accessories...');

  await prisma.accesorio.createMany({
    data: [
      {
        codigo: 'ACC-001',
        nombre: 'Funda transparente iPhone 12',
        categoria: 'Fundas',
        marca: 'Generic',
        precioCompra: 50.0,
        precioVenta: 120.0,
        stockActual: 20,
        stockMinimo: 10,
      },
      {
        codigo: 'ACC-002',
        nombre: 'Mica de vidrio templado Universal',
        categoria: 'Micas',
        marca: 'Generic',
        precioCompra: 30.0,
        precioVenta: 80.0,
        stockActual: 50,
        stockMinimo: 20,
      },
      {
        codigo: 'ACC-003',
        nombre: 'Cable USB-C 1m',
        categoria: 'Cables',
        marca: 'Generic',
        precioCompra: 40.0,
        precioVenta: 100.0,
        stockActual: 30,
        stockMinimo: 15,
      },
      {
        codigo: 'ACC-004',
        nombre: 'Cargador rápido 20W',
        categoria: 'Cargadores',
        marca: 'Generic',
        precioCompra: 100.0,
        precioVenta: 250.0,
        stockActual: 15,
        stockMinimo: 8,
      },
      {
        codigo: 'ACC-005',
        nombre: 'Audífonos Bluetooth',
        categoria: 'Audio',
        marca: 'Generic',
        precioCompra: 200.0,
        precioVenta: 450.0,
        stockActual: 10,
        stockMinimo: 5,
      },
    ],
  });

  console.log('✓ Accessories created');

  // ============================================================================
  // 7. PRESUPUESTOS
  // ============================================================================
  console.log('Creating sample presupuestos...');

  const now = new Date();
  const fechaVencimiento = new Date(now);
  fechaVencimiento.setDate(fechaVencimiento.getDate() + 15);

  const presupuesto1 = await prisma.presupuesto.create({
    data: {
      folio: 'PRE-202601001',
      clienteId: cliente5.id,
      descripcionProblema: 'Pantalla quebrada, necesita reemplazo',
      montoEstimado: 1500.0,
      estado: 'PENDIENTE',
      vigenciaDias: 15,
      fechaVencimiento: fechaVencimiento,
    },
  });

  console.log('✓ Presupuestos created');

  // ============================================================================
  // 8. ÓRDENES DE REPARACIÓN
  // ============================================================================
  console.log('Creating sample orders...');

  const fechaEntrega1 = new Date(now);
  fechaEntrega1.setDate(fechaEntrega1.getDate() + 3);

  const fechaEntrega2 = new Date(now);
  fechaEntrega2.setDate(fechaEntrega2.getDate() + 5);

  const fechaEntrega3 = new Date(now);
  fechaEntrega3.setDate(fechaEntrega3.getDate() + 2);

  // Orden 1: Cliente VIP Juan Pérez - iPhone 12 Pro (TERMINADO)
  const orden1 = await prisma.orden.create({
    data: {
      folio: 'ORD-202601001',
      clienteId: cliente1.id,
      equipoId: equipo1.id,
      problemaReportado: 'Pantalla rota después de caída',
      diagnosticoTecnico: 'Pantalla OLED dañada, requiere reemplazo completo. Resto del equipo funcional.',
      tipoReparacion: 'Cambio de pantalla',
      reparacionRealizada: 'Se reemplazó pantalla OLED original. Pruebas de touch y display exitosas.',
      estado: 'TERMINADO',
      prioridad: 'NORMAL',
      conSIM: true,
      conFunda: true,
      estadoEncendido: true,
      nivelBateria: 45,
      tieneBloqueo: true,
      tipoBloqueo: 'Face ID',
      codigoProporciona: true,
      estadoFisico: 'Buen estado general, solo daño en pantalla',
      costoTotal: 3200.0,
      anticipo: 1000.0,
      adeudo: 2200.0,
      fechaIngreso: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // Hace 2 días
      fechaEstimadaEntrega: fechaEntrega1,
      tecnicoId: tecnicoUser.id,
      tieneGarantia: true,
      diasGarantia: 30,
    },
  });

  // Orden 2: María López - Samsung A52 (EN_REPARACION)
  const orden2 = await prisma.orden.create({
    data: {
      folio: 'ORD-202601002',
      clienteId: cliente2.id,
      equipoId: equipo3.id,
      problemaReportado: 'No carga, batería se descarga muy rápido',
      diagnosticoTecnico: 'Batería hinchada y conector de carga con oxidación',
      tipoReparacion: 'Cambio de batería y limpieza de conector',
      estado: 'EN_REPARACION',
      prioridad: 'NORMAL',
      conSIM: true,
      conFunda: false,
      conMemoriaSD: true,
      estadoEncendido: true,
      nivelBateria: 15,
      estadoFisico: 'Desgaste normal de uso',
      costoTotal: 1800.0,
      anticipo: 500.0,
      adeudo: 1300.0,
      fechaIngreso: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Hace 1 día
      fechaEstimadaEntrega: fechaEntrega2,
      tecnicoId: tecnicoUser.id,
      tieneGarantia: true,
      diasGarantia: 15,
    },
  });

  // Orden 3: Pedro Martínez - Xiaomi (RECIBIDO)
  const orden3 = await prisma.orden.create({
    data: {
      folio: 'ORD-202601003',
      clienteId: cliente3.id,
      equipoId: equipo4.id,
      problemaReportado: 'Se cayó al agua, no enciende',
      tipoReparacion: 'Diagnóstico y reparación por daño líquido',
      estado: 'RECIBIDO',
      prioridad: 'URGENTE',
      conSIM: false,
      estadoEncendido: false,
      estadoFisico: 'Señales de humedad en puertos',
      costoTotal: 0.0, // Por definir después del diagnóstico
      anticipo: 0.0,
      adeudo: 0.0,
      fechaIngreso: now,
      fechaEstimadaEntrega: fechaEntrega3,
      tieneGarantia: false,
      diasGarantia: 15,
    },
  });

  // Orden 4: Ana González - iPhone 11 (ENTREGADO) - Orden antigua
  const fechaPasada = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Hace 30 días
  const fechaEntregaPasada = new Date(fechaPasada.getTime() + 3 * 24 * 60 * 60 * 1000);

  const orden4 = await prisma.orden.create({
    data: {
      folio: 'ORD-202512001',
      clienteId: cliente4.id,
      equipoId: equipo5.id,
      problemaReportado: 'Cámara trasera no enfoca',
      diagnosticoTecnico: 'Módulo de cámara trasera defectuoso',
      tipoReparacion: 'Cambio de cámara trasera',
      reparacionRealizada: 'Se reemplazó módulo de cámara trasera original',
      estado: 'ENTREGADO',
      prioridad: 'NORMAL',
      conSIM: true,
      estadoEncendido: true,
      nivelBateria: 80,
      estadoFisico: 'Buen estado',
      costoTotal: 2100.0,
      anticipo: 2100.0,
      adeudo: 0.0,
      fechaIngreso: fechaPasada,
      fechaEstimadaEntrega: fechaEntregaPasada,
      fechaRealEntrega: fechaEntregaPasada,
      tecnicoId: tecnicoUser.id,
      tieneGarantia: true,
      diasGarantia: 30,
    },
  });

  console.log('✓ Orders created');

  // ============================================================================
  // 9. HISTORIAL DE ESTADOS
  // ============================================================================
  console.log('Creating order status history...');

  // Historial para Orden 1
  await prisma.historialEstadoOrden.createMany({
    data: [
      {
        ordenId: orden1.id,
        estadoAnterior: null,
        estadoNuevo: 'RECIBIDO',
        usuarioId: recepcionistaUser.id,
        notas: 'Orden recibida en recepción',
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        ordenId: orden1.id,
        estadoAnterior: 'RECIBIDO',
        estadoNuevo: 'EN_DIAGNOSTICO',
        usuarioId: tecnicoUser.id,
        notas: 'Técnico inició diagnóstico',
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 3600000),
      },
      {
        ordenId: orden1.id,
        estadoAnterior: 'EN_DIAGNOSTICO',
        estadoNuevo: 'EN_REPARACION',
        usuarioId: tecnicoUser.id,
        notas: 'Diagnóstico completado, iniciando reparación',
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        ordenId: orden1.id,
        estadoAnterior: 'EN_REPARACION',
        estadoNuevo: 'TERMINADO',
        usuarioId: tecnicoUser.id,
        notas: 'Reparación completada, equipo listo para entrega',
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      },
    ],
  });

  // Historial para Orden 2
  await prisma.historialEstadoOrden.createMany({
    data: [
      {
        ordenId: orden2.id,
        estadoAnterior: null,
        estadoNuevo: 'RECIBIDO',
        usuarioId: recepcionistaUser.id,
        notas: 'Orden recibida',
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        ordenId: orden2.id,
        estadoAnterior: 'RECIBIDO',
        estadoNuevo: 'EN_DIAGNOSTICO',
        usuarioId: tecnicoUser.id,
        createdAt: new Date(now.getTime() - 20 * 60 * 60 * 1000),
      },
      {
        ordenId: orden2.id,
        estadoAnterior: 'EN_DIAGNOSTICO',
        estadoNuevo: 'EN_REPARACION',
        usuarioId: tecnicoUser.id,
        notas: 'Se solicitó batería, en proceso de reemplazo',
        createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
      },
    ],
  });

  // Historial para Orden 3
  await prisma.historialEstadoOrden.create({
    data: {
      ordenId: orden3.id,
      estadoAnterior: null,
      estadoNuevo: 'RECIBIDO',
      usuarioId: recepcionistaUser.id,
      notas: 'Orden urgente recibida, prioridad alta',
      createdAt: now,
    },
  });

  console.log('✓ Order status history created');

  // ============================================================================
  // 10. REFACCIONES USADAS EN ÓRDENES
  // ============================================================================
  console.log('Linking refacciones to orders...');

  await prisma.ordenRefaccion.create({
    data: {
      ordenId: orden1.id,
      refaccionId: refaccion1.id,
      cantidad: 1,
      precioUnitario: 2800.0,
    },
  });

  await prisma.ordenRefaccion.create({
    data: {
      ordenId: orden4.id,
      refaccionId: refaccion6.id,
      cantidad: 1,
      precioUnitario: 1800.0,
    },
  });

  console.log('✓ Refacciones linked');

  // ============================================================================
  // 11. MOVIMIENTOS DE INVENTARIO
  // ============================================================================
  console.log('Creating inventory movements...');

  await prisma.movimientoInventario.createMany({
    data: [
      {
        refaccionId: refaccion1.id,
        tipo: 'SALIDA',
        cantidad: 1,
        motivo: `Usado en orden ${orden1.folio}`,
        usuarioId: tecnicoUser.id,
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      },
      {
        refaccionId: refaccion5.id,
        tipo: 'ENTRADA',
        cantidad: 10,
        motivo: 'Compra a proveedor',
        usuarioId: adminUser.id,
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        refaccionId: refaccion6.id,
        tipo: 'SALIDA',
        cantidad: 1,
        motivo: `Usado en orden ${orden4.folio}`,
        usuarioId: tecnicoUser.id,
        createdAt: fechaPasada,
      },
    ],
  });

  console.log('✓ Inventory movements created');

  // ============================================================================
  // 12. PAGOS
  // ============================================================================
  console.log('Creating payments...');

  await prisma.pago.createMany({
    data: [
      {
        ordenId: orden1.id,
        monto: 1000.0,
        metodoPago: 'EFECTIVO',
        concepto: 'Anticipo orden ORD-202601001',
        usuarioId: recepcionistaUser.id,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        ordenId: orden2.id,
        monto: 500.0,
        metodoPago: 'TRANSFERENCIA',
        concepto: 'Anticipo orden ORD-202601002',
        usuarioId: recepcionistaUser.id,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        ordenId: orden4.id,
        monto: 2100.0,
        metodoPago: 'TARJETA',
        concepto: 'Pago total orden ORD-202512001',
        usuarioId: recepcionistaUser.id,
        createdAt: fechaEntregaPasada,
      },
    ],
  });

  console.log('✓ Payments created');

  // ============================================================================
  // RESUMEN
  // ============================================================================
  console.log('\n✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: 3 (1 Admin, 1 Técnico, 1 Recepcionista)`);
  console.log(`   - Configuration entries: 7`);
  console.log(`   - Clients: 5`);
  console.log(`   - Equipment: 5`);
  console.log(`   - Refacciones: 6`);
  console.log(`   - Accessories: 5`);
  console.log(`   - Presupuestos: 1`);
  console.log(`   - Orders: 4 (1 TERMINADO, 1 EN_REPARACION, 1 RECIBIDO, 1 ENTREGADO)`);
  console.log(`   - Status history entries: 8`);
  console.log(`   - Payments: 3`);
  console.log(`   - Inventory movements: 3`);
  console.log('\n🔑 Default credentials:');
  console.log(`   Admin: admin@salvacell.com / salvacell2026`);
  console.log(`   Técnico: tecnico@salvacell.com / salvacell2026`);
  console.log(`   Recepcionista: recepcion@salvacell.com / salvacell2026`);
  console.log('\n🎯 Next steps:');
  console.log(`   1. Run: npx prisma studio`);
  console.log(`   2. Explore the seeded data in Prisma Studio`);
  console.log(`   3. Start building your API endpoints!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

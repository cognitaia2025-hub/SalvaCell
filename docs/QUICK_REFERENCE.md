# 📋 Quick Reference Guide - SalvaCell Database

## Default Credentials

```
Admin:         admin@salvacell.com / salvacell2026
Técnico:       tecnico@salvacell.com / salvacell2026
Recepcionista: recepcion@salvacell.com / salvacell2026
```

## Essential Commands

```bash
# Setup from scratch
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# View database
npm run prisma:studio  # Opens at http://localhost:5555

# Reset everything (⚠️ destructive)
npm run prisma:reset
```

## Table Summary

| Table | Records (after seed) | Description |
|-------|---------------------|-------------|
| User | 3 | System users |
| Cliente | 5 | Customers |
| Equipo | 5 | Customer devices |
| Orden | 4 | Repair orders |
| Presupuesto | 1 | Budget estimates |
| Refaccion | 6 | Spare parts (1 low stock) |
| Accesorio | 5 | Accessories for sale |
| HistorialEstadoOrden | 8 | Order status history |
| Pago | 3 | Payments |
| MovimientoInventario | 3 | Inventory movements |
| Configuracion | 7 | System config |

## Order States

```
RECIBIDO → EN_DIAGNOSTICO → EN_REPARACION → ESPERANDO_REFACCION → TERMINADO → ENTREGADO
                                                    ↓
                                               CANCELADO
```

## Sample Data Overview

### Orders
- **ORD-202601001**: iPhone 12 Pro (Juan) - TERMINADO - $3,200
- **ORD-202601002**: Samsung A52 (María) - EN_REPARACION - $1,800
- **ORD-202601003**: Xiaomi (Pedro) - RECIBIDO - TBD (URGENTE)
- **ORD-202512001**: iPhone 11 (Ana) - ENTREGADO - $2,100 (30 days ago)

### Clients
- **Juan Pérez**: VIP customer with 2 devices (iPhone 12 Pro, iPad Air)
- **María López**: Regular customer with Samsung A52
- **Pedro Martínez**: New customer with Xiaomi (urgent water damage)
- **Ana González**: Previous customer, order delivered 30 days ago
- **Luis Hernández**: Potential customer with pending budget estimate

### Inventory Alerts
⚠️ **Low Stock**: Batería Xiaomi Redmi Note 10 (2 units, minimum 5)

## Key Relationships

```
Cliente (1) ──→ (N) Órdenes
Cliente (1) ──→ (N) Equipos
Orden (1) ──→ (N) HistorialEstadoOrden
Orden (N) ──→ (M) Refacciones (via OrdenRefaccion)
User (1) ──→ (N) Órdenes (as técnico)
```

## Important Indexes

- `Cliente.telefono` (UNIQUE) - Fast phone lookup
- `Cliente(nombre, apellido)` (COMPOSITE) - Name search
- `Orden.folio` (UNIQUE) - Order lookup
- `Orden.clienteId` - Customer history (CRITICAL for performance)
- `Orden.fechaIngreso` - Date range queries
- `Refaccion.stockActual` - Low stock alerts

## Database URL Examples

**Local:**
```
postgresql://postgres:postgres@localhost:5432/salvacell?schema=public
```

**Railway:**
```
postgresql://postgres:***@containers-us-west-xxx.railway.app:5432/railway
```

**Supabase:**
```
postgresql://postgres:***@db.xxx.supabase.co:5432/postgres
```

## Troubleshooting

**Problem:** Migration fails  
**Solution:** Check DATABASE_URL, ensure PostgreSQL is running

**Problem:** Prisma Client not found  
**Solution:** Run `npm run prisma:generate`

**Problem:** Seed fails  
**Solution:** Check if tables exist, run `npm run prisma:reset` to start fresh

**Problem:** Can't connect to Prisma Studio  
**Solution:** Ensure port 5555 is available, check DATABASE_URL

## Next Steps

1. ✅ Database implemented
2. ⏳ Create Express.js API
3. ⏳ Build React frontend
4. ⏳ Deploy to production

## Quick Links

- [Full Database Report](DB_IMPLEMENTATION_REPORT.md)
- [Prisma Technical Docs](../prisma/README.md)
- [FSD - Complete Specs](FSD.md)
- [Main README](../README.md)

---

**Last Updated:** 2026-01-01

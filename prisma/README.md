# SalvaCell - Database Setup

## Overview

This directory contains the Prisma schema and database configuration for the SalvaCell project.

## Database Structure

The database is designed for a cell phone repair shop management system with the following main entities:

- **Users**: System users with different roles (ADMIN, TECNICO, RECEPCIONISTA)
- **Clientes**: Customers who bring devices for repair
- **Equipos**: Devices belonging to customers (1:N relationship)
- **Presupuestos**: Budget estimates before accepting repairs
- **Órdenes**: Repair orders with full lifecycle tracking
- **Refacciones**: Parts inventory (spare parts)
- **Accesorios**: Accessories for sale
- **Ventas**: Sales of accessories
- **Pagos**: Payments for orders and sales
- **Configuración**: System configuration key-value pairs

## Prerequisites

- Node.js 18+ LTS
- PostgreSQL 15+
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure your database connection in `.env`:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

## Commands

### Generate Prisma Client
```bash
npm run prisma:generate
```

### Create and Apply Migrations
```bash
npm run prisma:migrate
```

This will:
- Create a new migration based on your schema
- Apply it to your database
- Generate the Prisma Client

### Run Seed Data
```bash
npm run prisma:seed
```

This will populate your database with:
- 3 users (admin, tecnico, recepcionista)
- 5 sample clients
- 5 devices
- 6 spare parts (refacciones)
- 5 accessories
- 4 repair orders in different states
- Sample payments and status history

### Open Prisma Studio
```bash
npm run prisma:studio
```

Prisma Studio is a visual editor for your database. It opens at http://localhost:5555

### Reset Database (⚠️ Destructive)
```bash
npm run prisma:reset
```

This will:
- Drop the database
- Recreate it
- Apply all migrations
- Run the seed

## Default Credentials

After running the seed, you can use these credentials:

- **Admin**: admin@salvacell.com / salvacell2026
- **Técnico**: tecnico@salvacell.com / salvacell2026
- **Recepcionista**: recepcion@salvacell.com / salvacell2026

## Key Features

### Indexes

The schema includes optimized indexes for common queries:

- `clientes.telefono` - Unique index for phone lookup
- `clientes.nombre + apellido` - Composite index for name search
- `ordenes.folio` - Unique index for order lookup
- `ordenes.clienteId` - Foreign key index for client orders
- `ordenes.fechaIngreso` - Index for date range queries
- `equipos.imei` - Unique index for device identification
- `refacciones.stockActual` - Index for inventory queries

### Relations

Key relationships:
- Cliente → Órdenes (1:N)
- Cliente → Equipos (1:N)
- Orden → Refacciones (N:M through OrdenRefaccion)
- Orden → HistorialEstadoOrden (1:N)
- User → Órdenes (1:N as técnico)

### Cascade Deletes

- Deleting a Cliente cascades to their Equipos
- Deleting an Orden cascades to its HistorialEstadoOrden and OrdenRefaccion entries
- Deleting a Venta cascades to its VentaItem entries

## Database Migrations

Migrations are stored in `prisma/migrations/`. Each migration is a timestamped directory containing:
- `migration.sql` - The SQL to apply the migration
- `README.md` - Human-readable description (optional)

To create a new migration after modifying the schema:
```bash
npx prisma migrate dev --name describe_your_changes
```

## Production Deployment

### Railway

1. Create a new PostgreSQL database in Railway
2. Copy the connection string
3. Set it as `DATABASE_URL` environment variable
4. Run migrations:
```bash
npx prisma migrate deploy
```

### Supabase

1. Create a new project in Supabase
2. Get the connection string from Settings → Database
3. Use the "Transaction" pooler connection string for migrations
4. Run migrations:
```bash
npx prisma migrate deploy
```

## Troubleshooting

### Migration conflicts
If you have migration conflicts:
```bash
npx prisma migrate reset
```

### Connection errors
- Check your DATABASE_URL is correct
- Ensure PostgreSQL is running
- Verify network connectivity
- Check firewall settings

### Schema drift
If your database is out of sync:
```bash
npx prisma db push
```

## Learn More

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

For issues or questions, please check the main project documentation or create an issue in the repository.

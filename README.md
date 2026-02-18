# En Su Presencia - Sistema de Contabilidad

Aplicación web moderna para la gestión de ingresos y gastos de una iglesia, construida con Next.js, TypeScript y Tailwind CSS.

## Características

- **Autenticación Segura**: Sistema de login con credenciales específicas
- **Dashboard Interactivo**: Vista en tiempo real de ingresos, gastos y balances
- **Registro de Cultos**: Formulario detallado para ofrendas y diezmos
- **Control de Gastos**: Registro de egresos con método de pago
- **Informes Semanales**: Análisis detallado por semanas del mes
- **Diseño Responsivo**: Interfaz moderna que funciona en todos los dispositivos
- **Base de Datos PostgreSQL**: Almacenamiento seguro y escalable

## Requisitos

- Node.js 18+
- Cuenta de Vercel para despliegue
- Base de datos PostgreSQL (Vercel Postgres recomendado)

## Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd ingresosygastosapp
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secreto-aqui
DATABASE_URL=tu-url-de-base-de-datos
```

4. Generar cliente Prisma:
```bash
npx prisma generate
```

5. Crear tablas en la base de datos:
```bash
npx prisma db push
```

6. Crear usuario inicial:
```bash
npx tsx seed.ts
```

7. Iniciar desarrollo:
```bash
npm run dev
```
## Funcionalidades

### Dashboard Principal
- Resumen de ingresos totales
- Control de gastos
- Balance neto
- Caja física (efectivo real)

### Registro de Cultos
- Ofrendas: billetes, monedas, tarjeta
- Diezmos: billetes, monedas, tarjeta
- Selección de día (Jueves, Sábado, Domingo, Especial)

### Control de Gastos
- Descripción detallada
- Monto y método de pago
- Clasificación automática

### Informes
- Desglose semanal administrativo
- Distribución de efectivo
- Movimientos bancarios/tarjeta

## Despliegue en Vercel

1. Conectar repositorio a Vercel
2. Configurar variables de entorno en Vercel
3. Configurar Vercel Postgres (recomendado)
4. Desplegar automáticamente

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/auth/[...nextauth]/    # Autenticación
│   ├── dashboard/                 # Panel principal
│   ├── login/                     # Página de login
│   └── layout.tsx                 # Layout principal
├── lib/
│   ├── auth.ts                    # Configuración NextAuth
│   └── prisma.ts                  # Cliente Prisma
├── types/
│   └── next-auth.d.ts             # Tipos NextAuth
prisma/
└── schema.prisma                  # Esquema de base de datos
```

## Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS, Lucide React Icons
- **Backend**: NextAuth.js, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Despliegue**: Vercel

## Notas

- La aplicación está optimizada para Vercel
- Usa Vercel Postgres como base de datos recomendada
- El sistema de autenticación es seguro con bcrypt
- Todos los datos se almacenan de forma persistente

## Contribuciones

1. Fork del proyecto
2. Crear rama de características
3. Hacer commit de cambios
4. Push a la rama
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

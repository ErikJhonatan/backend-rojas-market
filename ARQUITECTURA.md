# 🏗️ Arquitectura del Sistema MiniMarket - Backend API

## 📋 Información General

**Proyecto:** API REST para Sistema de Punto de Venta (POS)
**Tipo:** Backend API RESTful
**Framework:** Express.js 4.17.1 con Node.js
**Base de Datos:** MySQL con Sequelize ORM
**Autenticación:** JWT + Passport.js
**Despliegue:** Heroku Ready

---

## 🎯 Arquitectura General

El proyecto sigue una **arquitectura en capas (Layered Architecture)** con separación clara de responsabilidades y patrones de diseño MVC (Model-View-Controller).

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │   Routes    │  │ Middlewares  │  │    Controllers      │ │
│  │ (Endpoints) │  │ (Security)   │  │   (HTTP Logic)      │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    BUSINESS LAYER                           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │  Services   │  │   Schemas    │  │       Utils         │ │
│  │ (Business   │  │ (Validation) │  │   (Helpers)         │ │
│  │  Logic)     │  │              │  │                     │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                      DATA LAYER                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │   Models    │  │ Migrations   │  │      Seeders        │ │
│  │ (Sequelize) │  │   (Schema)   │  │   (Test Data)       │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE LAYER                      │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │   Database  │  │    Config    │  │      Security       │ │
│  │   (MySQL)   │  │ (Environment)│  │   (Auth/CORS)       │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Directorios

### 🌳 Árbol de Proyecto

```
proyecto-backend/
├── 🎯 index.js                    # Punto de entrada del servidor
├── 📦 package.json                # Dependencias y scripts
├── 🔧 Procfile                    # Configuración para Heroku
├── 🧪 Insomnia.json              # Colección de pruebas API
│
├── 📂 config/
│   └── config.js                  # Variables de entorno y configuración
│
├── 📂 db/
│   ├── config.js                  # Configuración de Sequelize
│   ├── 📂 migrations/             # Migraciones de base de datos
│   │   ├── 20250313013310-create-user.js
│   │   ├── 20250316203600-create-customers.js
│   │   ├── 20250409183115-products.js
│   │   ├── 20250414170833-order.js
│   │   ├── 20250414173138-order-product.js
│   │   └── 20250525051420-orders-modify.js
│   ├── 📂 models/                 # Modelos de Sequelize
│   │   ├── index.js               # Configuración central de modelos
│   │   ├── user.model.js          # Modelo de usuarios
│   │   ├── customer.model.js      # Modelo de clientes
│   │   ├── category.model.js      # Modelo de categorías
│   │   ├── product.model.js       # Modelo de productos
│   │   ├── order.model.js         # Modelo de órdenes
│   │   └── order.product.model.js # Modelo de relación orden-producto
│   └── 📂 seeders/                # Datos de prueba
│       ├── 20250201000001-users.js
│       ├── 20250201000002-categories.js
│       └── 20250201000003-products.js
│
├── 📂 libs/
│   └── sequalize.js               # Configuración de conexión a BD
│
├── 📂 middlewares/
│   ├── auth.handler.js            # Middleware de autenticación
│   ├── error.handler.js           # Manejo de errores
│   └── validator.handler.js       # Validación de datos
│
├── 📂 routes/
│   ├── index.js                   # Router principal
│   ├── auth.router.js             # Rutas de autenticación
│   ├── users.router.js            # Rutas de usuarios
│   ├── customers.router.js        # Rutas de clientes
│   ├── categories.router.js       # Rutas de categorías
│   ├── products.router.js         # Rutas de productos
│   └── orders.router.js           # Rutas de órdenes
│
├── 📂 schemas/
│   ├── user.schema.js             # Esquemas de validación para usuarios
│   ├── customer.schema.js         # Esquemas de validación para clientes
│   ├── category.schema.js         # Esquemas de validación para categorías
│   ├── product.schema.js          # Esquemas de validación para productos
│   └── order.schema.js            # Esquemas de validación para órdenes
│
├── 📂 services/
│   ├── user.service.js            # Lógica de negocio para usuarios
│   ├── customer.service.js        # Lógica de negocio para clientes
│   ├── category.service.js        # Lógica de negocio para categorías
│   ├── product.service.js         # Lógica de negocio para productos
│   └── order.service.js           # Lógica de negocio para órdenes
│
└── 📂 utils/
    └── auth/                      # Utilidades de autenticación
```

---

## 🔧 Tecnologías y Dependencias

### 📚 Dependencias Principales

```json
{
  "express": "^4.17.1", // Framework web
  "sequelize": "^6.37.6", // ORM para base de datos
  "mysql2": "^3.13.0", // Driver de MySQL
  "cors": "^2.8.5", // Manejo de CORS
  "joi": "^17.4.2", // Validación de datos
  "bcrypt": "^5.1.1", // Encriptación de contraseñas
  "jsonwebtoken": "^9.0.2", // Tokens JWT
  "passport": "^0.7.0", // Autenticación
  "passport-jwt": "^4.0.1", // Estrategia JWT para Passport
  "passport-local": "^1.0.1", // Estrategia local para Passport
  "@hapi/boom": "^9.1.4", // Manejo de errores HTTP
  "dotenv": "^16.4.7" // Variables de entorno
}
```

### 🛠️ Dependencias de Desarrollo

```json
{
  "nodemon": "^2.0.12", // Auto-restart del servidor
  "eslint": "^7.32.0", // Linter de código
  "prettier": "^2.3.2", // Formateador de código
  "sequelize-cli": "^6.6.2", // CLI para migraciones
  "@faker-js/faker": "^7.6.0" // Generación de datos falsos
}
```

---

## 🗄️ Modelo de Base de Datos

### 📊 Entidades Principales

```sql
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      USERS      │    │   CUSTOMERS     │    │   CATEGORIES    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ email           │    │ name            │    │ name            │
│ password        │    │ lastName        │    │ image           │
│ role            │    │ phone           │    │ createdAt       │
│ createdAt       │    │ createdAt       │    │ updatedAt       │
│ updatedAt       │    │ updatedAt       │    └─────────────────┘
└─────────────────┘    └─────────────────┘              │
                                                        │
┌─────────────────┐    ┌─────────────────┐              │
│    PRODUCTS     │    │     ORDERS      │              │
├─────────────────┤    ├─────────────────┤              │
│ id (PK)         │    │ id (PK)         │              │
│ name            │◄───┤ customerId (FK) │              │
│ price           │    │ createdAt       │              │
│ image           │    │ updatedAt       │              │
│ description     │    └─────────────────┘              │
│ categoryId (FK) │◄─────────────────────────────────────┘
│ createdAt       │           │
│ updatedAt       │           │
└─────────────────┘           │
         │                    │
         │    ┌─────────────────┐
         └────┤ ORDER_PRODUCTS  │
              ├─────────────────┤
              │ id (PK)         │
              │ orderId (FK)    │◄──┘
              │ productId (FK)  │
              │ amount          │
              │ createdAt       │
              │ updatedAt       │
              └─────────────────┘
```

### 🔗 Relaciones

- **Users**: No tiene relaciones directas (sistema de autenticación)
- **Customers → Orders**: Un cliente puede tener muchas órdenes (1:N)
- **Categories → Products**: Una categoría puede tener muchos productos (1:N)
- **Orders ↔ Products**: Relación muchos a muchos a través de `ORDER_PRODUCTS`

---

## 🛡️ Sistema de Autenticación

### 🔐 Estrategias de Passport

1. **Local Strategy**: Login con email/password
2. **JWT Strategy**: Autenticación basada en tokens

### 🎫 Flujo de Autenticación

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cliente   │    │   Middleware    │    │    Servicio     │
│             │    │    de Auth      │    │     de Auth     │
└─────────────┘    └─────────────────┘    └─────────────────┘
       │                     │                      │
       │ POST /auth/login    │                      │
       ├────────────────────►│                      │
       │                     │ validateData()       │
       │                     ├─────────────────────►│
       │                     │                      │
       │                     │ ◄─────────────────────┤
       │                     │                      │
       │                     │ authenticateUser()   │
       │                     ├─────────────────────►│
       │                     │                      │
       │                     │ JWT Token            │
       │ JWT Token           │ ◄─────────────────────┤
       │ ◄───────────────────┤                      │
```

---

## 🌐 API Endpoints

### 🔧 Rutas Principales

| Método         | Endpoint                 | Descripción          | Auth |
| -------------- | ------------------------ | -------------------- | ---- |
| **AUTH**       |
| POST           | `/api/v1/auth/login`     | Iniciar sesión       | ❌   |
| POST           | `/api/v1/auth/recovery`  | Recuperar contraseña | ❌   |
| **USUARIOS**   |
| GET            | `/api/v1/users`          | Listar usuarios      | ✅   |
| POST           | `/api/v1/users`          | Crear usuario        | ✅   |
| GET            | `/api/v1/users/:id`      | Obtener usuario      | ✅   |
| PATCH          | `/api/v1/users/:id`      | Actualizar usuario   | ✅   |
| DELETE         | `/api/v1/users/:id`      | Eliminar usuario     | ✅   |
| **CLIENTES**   |
| GET            | `/api/v1/customers`      | Listar clientes      | ✅   |
| POST           | `/api/v1/customers`      | Crear cliente        | ✅   |
| GET            | `/api/v1/customers/:id`  | Obtener cliente      | ✅   |
| PATCH          | `/api/v1/customers/:id`  | Actualizar cliente   | ✅   |
| DELETE         | `/api/v1/customers/:id`  | Eliminar cliente     | ✅   |
| **CATEGORÍAS** |
| GET            | `/api/v1/categories`     | Listar categorías    | ✅   |
| POST           | `/api/v1/categories`     | Crear categoría      | ✅   |
| GET            | `/api/v1/categories/:id` | Obtener categoría    | ✅   |
| PATCH          | `/api/v1/categories/:id` | Actualizar categoría | ✅   |
| DELETE         | `/api/v1/categories/:id` | Eliminar categoría   | ✅   |
| **PRODUCTOS**  |
| GET            | `/api/v1/products`       | Listar productos     | ✅   |
| POST           | `/api/v1/products`       | Crear producto       | ✅   |
| GET            | `/api/v1/products/:id`   | Obtener producto     | ✅   |
| PATCH          | `/api/v1/products/:id`   | Actualizar producto  | ✅   |
| DELETE         | `/api/v1/products/:id`   | Eliminar producto    | ✅   |
| **ÓRDENES**    |
| GET            | `/api/v1/orders`         | Listar órdenes       | ✅   |
| POST           | `/api/v1/orders`         | Crear orden          | ✅   |
| GET            | `/api/v1/orders/:id`     | Obtener orden        | ✅   |
| PATCH          | `/api/v1/orders/:id`     | Actualizar orden     | ✅   |
| DELETE         | `/api/v1/orders/:id`     | Eliminar orden       | ✅   |

---

## 🔄 Middlewares

### 🛡️ Middleware de Autenticación

```javascript
// auth.handler.js
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized());
  }
};

const checkJwt = passport.authenticate("jwt", { session: false });
```

### ⚠️ Middleware de Errores

```javascript
// error.handler.js
const logErrors = (err, req, res, next) => {
  console.log(err);
  next(err);
};

const boomErrorHandler = (err, req, res, next) => {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
};
```

### ✅ Middleware de Validación

```javascript
// validator.handler.js
const validatorHandler = (schema, property) => {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      next(boom.badRequest(error));
    }
    next();
  };
};
```

---

## 🔧 Configuración y Variables de Entorno

### 🌍 Variables de Entorno Requeridas

```bash
# Base de datos
DB_USER=usuario_db
DB_PASSWORD=password_db
DB_HOST=localhost
DB_NAME=nombre_db
DB_PORT=3306

# Autenticación
JWT_SECRET=clave_secreta_jwt
API_KEY=clave_api

# Configuración del servidor
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Ambiente
NODE_ENV=development
```

### ⚙️ Configuración por Ambiente

```javascript
// config/config.js
const config = {
  env: process.env.NODE_ENV || "dev",
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN,
};
```

---

## 🚀 Scripts de Desarrollo

### 📝 Scripts NPM

```json
{
  "dev": "nodemon index.js", // Desarrollo con auto-restart
  "start": "node index.js", // Producción
  "lint": "eslint", // Linter
  "migrations:generate": "sequelize-cli migration:generate --name",
  "migrations:run": "sequelize-cli db:migrate",
  "migrations:revert": "sequelize-cli db:migrate:undo",
  "migrations:delete": "sequelize-cli db:migrate:undo:all",
  "seeders:generate": "sequelize-cli seed:generate --name",
  "seeders:run": "sequelize-cli db:seed:all",
  "seeders:run:one": "sequelize-cli db:seed --seed",
  "seeders:revert": "sequelize-cli db:seed:undo",
  "seeders:revert:all": "sequelize-cli db:seed:undo:all"
}
```

---

## 🏭 Despliegue y Producción

### ☁️ Heroku Configuration

```
# Procfile
web: node index.js

# Variables de entorno en Heroku
DB_USER=heroku_user
DB_PASSWORD=heroku_password
DB_HOST=heroku-host.amazonaws.com
DB_NAME=heroku_database
JWT_SECRET=production_secret
API_KEY=production_api_key
CORS_ORIGIN=https://tu-frontend.vercel.app
```

### 🔒 Configuración de Seguridad

```javascript
// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      config.corsOrigin,
      "https://cloud.erikjhonatan.dev",
      "http://localhost:5173",
      "http://localhost:3000",
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-API-Key",
  ],
};
```

---

## 🧪 Testing y Desarrollo

### 🔬 Herramientas de Testing

- **Insomnia**: Colección de pruebas API incluida (`Insomnia.json`)
- **Seeders**: Datos de prueba para desarrollo
- **Faker.js**: Generación de datos falsos para testing

### 📊 Monitoring y Logs

- Console logs para desarrollo
- Error handling con Boom
- Middleware de logging de errores

---

## 🔄 Flujo de Desarrollo

### 🌱 Flujo de Migraciones

```bash
# 1. Generar nueva migración
npm run migrations:generate create-new-table

# 2. Ejecutar migraciones
npm run migrations:run

# 3. Revertir si es necesario
npm run migrations:revert
```

### 🌾 Flujo de Seeders

```bash
# 1. Generar seeder
npm run seeders:generate seed-users

# 2. Ejecutar todos los seeders
npm run seeders:run

# 3. Ejecutar seeder específico
npm run seeders:run:one 20250201000001-users.js
```

---

## 📈 Mejoras Futuras

### 🎯 Roadmap Técnico

- [ ] **Caching**: Implementar Redis para mejorar performance
- [ ] **Testing**: Agregar tests unitarios e integración
- [ ] **Documentation**: API documentation con Swagger
- [ ] **Monitoring**: Implementar logging avanzado con Winston
- [ ] **Security**: Rate limiting y validaciones adicionales
- [ ] **Performance**: Optimización de queries y paginación
- [ ] **CI/CD**: Pipeline de despliegue automatizado

---

## 👥 Equipo y Mantenimiento

**Desarrollado por:** Erik Jhonatan
**Tecnologías:** Node.js, Express, MySQL, Sequelize
**Versión:** 1.0.0
**Última actualización:** Junio 2025

---

_Este documento describe la arquitectura del backend API para el sistema MiniMarket POS. Para información del frontend, consultar `sys_minimarket_pos/ARQUITECTURA.md`._

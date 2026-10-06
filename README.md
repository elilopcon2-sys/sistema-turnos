# Sistema de Turnos y Reservas

API REST para gestionar servicios y reservas, desarrollada con Node.js, Express, MongoDB Atlas y Mongoose.

El proyecto mantiene una arquitectura en capas e incorpora vistas renderizadas con Handlebars, actualización en tiempo real con Socket.io, validaciones con Zod, consultas avanzadas de servicios y relaciones entre colecciones mediante `populate()`.

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Zod
- Handlebars
- Socket.io
- dotenv
- JavaScript con módulos ES

## Arquitectura

La aplicación usa una arquitectura en capas:

```text
routes → middlewares → controllers → services → repositories → DAO → models → MongoDB
```

Responsabilidad de cada capa:

- **Routes:** define los endpoints y los conecta con middlewares y controllers.
- **Middlewares:** valida los datos de entrada antes de que lleguen a los controllers.
- **Controllers:** recibe la petición, usa los services y construye la respuesta HTTP o la vista.
- **Services:** contiene reglas de negocio.
- **Repositories:** conecta los services con los DAO.
- **DAO:** accede a MongoDB mediante Mongoose.
- **Models:** define los schemas de las colecciones.
- **Validations:** contiene los esquemas de validación con Zod.

## Estructura del proyecto

```text
src/
├── config/
│   ├── database.config.js
│   └── env.config.js
├── controllers/
│   ├── bookings.controller.js
│   ├── services.controller.js
│   └── views.controller.js
├── dao/
│   ├── models/
│   │   ├── booking.model.js
│   │   ├── message.model.js
│   │   └── service.model.js
│   ├── bookings.dao.js
│   └── services.dao.js
├── middlewares/
│   └── validate.middleware.js
├── repositories/
│   ├── bookings.repository.js
│   └── services.repository.js
├── routes/
│   ├── bookings.router.js
│   ├── services.router.js
│   └── views.router.js
├── services/
│   ├── bookings.service.js
│   └── services.service.js
├── validations/
│   ├── booking.validation.js
│   └── service.validation.js
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── availability.handlebars
│   └── services.handlebars
├── app.js
└── server.js

public/
├── css/
│   └── styles.css
└── js/
    └── socket.js
```

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/elilopcon2-sys/sistema-turnos.git
cd sistema-turnos
```

Instala las dependencias:

```bash
npm install
```

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=TU_URI_DE_MONGODB_ATLAS
```

> No subas el archivo `.env` ni la carpeta `node_modules` al repositorio.

## Ejecución

```bash
npm start
```

El servidor se ejecuta en:

```text
http://localhost:8080
```

## API REST

La API continúa funcionando de forma independiente de las vistas.

## Servicios

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/services` | Obtiene servicios con filtros, paginación y ordenamiento. |
| GET | `/api/services/:sid` | Obtiene un servicio por ID. |
| POST | `/api/services` | Crea un servicio. |
| PUT | `/api/services/:sid` | Actualiza un servicio. |
| DELETE | `/api/services/:sid` | Elimina un servicio. |

### Consultas avanzadas de servicios

El endpoint:

```http
GET /api/services
```

acepta los siguientes query params:

- `category`
- `available`
- `page`
- `limit`
- `sortBy`
- `order`

### Filtrar por categoría

```http
GET /api/services?category=Belleza
```

### Filtrar por disponibilidad

```http
GET /api/services?available=true
```

### Combinar filtros

```http
GET /api/services?category=Belleza&available=true
```

### Paginación

```http
GET /api/services?page=2&limit=5
```

La respuesta incluye metadatos de paginación:

```json
{
  "services": [],
  "pagination": {
    "total": 12,
    "page": 2,
    "limit": 5,
    "totalPages": 3,
    "hasPrevPage": true,
    "hasNextPage": true
  }
}
```

### Ordenamiento

Ordenar por precio ascendente:

```http
GET /api/services?sortBy=price&order=asc
```

Ordenar por precio descendente:

```http
GET /api/services?sortBy=price&order=desc
```

Los campos permitidos para ordenar son:

- `id`
- `name`
- `duration`
- `price`
- `category`
- `available`

### Consulta combinada

```http
GET /api/services?category=Belleza&available=true&page=1&limit=5&sortBy=price&order=asc
```

### Ejemplo para crear un servicio

```json
{
  "name": "Manicure",
  "description": "Servicio de manicure tradicional",
  "duration": 45,
  "price": 40000,
  "category": "Belleza",
  "available": true
}
```

## Validaciones con Zod

La API utiliza Zod como capa de validación antes de que los datos lleguen al controller y a MongoDB.

Se aplican validaciones en:

- creación de servicios
- actualización de servicios
- creación de reservas
- agregado de servicios a una reserva

Las validaciones se encuentran en:

```text
src/validations/
```

y se ejecutan mediante:

```text
src/middlewares/validate.middleware.js
```

Flujo de validación:

```text
Request
  ↓
Middleware de validación con Zod
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
DAO
  ↓
MongoDB
```

Si los datos son inválidos, el flujo se corta antes de llegar al controller y la API responde con:

```http
400 Bad Request
```

Ejemplo:

```json
{
  "status": "error",
  "message": "Datos inválidos",
  "errors": [
    {
      "field": "body.price",
      "message": "El precio no puede ser negativo"
    }
  ]
}
```

## Reservas

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crea una reserva. |
| GET | `/api/bookings/:bid` | Obtiene una reserva con los servicios asociados completos. |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva. |

### Ejemplo para crear una reserva

```json
{
  "clientName": "Cliente de prueba",
  "clientEmail": "cliente@example.com",
  "date": "2026-10-05",
  "time": "10:00",
  "status": "pending"
}
```

## Relación entre reservas y servicios

Las reservas no guardan el objeto completo del servicio.

Cada servicio asociado se almacena como una referencia a la colección `services`, junto con la cantidad:

```json
{
  "service": "ObjectId",
  "quantity": 2
}
```

En el modelo de reservas, `service` se define como un `ObjectId` de Mongoose con referencia al modelo `Service`.

Esto permite mantener una relación entre ambas colecciones sin duplicar la información del servicio dentro de la reserva.

## Consulta de reservas con populate

Para consultar una reserva junto con la información completa de los servicios asociados se utiliza:

```http
GET /api/bookings/:bid
```

Este endpoint utiliza `populate()` de Mongoose.

Ejemplo de respuesta:

```json
{
  "id": 1,
  "clientName": "Cliente de prueba",
  "clientEmail": "cliente@example.com",
  "date": "2026-10-05",
  "time": "10:00",
  "status": "pending",
  "services": [
    {
      "service": {
        "id": 2,
        "name": "Manicure",
        "description": "Servicio de manicure tradicional",
        "duration": 45,
        "price": 40000,
        "category": "Belleza",
        "available": true
      },
      "quantity": 2
    }
  ]
}
```

`populate()` se utiliza únicamente al consultar la reserva.

En MongoDB se mantiene almacenada la referencia `ObjectId`, no el objeto completo del servicio.

## Vistas con Handlebars

Handlebars permite renderizar HTML desde Express usando datos reales de MongoDB.

| Ruta | Descripción |
|---|---|
| GET `/views/services` | Muestra todos los servicios. |
| GET `/views/availability` | Muestra únicamente los servicios disponibles. |

Las vistas usan la misma arquitectura del proyecto:

```text
views.router → views.controller → services.service → repository → DAO → MongoDB
```

No hay servicios escritos manualmente en los archivos `.handlebars`: la información siempre proviene de la base de datos.

## Tiempo real con Socket.io

Socket.io permite actualizar la vista de disponibilidad sin recargar el navegador.

Flujo:

```text
POST /api/services
        ↓
services.controller crea el servicio
        ↓
Socket.io emite "service:created"
        ↓
public/js/socket.js recibe el evento
        ↓
/views/availability agrega el servicio automáticamente
```

La actualización ocurre solamente si el servicio creado tiene:

```json
{
  "available": true
}
```

## Prueba manual de Socket.io

1. Inicia el servidor con `npm start`.
2. Abre `http://localhost:8080/views/availability`.
3. Sin recargar esa página, crea un servicio disponible mediante `POST /api/services`.
4. El nuevo servicio debe aparecer automáticamente en la vista.

## Persistencia

MongoDB almacena las colecciones:

- `services`
- `bookings`
- `messages`

Cada servicio contiene:

```text
id, name, description, duration, price, category, available
```

Cada reserva contiene:

```text
id, clientName, clientEmail, date, time, status, services
```

Las reservas guardan los servicios asociados mediante referencias de MongoDB.

Cada elemento del arreglo `services` contiene:

```text
service: ObjectId
quantity: Number
```

## Seguridad

El proyecto incluye `.env.example` como referencia de configuración.

Nunca se deben publicar:

```text
.env
node_modules
credenciales reales de MongoDB Atlas
```

## Autora

Elizabeth Lopez Conde
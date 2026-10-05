# Sistema de Turnos y Reservas

API REST para gestionar servicios y reservas, desarrollada con Node.js, Express, MongoDB Atlas y Mongoose.

El proyecto mantiene una arquitectura en capas y agrega vistas renderizadas con Handlebars, además de una actualización en tiempo real con Socket.io cuando se crea un nuevo servicio disponible.

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Handlebars
- Socket.io
- dotenv
- JavaScript con módulos ES

## Arquitectura

La aplicación usa una arquitectura en capas:

```text
routes → controllers → services → repositories → DAO → models → MongoDB
```

Responsabilidad de cada capa:

- **Routes:** define los endpoints y los conecta con los controllers.
- **Controllers:** recibe la petición, usa los services y construye la respuesta HTTP o la vista.
- **Services:** contiene reglas de negocio y validaciones.
- **Repositories:** conecta los services con los DAO.
- **DAO:** accede a MongoDB mediante Mongoose.
- **Models:** define los schemas de las colecciones.

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

### Servicios

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/services` | Obtiene todos los servicios. |
| GET | `/api/services/:sid` | Obtiene un servicio por ID. |
| POST | `/api/services` | Crea un servicio. |
| PUT | `/api/services/:sid` | Actualiza un servicio. |
| DELETE | `/api/services/:sid` | Elimina un servicio. |

Filtros disponibles:

```text
GET /api/services?category=Belleza
GET /api/services?available=true
```

Ejemplo para crear un servicio:

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

### Reservas

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crea una reserva. |
| GET | `/api/bookings/:bid` | Obtiene una reserva por ID. |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva. |

Ejemplo para crear una reserva:

```json
{
  "clientName": "Cliente de prueba",
  "clientEmail": "cliente@example.com",
  "date": "2026-10-05",
  "time": "10:00",
  "status": "pending"
}
```

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

Las reservas guardan los servicios asociados mediante referencias de MongoDB. Cada elemento incluye el servicio y su cantidad.

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
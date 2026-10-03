# Sistema de Turnos y Reservas

API REST desarrollada con Node.js, Express, MongoDB Atlas y Mongoose. Permite gestionar servicios y reservas mediante una arquitectura en capas.

La aplicación conserva sus endpoints originales, pero la persistencia fue migrada desde archivos JSON hacia colecciones de MongoDB.

## Tecnologías

- Node.js
- Express
- JavaScript con módulos ESM
- MongoDB Atlas
- Mongoose
- dotenv

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/elilopcon2-sys/sistema-turnos.git
cd sistema-turnos
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=<URI_DE_CONEXION_DE_MONGODB_ATLAS>
```

También se incluye `.env.example` como referencia.

> No se debe subir el archivo `.env` ni la carpeta `node_modules` al repositorio.

## Ejecución

```bash
npm start
```

El servidor se ejecuta en:

```text
http://localhost:8080
```

Antes de iniciar Express, la aplicación intenta conectarse a MongoDB Atlas. Si la conexión falla, el servidor no inicia.

## Estructura

```text
src/
├── app.js
├── server.js
├── config/
│   ├── env.config.js
│   └── database.config.js
├── controllers/
│   ├── services.controller.js
│   └── bookings.controller.js
├── services/
│   ├── services.service.js
│   └── bookings.service.js
├── repositories/
│   ├── services.repository.js
│   └── bookings.repository.js
├── dao/
│   ├── services.dao.js
│   ├── bookings.dao.js
│   └── models/
│       ├── service.model.js
│       ├── booking.model.js
│       └── message.model.js
└── routes/
    ├── services.router.js
    └── bookings.router.js
```

## Arquitectura del proyecto

El proyecto utiliza una arquitectura en capas:

```text
router → controller → service → repository → DAO → MongoDB
```

Responsabilidad de cada capa:

- **Router:** define los endpoints y los conecta con los controllers.
- **Controller:** recibe `req`, llama al service y responde con `res`.
- **Service:** contiene reglas de negocio y validaciones.
- **Repository:** actúa como puente entre services y DAO.
- **DAO:** accede a MongoDB mediante Mongoose.
- **Models:** definen los schemas y colecciones de MongoDB.

## Persistencia con MongoDB

La aplicación usa MongoDB Atlas como base de datos.

Colecciones utilizadas:

- `services`
- `bookings`
- `messages`

Los modelos principales son:

- `ServiceModel`
- `BookingModel`
- `MessageModel`

Cada documento tiene un `_id` interno de MongoDB. Además, servicios y reservas conservan un campo `id` numérico para mantener el comportamiento original de la API.

## Relación entre reservas y servicios

Una reserva puede tener uno o varios servicios asociados.

En MongoDB, cada servicio dentro de una reserva se guarda como una referencia `ObjectId`:

```js
{
  service: ObjectId("..."),
  quantity: 1
}
```

Mongoose utiliza `populate()` para consultar la información relacionada cuando es necesaria.

La API mantiene IDs numéricos en sus rutas:

```text
POST /api/bookings/1/services/2
```

Internamente, el DAO convierte el ID numérico del servicio en su `ObjectId` antes de guardarlo en MongoDB.

## Servicios

Cada servicio contiene:

- `id`
- `name`
- `description`
- `duration`
- `price`
- `category`
- `available`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/services` | Consultar todos los servicios |
| GET | `/api/services/:sid` | Consultar un servicio |
| POST | `/api/services` | Crear un servicio |
| PUT | `/api/services/:sid` | Actualizar un servicio |
| DELETE | `/api/services/:sid` | Eliminar un servicio |

### Crear un servicio

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

El ID se genera automáticamente y no debe enviarse en el body.

### Actualizar un servicio

Se pueden enviar únicamente los campos que se desean modificar:

```json
{
  "price": 45000
}
```

### Filtros

```text
GET /api/services?category=Belleza
GET /api/services?available=true
```

## Reservas

Cada reserva contiene:

- `id`
- `clientName`
- `clientEmail`
- `date`
- `time`
- `status`
- `services`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crear una reserva |
| GET | `/api/bookings/:bid` | Consultar una reserva |
| POST | `/api/bookings/:bid/services/:sid` | Agregar un servicio a una reserva |

### Crear una reserva

```json
{
  "clientName": "Cliente de prueba",
  "clientEmail": "cliente@example.com",
  "date": "2026-10-03",
  "time": "10:00",
  "status": "pending"
}
```

La reserva recibe un ID automático y se crea con el arreglo `services` vacío.

### Agregar un servicio a una reserva

No se necesita body:

```text
POST /api/bookings/1/services/2
```

La respuesta mantiene este formato:

```json
{
  "service": 2,
  "quantity": 1
}
```

Si se agrega nuevamente el mismo servicio, aumenta `quantity` sin duplicar el elemento.

## Respuestas HTTP

- `200`: consulta, actualización, eliminación o incorporación de servicio realizada correctamente.
- `201`: servicio o reserva creado correctamente.
- `400`: IDs inválidos, datos faltantes o datos inválidos.
- `404`: servicio o reserva no encontrado.

## Pruebas manuales

Las peticiones pueden probarse con Postman.

Se verificó:

- Conexión exitosa con MongoDB Atlas.
- Creación y consulta de servicios.
- Creación y consulta de reservas.
- Agregar un servicio a una reserva.
- Incremento de cantidad al agregar el mismo servicio nuevamente.
- Persistencia de datos después de reiniciar el servidor.
- Validación de campos obligatorios.
- Rechazo de servicios o reservas inexistentes.

## Seguridad

El proyecto incluye `.env.example` como plantilla de configuración.

Nunca se deben subir al repositorio:

```text
.env
node_modules
```

La URI de MongoDB Atlas se configura únicamente mediante la variable de entorno `MONGO_URI`.

## Autora

Elizabeth Lopez Conde
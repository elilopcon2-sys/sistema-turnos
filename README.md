# Sistema de Turnos y Reservas

API REST desarrollada con Node.js, Express y FileSystem.
Permite gestionar servicios y reservas, con persistencia en archivos JSON.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/elilopcon2-sys/sistema-turnos.git
cd sistema-turnos
```

Instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
NODE_ENV=development
```

También se incluye `.env.example` como referencia.

## Ejecución

```bash
npm start
```

El servidor se ejecuta en `http://localhost:8080`.

## Estructura

```text
src/
├── app.js
├── server.js
├── config/
│   └── env.config.js
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
│   └── bookings.dao.js
├── routes/
│   ├── services.router.js
│   └── bookings.router.js
└── data/
    ├── services.json
    └── bookings.json
```
## Arquitectura del proyecto

El proyecto fue refactorizado utilizando una arquitectura en capas para separar responsabilidades y facilitar el mantenimiento y futuras migraciones de persistencia.

El flujo principal de la aplicación es:

router → controller → service → repository → DAO → archivo JSON

### Responsabilidad de cada capa

- **Router:** define los endpoints y los conecta con los controllers.
- **Controller:** recibe `req`, llama al service y responde con `res`.
- **Service:** contiene las reglas de negocio y validaciones.
- **Repository:** actúa como puente entre los services y los DAO.
- **DAO:** accede directamente a los archivos JSON y realiza operaciones de persistencia.
- **Data:** contiene los archivos `services.json` y `bookings.json`.

## Servicios

Cada servicio contiene:
`id`, `name`, `description`, `duration`, `price`, `category` y `available`.

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/services | Consultar todos los servicios |
| GET | /api/services/:sid | Consultar un servicio |
| POST | /api/services | Crear un servicio |
| PUT | /api/services/:sid | Actualizar un servicio |
| DELETE | /api/services/:sid | Eliminar un servicio |

Ejemplo de body para crear un servicio:

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
No se permite modificar el ID mediante PUT.

Validaciones:
- Nombre, descripción y categoría deben ser textos no vacíos.
- Duración debe ser un número mayor que cero.
- Precio debe ser un número igual o mayor que cero.
- Disponible debe ser un booleano: `true` o `false`.

PUT permite enviar únicamente los campos que se desean modificar:

```json
{
  "price": 45000
}
```

GET /api/services permite filtrar por categoría y disponibilidad:

```text
/api/services?category=Belleza
/api/services?available=true
```

## Reservas

Cada reserva contiene:
`id`, `clientName`, `clientEmail`, `date`, `time`, `status` y `services`.

| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/bookings | Crear una reserva |
| GET | /api/bookings/:bid | Consultar una reserva |
| POST | /api/bookings/:bid/services/:sid | Agregar un servicio a una reserva |

Ejemplo de body para crear una reserva:

```json
{
  "clientName": "Cliente de prueba",
  "clientEmail": "cliente@example.com",
  "date": "2026-09-28",
  "time": "10:00",
  "status": "pending"
}
```

Estos cinco campos son obligatorios. La reserva recibe un ID
automático y se crea con el array `services` vacío.

Para agregar un servicio, enviar una petición POST sin body a:

```text
/api/bookings/1/services/2
```

En este ejemplo, `1` es el ID de la reserva y `2` es el ID del
servicio. Ambos deben existir.

El servicio se guarda dentro de la reserva con esta estructura:

```json
{
  "service": 2,
  "quantity": 1
}
```

Si se agrega nuevamente el mismo servicio, aumenta `quantity`
sin duplicar el elemento del array.

## Persistencia

Los DAO utilizan `fs/promises` para leer y escribir:

- `src/data/services.json`
- `src/data/bookings.json`

Los cambios se guardan en estos archivos y se conservan al
reiniciar el servidor.

Si un archivo no existe, su lectura devuelve un array vacío.
Otros errores de lectura se propagan para evitar tratar los
datos dañados como una lista vacía.

## Respuestas HTTP

- `200`: consulta, actualización, eliminación o incorporación
  de un servicio a una reserva realizada correctamente.
- `201`: servicio o reserva creado.
- `400`: IDs inválidos, campos obligatorios ausentes, datos de
  servicio inválidos o body vacío al actualizar un servicio.
- `404`: servicio o reserva no encontrado.

## Pruebas manuales

Las peticiones pueden ejecutarse con Postman.

Se comprobaron:
- Creación y consulta de reservas.
- Incorporación de servicios e incremento de cantidades.
- Persistencia de reservas después de reiniciar el servidor.
- Rechazo de servicios y reservas inexistentes al agregar servicios.
- Rechazo de reservas sin campos obligatorios.
- Validación de precios negativos al crear y actualizar servicios.
- Generación automática y protección del ID de servicios.
- Eliminación de un servicio y consulta posterior con respuesta 404.

## Tecnologías

- Node.js
- Express
- JavaScript con módulos ESM
- FileSystem (`fs/promises`)
- dotenv

## Autora

Elizabeth Lopez Conde
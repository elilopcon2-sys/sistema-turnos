# Sistema de Turnos

Proyecto desarrollado en Node.js para gestionar los servicios de un sistema de turnos y reservas mediante una clase `ServiceManager`.

## Instalación

Para instalar el proyecto, primero clona el repositorio y entra en la carpeta del proyecto.

Luego instala las dependencias con:

```bash
npm install
```

## Variables de entorno

El proyecto utiliza variables de entorno para configurar el puerto de ejecución y el entorno de desarrollo.

Se debe crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=8080
NODE_ENV=development
```

El archivo `.env` no debe subirse al repositorio, ya que puede contener información de configuración privada.

También se incluye un archivo `.env.example` como referencia:

```env
PORT=
NODE_ENV=
```

Las variables de entorno son cargadas mediante `dotenv` y validadas al iniciar la aplicación.

## Ejecución

Para ejecutar la aplicación con Node.js:

```bash
npm start
node src/server.js
```

La aplicación valida las variables de entorno antes de continuar con su ejecución.

## Recurso `services`

El recurso `services` contiene los servicios disponibles en el sistema de turnos y reservas.

Cada servicio tiene la siguiente estructura:

```js
{
  id,
  name,
  description,
  duration,
  price,
  category,
  available
}
```

### Campos

* `id`: identificador único del servicio. Se genera automáticamente al agregar un nuevo servicio.
* `name`: nombre del servicio.
* `description`: descripción del servicio.
* `duration`: duración del servicio en minutos.
* `price`: precio del servicio.
* `category`: categoría a la que pertenece el servicio.
* `available`: indica si el servicio está disponible.

## ServiceManager

La clase `ServiceManager` se encarga de gestionar los servicios mediante operaciones CRUD:

* Crear servicios.
* Consultar servicios.
* Actualizar servicios.
* Eliminar servicios.

### `getServices()`

Devuelve todos los servicios registrados.

```js
serviceManager.getServices();
```

### `getServiceById(id)`

Busca un servicio utilizando su identificador.

```js
serviceManager.getServiceById(2);
```

Devuelve el servicio encontrado o `null` si no existe.

### `addService(serviceData)`

Agrega un nuevo servicio.

El `id` se genera automáticamente, por lo que no debe enviarse dentro de los datos del servicio.

```js
serviceManager.addService({
  name: "Pedicure",
  description: "Servicio de pedicure tradicional",
  duration: 50,
  price: 45000,
  category: "Belleza",
  available: true
});
```

El método valida que estén presentes los siguientes campos:

* `name`
* `description`
* `duration`
* `price`
* `category`
* `available`

Si falta alguno de los campos requeridos, el método devuelve `null`.

### `updateService(id, updatedData)`

Actualiza la información de un servicio existente.

El `id` se recibe como identificador del servicio y no puede ser modificado.

```js
serviceManager.updateService(2, {
  price: 45000
});
```

Si el servicio no existe, devuelve `null`.

### `deleteService(id)`

Elimina un servicio existente utilizando su identificador.

```js
serviceManager.deleteService(3);
```

Devuelve el servicio eliminado o `null` si no existe.

## Persistencia de datos

El proyecto utiliza el módulo `fs` de Node.js para guardar los cambios realizados sobre los servicios en el archivo:

```text
src/data/services.json
```

Los métodos `addService()`, `updateService()` y `deleteService()` guardan los cambios realizados en el archivo mediante el método `saveServices()`.

## Tecnologías utilizadas

* Node.js
* JavaScript
* ESM (ECMAScript Modules)
* dotenv
* Express
* File System (`fs`)
* JSON

## Estructura del proyecto

```text
sistema-turnos/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
│
└── src/
    ├── app.js
    ├── server.js
    │
    ├── config/
    │   └── env.config.js
    │
    ├── managers/
    │   └── ServiceManager.js
    │
    ├── routes/
    │   └── services.router.js
    │
    └── data/
        └── services.json
```

## Endpoints

- GET /api/services
- GET /api/services/:sid
- POST /api/services
- PUT /api/services/:sid
- DELETE /api/services/:sid

El endpoint GET /api/services acepta filtros por query params:

- ?category=Belleza
- ?available=true

## Autor

Elizabeth Lopez Conde

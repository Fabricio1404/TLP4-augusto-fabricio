# API de Empleados — Refactorización con SOLID

Alumno: Fabricio Augusto

La consigna original está en [CONSIGNAS.md](CONSIGNAS.md). El código de partida se puede ver en el primer commit de esta rama ("Proyecto base de la API de empleados").

## Problemas del diseño original

Todo estaba dentro de `src/server.ts`:

1. **Una sola parte con muchas responsabilidades:** el mismo archivo definía el esquema de Mongo, validaba los datos, calculaba el salario, hacía las consultas, definía las rutas y levantaba el servidor. Cualquier cambio (una validación, la base de datos, una ruta) obligaba a tocar ese archivo.
2. **La regla de negocio estaba atada a Express:** el cálculo del salario estaba dentro del handler del `POST`, así que no se podía reutilizar ni probar sin hacer una petición HTTP.
3. **Dependencia directa de MongoDB:** las rutas usaban el modelo `Employee` de Mongoose directamente. Para cambiar de base o probar sin base había que reescribir las rutas.
4. **Manejo de errores repetido:** cada ruta tenía su propio `try/catch` con el mismo `console.error` y la misma respuesta 500.

## Estructura nueva

```text
src/
├── models/Employee.model.ts             interfaces y esquema de Mongoose
├── repository/EmployeeRepository.ts     acceso a MongoDB (interfaz + implementación)
├── service/EmployeeService.ts           validaciones y cálculo del salario final
├── controllers/employee.controller.ts   lee la petición y arma la respuesta HTTP
├── routes/employees.routes.ts           asocia cada URL con su método del controller
├── errorHandler/
│   ├── HttpError.ts                     error con código HTTP (400, 404)
│   └── errorHandler.ts                  middleware que responde todos los errores
├── config/database.ts                   conexión a MongoDB
├── app.ts                               arma Express (middlewares, rutas, errores)
└── server.ts                            conecta las capas y levanta el servidor
```

Recorrido de una petición:

```text
Petición → routes → controller → service → repository → MongoDB
                                    ↓ (si algo falla)
                              errorHandler → respuesta de error
```

## Cómo se aplica SOLID

### S — Responsabilidad única
Cada archivo tiene un solo motivo para cambiar. Si cambia la fórmula del salario, se toca solo el service. Si cambia la base de datos, solo el repository. Si cambia una URL, solo las rutas.

### O — Abierto/Cerrado
Para agregar otra forma de guardar empleados (por ejemplo otra base de datos) se crea una clase nueva que implemente `EmployeeRepository`, sin modificar el service ni el controller. Lo mismo con los errores: un error nuevo se lanza como `HttpError` con su código y el `errorHandler` no cambia.

### L — Sustitución de Liskov
El service funciona con cualquier objeto que cumpla la interfaz `EmployeeRepository`. `MongoEmployeeRepository` se puede reemplazar por un repositorio en memoria y la API sigue funcionando igual. Así probé los endpoints sin tener MongoDB levantado.

### I — Segregación de interfaces
`CreateEmployeeData` tiene solo los datos que manda el cliente (`name`, `position`, `baseSalary`, `yearsOfService`). `finalSalary` está en `Employee` porque lo calcula el service y no lo ingresa el usuario. La interfaz del repositorio tiene solo los tres métodos que usa la API.

### D — Inversión de dependencias
`EmployeeService` depende de la interfaz `EmployeeRepository` y no de Mongoose. Las dependencias se crean en un solo lugar (`server.ts`) y se pasan por constructor:

```ts
const repository = new MongoEmployeeRepository();
const service = new EmployeeService(repository);
const controller = new EmployeeController(service);
const app = createApp(controller);
```

## Endpoints

El comportamiento es el mismo que en la versión original (mismos códigos de estado y mensajes).

| Método | Ruta | Respuesta |
|---|---|---|
| POST | `/employees` | 201 con el empleado creado, o 400 si faltan datos o son inválidos |
| GET | `/employees` | 200 con todos los empleados, los más nuevos primero |
| GET | `/employees/:id` | 200 con el empleado, o 404 si no existe |

Ejemplo de body para crear:

```json
{
  "name": "Juan",
  "position": "Developer",
  "baseSalary": 1000000,
  "yearsOfService": 5
}
```

Respuesta: el mismo empleado con `finalSalary: 1100000` (1.000.000 + 2% × 5 años).

## Cómo ejecutar

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

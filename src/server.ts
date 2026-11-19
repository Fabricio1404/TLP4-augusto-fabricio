// Punto de entrada de la API.
// Antes este archivo tenía TODO: esquema, validaciones, cálculo del salario, consultas y rutas.
// Ahora solo lee la configuración, conecta las capas entre sí y levanta el servidor.

import 'dotenv/config';
import { connectDatabase } from './config/database.js';
import { MongoEmployeeRepository } from './repository/EmployeeRepository.js';
import { EmployeeService } from './service/EmployeeService.js';
import { EmployeeController } from './controllers/employee.controller.js';
import { createApp } from './app.js';

const PORT = Number(process.env.PORT ?? 3000);
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/employees_db';

// Inyección de dependencias: cada capa recibe la que necesita por constructor
// Repository -> Service -> Controller -> Rutas
const repository = new MongoEmployeeRepository();
const service = new EmployeeService(repository);
const controller = new EmployeeController(service);
const app = createApp(controller);

connectDatabase(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('No se pudo conectar a MongoDB', error);
    process.exit(1);
  });

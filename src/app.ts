// Arma la aplicación de Express: middlewares, rutas y manejo de errores.
// No se conecta a la base ni levanta el servidor, eso lo hace server.ts.

import express, { type Express } from 'express';
import type { EmployeeController } from './controllers/employee.controller.js';
import { createEmployeeRoutes } from './routes/employees.routes.js';
import { errorHandler } from './errorHandler/errorHandler.js';

export function createApp(employeeController: EmployeeController): Express {
  const app = express();

  // permite leer el body de las peticiones en formato JSON
  app.use(express.json());

  app.use('/employees', createEmployeeRoutes(employeeController));

  // va al final para atrapar los errores de todas las rutas
  app.use(errorHandler);

  return app;
}

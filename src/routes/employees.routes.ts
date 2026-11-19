// ROUTES
// Solo dice qué método del controller atiende cada URL. No tiene lógica.

import { Router } from 'express';
import type { EmployeeController } from '../controllers/employee.controller.js';

// Recibe el controller ya armado, así las rutas no dependen de cómo se crea
export function createEmployeeRoutes(controller: EmployeeController): Router {
  const router = Router();

  router.post('/', controller.create);
  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);

  return router;
}

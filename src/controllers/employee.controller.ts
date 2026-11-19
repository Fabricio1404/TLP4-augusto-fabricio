// CONTROLLER
// Traduce entre HTTP y el service: lee lo que llega en la petición (body, params),
// llama al service y arma la respuesta con el código de estado correcto.

import type { Request, Response } from 'express';
import type { EmployeeService } from '../service/EmployeeService.js';

export class EmployeeController {
  private service: EmployeeService;

  constructor(service: EmployeeService) {
    this.service = service;
  }

  // Uso funciones flecha para que "this" siga apuntando al controller
  // cuando Express llama al método desde la ruta.
  // No hace falta try/catch: en Express 5, si una función async lanza un error,
  // Express lo manda solo al errorHandler.

  create = async (req: Request, res: Response) => {
    const employee = await this.service.createEmployee(req.body);
    res.status(201).json(employee);
  };

  getAll = async (_req: Request, res: Response) => {
    const employees = await this.service.getEmployees();
    res.json(employees);
  };

  getById = async (req: Request<{ id: string }>, res: Response) => {
    const employee = await this.service.getEmployeeById(req.params.id);
    res.json(employee);
  };
}

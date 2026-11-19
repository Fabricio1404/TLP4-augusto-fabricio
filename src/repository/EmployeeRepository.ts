// REPOSITORY
// Es la única parte de la app que sabe hablar con la base de datos.
// Si mañana cambiamos MongoDB por otra base, solo se toca este archivo.

import { EmployeeModel, type Employee } from '../models/Employee.model.js';

// Contrato que tiene que cumplir cualquier repositorio de empleados.
// El service depende de esta interfaz y no de MongoDB (inversión de dependencias),
// así se puede reemplazar por otro repositorio, por ejemplo uno en memoria para pruebas.
export interface EmployeeRepository {
  create(employee: Employee): Promise<Employee>;
  findAll(): Promise<Employee[]>;
  findById(id: string): Promise<Employee | null>;
}

export class MongoEmployeeRepository implements EmployeeRepository {
  async create(employee: Employee): Promise<Employee> {
    return EmployeeModel.create(employee);
  }

  // Igual que antes: los más nuevos primero
  async findAll(): Promise<Employee[]> {
    return EmployeeModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<Employee | null> {
    return EmployeeModel.findById(id);
  }
}

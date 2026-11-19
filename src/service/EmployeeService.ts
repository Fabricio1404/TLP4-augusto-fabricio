// SERVICE
// Lógica de negocio: valida los datos, calcula el salario final y coordina con el repositorio.
// No sabe nada de Express (req/res) ni de MongoDB, por eso se puede reutilizar y probar aparte.

import type { CreateEmployeeData, Employee } from '../models/Employee.model.js';
import type { EmployeeRepository } from '../repository/EmployeeRepository.js';
import { HttpError } from '../errorHandler/HttpError.js';

// Regla de negocio: 2% del salario base por cada año de antigüedad
const BONUS_PER_YEAR = 0.02;

export class EmployeeService {
  private repository: EmployeeRepository;

  // Recibe el repositorio desde afuera (inyección de dependencias) en vez de crearlo acá.
  // Depende de la interfaz EmployeeRepository, no de la clase concreta de MongoDB.
  constructor(repository: EmployeeRepository) {
    this.repository = repository;
  }

  // salario final = salario base + 2% del salario base por cada año de antigüedad
  calculateFinalSalary(baseSalary: number, yearsOfService: number): number {
    const bonus = baseSalary * BONUS_PER_YEAR * yearsOfService;
    return baseSalary + bonus;
  }

  async createEmployee(data: Partial<CreateEmployeeData>): Promise<Employee> {
    const { name, position, baseSalary, yearsOfService } = this.validate(data);

    const employee = await this.repository.create({
      name,
      position,
      baseSalary,
      yearsOfService,
      finalSalary: this.calculateFinalSalary(baseSalary, yearsOfService)
    });

    console.log(`Empleado creado: ${employee.name} - salario final: ${employee.finalSalary}`);
    return employee;
  }

  async getEmployees(): Promise<Employee[]> {
    return this.repository.findAll();
  }

  async getEmployeeById(id: string): Promise<Employee> {
    const employee = await this.repository.findById(id);

    if (!employee) {
      throw new HttpError(404, 'Empleado no encontrado');
    }

    return employee;
  }

  // Mismas validaciones y mensajes que tenía server.ts, en el mismo orden.
  // Si algo está mal lanza un HttpError 400 que después responde el errorHandler.
  private validate(data: Partial<CreateEmployeeData>): CreateEmployeeData {
    const { name, position, baseSalary, yearsOfService } = data ?? {};

    if (!name || !position) {
      throw new HttpError(400, 'Nombre y puesto son obligatorios');
    }

    if (typeof baseSalary !== 'number' || baseSalary <= 0) {
      throw new HttpError(400, 'El salario base debe ser mayor a 0');
    }

    if (
      typeof yearsOfService !== 'number' ||
      yearsOfService < 0 ||
      !Number.isInteger(yearsOfService)
    ) {
      throw new HttpError(400, 'La antigüedad debe ser un entero mayor o igual a 0');
    }

    return { name, position, baseSalary, yearsOfService };
  }
}

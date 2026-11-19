// MODELO
// Define cómo es un empleado: los tipos que usa el resto de la app y el esquema de MongoDB.
// Antes el esquema estaba mezclado en server.ts junto con las rutas y la conexión.

import { Schema, model } from 'mongoose';

// Datos que manda el cliente para crear un empleado.
// finalSalary NO está acá porque no lo ingresa el usuario: lo calcula el service.
export interface CreateEmployeeData {
  name: string;
  position: string;
  baseSalary: number;
  yearsOfService: number;
}

// Empleado completo, como se guarda en la base (con el salario final ya calculado)
export interface Employee extends CreateEmployeeData {
  finalSalary: number;
}

const employeeSchema = new Schema<Employee>(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    yearsOfService: { type: Number, required: true },
    finalSalary: { type: Number, required: true }
  },
  { timestamps: true } // agrega createdAt y updatedAt automáticamente
);

export const EmployeeModel = model<Employee>('Employee', employeeSchema);

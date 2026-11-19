// EJERCICIO 4 — POLIMORFISMO
// Polimorfismo = "muchas formas". Distintos objetos responden al mismo método (calcularSueldo)
// cada uno a su manera. Quien los usa no necesita saber de qué tipo es cada uno:
// le alcanza con saber que todos son Empleado y que todos saben calcular su sueldo.

// Reutilizo la jerarquía del ejercicio 3
import { Empleado, EmpleadoFijo } from "./ej3.ts";

export class EmpleadoPorHoras extends Empleado {
    private horasTrabajadas: number;
    private valorHora: number;

    constructor(nombre: string, antiguedad: number, horasTrabajadas: number, valorHora: number) {
        super(nombre, antiguedad);
        this.horasTrabajadas = horasTrabajadas;
        this.valorHora = valorHora;
    }

    // horas × valor hora, sin bono por antigüedad
    override calcularSueldo(): number {
        return this.horasTrabajadas * this.valorHora;
    }
}

export class EmpleadoPorComision extends Empleado {
    private ventasDelMes: number;
    private porcentajeComision: number; // por ejemplo 10 = 10%

    constructor(nombre: string, antiguedad: number, ventasDelMes: number, porcentajeComision: number) {
        super(nombre, antiguedad);
        this.ventasDelMes = ventasDelMes;
        this.porcentajeComision = porcentajeComision;
    }

    // ventas × porcentaje de comisión
    override calcularSueldo(): number {
        return this.ventasDelMes * (this.porcentajeComision / 100);
    }
}

// Función suelta (no es método de ninguna clase): suma lo que hay que pagarle a todos.
// Recibe Empleado[], así que le sirve cualquier subclase, incluso una que se cree más adelante.
export function calcularNomina(empleados: Empleado[]): number {
    let total = 0;
    for (const empleado of empleados) {
        total += empleado.calcularSueldo();
    }
    return total;
}

// ---------------- PRUEBA ----------------
console.log("=== Ejercicio 4: Polimorfismo ===");

// Un solo arreglo de tipo Empleado con los tres tipos mezclados
const empleados: Empleado[] = [
    new EmpleadoFijo("Juan", 3, 500000),              // 530000
    new EmpleadoPorHoras("Lucía", 1, 120, 3500),      // 420000
    new EmpleadoPorComision("Martín", 5, 4000000, 10), // 400000
    new EmpleadoFijo("María", 10, 800000),            // 960000
    new EmpleadoPorHoras("Pedro", 0, 80, 4000),       // 320000
];

// Recorro el arreglo sin preguntar de qué tipo es cada uno (no hay if ni instanceof).
// Cada objeto ejecuta SU versión de calcularSueldo().
for (const empleado of empleados) {
    console.log(`${empleado.describir()} -> calcularSueldo(): ${empleado.calcularSueldo()}`);
}

console.log("Total de la nómina: $" + calcularNomina(empleados)); // 2630000

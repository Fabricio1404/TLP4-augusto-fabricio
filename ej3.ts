// EJERCICIO 3 — HERENCIA
// La herencia permite crear una clase nueva a partir de otra que ya existe.
// La clase hija (subclase) recibe todos los atributos y métodos de la clase padre
// y puede agregar los suyos o cambiar (sobreescribir) los que necesite.

// Exporto las clases porque en el ejercicio 4 las vuelvo a usar
export class Empleado {
    // protected: igual que private (nadie de afuera lo puede tocar),
    // pero las clases hijas SÍ pueden usarlo
    protected nombre: string;
    protected antiguedad: number; // años trabajados

    constructor(nombre: string, antiguedad: number) {
        this.nombre = nombre;
        this.antiguedad = antiguedad;
    }

    // La clase base no sabe cómo se calcula el sueldo de cada tipo de empleado,
    // entonces devuelve 0 y cada subclase lo reemplaza con su propia fórmula
    calcularSueldo(): number {
        return 0;
    }

    // Este método NO se reescribe en las hijas. Cuando se ejecuta, this.calcularSueldo()
    // llama a la versión del objeto real (la de EmpleadoFijo, por ejemplo), no a la de Empleado.
    describir(): string {
        return `${this.nombre} (${this.antiguedad} años) — sueldo: $${this.calcularSueldo()}`;
    }
}

// extends: EmpleadoFijo hereda nombre, antiguedad, calcularSueldo y describir de Empleado
export class EmpleadoFijo extends Empleado {
    private sueldoBase: number;

    constructor(nombre: string, antiguedad: number, sueldoBase: number) {
        // super(...) llama al constructor de Empleado para que cargue nombre y antiguedad.
        // Es obligatorio y tiene que ir antes de usar this
        super(nombre, antiguedad);
        this.sueldoBase = sueldoBase;
    }

    // override: reemplaza el calcularSueldo() de la clase padre
    // sueldo = sueldoBase + 2% del sueldoBase por cada año de antigüedad
    override calcularSueldo(): number {
        const bono = this.sueldoBase * 0.02 * this.antiguedad;
        return this.sueldoBase + bono;
    }
}

// ---------------- PRUEBA ----------------
// import.meta.main es true solo cuando ejecuto este archivo directamente (npm run ej3).
// Así, cuando ej4.ts importa estas clases, esta prueba no se vuelve a ejecutar.
if (import.meta.main) {
    console.log("=== Ejercicio 3: Herencia ===");

    const generico = new Empleado("Ana", 2);
    console.log(generico.describir()); // sueldo 0, la clase base no sabe calcularlo

    const juan = new EmpleadoFijo("Juan", 3, 500000);
    console.log(juan.describir()); // 500000 + 6% = 530000

    const maria = new EmpleadoFijo("María", 10, 800000);
    console.log(maria.describir()); // 800000 + 20% = 960000

    // juan.nombre = "Pedro"; // no compila: nombre es protected
}

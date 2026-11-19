// EJERCICIO 5 — GETTERS Y SETTERS
// Un getter (get) y un setter (set) se usan como si fueran atributos (persona.edad = 20),
// pero por detrás ejecutan código. Sirven para validar un dato antes de guardarlo
// o para calcular un valor en el momento en que se lee.

class Persona {
    // private readonly: no se puede ver desde afuera y además no se puede cambiar nunca
    private readonly dni: string;

    // público y sin restricciones
    nombre: string;

    // Uso _edad y _email porque los nombres "edad" y "email" los ocupan el get y el set
    private _edad: number = 0;
    private _email: string = "";

    constructor(dni: string, nombre: string, edad: number, email: string) {
        this.dni = dni;
        this.nombre = nombre;
        // Asigno a través de los setters (sin el guion bajo) para que también se validen
        // los datos que llegan por el constructor
        this.edad = edad;
        this.email = email;
    }

    get edad(): number {
        return this._edad;
    }

    set edad(valor: number) {
        if (valor < 0) {
            throw new Error("La edad no puede ser negativa");
        }
        if (valor > 120) {
            throw new Error("La edad no puede ser mayor a 120");
        }
        this._edad = valor;
    }

    get email(): string {
        return this._email;
    }

    set email(valor: string) {
        if (!valor.includes("@")) {
            throw new Error(`El email "${valor}" no es válido, le falta el @`);
        }
        this._email = valor;
    }

    // getter de solo lectura (no tiene set): no se guarda, se calcula cada vez que se lee
    get esMayorDeEdad(): boolean {
        return this._edad >= 18;
    }

    // Solo muestra datos que no son sensibles: no incluye dni ni email
    get datosPublicos(): string {
        return `${this.nombre} — mayor de edad: ${this.esMayorDeEdad ? "sí" : "no"}`;
    }
}

// ---------------- PRUEBA ----------------
console.log("=== Ejercicio 5: Getters y setters ===");

const persona = new Persona("40123456", "Fabricio", 17, "fabri@correo.com");
console.log("Edad:", persona.edad);
console.log("Email:", persona.email);
console.log("¿Es mayor de edad?", persona.esMayorDeEdad); // false
console.log("Datos públicos:", persona.datosPublicos);

// Se usa como un atributo, pero en realidad está ejecutando el set edad()
persona.edad = 18;
console.log("Después de cumplir años:", persona.datosPublicos); // ahora sí es mayor

persona.nombre = "Fabri"; // nombre es público, se cambia sin restricciones
console.log("Nombre cambiado:", persona.datosPublicos);

try {
    persona.edad = -5;
} catch (error) {
    console.log("Error:", (error as Error).message);
}

try {
    persona.edad = 150;
} catch (error) {
    console.log("Error:", (error as Error).message);
}

try {
    persona.email = "fabri.correo.com";
} catch (error) {
    console.log("Error:", (error as Error).message);
}
console.log("Los valores siguen siendo válidos:", persona.edad, persona.email);

// También valida en el constructor
try {
    new Persona("30111222", "Error", 200, "error@correo.com");
} catch (error) {
    console.log("Error al crear la persona:", (error as Error).message);
}

// Estas líneas no compilan (por eso quedan comentadas):
// persona.dni;                 // dni es private
// persona.esMayorDeEdad = true; // solo tiene get, no se puede asignar

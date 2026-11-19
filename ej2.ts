// EJERCICIO 2 — PATRÓN FACTORY METHOD
// En vez de hacer "new Notebook(...)", "new Desktop(...)", etc. por todo el programa,
// le pedimos a una fábrica que cree el equipo según el tipo. Quien usa la fábrica no necesita
// conocer las clases concretas: siempre recibe un EquipoInformatico.

type TipoEquipo = "Notebook" | "Desktop" | "Servidor";

// Clase abstracta: no se puede instanciar, solo sirve de molde común.
// Declara detalles() como abstract, así cada subclase está OBLIGADA a implementarlo.
abstract class EquipoInformatico {
  protected nombre: string;
  protected ram: string;
  protected procesador: string;

  constructor(nombre: string, ram: string, procesador: string) {
    this.nombre = nombre;
    this.ram = ram;
    this.procesador = procesador;
  }

  abstract detalles(): string;
}

class Notebook extends EquipoInformatico {
  detalles(): string {
    return `Tipo: Notebook, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class Desktop extends EquipoInformatico {
  detalles(): string {
    return `Tipo: Desktop, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class Servidor extends EquipoInformatico {
  detalles(): string {
    return `Tipo: Servidor, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class EquipoFactory {
  // El método fábrica: según el tipo decide qué clase crear.
  // El tipo de retorno es siempre EquipoInformatico, sin importar cuál se construyó.
  crearEquipo(tipo: TipoEquipo, nombre: string, ram: string, procesador: string): EquipoInformatico {
    switch (tipo) {
      case "Notebook":
        return new Notebook(nombre, ram, procesador);
      case "Desktop":
        return new Desktop(nombre, ram, procesador);
      case "Servidor":
        return new Servidor(nombre, ram, procesador);
      default:
        // Por si llega un tipo que no existe (por ejemplo desde datos externos)
        throw new Error(`Tipo de equipo no soportado: ${tipo}`);
    }
  }
}

// ---------------- PRUEBA ----------------
console.log("=== Ejercicio 2: Factory Method ===");

const factory = new EquipoFactory();
const notebook = factory.crearEquipo("Notebook", "Dell XPS", "16GB", "i7");
console.log(notebook.detalles());
// Tipo: Notebook, Nombre: Dell XPS, RAM: 16GB, Procesador: i7

// Como todos son EquipoInformatico, se pueden guardar juntos y tratar igual
const equipos: EquipoInformatico[] = [
  notebook,
  factory.crearEquipo("Desktop", "Lenovo ThinkCentre", "8GB", "i5"),
  factory.crearEquipo("Servidor", "HP ProLiant", "64GB", "Xeon"),
];

for (const equipo of equipos) {
  console.log(equipo.detalles());
}

try {
  factory.crearEquipo("Tablet" as TipoEquipo, "Galaxy Tab", "4GB", "Exynos");
} catch (error) {
  console.log("Error:", (error as Error).message);
}

// new EquipoInformatico("x", "x", "x"); // no compila: es una clase abstracta

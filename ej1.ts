// EJERCICIO 1 — PATRÓN SINGLETON
// Garantiza que de una clase exista UNA SOLA instancia en todo el programa
// y da un punto de acceso global a ella.
// Sirve para el inventario porque toda la app tiene que trabajar sobre la misma lista de equipos:
// si cada parte creara su propio inventario, los equipos quedarían repartidos en varias listas.

interface Equipo {
  nombre: string;
  tipo: string;
  estado: string; // por ejemplo "disponible" o "en reparación"
}

class Inventario {
  // static: pertenece a la clase y no a cada objeto. Acá se guarda la única instancia.
  private static instancia: Inventario | undefined;

  private equipos: Equipo[] = [];

  // constructor private: desde afuera NO se puede hacer "new Inventario()".
  // La única forma de conseguir el inventario es con obtenerInstancia().
  private constructor() {}

  static obtenerInstancia(): Inventario {
    // La primera vez la crea; las siguientes devuelve la misma
    if (!Inventario.instancia) {
      Inventario.instancia = new Inventario();
    }
    return Inventario.instancia;
  }

  agregarEquipo(nombre: string, tipo: string, estado: string): void {
    this.equipos.push({ nombre, tipo, estado });
  }

  // Devuelvo una copia para que nadie modifique la lista interna desde afuera
  listarEquipos(): Equipo[] {
    return [...this.equipos];
  }
}

// ---------------- PRUEBA ----------------
console.log("=== Ejercicio 1: Singleton ===");

const inventario = Inventario.obtenerInstancia();
inventario.agregarEquipo("Notebook HP", "Portátil", "disponible");
console.log(inventario.listarEquipos());
// [{ nombre: "Notebook HP", tipo: "Portátil", estado: "disponible" }]

// Pido el inventario "otra vez" desde otra parte del programa
const otroInventario = Inventario.obtenerInstancia();
otroInventario.agregarEquipo("Impresora Epson", "Impresora", "en reparación");

console.log("¿Son el mismo objeto?", inventario === otroInventario); // true
console.log("El primero ve el equipo que agregó el segundo:", inventario.listarEquipos());

// const inventarioNuevo = new Inventario(); // no compila: el constructor es private

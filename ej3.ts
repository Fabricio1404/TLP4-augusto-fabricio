// EJERCICIO 3 — PATRÓN OBSERVER
// Un objeto (el "sujeto", acá el Equipo) mantiene una lista de observadores y les avisa
// automáticamente cuando algo cambia. Los observadores no tienen que estar preguntando
// todo el tiempo si el equipo cambió: el equipo les avisa solo.

// Contrato que cumple cualquier observador. Equipo depende de esta interfaz
// y no de Soporte, así se pueden sumar otros observadores sin modificar Equipo.
interface Observador {
  notificar(equipo: Equipo): void;
}

class Equipo {
  nombre: string;
  tipo: string;
  private estado: string;
  private observadores: Observador[] = [];

  constructor(nombre: string, tipo: string, estado: string) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.estado = estado;
  }

  obtenerEstado(): string {
    return this.estado;
  }

  agregarObservador(observador: Observador): void {
    this.observadores.push(observador);
  }

  quitarObservador(observador: Observador): void {
    this.observadores = this.observadores.filter((o) => o !== observador);
  }

  // El estado es private: la única forma de cambiarlo es con este método,
  // así nunca se cambia sin avisarles a los observadores
  cambiarEstado(nuevoEstado: string): void {
    this.estado = nuevoEstado;
    this.notificarObservadores();
  }

  private notificarObservadores(): void {
    for (const observador of this.observadores) {
      observador.notificar(this);
    }
  }
}

// Observador concreto: el departamento de soporte
class Soporte implements Observador {
  notificar(equipo: Equipo): void {
    console.log(`Soporte notificado: ${equipo.nombre} ha cambiado su estado a ${equipo.obtenerEstado()}.`);
  }
}

// Otro observador que agrego sin tocar la clase Equipo: guarda un registro de los cambios
class RegistroCambios implements Observador {
  private registros: string[] = [];

  notificar(equipo: Equipo): void {
    this.registros.push(`${equipo.nombre} (${equipo.tipo}) -> ${equipo.obtenerEstado()}`);
  }

  listar(): string[] {
    return [...this.registros];
  }
}

// ---------------- PRUEBA ----------------
console.log("=== Ejercicio 3: Observer ===");

const soporte = new Soporte();
const equipo = new Equipo("Notebook HP", "Portátil", "disponible");
equipo.agregarObservador(soporte);
equipo.cambiarEstado("en reparación");
// Soporte notificado: Notebook HP ha cambiado su estado a en reparación.

const registro = new RegistroCambios();
equipo.agregarObservador(registro);
equipo.cambiarEstado("disponible"); // ahora avisa a los dos observadores

equipo.quitarObservador(soporte);
equipo.cambiarEstado("dado de baja"); // soporte ya no recibe este aviso, el registro sí

console.log("Registro de cambios:", registro.listar());

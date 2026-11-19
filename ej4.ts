// EJERCICIO 4 — PATRÓN ADAPTER (ADAPTADOR)
// Permite usar una clase que tiene una interfaz distinta a la que espera el sistema,
// sin modificarla. El adaptador se pone "en el medio" y traduce las llamadas,
// como un adaptador de enchufe.

interface Equipo {
  nombre: string;
  tipo: string;
  estado: string;
}

// Contrato objetivo: lo que espera el sistema nuevo de cualquier inventario
interface Inventario {
  agregarEquipo(nombre: string, tipo: string, estado: string): void;
  listarEquipos(): Equipo[];
}

// ---------- Sistema viejo (supongamos que no lo podemos modificar) ----------
// Usa otros nombres: agregarItem en vez de agregarEquipo, y guarda los datos
// como descripcion / categoria / condicion en vez de nombre / tipo / estado.
interface ItemViejo {
  descripcion: string;
  categoria: string;
  condicion: string;
}

class InventarioViejo {
  private items: ItemViejo[] = [];

  agregarItem(item: ItemViejo): void {
    this.items.push(item);
  }

  obtenerItems(): ItemViejo[] {
    return [...this.items];
  }
}

// ---------- Adaptador ----------
// Implementa la interfaz nueva (Inventario) y por dentro usa el InventarioViejo
class AdaptadorInventario implements Inventario {
  private inventarioViejo: InventarioViejo;

  constructor(inventarioViejo: InventarioViejo) {
    this.inventarioViejo = inventarioViejo;
  }

  // Traduce la llamada nueva a la vieja: nombre -> descripcion, tipo -> categoria, estado -> condicion
  agregarEquipo(nombre: string, tipo: string, estado: string): void {
    this.inventarioViejo.agregarItem({ descripcion: nombre, categoria: tipo, condicion: estado });
  }

  // Y al revés: convierte los items viejos al formato Equipo que espera el sistema nuevo
  listarEquipos(): Equipo[] {
    return this.inventarioViejo.obtenerItems().map((item) => ({
      nombre: item.descripcion,
      tipo: item.categoria,
      estado: item.condicion,
    }));
  }
}

// Una función del sistema nuevo: solo conoce la interfaz Inventario
function mostrarDisponibles(inventario: Inventario): void {
  const disponibles = inventario.listarEquipos().filter((e) => e.estado === "disponible");
  console.log("Equipos disponibles:", disponibles.map((e) => e.nombre));
}

// ---------------- PRUEBA ----------------
console.log("=== Ejercicio 4: Adapter ===");

const inventarioViejo = new InventarioViejo();
const adaptador = new AdaptadorInventario(inventarioViejo);
adaptador.agregarEquipo("Servidor Dell", "Servidor", "disponible");
console.log(adaptador.listarEquipos());
// [{ nombre: "Servidor Dell", tipo: "Servidor", estado: "disponible" }]

adaptador.agregarEquipo("Switch Cisco", "Red", "en reparación");
adaptador.agregarEquipo("Notebook Lenovo", "Portátil", "disponible");

// El sistema nuevo usa el inventario viejo sin saberlo
mostrarDisponibles(adaptador);

// Por dentro, el inventario viejo sigue guardando todo con su propio formato
console.log("Cómo lo guarda el inventario viejo:", inventarioViejo.obtenerItems());

// EJERCICIO 1 — ABSTRACCIÓN
// Abstraer es quedarse solo con lo que importa del objeto real para el problema que queremos resolver.
// Para vender un producto me interesa su nombre, cuánto cuesta, de qué categoría es y cuántos hay.
// Cosas como el color del embalaje, el peso de la caja o el código de la fábrica existen en la realidad,
// pero al sistema de ventas no le sirven para nada, por eso no las pongo en la clase.

class Producto {
    // atributos: los datos que necesita cada producto
    nombre: string;
    precio: number;
    categoria: string;
    stock: number;

    // el constructor se ejecuta cuando hacemos "new Producto(...)" y carga los datos iniciales
    constructor(nombre: string, precio: number, categoria: string, stock: number) {
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
    }

    // devuelve un texto con toda la info del producto
    describir(): string {
        return `${this.nombre} (${this.categoria}): $${this.precio} — ${this.stock} unidades`;
    }

    // dice si alcanza el stock para vender esa cantidad sin quedar en negativo
    hayStock(cantidad: number): boolean {
        return cantidad <= this.stock;
    }

    // Decidí lanzar un Error en vez de mostrar un mensaje.
    // Si solo hago un console.log, el código que llamó a venderUnidades sigue como si la venta
    // se hubiera hecho (por ejemplo podría cobrarle al cliente igual). Con un Error el programa
    // se corta y quien llama está obligado a darse cuenta y manejarlo con un try/catch.
    venderUnidades(cantidad: number): void {
        if (!this.hayStock(cantidad)) {
            throw new Error(`No hay stock suficiente de ${this.nombre}: pediste ${cantidad} y quedan ${this.stock}`);
        }
        this.stock -= cantidad;
    }

    // calcula el precio con descuento pero NO cambia this.precio,
    // porque es solo una simulación (por ejemplo para mostrar "precio con promo")
    aplicarDescuento(porcentaje: number): number {
        const descuento = this.precio * (porcentaje / 100);
        return this.precio - descuento;
    }
}

// ---------------- PRUEBA ----------------
console.log("=== Ejercicio 1: Abstracción ===");

const teclado = new Producto("Teclado", 10000, "electrónica", 5);
const yerba = new Producto("Yerba 1kg", 4500, "almacén", 20);

console.log(teclado.describir());
console.log(yerba.describir());

console.log("¿Hay stock para vender 3 teclados?", teclado.hayStock(3)); // true
console.log("¿Hay stock para vender 8 teclados?", teclado.hayStock(8)); // false

teclado.venderUnidades(3);
console.log("Después de vender 3:", teclado.describir()); // quedan 2

console.log("Precio del teclado con 15% de descuento:", teclado.aplicarDescuento(15)); // 8500
console.log("El precio original no cambió:", teclado.precio); // 10000

try {
    teclado.venderUnidades(10); // no alcanza, tiene que tirar error
} catch (error) {
    console.log("Error al vender:", (error as Error).message);
}
console.log("El stock quedó igual:", teclado.describir()); // siguen 2

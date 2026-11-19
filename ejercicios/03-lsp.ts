// 3. LSP — Principio de Sustitución de Liskov
// Si una clase hija se usa en lugar de su clase padre, el programa tiene que seguir
// funcionando como se espera, sin sorpresas.

// ---------------- CÓDIGO ORIGINAL (lo dejo comentado para comparar) ----------------
// class Rectangle {
//   constructor(protected width: number, protected height: number) {}
//   setWidth(width: number): void { this.width = width; }
//   setHeight(height: number): void { this.height = height; }
//   area(): number { return this.width * this.height; }
// }
//
// class Square extends Rectangle {
//   setWidth(width: number): void { this.width = width; this.height = width; }
//   setHeight(height: number): void { this.width = height; this.height = height; }
// }
//
// function resizeRectangle(rectangle: Rectangle): void {
//   rectangle.setWidth(5);
//   rectangle.setHeight(10);
//   console.log(`Area esperada: 50. Area obtenida: ${rectangle.area()}`);
// }
//
// resizeRectangle(new Rectangle(1, 1)); // Area obtenida: 50
// resizeRectangle(new Square(1, 1));    // Area obtenida: 100  <- el cuadrado rompe la función

// ---------------- SOLUCIÓN ----------------

// Contrato común: lo único que comparten TODAS las figuras es que tienen un área.
// No pongo setWidth/setHeight acá porque no todas las figuras los pueden cumplir igual.
interface Shape {
  area(): number;
}

// Rectangle y Square ya no se heredan entre sí: cada una cumple Shape por separado
class Rectangle implements Shape {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  area(): number {
    return this.width * this.height;
  }
}

// El cuadrado tiene un solo lado, así que solo expone setSide.
// No promete poder cambiar ancho y alto por separado (porque no puede).
class Square implements Shape {
  private side: number;

  constructor(side: number) {
    this.side = side;
  }

  setSide(side: number): void {
    this.side = side;
  }

  area(): number {
    return this.side * this.side;
  }
}

// Ahora solo acepta Rectangle. Un Square ya no se puede pasar acá (TypeScript da error),
// así que la función nunca se lleva la sorpresa de antes.
function resizeRectangle(rectangle: Rectangle): void {
  rectangle.setWidth(5);
  rectangle.setHeight(10);
  console.log(`Area esperada: 50. Area obtenida: ${rectangle.area()}`);
}

// Esta función sí sirve para cualquier figura, porque solo usa lo que promete Shape
function printArea(shape: Shape): void {
  console.log(`Area: ${shape.area()}`);
}

// ---------------- PRUEBA ----------------
resizeRectangle(new Rectangle(1, 1)); // 50, como se esperaba
// resizeRectangle(new Square(1));    // no compila: Square no es un Rectangle

const square = new Square(1);
square.setSide(7);

const shapes: Shape[] = [new Rectangle(5, 10), square];
for (const shape of shapes) {
  printArea(shape); // 50 y 49: cada figura calcula bien su área
}

// ---------------- PREGUNTAS ----------------
// - ¿Por qué el área final no coincide con lo que espera resizeRectangle?
//   Porque Square cambia el comportamiento de los setters: setWidth(5) pone ancho y alto en 5,
//   y después setHeight(10) vuelve a poner los dos en 10. La función espera 5 × 10 = 50
//   y obtiene 10 × 10 = 100. Square no se puede usar en lugar de Rectangle sin romper la función.
//
// - ¿Es siempre correcto modelar un cuadrado como un rectángulo por herencia?
//   No. En matemática un cuadrado ES un rectángulo, pero en el código la herencia tiene que
//   respetar el COMPORTAMIENTO del padre. Un Rectangle promete que el ancho y el alto se
//   cambian por separado, y un cuadrado no puede cumplir esa promesa.
//
// - ¿Qué abstracción común podríamos usar?
//   Una interfaz Shape con el método area(), que es lo que todas las figuras pueden cumplir
//   sin sorpresas. Cada figura la implementa a su manera.

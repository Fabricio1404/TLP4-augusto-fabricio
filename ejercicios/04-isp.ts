// 4. ISP — Principio de Segregación de Interfaces
// Es mejor tener varias interfaces chicas que una grande que obligue a una clase
// a implementar métodos que no necesita.

// ---------------- CÓDIGO ORIGINAL (lo dejo comentado para comparar) ----------------
// interface MultifunctionPrinter {
//   print(document: string): void;
//   scan(document: string): void;
//   fax(document: string): void;
// }
//
// class SimplePrinter implements MultifunctionPrinter {
//   print(document: string): void { console.log(`Imprimiendo: ${document}`); }
//   scan(_document: string): void { throw new Error("Esta impresora no puede escanear"); }
//   fax(_document: string): void { throw new Error("Esta impresora no puede enviar fax"); }
// }

// ---------------- SOLUCIÓN ----------------
// Parto la interfaz grande en una por cada capacidad

interface Printer {
  print(document: string): void;
}

interface Scanner {
  scan(document: string): void;
}

interface Fax {
  fax(document: string): void;
}

// La impresora simple implementa solo lo que de verdad sabe hacer.
// Ya no tiene métodos que tiran error.
class SimplePrinter implements Printer {
  print(document: string): void {
    console.log(`Imprimiendo: ${document}`);
  }
}

// Una clase puede implementar varias interfaces chicas a la vez
class MultifunctionPrinter implements Printer, Scanner, Fax {
  print(document: string): void {
    console.log(`Imprimiendo: ${document}`);
  }

  scan(document: string): void {
    console.log(`Escaneando: ${document}`);
  }

  fax(document: string): void {
    console.log(`Enviando por fax: ${document}`);
  }
}

// Cada función pide solo la capacidad que usa
function printAll(printer: Printer, documents: string[]): void {
  for (const document of documents) {
    printer.print(document);
  }
}

function digitalize(scanner: Scanner, document: string): void {
  scanner.scan(document);
}

// ---------------- PRUEBA ----------------
new SimplePrinter().print("tarea.txt"); // mismo resultado que el original

const simple = new SimplePrinter();
const multifunction = new MultifunctionPrinter();

printAll(simple, ["informe.pdf", "notas.txt"]);
printAll(multifunction, ["contrato.pdf"]); // la multifunción también es Printer
digitalize(multifunction, "dni.jpg");
multifunction.fax("factura.pdf");

// digitalize(simple, "dni.jpg"); // no compila: SimplePrinter no es un Scanner.
// Antes esto compilaba y explotaba recién al ejecutarse.

// ---------------- PREGUNTAS ----------------
// - ¿Qué método no necesita SimplePrinter?
//   scan y fax. Solo sabe imprimir, pero la interfaz grande la obligaba a tener los tres.
//
// - ¿Qué problema causa implementar métodos que lanzan errores?
//   La clase dice que puede escanear y mandar fax (porque cumple la interfaz), pero es mentira.
//   TypeScript deja llamar a scan() sin avisar nada y el error aparece recién cuando el programa
//   está corriendo. Además, quien use la interfaz no puede confiar en ella y tendría que
//   preguntar de qué tipo de impresora se trata antes de usarla.
//
// - ¿Cómo separar las capacidades de una impresora?
//   En interfaces chicas: Printer, Scanner y Fax. Cada clase implementa solo las que puede
//   cumplir. Una impresora multifunción implementa las tres y una simple solo Printer.

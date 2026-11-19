// 2. OCP — Principio Abierto/Cerrado
// El código tiene que estar abierto para agregar cosas nuevas,
// pero cerrado para modificar lo que ya funciona.

// ---------------- CÓDIGO ORIGINAL (lo dejo comentado para comparar) ----------------
// type PaymentType = "card" | "cash";
//
// class PaymentProcessor {
//   pay(type: PaymentType, amount: number): void {
//     switch (type) {
//       case "card":
//         console.log(`Pagando $${amount} con tarjeta`);
//         break;
//       case "cash":
//         console.log(`Pagando $${amount} en efectivo`);
//         break;
//       default:
//         throw new Error("Medio de pago no soportado");
//     }
//   }
// }

// ---------------- SOLUCIÓN ----------------

// Contrato común: todo medio de pago sabe pagar un monto
interface PaymentMethod {
  pay(amount: number): void;
}

// Cada medio de pago es una clase separada que cumple el contrato
class CardPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} con tarjeta`);
  }
}

class CashPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} en efectivo`);
  }
}

// Medio de pago nuevo: se agrega con una clase nueva sin tocar PaymentProcessor
class TransferPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} con transferencia`);
  }
}

// Ya no tiene switch: recibe cualquier medio de pago y le delega el pago.
// Esta clase queda "cerrada": no hace falta modificarla nunca más para sumar medios de pago.
class PaymentProcessor {
  pay(method: PaymentMethod, amount: number): void {
    method.pay(amount);
  }
}

// ---------------- PRUEBA ----------------
const processor = new PaymentProcessor();
processor.pay(new CardPayment(), 100); // mismo resultado que el original
processor.pay(new CashPayment(), 250);
processor.pay(new TransferPayment(), 1200);

// ---------------- PREGUNTAS ----------------
// - ¿Qué parte debe modificarse para agregar pago con transferencia?
//   En el original hay que modificar dos lugares: el tipo PaymentType (agregar "transfer")
//   y el switch de PaymentProcessor (agregar otro case). O sea, cada medio de pago nuevo
//   obliga a abrir y cambiar una clase que ya funcionaba.
//
// - ¿Cómo podríamos representar un medio de pago?
//   Con una interfaz PaymentMethod que tenga el método pay(amount), y una clase por cada
//   medio de pago que la implemente (CardPayment, CashPayment, TransferPayment).
//
// - ¿Qué comportamiento común tienen todos los medios de pago?
//   Todos reciben un monto y lo pagan. Lo único que cambia es CÓMO lo pagan,
//   y eso queda adentro de cada clase.

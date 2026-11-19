type PaymentType = "card" | "cash";

class PaymentProcessor {
  pay(type: PaymentType, amount: number): void {
    switch (type) {
      case "card":
        console.log(`Pagando $${amount} con tarjeta`);
        break;
      case "cash":
        console.log(`Pagando $${amount} en efectivo`);
        break;
      default:
        throw new Error("Medio de pago no soportado");
    }
  }
}

new PaymentProcessor().pay("card", 100);

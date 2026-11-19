// 5. DIP — Principio de Inversión de Dependencias
// Las clases de alto nivel (la lógica del negocio) no tienen que depender de clases concretas
// de bajo nivel (cómo se manda un correo). Las dos tienen que depender de una abstracción.

// ---------------- CÓDIGO ORIGINAL (lo dejo comentado para comparar) ----------------
// class EmailSender {
//   send(to: string, message: string): void {
//     console.log(`Correo para ${to}: ${message}`);
//   }
// }
//
// class OrderService {
//   createOrder(customerEmail: string): void {
//     console.log("Pedido creado");
//     const emailSender = new EmailSender();   // <- crea la dependencia concreta adentro
//     emailSender.send(customerEmail, "Tu pedido fue creado");
//   }
// }

// ---------------- SOLUCIÓN ----------------

// La abstracción: cualquier cosa que sepa enviar un mensaje a alguien
interface Notifier {
  send(to: string, message: string): void;
}

// Implementaciones concretas (bajo nivel)
class EmailSender implements Notifier {
  send(to: string, message: string): void {
    console.log(`Correo para ${to}: ${message}`);
  }
}

class SmsSender implements Notifier {
  send(to: string, message: string): void {
    console.log(`SMS al ${to}: ${message}`);
  }
}

// Notificador "de mentira" para pruebas: no manda nada, solo guarda lo que le pidieron enviar
class FakeNotifier implements Notifier {
  sent: { to: string; message: string }[] = [];

  send(to: string, message: string): void {
    this.sent.push({ to, message });
  }
}

// Alto nivel: ya no hace new EmailSender(). Recibe un Notifier por el constructor
// y no sabe (ni le importa) si es un correo, un SMS o uno falso.
class OrderService {
  private notifier: Notifier;

  constructor(notifier: Notifier) {
    this.notifier = notifier;
  }

  createOrder(contact: string): void {
    console.log("Pedido creado");
    this.notifier.send(contact, "Tu pedido fue creado");
  }
}

// ---------------- PRUEBA ----------------
// La dependencia se elige y se crea desde afuera
new OrderService(new EmailSender()).createOrder("ana@example.com"); // mismo resultado que el original

new OrderService(new SmsSender()).createOrder("+54 370 4123456"); // cambiar a SMS sin tocar OrderService

// Prueba sin mandar ningún correo real
const fake = new FakeNotifier();
new OrderService(fake).createOrder("test@example.com");
console.log("Mensajes que se hubieran enviado:", fake.sent);

// ---------------- PREGUNTAS ----------------
// - ¿Qué dependencia concreta crea OrderService?
//   Crea un EmailSender adentro del método createOrder con new EmailSender().
//   Eso lo deja atado a los correos: para usar SMS hay que modificar OrderService.
//
// - ¿Cómo probarías la clase sin enviar un correo?
//   Pasándole por el constructor un notificador falso (FakeNotifier) que cumpla la interfaz
//   Notifier pero que en vez de enviar guarde los mensajes en un arreglo. Después reviso
//   ese arreglo para comprobar que se intentó avisar al cliente con el mensaje correcto.
//
// - ¿Qué contrato común podrían implementar el correo y el SMS?
//   La interfaz Notifier, con un método send(to, message). EmailSender y SmsSender la
//   implementan cada uno a su manera y OrderService solo conoce esa interfaz.

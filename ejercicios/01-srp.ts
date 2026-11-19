// 1. SRP — Principio de Responsabilidad Única
// Una clase tiene que tener un solo motivo para cambiar.

interface User {
  username: string;
  email: string;
}

// ---------------- CÓDIGO ORIGINAL (lo dejo comentado para comparar) ----------------
// class UserManager {
//   users: User[] = [];
//
//   register(username: string, email: string): string {
//     if (!email.includes("@")) {
//       throw new Error("El correo no es valido");
//     }
//
//     this.users.push({ username, email });
//     return this.sendWelcomeEmail(email);
//   }
//
//   private sendWelcomeEmail(email: string): string {
//     return `Email enviado a ${email}`;
//   }
// }

// ---------------- SOLUCIÓN ----------------
// Separo cada tarea que hacía UserManager en su propia clase.

// Solo valida los datos del usuario
class UserValidator {
  validate(user: User): void {
    if (!user.email.includes("@")) {
      throw new Error("El correo no es valido");
    }
  }
}

// Solo guarda y devuelve usuarios (por ahora en un arreglo, mañana podría ser una base de datos)
class UserRepository {
  private users: User[] = [];

  save(user: User): void {
    this.users.push(user);
  }

  findAll(): User[] {
    return [...this.users];
  }
}

// Solo se encarga de los correos
class EmailService {
  sendWelcomeEmail(email: string): string {
    return `Email enviado a ${email}`;
  }
}

// Coordina el registro usando las otras tres clases (composición).
// No valida, no guarda y no manda mails por su cuenta: le pide a cada clase que haga lo suyo.
class UserRegistrationService {
  private validator: UserValidator;
  private repository: UserRepository;
  private emailService: EmailService;

  constructor(validator: UserValidator, repository: UserRepository, emailService: EmailService) {
    this.validator = validator;
    this.repository = repository;
    this.emailService = emailService;
  }

  register(username: string, email: string): string {
    const user: User = { username, email };
    this.validator.validate(user);
    this.repository.save(user);
    return this.emailService.sendWelcomeEmail(email);
  }
}

// ---------------- PRUEBA ----------------
const repository = new UserRepository();
const registration = new UserRegistrationService(new UserValidator(), repository, new EmailService());

console.log(registration.register("fabri", "fabri@correo.com")); // mismo resultado que antes
console.log(registration.register("ana", "ana@correo.com"));
console.log("Usuarios guardados:", repository.findAll());

try {
  registration.register("sinarroba", "correo-invalido");
} catch (error) {
  console.log("Error:", (error as Error).message);
}

// ---------------- PREGUNTAS ----------------
// - ¿Qué responsabilidades tiene UserManager?
//   Tres distintas: valida el correo, guarda el usuario en la lista y manda el email de bienvenida.
//   Además coordina el orden en que pasan esas tres cosas.
//
// - ¿Qué ocurre si cambia la forma de guardar datos?
//   Hay que modificar UserManager, aunque el cambio no tenga nada que ver con validar ni con mandar
//   mails. Al tocar esa clase se puede romper otra parte que funcionaba. Con la solución
//   solo se cambia UserRepository.
//
// - ¿Qué clase podría encargarse de enviar correos?
//   EmailService, una clase que solo se ocupe de los correos. Si cambia el proveedor de mails
//   o el texto de bienvenida, se toca únicamente esa clase.

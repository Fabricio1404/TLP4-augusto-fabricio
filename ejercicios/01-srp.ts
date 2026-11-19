interface User {
  username: string;
  email: string;
}

class UserManager {
  users: User[] = [];

  register(username: string, email: string): string {
    if (!email.includes("@")) {
      throw new Error("El correo no es valido");
    }

    this.users.push({ username, email });
    return this.sendWelcomeEmail(email);
  }

  private sendWelcomeEmail(email: string): string {
    return `Email enviado a ${email}`;
  }
}

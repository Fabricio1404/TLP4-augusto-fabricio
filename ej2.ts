// EJERCICIO 2 — ENCAPSULAMIENTO
// Encapsular es esconder los datos internos de un objeto y dejar que se modifiquen
// solamente a través de sus métodos. Así la clase controla que nunca quede en un estado inválido
// (por ejemplo, un saldo negativo o un movimiento que no quedó registrado).

// Elegí guardar cada movimiento como un objeto con tipo y monto en vez de un string,
// porque así después se puede filtrar o sumar sin tener que "cortar" el texto.
interface Movimiento {
    tipo: "depósito" | "retiro";
    monto: number;
}

class CuentaBancaria {
    // readonly: se asigna en el constructor y después no se puede cambiar más
    readonly titular: string;

    // private: solo se puede usar desde adentro de la clase
    private saldo: number;
    private historial: Movimiento[] = [];

    constructor(titular: string, montoInicial: number) {
        this.titular = titular;
        this.saldo = montoInicial;
    }

    depositar(monto: number): void {
        if (monto <= 0) {
            throw new Error("El monto a depositar tiene que ser mayor a 0");
        }
        this.saldo += monto;
        this.historial.push({ tipo: "depósito", monto });
    }

    retirar(monto: number): void {
        if (monto <= 0) {
            throw new Error("El monto a retirar tiene que ser mayor a 0");
        }
        if (monto > this.saldo) {
            throw new Error(`Saldo insuficiente: querés retirar $${monto} y tenés $${this.saldo}`);
        }
        this.saldo -= monto;
        this.historial.push({ tipo: "retiro", monto });
    }

    consultarSaldo(): number {
        return this.saldo;
    }

    // Si devolviera this.historial directamente, quien lo reciba tendría el MISMO arreglo
    // (los arreglos se pasan por referencia) y podría hacerle push o borrar cosas.
    // Por eso devuelvo una copia: un arreglo nuevo con copias de cada movimiento.
    obtenerHistorial(): Movimiento[] {
        return this.historial.map((movimiento) => ({ ...movimiento }));
    }
}

// ---------------- PRUEBA ----------------
console.log("=== Ejercicio 2: Encapsulamiento ===");

const cuenta = new CuentaBancaria("Fabricio", 5000);
console.log(`Cuenta de ${cuenta.titular}, saldo inicial: $${cuenta.consultarSaldo()}`);

cuenta.depositar(2000);
cuenta.retirar(1500);
console.log("Saldo después de depositar 2000 y retirar 1500:", cuenta.consultarSaldo()); // 5500

try {
    cuenta.depositar(-100);
} catch (error) {
    console.log("Error:", (error as Error).message);
}

try {
    cuenta.retirar(0);
} catch (error) {
    console.log("Error:", (error as Error).message);
}

try {
    cuenta.retirar(100000);
} catch (error) {
    console.log("Error:", (error as Error).message);
}

// Intento "romper" el historial desde afuera modificando lo que me devolvió el método
const copia = cuenta.obtenerHistorial();
copia.push({ tipo: "depósito", monto: 999999 });
copia[0]!.monto = 0;
console.log("Copia modificada desde afuera:", copia);
console.log("Historial real de la cuenta (no cambió):", cuenta.obtenerHistorial());

// Estas líneas no compilan porque saldo e historial son private (por eso quedan comentadas):
// cuenta.saldo = 1000000;
// cuenta.historial = [];
// cuenta.titular = "Otro"; // titular es readonly

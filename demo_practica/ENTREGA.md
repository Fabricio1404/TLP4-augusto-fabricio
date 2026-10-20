# Entrega: Laboratorio de pruebas automatizadas en Express.js

**Taller de Lenguajes de Programación IV · Unidad 4**

**Alumno:** Fabricio Augusto

---

## 1. Preparación del entorno

- Node.js: v24.16.0
- npm: 11.13.0
- `npm install` ejecutado correctamente (se generó `package-lock.json`).

**Ajuste realizado:** la ruta de salud del proyecto se llamaba `/salud`, pero la guía indica `GET /healthy`. Se adaptó el proyecto a la guía cambiando la ruta en `src/app.ts`, la prueba en `tests/api.test.ts` y el `README.md`. Fue necesario cambiar también la prueba porque, de lo contrario, hubiera recibido un 404 y fallado.

## 2. Conocer la aplicación

Pruebas manuales realizadas con `Invoke-RestMethod` (PowerShell):

| Petición | Resultado |
| --- | --- |
| `GET /healthy` | `{"estado":"ok"}` |
| `POST /api/precios/calcular` con precio 1000 y descuento 10 | `{"total":900}` |
| `POST /api/precios/calcular` con precio 1000 y descuento 150 | `{"total":-500}` |

**¿Qué archivo contiene la regla de cálculo?**
`src/services/precios.ts`, en la función `calcularPrecioFinal`.

**¿Qué archivo define la ruta HTTP?**
`src/app.ts`, que define `GET /healthy` y `POST /api/precios/calcular`.

**¿En qué se diferencian sus responsabilidades?**
`precios.ts` solo realiza el cálculo y no sabe nada de HTTP. `app.ts` recibe la petición, le pide el cálculo al servicio y arma la respuesta (código 200 o 400). Al estar separados, cada parte puede probarse por su cuenta.

## 3 y 4. Ejecutar las pruebas e interpretar la falla

Primera ejecución de `npm test`: **4 pruebas pasan y 1 falla**. Falla `rechaza descuentos superiores al 100 %` con el mensaje `expected function to throw an error, but it didn't`.

**1. ¿Qué total devuelve actualmente un descuento del 150 % sobre $1.000?**
Devuelve -500, porque la función calcula sin controlar los datos: `1000 - (1000 × 150 / 100) = -500`.

**2. ¿Por qué ese resultado no cumple la regla de negocio?**
Porque un precio final no puede ser negativo: significaría que el negocio le paga al cliente. Un descuento válido debe estar entre 0 % y 100 %; con 150 % el sistema debería rechazar la operación.

**3. ¿Por qué la prueba falla si la función terminó de ejecutarse?**
Porque la prueba no comprueba que el programa no se rompa, sino que se comporte según el requisito. Esperaba que la función lanzara un `RangeError`, pero la función terminó normalmente y devolvió -500. Lo obtenido no coincide con lo esperado.

## 5. Corrección de la función

Se modificó solo `src/services/precios.ts`. Antes de calcular, la función valida los datos de entrada y lanza un `RangeError` si no son válidos:

```typescript
export function calcularPrecioFinal(precio: number, descuento: number): number {
  if (!Number.isFinite(precio) || precio < 0) {
    throw new RangeError('El precio debe ser un número mayor o igual a 0');
  }

  if (!Number.isFinite(descuento) || descuento < 0 || descuento > 100) {
    throw new RangeError('El descuento debe estar entre 0 y 100');
  }

  return precio - (precio * descuento) / 100;
}
```

- `Number.isFinite(...)` rechaza `NaN`, `Infinity`, textos y valores vacíos.
- `throw new RangeError(...)` interrumpe la función, por lo que nunca se calcula un total con datos inválidos.
- La fórmula original se conserva para las entradas válidas.

Resultado de `npm test` después de la corrección: **5 pruebas pasan (5)**.

## 6. Pruebas unitarias agregadas

Se agregaron en `tests/precios.test.ts`, dentro del `describe` existente:

| Entrada | Resultado esperado | Tipo de caso |
| --- | --- | --- |
| Precio 1000, descuento 100 % | Total 0 | Límite |
| Precio -100, descuento 10 % | Lanza `RangeError` | Inválido |
| Precio 1000, descuento -10 % | Lanza `RangeError` | Inválido |
| Precio `NaN`, descuento 10 % | Lanza `RangeError` | Desafío adicional |

```typescript
it('devuelve cero con un descuento del 100 %', () => {
  expect(calcularPrecioFinal(1000, 100)).toBe(0);
});

it('rechaza precios negativos', () => {
  expect(() => calcularPrecioFinal(-100, 10)).toThrow(RangeError);
});

it('rechaza descuentos negativos', () => {
  expect(() => calcularPrecioFinal(1000, -10)).toThrow(RangeError);
});

it('rechaza un precio que no es un número (NaN)', () => {
  expect(() => calcularPrecioFinal(NaN, 10)).toThrow(RangeError);
});
```

**Desafío adicional: ¿la validación actual rechaza `NaN`?**
Sí. `Number.isFinite(NaN)` devuelve `false`, así que la condición `!Number.isFinite(precio)` es verdadera y la función lanza un `RangeError`. Una validación que solo usara `precio < 0` no lo hubiera rechazado, porque cualquier comparación con `NaN` da `false`.

Resultado de `npm test`: **9 pruebas pasan (9)**: 7 unitarias y 2 de integración.

## 7. Prueba de integración HTTP

Se agregó en `tests/api.test.ts`, dentro de `describe('API de precios', ...)`:

```typescript
it('responde HTTP 400 ante un descuento inválido', async () => {
  const respuesta = await request(app)
    .post('/api/precios/calcular')
    .send({ precio: 1000, descuento: 150 });

  expect(respuesta.status).toBe(400);
  expect(respuesta.body).toHaveProperty('error');
});
```

Resultado de `npm test`: **10 pruebas pasan (10)**: 7 unitarias y 3 de integración.

**¿Por qué es una prueba de integración y no solamente unitaria?**
Porque no llama directamente a `calcularPrecioFinal`, sino que envía una petición HTTP real a la aplicación Express mediante Supertest. Para que la prueba pase deben funcionar juntas varias partes: Express recibe y convierte el JSON, la ruta `POST /api/precios/calcular` llama al servicio, el servicio lanza el `RangeError` y la ruta lo atrapa y lo convierte en una respuesta `400` con la propiedad `error`. Se comprueba la colaboración entre la capa HTTP y la lógica de negocio, no una función aislada.

## 8. Pruebas y verificación de tipos

`npm run typecheck` (`tsc --noEmit`) finalizó **sin errores**.

**¿Por qué conviene utilizar tanto `typecheck` como `npm test`?**
Porque detectan problemas distintos. `typecheck` analiza el código sin ejecutarlo y encuentra errores de tipos, por ejemplo pasar un texto donde se espera un número o llamar a una función que no existe. No sabe nada de las reglas de negocio. `npm test` ejecuta el código y comprueba comportamientos, por ejemplo que un descuento del 150 % sea rechazado, pero no revisa los tipos: Node ejecuta los `.ts` eliminando los tipos sin verificarlos. Un código puede tener los tipos correctos y calcular mal, o calcular bien en las pruebas y tener errores de tipos en otra parte. Usando las dos verificaciones se cubren ambas clases de problemas.

## 9. Integración continua (opcional)

El archivo `.github/workflows/pruebas.yml` define un flujo de GitHub Actions que se ejecuta en cada `push` y `pull_request`:

1. `actions/checkout@v4`: descarga el código del repositorio.
2. `actions/setup-node@v4` con Node 24: prepara Node.js.
3. `npm install`: instala las dependencias.
4. `npm run typecheck`: comprueba los tipos.
5. `npm test`: ejecuta las pruebas.

Si alguna prueba falla, el flujo se marca en rojo y se ve en la pestaña **Actions** del repositorio. Una vez versionado `package-lock.json`, conviene reemplazar `npm install` por `npm ci` para que las instalaciones sean reproducibles.

**Observación:** GitHub solo lee los workflows ubicados en `.github/workflows` en la raíz del repositorio. Para que funcione, `demo_practica` debe subirse como raíz de su propio repositorio, o el archivo debe moverse a la raíz.

## 10. Registro de resultados

| Comprobación | Resultado | Observación |
| --- | --- | --- |
| Respuesta de `GET /healthy` | `{"estado":"ok"}` | La API responde correctamente |
| Primera ejecución de `npm test` | 4 pasan, 1 falla | Falla "rechaza descuentos superiores al 100 %": esperaba `RangeError` y la función devolvió -500 |
| Corrección del servicio | 5 pasan, 0 fallan | Se agregaron validaciones con `RangeError` antes del cálculo |
| Nuevas pruebas unitarias | 9 pasan, 0 fallan | Se agregaron el límite de 100 %, precio negativo, descuento negativo y `NaN` |
| Prueba de integración HTTP 400 | 10 pasan, 0 fallan | Con descuento 150 % la API responde 400 y un JSON con `error` |
| Verificación `npm run typecheck` | Sin errores | `tsc --noEmit` analiza los tipos sin ejecutar ni generar archivos |

## 11. Preguntas de cierre

**1. ¿Qué diferencia hay entre comprobar manualmente una respuesta y ejecutar una prueba automatizada?**
En la comprobación manual una persona envía los datos, mira la respuesta y decide si es correcta; hay que repetirla a mano cada vez y depende de que la persona se acuerde de todos los casos. En la prueba automatizada la entrada y el resultado esperado quedan escritos en código: se ejecutan todas juntas con un comando, en segundos, siempre de la misma forma y pueden correr en CI. La prueba manual sigue siendo útil para explorar situaciones nuevas; la automatizada, para verificar lo ya conocido después de cada cambio.

**2. ¿Cuál fue la causa de la primera prueba fallida?**
La función `calcularPrecioFinal` no validaba los datos de entrada. Con un descuento del 150 % calculaba un total de -500 en lugar de lanzar el `RangeError` que exigía la regla de negocio. El defecto estaba en la implementación, no en la prueba.

**3. ¿Por qué es útil incluir casos inválidos además de los casos habituales?**
Porque los errores suelen aparecer en las entradas que nadie usa normalmente. Con los casos habituales (10 %, 0 %) el programa funcionaba bien, y el defecto solo apareció al probar 150 %. Los casos inválidos y límite (negativos, `NaN`, 100 %) comprueban que el sistema rechace lo que no debe aceptar y que los bordes de las validaciones estén bien puestos.

**4. ¿Qué parte del sistema comprueba `tests/precios.test.ts` y qué partes comprueba `tests/api.test.ts`?**
`tests/precios.test.ts` comprueba solo la función `calcularPrecioFinal` de `src/services/precios.ts`, de forma aislada (pruebas unitarias). `tests/api.test.ts` comprueba la aplicación Express de `src/app.ts` a través de HTTP: las rutas, la conversión del JSON, la llamada al servicio y los códigos de respuesta 200 y 400 (pruebas de integración).

**5. ¿Qué ventajas ofrece ejecutar las pruebas después de cada modificación?**
Permite detectar regresiones, es decir, cosas que antes funcionaban y se rompieron con el cambio, en el momento en que ocurren y cuando es más fácil saber qué las causó. En este laboratorio, al cambiar la ruta a `/healthy` y al agregar las validaciones, volver a correr las pruebas confirmó que el cálculo normal (10 % → 900) siguió funcionando. Da confianza para modificar el código sin miedo a romper algo sin darse cuenta.

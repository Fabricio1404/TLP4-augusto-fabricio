# Patrones de diseño — Sistema de Inventario de Equipos Informáticos

Alumno: Fabricio Augusto

| Archivo | Patrón | Qué resuelve |
|---|---|---|
| `ej1.ts` | Singleton | Una sola instancia de `Inventario` para toda la aplicación |
| `ej2.ts` | Factory Method | `EquipoFactory` crea `Notebook`, `Desktop` o `Servidor` y siempre devuelve un `EquipoInformatico` |
| `ej3.ts` | Observer | `Equipo` avisa a sus observadores (`Soporte`, `RegistroCambios`) cuando cambia de estado |
| `ej4.ts` | Adapter | `AdaptadorInventario` permite usar `InventarioViejo` donde el sistema espera un `Inventario` |

## Cómo ejecutarlo

Necesita Node 22.18 o superior (ejecuta los `.ts` directamente).

```bash
npm install
npm run ej1   # y así con ej2, ej3, ej4
npm run typecheck   # revisa los tipos con TypeScript
```

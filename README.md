# Taller de Lenguajes de Programación IV

**Alumno:** Fabricio Augusto

Este repositorio reúne los trabajos prácticos de la materia. **Cada actividad está en su propia rama**, que tiene solo los archivos de ese trabajo y su historial de commits.

## Actividades

| # | Actividad | Rama | Contenido |
|---|---|---|---|
| 1 | Los 4 pilares de la POO + getters y setters | [`poo-cuatro-pilares`](https://github.com/Fabricio1404/TLP4-augusto-fabricio/tree/poo-cuatro-pilares) | Abstracción, encapsulamiento, herencia, polimorfismo y getters/setters (`ej1.ts` a `ej5.ts`) |
| 2 | Práctica de SOLID | [`practica-solid`](https://github.com/Fabricio1404/TLP4-augusto-fabricio/tree/practica-solid) | Un ejercicio por principio (SRP, OCP, LSP, ISP, DIP) con las respuestas a las preguntas |
| 3 | Patrones de diseño | [`patrones-diseno`](https://github.com/Fabricio1404/TLP4-augusto-fabricio/tree/patrones-diseno) | Inventario de equipos con Singleton, Factory Method, Observer y Adapter |
| 4 | Calidad y pruebas (introducción a testing) | [`laboratorio-testing`](https://github.com/Fabricio1404/TLP4-augusto-fabricio/tree/laboratorio-testing) | Pruebas unitarias y de integración con Vitest y Supertest |
| 5 | API de empleados (refactorización de servidor Express) | [`refactorizacion-express`](https://github.com/Fabricio1404/TLP4-augusto-fabricio/tree/refactorizacion-express) | Separación en models, repository, service, controllers, routes y errorHandler aplicando SOLID |

Cada rama tiene su propio `README.md` con la explicación del trabajo y cómo ejecutarlo.

## Cómo ver una actividad

Desde GitHub: elegir la rama en el selector de ramas o usar los enlaces de la tabla.

Desde la terminal:

```bash
git clone https://github.com/Fabricio1404/TLP4-augusto-fabricio.git
cd TLP4-augusto-fabricio
git checkout poo-cuatro-pilares   # o el nombre de la rama de la actividad
npm install
```

Los ejercicios en TypeScript se ejecutan directamente con Node (versión 22.18 o superior).

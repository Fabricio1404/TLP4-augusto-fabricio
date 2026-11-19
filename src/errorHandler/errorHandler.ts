// ERROR HANDLER
// Middleware de Express que recibe todos los errores de la app.
// Antes cada ruta tenía su propio try/catch repitiendo el mismo código del 500.

import type { NextFunction, Request, Response } from 'express';
import { HttpError } from './HttpError.js';

// Express lo reconoce como manejador de errores porque recibe 4 parámetros
export function errorHandler(error: unknown, _req: Request, res: Response, next: NextFunction) {
  // Errores esperados (datos inválidos, empleado inexistente): respondo con su código y mensaje
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  // Errores que genera el propio Express, por ejemplo un body con JSON mal escrito (400).
  // Antes no había errorHandler y Express los respondía solo, así que se los devuelvo
  // para que la API siga respondiendo igual que antes.
  if (isExpressError(error)) {
    return next(error);
  }

  // Cualquier otro error es inesperado: lo muestro en consola y respondo 500 como antes
  console.error(error);
  return res.status(500).json({ message: 'Error interno del servidor' });
}

// Los errores de Express (body-parser) traen un status 4xx
function isExpressError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('status' in error)) {
    return false;
  }
  const status = error.status;
  return typeof status === 'number' && status >= 400 && status < 500;
}

// ERROR HANDLER
// Middleware de Express que recibe todos los errores de la app.
// Antes cada ruta tenía su propio try/catch repitiendo el mismo código del 500.

import type { NextFunction, Request, Response } from 'express';
import { HttpError } from './HttpError.js';

// Express lo reconoce como manejador de errores porque recibe 4 parámetros
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Errores esperados (datos inválidos, empleado inexistente): respondo con su código y mensaje
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  // Cualquier otro error es inesperado: lo muestro en consola y respondo 500 como antes
  console.error(error);
  return res.status(500).json({ message: 'Error interno del servidor' });
}

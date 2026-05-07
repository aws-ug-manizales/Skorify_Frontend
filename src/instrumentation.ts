export const register = async () => {
  // Valida las variables de entorno al iniciar el servidor.
  // Si alguna falta o es inválida, el proceso falla con un mensaje claro
  // antes de aceptar cualquier petición.
  await import('@lib/env');
};

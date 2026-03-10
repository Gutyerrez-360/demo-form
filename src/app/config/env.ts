const env = {
  API_URL: import.meta.env.VITE_API_URL as string,
  API_PREFIJO_RUTA: import.meta.env.VITE_PREFIJO_RUTAS as string,
  API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT as number,
};

const requiredVars: (keyof typeof env)[] = [
  "API_URL",
  "API_PREFIJO_RUTA",
  "API_TIMEOUT",
];

requiredVars.forEach((key) => {
  if (!env[key]) {
    console.warn(`Variable de entorno faltante: VITE_${key}`);
  }
});

export default env;

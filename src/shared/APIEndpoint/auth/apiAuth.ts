const API_ROUTES_AUTH = {
  // Codigos de acceso
  AUTH: {
    LOGIN: (codigo: string) => `/access-codes/validate?codigo=${codigo}`,
  },
} as const;

export default API_ROUTES_AUTH;

const API_ROUTES = {
  // Formularios completos
  FORMULARIOS: {
    BASE: "/formularios",
    BY_ID: (id: string) => `/formularios/${id}`,
    SECCIONES: (id: string) => `/formularios/${id}/secciones`,
  },

  // Secciones independientes
  SECCIONES: {
    BASE: "/secciones",
    BY_ID: (id: string) => `/secciones/${id}`,
    GRUPOS: (id: string) => `/secciones/${id}/grupos`,
  },

  // Codigos de acceso
  AUTH: {
    LOGIN: (codigo: string) => `/access-codes/validate?codigo=${codigo}`,
  },
} as const;

export default API_ROUTES;

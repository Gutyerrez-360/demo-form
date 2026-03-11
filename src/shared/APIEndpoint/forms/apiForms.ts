const API_ROUTES_FORM = {
  // Formularios completos
  FORMULARIOS: {
    BASE: "/forms",
  },
  // Secciones independientes
  SECCIONES: {
    BASE: "/secciones",
    SECCIONES: (id: string) => `/sections?idFormulario=${id}`,
  },
  AUTH: {
    LOGIN: (codigo: string) => `/access-codes/validate?codigo=${codigo}`,
  },
} as const;

export default API_ROUTES_FORM;

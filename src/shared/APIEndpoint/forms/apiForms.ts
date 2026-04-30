const API_ROUTES_FORM = {
  // Formularios completos
  FORMULARIOS: {
    BASE: "/forms",
    GET_BY_ID: (id: string) => `/forms/${id}`,
  },
  // Secciones independientes
  SECCIONES: {
    BASE: "/secciones",
    SECCIONES: (id: string) => `/sections/${id}`,
    SECCIONES_BY_FORM_ID: (id: string) => `/sections?idFormulario=${id}`,
    CHECKOUT: (id: string) => `/sections/${id}/checkout`,
    SECCIONES_UPDATE_SECTION: (id: string) => `/sections/${id}`,
  },
} as const;

export default API_ROUTES_FORM;

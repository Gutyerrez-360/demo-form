import http from "../../../shared/services/httpClient";
import API_ROUTES_FORM from "../../../shared/APIEndpoint/forms/apiForms";

export const verificarCodigo = (codigo: string) => {
  return http.get<{ token: string }>(API_ROUTES_FORM.AUTH.LOGIN(codigo), {
    headers: {
      "X-Access-Code": codigo,
    },
  });
};

import http from "../../../shared/services/httpClient";
import API_ROUTES_AUTH from "../../../shared/APIEndpoint/auth/apiAuth";

export const verificarCodigo = (codigo: string) => {
  return http.get<{ token: string }>(API_ROUTES_AUTH.AUTH.LOGIN(codigo), {
    headers: {
      "X-Access-Code": codigo,
    },
  });
};

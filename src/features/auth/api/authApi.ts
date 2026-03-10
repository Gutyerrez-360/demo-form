import http from "../../../shared/services/httpClient";
import API_ROUTES from "../../forms/api/FormsApi";

export const verificarCodigo = (codigo: string) => {
  return http.get<{ token: string }>(API_ROUTES.AUTH.LOGIN(codigo), {
    headers: {
      "X-Access-Code": codigo,
    },
  });
};

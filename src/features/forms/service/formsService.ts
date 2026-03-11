import http from "../../../shared/services/httpClient";
import API_ROUTES_FORM from "../../../shared/APIEndpoint/forms/apiForms";

// types principales de las paginas
import type { ItemLista } from "../types/FormTypes";

// dto's
import type { FormularioRaw, SeccionRaw } from "./dto/response_dto";
import type { GetSeccionesRequest } from "./dto/request_dto";

// utils get item local storage
import { getAccessCode } from "../../../utils/localStorage";

export const getFormularios = async (): Promise<ItemLista[]> => {
  const codigo = getAccessCode();
  const data = await http.get<FormularioRaw[]>(
    API_ROUTES_FORM.FORMULARIOS.BASE,
    {
      headers: {
        "X-Access-Code": codigo,
      },
    },
  );

  return data.map((f) => ({
    id: String(f.idFormulario),
    nombre: f.nombre,
  }));
};

export const getSecciones = async ({
  formularioId,
}: GetSeccionesRequest): Promise<ItemLista[]> => {
  const codigo = getAccessCode();

  const data = await http.get<SeccionRaw[]>(
    API_ROUTES_FORM.SECCIONES.SECCIONES(formularioId),
    {
      headers: {
        "X-Access-Code": codigo,
      },
    },
  );

  return data.map((s) => ({
    id: String(s.idSeccion),
    nombre: s.nombre,
  }));
};

import http from "../../../shared/services/httpClient";
import API_ROUTES_FORM from "../../../shared/APIEndpoint/forms/apiForms";

// types principales de las paginas
import type { ItemLista, Pagina } from "../types/FormTypes";

// dto's
import type {
  FormularioRaw,
  SeccionRaw,
  FormJsonResponse,
} from "./dto/response_dto";
import type { GetSeccionesRequest, FormJsonRequest } from "./dto/request_dto";

// utils get item local storage
import { getAccessCode, removeBuilders } from "../../../utils/localStorage";
import { toast } from "../../../shared/components/notifications/toast";

// Obtiene catalogo de formularios
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

// Obtiene catalogo de secciones con base al id del formulario
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

export const obtenerFormularioPorId = async ({
  id,
}: FormJsonRequest): Promise<FormJsonResponse> => {
  const codigo = getAccessCode();
  const data = await http.get(API_ROUTES_FORM.FORMULARIOS.GET_BY_ID(id), {
    headers: {
      "X-Access-Code": codigo,
    },
  });

  return data as FormJsonResponse;
};

export async function guardarFormulario(jsonForm: Pagina): Promise<boolean> {
  const codigo = getAccessCode();

  if (!jsonForm) {
    toast.error("Error", "No hay datos del formulario.");
    return false;
  }

  const metadata = jsonForm;
  const body = {
    codigo: metadata.codigo,
    nombre: metadata.nombre,
    descripcion: metadata.descripcion,
    metadata,
  };

  try {
    await http.post(API_ROUTES_FORM.FORMULARIOS.BASE, body, {
      headers: {
        "Content-Type": "application/json",
        "X-Access-Code": codigo,
      },
    });

    toast.success(
      "Formulario guardado",
      "El formulario fue registrado correctamente.",
    );
    removeBuilders();
    return true;
  } catch (error: any) {
    const status = error?.response?.status ?? error?.status;

    if (status === 409) {
      toast.error(
        "Código duplicado",
        `Ya existe un formulario con el código "${jsonForm.codigo}".`,
      );
    } else {
      toast.error(
        "Error al guardar",
        "No se pudo procesar el formulario. Intenta nuevamente.",
      );
    }
    return false;
  }
}

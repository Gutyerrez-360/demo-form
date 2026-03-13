import http from "../../../shared/services/httpClient";
import API_ROUTES_FORM from "../../../shared/APIEndpoint/forms/apiForms";

// types principales de las paginas
import type { Pagina, ItemLista } from "../../../types/forms";

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
    API_ROUTES_FORM.SECCIONES.SECCIONES_BY_FORM_ID(formularioId),
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

export async function actualizarFormulario(
  id: string,
  jsonForm: Pagina,
): Promise<boolean> {
  const codigo = getAccessCode();

  if (!jsonForm) {
    toast.error("Error", "No hay datos del formulario.");
    return false;
  }

  const body = {
    codigo: jsonForm.codigo,
    nombre: jsonForm.nombre,
    descripcion: jsonForm.descripcion,
    metadata: jsonForm,
  };

  try {
    await http.put(`${API_ROUTES_FORM.FORMULARIOS.BASE}/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        "X-Access-Code": codigo,
      },
    });

    toast.success(
      "Formulario actualizado",
      "Los cambios fueron guardados correctamente.",
    );
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
        "Error al actualizar",
        "No se pudieron guardar los cambios. Intenta nuevamente.",
      );
    }
    return false;
  }
}

export async function obtenerSeccionPorId(sectionId: string): Promise<Pagina> {
  const codigo = getAccessCode();

  const data: FormJsonResponse = await http.get(
    `${API_ROUTES_FORM.SECCIONES.SECCIONES(sectionId)}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Access-Code": codigo,
      },
    },
  );

  return {
    ...data.metadata,
    codigo: data.codigo,
    nombre: data.nombre,
    descripcion: data.descripcion,
    secciones: (data.metadata?.secciones ?? []).map((sec: any) => ({
      ...sec,
      id: sec.id ?? crypto.randomUUID(),
      codigo: sec.codigo,
      nombre: sec.nombre,
      grupos: (sec.grupos ?? []).map((grupo: any) => ({
        ...grupo,
        id: grupo.id ?? crypto.randomUUID(),
        preguntas: (grupo.preguntas ?? []).map((pregunta: any) => ({
          ...pregunta,
          id: pregunta.id ?? crypto.randomUUID(),
        })),
      })),
    })),
  };
}

export async function checkoutSeccion(
  sectionId: string,
): Promise<{ disponible: boolean; mensaje?: string }> {
  const codigo = getAccessCode();

  try {
    await http.post(
      API_ROUTES_FORM.SECCIONES.CHECKOUT(sectionId),
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "X-Access-Code": codigo,
        },
      },
    );

    return { disponible: true };
  } catch (error: any) {
    const status = error?.response?.status ?? error?.status;
    if (status === 409) {
      return {
        disponible: false,
        mensaje:
          error?.response?.data?.message ?? "La sección ya está en edición.",
      };
    }
    throw error;
  }
}

export async function actualizarSeccion(
  sectionId: string,
  jsonForm: Pagina,
): Promise<boolean> {
  const codigo = getAccessCode();

  if (!jsonForm) {
    toast.error("Error", "No hay datos de la sección.");
    return false;
  }

  const body = {
    codigo: jsonForm.secciones[0].codigo,
    nombre: jsonForm.secciones[0].nombre,
    metadata: jsonForm.secciones[0],
    enEdicion: false,
  };
  try {
    await http.put(
      `${API_ROUTES_FORM.SECCIONES.SECCIONES_UPDATE_SECTION(sectionId)}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Access-Code": codigo,
        },
      },
    );

    toast.success(
      "Sección actualizada",
      "Los cambios fueron guardados correctamente.",
    );
    return true;
  } catch (error: any) {
    const status = error?.response?.status ?? error?.status;

    if (status === 409) {
      toast.error(
        "Código duplicado",
        `Ya existe una sección con el código "${jsonForm.codigo}".`,
      );
    } else {
      toast.error(
        "Error al actualizar",
        "No se pudieron guardar los cambios. Intenta nuevamente.",
      );
    }
    return false;
  }
}

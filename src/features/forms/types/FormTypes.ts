// Seccion de los type las paginas
export type ItemLista = { id: string; nombre: string; codigo?: string };

export type SubmitData =
  | { accion: "editar"; formulario: ItemLista }
  | { accion: "editar-seccion"; formulario: ItemLista; seccion: ItemLista };

export type SelectorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "formularios" | "secciones" | null;
  onSubmit: (data: SubmitData) => void;
};

export interface UserFormData {
  correo: string;
  nombre: string;
  cargo: string;
  codigo: string;
}

export type QuestionType =
  | "abierta"
  | "cerrada"
  | "opcion-multiple"
  | "tabular";

export interface OpcionMultiple {
  id: string;
  texto?: string;
}

export interface CeldaTabular {
  tipo: string;
  id: string;
  variable: string;
  columnaIndex?: number;
}

export interface FilaTabular {
  id: string;
  celdas: CeldaTabular[];
}

export interface PreguntaTabular {
  id: string;
  titulo: string;
  tipo: "tabular";
  codigoPregunta?: string;
  numFilas: number;
  numColumnas: number;
  encabezadoColumnas?: string[];
  filas: FilaTabular[];

  modo: "dinamico" | "estatico";
  codigo: string | "";
  repeticiones: number | 0;
}

export interface PreguntaAbierta {
  id: string;
  titulo: string;
  tipo: "abierta";
  codigoPregunta?: string;
  respuesta?: string;
}

export interface PreguntaCerrada {
  id: string;
  titulo: string;
  tipo: "cerrada";
  codigoPregunta?: string;
  respuesta?: "si" | "no";
}

export interface PreguntaOpcionMultiple {
  id: string;
  titulo: string;
  tipo: "opcion-multiple";
  codigoPregunta?: string;
  opciones: OpcionMultiple[];
  respuestaSeleccionada?: string;
}

export type Pregunta =
  | PreguntaAbierta
  | PreguntaCerrada
  | PreguntaOpcionMultiple
  | PreguntaTabular;

export interface Grupo {
  id: string;
  nombre: string;
  preguntas: Pregunta[];
}

export interface Seccion {
  id: string;
  nombre: string;
  grupos: Grupo[];
}

export interface Pagina {
  nombre: string;
  codigoPregunta?: string;
  secciones: Seccion[];
}

export type OpenGroups = {
  [seccionId: string]: {
    [grupoId: string]: boolean;
  };
};

export type OpenSections = { [id: string]: boolean };

// Modal especifico
export interface ModalActionsSeccionesProps {
  hayFormulario: boolean;
  haySeccion: boolean;
  onEditarSeccion: () => void;
}

export interface ModalActionsFormulariosProps {
  hayFormulario: boolean;
  onCrear: () => void;
  onEditar: () => void;
}

// sub-componente: solo el encabezado del modal
export interface ModalHeaderProps {
  mode: "formularios" | "secciones" | null;
  onClose: () => void;
}

// ======================================seccion de los servicios======================================
export interface FormularioRaw {
  idFormulario: number;
  codigo: string;
  nombre: string;
}

export interface SeccionRaw {
  idSeccion: number;
  nombre: string;
}

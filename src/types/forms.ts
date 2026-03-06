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
  descripcion?: string;
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
  descripcion?: string;
  respuesta?: string;
}

export interface PreguntaCerrada {
  id: string;
  titulo: string;
  tipo: "cerrada";
  descripcion?: string;
  respuesta?: "si" | "no";
}

export interface PreguntaOpcionMultiple {
  id: string;
  titulo: string;
  tipo: "opcion-multiple";
  descripcion?: string;
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
  descripcion?: string;
  secciones: Seccion[];
}

export type OpenGroups = {
  [seccionId: string]: {
    [grupoId: string]: boolean;
  };
};

export type OpenSections = { [id: string]: boolean };

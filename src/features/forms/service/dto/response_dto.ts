export interface FormularioRaw {
  idFormulario: number;
  codigo: string;
  nombre: string;
}

export interface SeccionRaw {
  idSeccion: number;
  nombre: string;
}

export interface FormJsonResponse {
  codigo: string;
  idFormulario: number;
  nombre: string;
  metadata: any;
  descripcion?: string;
}

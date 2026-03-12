import type { SubmitData } from "../../../types/forms";

// Modal especifico
export interface ModalActionsSeccionesProps {
  hayFormulario: boolean;
  haySeccion: boolean;
  onEditarSeccion: () => void;
}

export type SelectorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "formularios" | "secciones" | null;
  onSubmit: (data: SubmitData) => void;
};

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

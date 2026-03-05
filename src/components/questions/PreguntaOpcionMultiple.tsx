import { useState } from "react";
import type { PreguntaOpcionMultiple } from "../../types/forms";
import { Trash2, Plus, X } from "lucide-react";

//modal component
import ConfirmDeleteModal from "../notifications/ConfirmDeleteModal";

interface PreguntaOpcionMultipleProps {
  pregunta: PreguntaOpcionMultiple;
  onUpdate: (pregunta: PreguntaOpcionMultiple) => void;
  onDelete: () => void;
}

function PreguntaOpcionMultipleComp({
  pregunta,
  onUpdate,
  onDelete,
}: PreguntaOpcionMultipleProps) {
  const addOpcion = () => {
    onUpdate({
      ...pregunta,
      opciones: [...pregunta.opciones, { id: crypto.randomUUID(), texto: "" }],
    });
  };

  const updateOpcion = (id: string, texto: string) => {
    onUpdate({
      ...pregunta,
      opciones: pregunta.opciones.map((op: { id: string }) =>
        op.id === id ? { ...op, texto } : op,
      ),
    });
  };

  const removeOpcion = (id: string) => {
    onUpdate({
      ...pregunta,
      opciones: pregunta.opciones.filter((op) => op.id !== id),
    });
  };

  const [deleteConfig, setDeleteConfig] = useState<{
    isOpen: boolean;
    onConfirm: () => void;
    title: string;
    message: string;
  }>({
    isOpen: false,
    onConfirm: () => {},
    title: "",
    message: "",
  });

  const requestDelete = (
    title: string,
    message: string,
    onConfirm: () => void,
  ) => {
    setDeleteConfig({
      isOpen: true,
      onConfirm,
      title,
      message,
    });
  };

  return (
    <div className="p-6 bg-white border-2 border-purple-200 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={pregunta.titulo}
            onChange={(e) => onUpdate({ ...pregunta, titulo: e.target.value })}
            placeholder="Título de la pregunta"
            className="w-full text-lg font-bold text-gray-900 bg-transparent border-b-2 border-gray-200 focus:border-purple-500 outline-none pb-2 transition-colors"
          />
        </div>
      </div>

      <textarea
        value={pregunta.descripcion || ""}
        onChange={(e) => onUpdate({ ...pregunta, descripcion: e.target.value })}
        placeholder="Descripción opcional"
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none h-12 text-gray-700"
      />

      <div className="space-y-3 mb-4">
        <label className="text-sm font-semibold text-gray-700 block">
          Opciones:
        </label>
        {pregunta.opciones.map((opcion, index) => (
          <div key={opcion.id} className="flex gap-2 items-center">
            <span className="px-3 py-2 bg-gray-100 rounded text-sm font-medium text-gray-600 min-w-10">
              {index + 1}
            </span>
            <input
              type="text"
              value={opcion.texto}
              onChange={(e) => updateOpcion(opcion.id, e.target.value)}
              placeholder={`Opción ${index + 1}`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-700"
            />
            <button
              onClick={() => removeOpcion(opcion.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addOpcion}
        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium mb-4"
      >
        <Plus size={18} />
        Agregar Opción
      </button>

      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Respuesta seleccionada:
        </label>
        <select
          value={pregunta.respuestaSeleccionada || ""}
          onChange={(e) =>
            onUpdate({ ...pregunta, respuestaSeleccionada: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-700"
        >
          <option value="">Selecciona una opción...</option>
          {pregunta.opciones.map((opcion) => (
            <option key={opcion.id} value={opcion.texto}>
              {opcion.texto}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 flex items-center justify-between pt-4">
        <div className="mt-4 text-xs text-gray-500 font-medium">
          Tipo: Opción Múltiple
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            requestDelete(
              "Eliminar Pregunta",
              `Vas a eliminar la pregunta "${pregunta.titulo}". ¿Estás seguro?`,
              () => onDelete(),
            );
          }}
          className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-200 rounded-lg transition-colors ml-0 sm:ml-4 w-full sm:w-auto justify-center border-2 border-red-500 bg-red-100"
        >
          <Trash2 size={18} />
          Eliminar Pregunta
        </button>
      </div>
      <ConfirmDeleteModal
        isOpen={deleteConfig.isOpen}
        title={deleteConfig.title}
        message={deleteConfig.message}
        onClose={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
        onConfirm={deleteConfig.onConfirm}
      />
    </div>
  );
}

export default PreguntaOpcionMultipleComp;

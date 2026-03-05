import { useState } from "react";
import type { PreguntaAbierta } from "../../types/forms";
import { Trash2 } from "lucide-react";

//modal Component
import ConfirmDeleteModal from "../notifications/ConfirmDeleteModal";

interface PreguntaAbiertaProps {
  pregunta: PreguntaAbierta;
  onUpdate: (pregunta: PreguntaAbierta) => void;
  onDelete: () => void;
}

function PreguntaAbiert({
  pregunta,
  onUpdate,
  onDelete,
}: PreguntaAbiertaProps) {
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
    <div className="p-6 bg-white border-2 border-gray-200 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <label className="pt-0 font-bold">Titulo de la pregunta</label>
          <div className="pt-2">
            <textarea
              value={pregunta.titulo || ""}
              onChange={(e) =>
                onUpdate({ ...pregunta, titulo: e.target.value })
              }
              placeholder="Aqui ira la pregunta a realizar"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-12 text-gray-700"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 pt-0">
        <label className="pt-0 font-bold">Codificación de la pregunta</label>
        <textarea
          value={pregunta.descripcion || ""}
          onChange={(e) =>
            onUpdate({ ...pregunta, descripcion: e.target.value })
          }
          placeholder="Deberá colocar el codigo que representa a la pregunta o una descripción, Ej: PRG12_001 ó La finalidad de la pregunta..."
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-12 text-gray-700"
        />
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Respuesta:
        </label>
        <textarea
          value={pregunta.respuesta || ""}
          onChange={(e) => onUpdate({ ...pregunta, respuesta: e.target.value })}
          placeholder="Este sera un ejemplo de una posible respuesta de la pregunta realizada"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 text-gray-700"
        />
      </div>

      <div className="mt-2 flex items-center justify-between pt-4">
        <div className="mt-3 text-xs text-gray-500 font-medium">
          Tipo: Pregunta Abierta
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
          className="flex items-center gap-2 px-3 py-2 text-[#E91C1C] hover:bg-red-200 rounded-lg transition-colors ml-0 sm:ml-4 w-full sm:w-auto justify-center border-2 bg-[#FFCFCF]"
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

export default PreguntaAbiert;

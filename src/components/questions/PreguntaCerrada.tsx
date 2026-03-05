import { useState } from "react";
import type { PreguntaCerrada } from "../../types/forms";
import { Trash2 } from "lucide-react";

//modal Component
import ConfirmDeleteModal from "../notifications/ConfirmDeleteModal";

interface PreguntaCerradaProps {
  pregunta: PreguntaCerrada;
  onUpdate: (pregunta: PreguntaCerrada) => void;
  onDelete: () => void;
}

function PreguntaCerradaComp({
  pregunta,
  onUpdate,
  onDelete,
}: PreguntaCerradaProps) {
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
    <div className="p-6 bg-white border-2 border-green-200 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={pregunta.titulo}
            onChange={(e) => onUpdate({ ...pregunta, titulo: e.target.value })}
            placeholder="Título de la pregunta"
            className="w-full text-lg font-bold text-gray-900 bg-transparent border-b-2 border-gray-200 focus:border-green-500 outline-none pb-2 transition-colors"
          />
        </div>
      </div>

      <textarea
        value={pregunta.descripcion || ""}
        onChange={(e) => onUpdate({ ...pregunta, descripcion: e.target.value })}
        placeholder="Descripción opcional"
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none h-12 text-gray-700"
      />

      <div className="mt-6 flex flex-col items-center space-y-4">
        <label className="text-sm font-semibold text-gray-700 text-center">
          Respuesta:
        </label>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          {/* Sí */}
          <label
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all
              ${
                pregunta.respuesta === "si"
                  ? "bg-green-100 border-green-400"
                  : "bg-green-50 border-green-200 hover:bg-green-100"
              }`}
          >
            <input
              type="radio"
              name={`pregunta-${pregunta.id}`}
              value="si"
              checked={pregunta.respuesta === "si"}
              onChange={() =>
                onUpdate({
                  ...pregunta,
                  respuesta: "si",
                })
              }
              className="accent-green-600"
            />
            <span className="text-green-800 font-medium">Sí</span>
          </label>

          {/* No */}
          <label
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all
              ${
                pregunta.respuesta === "no"
                  ? "bg-red-100 border-red-400"
                  : "bg-red-50 border-red-200 hover:bg-red-100"
              }`}
          >
            <input
              type="radio"
              name={`pregunta-${pregunta.id}`}
              value="no"
              checked={pregunta.respuesta === "no"}
              onChange={() =>
                onUpdate({
                  ...pregunta,
                  respuesta: "no",
                })
              }
              className="accent-red-600"
            />
            <span className="text-red-800 font-medium">No</span>
          </label>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between pt-4">
        <div className="mt-4 text-xs text-gray-500 font-medium">
          Tipo: Pregunta Cerrada (Sí/No)
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

export default PreguntaCerradaComp;

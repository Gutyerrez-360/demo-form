import { useState } from "react";
import type { PreguntaAbierta } from "../../../../types/forms";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

//modal Component
import ConfirmDeleteModal from "../../../../shared/components/notifications/ConfirmDeleteModal";

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
  const [subpreguntasOpen, setSubpreguntasOpen] = useState(true);
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

  const handleAddSubpregunta = () => {
    const nuevas = [...(pregunta.subpreguntas ?? []), ""];
    onUpdate({ ...pregunta, subpreguntas: nuevas });
  };

  const handleUpdateSubpregunta = (index: number, value: string) => {
    const nuevas = [...(pregunta.subpreguntas ?? [])];
    nuevas[index] = value;
    onUpdate({ ...pregunta, subpreguntas: nuevas });
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
              placeholder="Escribe la pregunta que verán los participantes"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-12 text-gray-700"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 pt-0">
        <label className="pt-0 font-bold">Codificación de la pregunta</label>
        <textarea
          value={pregunta.codigoPregunta || ""}
          onChange={(e) =>
            onUpdate({ ...pregunta, codigoPregunta: e.target.value })
          }
          placeholder="Deberá colocar el codigo que representa a la pregunta o una descripción, Ej: PRG12_001 ó La finalidad de la pregunta..."
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-12 text-gray-700"
        />
      </div>

      {/* Subpreguntas */}
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        {/* Checkbox toggle */}
        <div className="flex items-center gap-3 mb-3">
          <input
            type="checkbox"
            id="incluir-subpreguntas"
            checked={pregunta.incluirSubpreguntas ?? false}
            onChange={(e) =>
              onUpdate({ ...pregunta, incluirSubpreguntas: e.target.checked })
            }
            className="w-4 h-4 accent-blue-600 cursor-pointer"
          />
          <label
            htmlFor="incluir-subpreguntas"
            className="font-medium cursor-pointer"
          >
            Incluir Subpreguntas
          </label>
        </div>

        {pregunta.incluirSubpreguntas && (
          <div>
            {/* Collapsible header */}
            <button
              type="button"
              onClick={() => setSubpreguntasOpen((prev) => !prev)}
              className="flex items-center gap-2 text-gray-500 text-sm mb-3"
            >
              <ChevronDown
                size={16}
                className={`transition-transform ${subpreguntasOpen ? "" : "-rotate-90"}`}
              />
              Subpreguntas
            </button>

            {subpreguntasOpen && (
              <div className="flex flex-col gap-3 pl-1">
                {(pregunta.subpreguntas ?? []).map((sub, i) => (
                  <div key={i}>
                    <label className="text-sm font-semibold text-gray-700">
                      Título de la subpregunta{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={sub}
                      onChange={(e) =>
                        handleUpdateSubpregunta(i, e.target.value)
                      }
                      placeholder={`Sub-pregunta ${i + 1}`}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddSubpregunta}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 w-fit mt-1"
                >
                  <Plus size={14} />
                  Agregar subpregunta
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Respuesta:
        </label>
        <textarea
          value={pregunta.respuesta || ""}
          onChange={(e) => onUpdate({ ...pregunta, respuesta: e.target.value })}
          placeholder="Escriba un ejemplo de cómo podría responder un participante"
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

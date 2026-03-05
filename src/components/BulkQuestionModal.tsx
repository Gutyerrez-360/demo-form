import { useState } from "react";
import { X, Type, CheckCircle2 } from "lucide-react";
import type { QuestionType } from "../types/forms";

interface BulkQuestionModalProps {
  onAdd: (type: QuestionType, count: number) => void;
  onClose: () => void;
}

function BulkQuestionModal({ onAdd, onClose }: BulkQuestionModalProps) {
  const [count, setCount] = useState(1);
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);

  const types: Array<{
    id: QuestionType;
    nombre: string;
    descripcion: string;
    icono: React.ReactNode;
  }> = [
    {
      id: "abierta",
      nombre: "Pregunta Abierta",
      descripcion: "Campo de texto libre para respuestas extensas",
      icono: <Type size={32} />,
    },
    {
      id: "cerrada",
      nombre: "Pregunta Cerrada",
      descripcion: "Respuesta Sí/No simple",
      icono: <CheckCircle2 size={32} />,
    },
  ];

  const handleAdd = () => {
    if (selectedType && count > 0) {
      onAdd(selectedType, count);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col">
        {/* Header con X sticky */}
        <div className="bg-[#FFFDFD] px-8 py-5 sticky top-0 z-20 flex justify-between items-center border-b border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-black">
              Agrega Múltiples Preguntas
            </h2>
            <p className="text-black-200 mt-2 text-lg">
              Elige el formato que mejor se ajuste a tu necesidad
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-all"
          >
            <X size={30} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Grid de tipos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {types?.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`group p-6 border-2 rounded-xl text-left transition-all duration-300 flex items-start gap-4
                  ${
                    selectedType === type.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-[#F4F5F7]"
                  } hover:border-blue-500 hover:bg-blue-50`}
              >
                <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                  {type.icono}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {type.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {type.descripcion}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Cantidad de preguntas */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Cantidad de preguntas:
            </label>
            <input
              type="number"
              min={1}
              max={50}
              onFocus={(e) => e.currentTarget.select()}
              onClick={(e) => e.currentTarget.select()}
              value={count === 0 ? "" : count}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                if (value > 50) {
                  alert("El número máximo permitido es 50");
                  setCount(50);
                } else {
                  setCount(Math.max(1, value));
                }
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-semibold text-lg"
            />
            <p className="text-xs text-gray-500 mt-2">
              Se agregarán {count} pregunta{count !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-start">
            <button
              onClick={handleAdd}
              disabled={!selectedType}
              className={`px-3 py-2 rounded-lg font-bold text-sm text-white transition-colors 
                ${selectedType ? "bg-[#0A0D12] hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"}`}
            >
              Agregar
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-gray-700 bg-[#F4F5F7] rounded-lg hover:bg-gray-200 transition-colors font-bold text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkQuestionModal;

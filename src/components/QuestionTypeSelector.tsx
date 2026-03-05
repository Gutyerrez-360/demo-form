import type { QuestionType } from "../types/forms";
import { Type, CheckCircle2, List, Grid3x3, X } from "lucide-react";

interface QuestionTypeSelectorProps {
  onSelect: (type: QuestionType) => void;
  onClose: () => void;
}

function QuestionTypeSelector({
  onSelect,
  onClose,
}: QuestionTypeSelectorProps) {
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
    {
      id: "opcion-multiple",
      nombre: "Opción Múltiple",
      descripcion: "Selecciona una de varias opciones",
      icono: <List size={32} />,
    },
    {
      id: "tabular",
      nombre: "Pregunta Tabular",
      descripcion: "Matriz de filas y columnas personalizables",
      icono: <Grid3x3 size={32} />,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-7 pt-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-all z-10"
        >
          <X size={30} />
        </button>
        <div className="bg-[#FFFDFD] px-8 py-5 sticky top-6">
          <h2 className="text-3xl font-bold text-black">
            Selecciona el tipo de pregunta
          </h2>
          <p className="text-black-200 mt-2 text-xl">
            Elige el formato que mejor se ajuste a tu necesidad
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 text-left bg-[#F4F5F7]"
            >
              <div className="flex items-start gap-4 mb-3 ">
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
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionTypeSelector;

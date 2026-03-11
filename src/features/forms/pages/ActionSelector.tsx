import { useState } from "react";
import { FileText, FilePen } from "lucide-react";
import SelectorModal from "../components/ModalSelector";
import type { SubmitData } from "../types/FormTypes";

// S — tipos y constantes locales
type Option = "formularios" | "secciones" | null;

interface ActionOption {
  value: "formularios" | "secciones";
  label: string;
  description: string;
  icon: React.ElementType;
  activeBorder: string;
}

const ACTION_OPTIONS: ActionOption[] = [
  {
    value: "formularios",
    label: "Administración de Formularios",
    description:
      "Permite crear y modificar la estructura general de los formularios.",
    icon: FileText,
    activeBorder: "border-gray-500",
  },
  {
    value: "secciones",
    label: "Administración de Contenido de Secciones",
    description:
      "Permite definir el contenido que tendrá cada sección del formulario.",
    icon: FilePen,
    activeBorder: "border-gray-800",
  },
];

// sub-componente con única responsabilidad: renderizar una opción
// agregar opciones sin modificar ActionOptionCard
interface ActionOptionCardProps {
  option: ActionOption;
  isSelected: boolean;
  onSelect: (value: "formularios" | "secciones") => void;
}

function ActionOptionCard({
  option,
  isSelected,
  onSelect,
}: ActionOptionCardProps) {
  const Icon = option.icon;

  return (
    <div
      onClick={() => onSelect(option.value)}
      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
        ${
          isSelected
            ? `${option.activeBorder} bg-[#F4F5F7]`
            : "border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
        }`}
    >
      <div
        className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors
          ${isSelected ? "bg-blue-100" : "bg-gray-200"}`}
      >
        <Icon
          size={20}
          className={isSelected ? "text-blue-500" : "text-gray-500"}
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{option.label}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-snug">
          {option.description}
        </p>
      </div>
    </div>
  );
}

// Página principal — solo orquesta estado y eventos
// depende de ActionOptionCard y SelectorModal como abstracciones
export default function ActionSelector() {
  const [selected, setSelected] = useState<Option>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleContinuar = () => {
    if (selected) setModalOpen(true);
  };

  const handleSubmit = (data: SubmitData) => {
    console.log("Submitted:", { mode: selected, ...data });
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef0f3] p-6">
      <div className="bg-white rounded-2xl p-10 w-full max-w-xl shadow-lg">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ¿Por dónde quieres empezar?
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Selecciona una opción para crear formularios o configurar las
          secciones con sus preguntas.
        </p>

        <hr className="my-6 border-gray-200" />

        {/* Opciones */}
        <div className="flex flex-col gap-3 mb-7">
          {ACTION_OPTIONS.map((option) => (
            <ActionOptionCard
              key={option.value}
              option={option}
              isSelected={selected === option.value}
              onSelect={setSelected}
            />
          ))}
        </div>

        {/* Botón continuar */}
        <button
          disabled={!selected}
          onClick={handleContinuar}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all
            ${
              selected
                ? "bg-gray-600 hover:bg-[#0A0D12] text-white shadow-md hover:shadow-lg"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
        >
          Continuar
        </button>
      </div>

      <SelectorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={selected}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

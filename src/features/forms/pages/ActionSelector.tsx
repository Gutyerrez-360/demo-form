import { useState } from "react";
import { FileText, FilePen } from "lucide-react";
import SelectorModal from "../components/ModalSelector";
import type { UserFormData } from "../types/FormTypes";

type Option = "formularios" | "secciones" | null;

export default function ActionSelector() {
  const [selected, setSelected] = useState<Option>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleContinuar = () => {
    if (selected) setModalOpen(true);
  };

  const handleSubmit = (data: UserFormData) => {
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

        {/* Options */}
        <div className="flex flex-col gap-3 mb-7">
          {/* Option 1 */}
          <div
            onClick={() => setSelected("formularios")}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
              ${
                selected === "formularios"
                  ? "border-gray-500 bg-[#F4F5F7]"
                  : "border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
              }`}
          >
            <div
              className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors
              ${selected === "formularios" ? "bg-blue-100" : "bg-gray-200"}`}
            >
              <FileText
                size={20}
                className={
                  selected === "formularios" ? "text-blue-500" : "text-gray-500"
                }
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Administración de Formularios
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                Permite crear y modificar la estructura general de los
                formularios.
              </p>
            </div>
          </div>

          {/* Option 2 */}
          <div
            onClick={() => setSelected("secciones")}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
              ${
                selected === "secciones"
                  ? "border-gray-800 bg-[#F4F5F7]"
                  : "border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
              }`}
          >
            <div
              className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors
              ${selected === "secciones" ? "bg-blue-100" : "bg-gray-200"}`}
            >
              <FilePen
                size={20}
                className={
                  selected === "secciones" ? "text-blue-500" : "text-gray-500"
                }
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Administración de Contenido de Secciones
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                Permite definir el contenido que tendrá cada sección del
                formulario.
              </p>
            </div>
          </div>
        </div>

        {/* Button */}
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

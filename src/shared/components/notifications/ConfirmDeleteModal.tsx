import { AlertCircle } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Eliminar Sección",
  message = "¿Estás seguro de que deseas eliminar este elemento?",
}: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    // Fondo oscuro semi-transparente y desenfocado
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
      <div className="bg-white rounded-4xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
        <div className="p-8 text-center flex flex-col items-center">
          <div className="bg-[#FFECEC] p-3 rounded-full mb-6">
            <AlertCircle className="text-[#FF4040]" size={45} />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{title}</h3>

          <p className="text-gray-600 max-w-70">{message}</p>
        </div>

        <div className="bg-[#F9FAFB] px-8 py-6 rounded-b-4xl grid grid-cols-2 gap-4">
          {/* Botón de Cancelar */}
          <button
            onClick={onClose}
            className="w-full text-lg px-5 py-4 bg-[#F2F4F7] hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition"
          >
            Cancelar
          </button>

          {/* Botón de Eliminar */}
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full text-lg px-5 py-4 bg-[#FFDADA] hover:bg-[#FFCFCF] text-[#E91C1C] rounded-lg font-semibold transition"
          >
            Si, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;

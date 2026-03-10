import { useState } from "react";
import { X } from "lucide-react";

//types
import type { SelectorModalProps, UserFormData } from "../types/FormTypes";

export default function SelectorModal({
  isOpen,
  onClose,
  mode,
  onSubmit,
}: SelectorModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    correo: "",
    nombre: "",
    cargo: "",
    codigo: "",
  });
  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  if (!isOpen) return null;

  const codigoRequired = mode === "secciones";

  const validate = () => {
    const newErrors: Partial<UserFormData> = {};
    if (!formData.correo) newErrors.correo = "Campo requerido";
    if (!formData.nombre) newErrors.nombre = "Campo requerido";
    if (!formData.cargo) newErrors.cargo = "Campo requerido";
    if (codigoRequired && !formData.codigo)
      newErrors.codigo = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(formData);
  };

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleClose = () => {
    setFormData({ correo: "", nombre: "", cargo: "", codigo: "" });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Antes de comenzar
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Ingresa tus datos para registrar los cambios que realices en el
            sistema.
          </p>

          <hr className="border-gray-200 mb-6" />

          {/* Fields */}
          <div className="flex flex-col gap-4">
            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="abc@example.com"
                value={formData.correo}
                onChange={(e) => handleChange("correo", e.target.value)}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-colors
                  ${errors.correo ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-gray-500"}`}
              />
              {errors.correo && (
                <p className="text-xs text-red-500 mt-1">{errors.correo}</p>
              )}
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-colors
                  ${errors.nombre ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-gray-500"}`}
              />
              {errors.nombre && (
                <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>
              )}
            </div>

            {/* Cargo */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Cargo / Área <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Supervisor de Calidad"
                value={formData.cargo}
                onChange={(e) => handleChange("cargo", e.target.value)}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-colors
                  ${errors.cargo ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-gray-500"}`}
              />
              {errors.cargo && (
                <p className="text-xs text-red-500 mt-1">{errors.cargo}</p>
              )}
            </div>

            {/* Código */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Código del formulario{" "}
                {codigoRequired ? (
                  <span className="text-red-500">*</span>
                ) : (
                  <span className="text-gray-400 font-normal">(opcional)</span>
                )}
              </label>
              <input
                type="text"
                placeholder="Ej: FORM-001"
                value={formData.codigo}
                onChange={(e) => handleChange("codigo", e.target.value)}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-colors
                  ${errors.codigo ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-gray-500"}`}
              />
              {errors.codigo && (
                <p className="text-xs text-red-500 mt-1">{errors.codigo}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full mt-7 py-3 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

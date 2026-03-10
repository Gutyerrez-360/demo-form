import { useNavigate } from "react-router";
import { useState } from "react";

export default function SessionForm() {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerificar = () => {
    if (!codigo.trim()) {
      setError("Por favor ingresa un código.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/form/selector");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#EEEEF0] flex items-center justify-center p-2 sm:p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-sm overflow-hidden">
        {/* Imagen ilustrativa */}
        <div className="w-full pt-7 rounded-2xl bg-[#F5F5F7] flex items-center justify-center py-6 px-6">
          <div className="w-100 h-30 rounded-xl bg-[#ced0d2] flex items-center justify-center text-gray-400 text-xs tracking-wide px-10 relative z-10">
            <img src="/assets/img/home.png" alt="Imagen bienvenida" />
          </div>
        </div>

        {/* Contenido */}
        <div className="px-7 sm:px-10 pt-15 pb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-snug">
            Ingresa el código de accesso
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Ingresa tu código para acceder a las herramientas de gestión y
            edición de formularios.
          </p>

          <hr className="border-gray-100 mb-5" />

          {/* Campo */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Ingresar código:
            </label>
            <input
              type="text"
              placeholder="Ej: Pw66x34"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleVerificar()}
              className={`w-full px-4 py-3 text-sm bg-[#F4F4F6] border rounded-xl outline-none transition-colors placeholder-gray-400
                ${
                  error
                    ? "border-red-400 focus:border-red-500"
                    : "border-transparent focus:border-gray-400"
                }`}
            />
            {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
          </div>

          {/* Botón */}
          <button
            onClick={handleVerificar}
            disabled={loading}
            className={`w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all
              ${
                loading
                  ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black text-white active:scale-[0.98]"
              }`}
          >
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </div>
      </div>
    </div>
  );
}

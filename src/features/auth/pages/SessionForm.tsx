import { useState, useEffect } from "react";

// navegacion
import { useNavigate } from "react-router";

// verificacion del codigo con backend
import { verificarCodigo } from "../service/authApi";

// icons
import { CircleAlert } from "lucide-react";

// loading animated
import LoadingOverlay from "../../../shared/components/ui/LoadingOverlay";

export default function SessionForm() {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("access_code")) {
      navigate("/form/selector", { replace: true });
    } else {
      setCheckingSession(false);
    }
  }, []);

  if (checkingSession) return null;

  const handleVerificar = async () => {
    if (!codigo.trim()) {
      setError("Por favor ingresa un código.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await verificarCodigo(codigo);
      localStorage.setItem("access_code", codigo);
      navigate("/form/selector", { replace: true });
    } catch (err: any) {
      const status = err?.response?.status;
      if (
        status === 404 ||
        status === 400 ||
        status === 401 ||
        status === 403
      ) {
        setError("Código de acceso inválido.");
      } else {
        setError("Error al verificar el código. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEEEF0] flex items-center justify-center p-2 sm:p-6">
      {/* Overlay de loading */}
      {loading && (
        <LoadingOverlay visible={loading} message="Verificando código..." />
      )}

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
            Ingresa el código de acceso
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
              maxLength={6}
              placeholder="Ej: 639451"
              value={codigo}
              onChange={(e) => {
                const olnyNumbers = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6);
                setCodigo(olnyNumbers);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleVerificar()}
              disabled={loading}
              className={`w-full px-4 py-3 text-sm bg-[#F4F4F6] border rounded-xl outline-none transition-colors placeholder-gray-400
                ${
                  error
                    ? "border-red-400 focus:border-red-500"
                    : "border-transparent focus:border-gray-400"
                }`}
            />
            <div className="min-h-5 mt-1.5">
              {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <CircleAlert size={13} /> {error}
                </p>
              )}
            </div>
          </div>

          {/* Botón */}
          <button
            onClick={handleVerificar}
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all bg-gray-900 hover:bg-black text-white active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verificar
          </button>
        </div>
      </div>
    </div>
  );
}

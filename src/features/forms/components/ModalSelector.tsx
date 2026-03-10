import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import type { SelectorModalProps } from "../types/FormTypes";

// ─── Mock data (reemplazar por fetch real)
const fetchFormularios = async () => [
  { id: "1", nombre: "Formulario de Calidad A" },
  { id: "2", nombre: "Formulario de Auditoría B" },
  { id: "3", nombre: "Formulario de Seguridad C" },
];

const fetchSecciones = async (formularioId: string) => [
  { id: "s1", nombre: `Sección 1 — Form ${formularioId}` },
  { id: "s2", nombre: `Sección 2 — Form ${formularioId}` },
  { id: "s3", nombre: `Sección 3 — Form ${formularioId}` },
];

type ItemLista = { id: string; nombre: string };

export default function SelectorModal({
  isOpen,
  onClose,
  mode,
  onSubmit,
}: SelectorModalProps) {
  const [formularios, setFormularios] = useState<ItemLista[]>([]);
  const [secciones, setSecciones] = useState<ItemLista[]>([]);
  const [formularioSeleccionado, setFormularioSeleccionado] =
    useState<ItemLista | null>(null);
  const [seccionSeleccionada, setSeccionSeleccionada] =
    useState<ItemLista | null>(null);
  const [loadingFormularios, setLoadingFormularios] = useState(false);
  const [loadingSecciones, setLoadingSecciones] = useState(false);
  const [openFormList, setOpenFormList] = useState(false);
  const [openSecList, setOpenSecList] = useState(false);

  // Cargar formularios al abrir
  useEffect(() => {
    if (!isOpen) return;
    setLoadingFormularios(true);
    fetchFormularios().then((data) => {
      setFormularios(data);
      setLoadingFormularios(false);
    });
  }, [isOpen]);

  // Cargar secciones al seleccionar formulario en modo secciones
  useEffect(() => {
    if (mode !== "secciones" || !formularioSeleccionado) return;
    setLoadingSecciones(true);
    setSecciones([]);
    setSeccionSeleccionada(null);
    fetchSecciones(formularioSeleccionado.id).then((data) => {
      setSecciones(data);
      setLoadingSecciones(false);
    });
  }, [formularioSeleccionado, mode]);

  const handleClose = () => {
    setFormularioSeleccionado(null);
    setSeccionSeleccionada(null);
    setSecciones([]);
    setOpenFormList(false);
    setOpenSecList(false);
    onClose();
  };

  const handleCrear = () => {
    console.log("Navegar a /formularios/nuevo");
    // navigate("/formularios/nuevo")
    handleClose();
  };

  const handleEditar = () => {
    if (!formularioSeleccionado) return;
    onSubmit({ accion: "editar", formulario: formularioSeleccionado });
    handleClose();
  };

  const handleEditarSeccion = () => {
    if (!formularioSeleccionado || !seccionSeleccionada) return;
    onSubmit({
      accion: "editar-seccion",
      formulario: formularioSeleccionado,
      seccion: seccionSeleccionada,
    });
    handleClose();
  };

  if (!isOpen) return null;

  const hayFormularioSeleccionado = !!formularioSeleccionado;
  const haySeccionSeleccionada = !!seccionSeleccionada;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "formularios"
                ? "Administrar formulario"
                : "Administrar sección"}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            {mode === "formularios"
              ? "Crea un nuevo formulario o selecciona uno existente para editarlo."
              : "Selecciona un formulario y luego la sección que deseas editar."}
          </p>

          <hr className="border-gray-200 mb-6" />

          <div className="flex flex-col gap-5">
            {/* Lista de formularios */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Lista de formularios
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenFormList((p) => !p)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none text-left flex items-center justify-between hover:border-gray-400 transition-colors"
                >
                  <span
                    className={
                      formularioSeleccionado ? "text-gray-900" : "text-gray-400"
                    }
                  >
                    {formularioSeleccionado
                      ? formularioSeleccionado.nombre
                      : loadingFormularios
                        ? "Cargando..."
                        : "Selecciona un formulario"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${openFormList ? "rotate-180" : ""}`}
                  />
                </button>

                {openFormList && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {formularios.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setFormularioSeleccionado(f);
                          setOpenFormList(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors
                          ${formularioSeleccionado?.id === f.id ? "bg-gray-100 font-medium" : ""}`}
                      >
                        {f.nombre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lista de secciones — solo en modo secciones */}
            {mode === "secciones" && (
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Lista de secciones
                </label>
                <div className="relative">
                  <button
                    type="button"
                    disabled={!hayFormularioSeleccionado}
                    onClick={() => setOpenSecList((p) => !p)}
                    className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none text-left flex items-center justify-between transition-colors
                      ${
                        !hayFormularioSeleccionado
                          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <span
                      className={
                        seccionSeleccionada ? "text-gray-900" : "text-gray-400"
                      }
                    >
                      {!hayFormularioSeleccionado
                        ? "Primero selecciona un formulario"
                        : loadingSecciones
                          ? "Cargando secciones..."
                          : seccionSeleccionada
                            ? seccionSeleccionada.nombre
                            : "Selecciona una sección"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform ${openSecList ? "rotate-180" : ""}`}
                    />
                  </button>

                  {openSecList && secciones.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {secciones.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setSeccionSeleccionada(s);
                            setOpenSecList(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors
                            ${seccionSeleccionada?.id === s.id ? "bg-gray-100 font-medium" : ""}`}
                        >
                          {s.nombre}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-7">
            {mode === "formularios" && (
              <>
                {/* Crear — siempre activo */}
                <button
                  onClick={handleCrear}
                  disabled={hayFormularioSeleccionado}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all
                    ${
                      !hayFormularioSeleccionado
                        ? "bg-gray-900 hover:bg-black text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  Crear
                </button>

                {/* Editar — solo si hay formulario seleccionado */}
                <button
                  onClick={handleEditar}
                  disabled={!hayFormularioSeleccionado}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all
                    ${
                      hayFormularioSeleccionado
                        ? "bg-gray-900 hover:bg-black text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  Editar
                </button>
              </>
            )}

            {mode === "secciones" && (
              <button
                onClick={handleEditarSeccion}
                disabled={!hayFormularioSeleccionado || !haySeccionSeleccionada}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all
                  ${
                    hayFormularioSeleccionado && haySeccionSeleccionada
                      ? "bg-gray-900 hover:bg-black text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                Editar sección
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

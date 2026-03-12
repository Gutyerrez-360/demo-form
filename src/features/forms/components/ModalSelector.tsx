import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router";

// types
import type {
  SelectorModalProps,
  ModalActionsSeccionesProps,
  ModalActionsFormulariosProps,
  ModalHeaderProps,
} from "../types/FormTypes";
import type { ListItem } from "../../../shared/components/ui/DropDownList";

// servicios reales
import {
  checkoutSeccion,
  getFormularios,
  getSecciones,
} from "../service/formsService";

// componente reutilizable
import { DropdownList } from "../../../shared/components/ui/DropDownList";
import { toast } from "../../../shared/components/notifications/toast";

// utils
import { removeBuilders } from "../../../utils/localStorage";

function useFormularios(isOpen: boolean) {
  const [formularios, setFormularios] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getFormularios();
        setFormularios(data);
      } catch (err) {
        console.error("Error cargando formularios:", err);
        setError("No se pudieron cargar los formularios");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  return { formularios, loading, error };
}

// hook con única responsabilidad: cargar secciones
// se dispara solo cuando el modo y el id son válidos
function useSecciones(
  formularioId: string | null,
  mode: "formularios" | "secciones" | null,
) {
  const [secciones, setSecciones] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode !== "secciones" || !formularioId) return;
    setLoading(true);
    setSecciones([]);
    getSecciones({ formularioId })
      .then(setSecciones)
      .finally(() => setLoading(false));
  }, [formularioId, mode]);

  return { secciones, loading };
}

function ModalHeader({ mode, onClose }: ModalHeaderProps) {
  const title =
    mode === "formularios" ? "Administrar formulario" : "Administrar sección";

  const description =
    mode === "formularios"
      ? "Crea un nuevo formulario o selecciona uno existente para editarlo."
      : "Selecciona un formulario y luego la sección que deseas editar.";

  return (
    <>
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
        >
          <X size={20} />
        </button>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed mb-5">
        {description}
      </p>
      <hr className="border-gray-200 mb-6" />
    </>
  );
}

// FORMULARIOS
// botones exclusivos del modo "formularios"
// funciona para variar los datos del boton al final del modal
function ModalActionsFormularios({
  hayFormulario,
  onCrear,
  onEditar,
}: ModalActionsFormulariosProps) {
  return (
    <>
      <button
        onClick={onCrear}
        disabled={hayFormulario}
        className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all
          ${
            !hayFormulario
              ? "bg-gray-900 hover:bg-black text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
      >
        Crear
      </button>
      <button
        onClick={onEditar}
        disabled={!hayFormulario}
        className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all
          ${
            hayFormulario
              ? "bg-gray-900 hover:bg-black text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
      >
        Editar
      </button>
    </>
  );
}

// SECCIONES
// botón exclusivo del modo "secciones"
// funciona para variar los datos del boton al final del modal
function ModalActionsSecciones({
  hayFormulario,
  haySeccion,
  onEditarSeccion,
}: Readonly<ModalActionsSeccionesProps>) {
  const habilitado = hayFormulario && haySeccion;

  return (
    <button
      onClick={onEditarSeccion}
      disabled={!habilitado}
      className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all
        ${
          habilitado
            ? "bg-gray-900 hover:bg-black text-white"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
    >
      Editar Sección
    </button>
  );
}

// Modal principal
export default function SelectorModal({
  isOpen,
  onClose,
  mode,
  onSubmit,
}: SelectorModalProps) {
  const [formularioSeleccionado, setFormularioSeleccionado] =
    useState<ListItem | null>(null);
  const [seccionSeleccionada, setSeccionSeleccionada] =
    useState<ListItem | null>(null);
  const [openFormList, setOpenFormList] = useState(false);
  const [openSecList, setOpenSecList] = useState(false);

  const navigate = useNavigate();

  const { formularios, loading, error } = useFormularios(isOpen);
  const { secciones, loading: loadingSecciones } = useSecciones(
    formularioSeleccionado?.id ?? null,
    mode,
  );

  const handleClose = () => {
    setFormularioSeleccionado(null);
    setSeccionSeleccionada(null);
    setOpenFormList(false);
    setOpenSecList(false);
    onClose();
  };

  const handleCrear = () => {
    navigate("/form/builder");
    removeBuilders();
    handleClose();
  };

  const handleEditar = () => {
    if (!formularioSeleccionado) return;
    onSubmit({ accion: "editar", formulario: formularioSeleccionado });
    handleClose();
    navigate(`/form/builder/${formularioSeleccionado.id}`);
  };

  const handleEditarSeccion = async () => {
    if (!formularioSeleccionado || !seccionSeleccionada) return;

    try {
      const { disponible, mensaje } = await checkoutSeccion(
        seccionSeleccionada.id,
      );

      if (!disponible) {
        toast.error(
          "Sección no disponible",
          mensaje ?? "La sección ya está en edición.",
        );
        return;
      }

      onSubmit({
        accion: "editar-seccion",
        formulario: formularioSeleccionado,
        seccion: seccionSeleccionada,
      });
      handleClose();
      navigate(
        `/form/editSection/${formularioSeleccionado.id}/${seccionSeleccionada.id}`,
      );
    } catch (error) {
      toast.error("Error", "No se pudo verificar el estado de la sección.");
    }
  };

  if (!isOpen) return null;

  const hayFormulario = !!formularioSeleccionado;
  const haySeccion = !!seccionSeleccionada;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-8">
          <ModalHeader mode={mode} onClose={handleClose} />

          <div className="flex flex-col gap-5">
            {/* Formularios — siempre visible */}
            <DropdownList
              label="Lista de formularios"
              items={formularios}
              selected={formularioSeleccionado}
              onSelect={(f) => {
                setFormularioSeleccionado(f);
                setOpenFormList(false);
              }}
              isOpen={openFormList}
              onToggle={() => setOpenFormList((p) => !p)}
              loading={loading}
              placeholder="Selecciona un formulario"
            />
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Secciones — solo en modo secciones */}
            {mode === "secciones" && (
              <DropdownList
                label="Lista de secciones"
                items={secciones}
                selected={seccionSeleccionada}
                onSelect={(s) => {
                  setSeccionSeleccionada(s);
                  setOpenSecList(false);
                }}
                isOpen={openSecList}
                onToggle={() => setOpenSecList((p) => !p)}
                disabled={!hayFormulario}
                loading={loadingSecciones}
                placeholder="Selecciona una sección"
                disabledPlaceholder="Primero selecciona un formulario"
              />
            )}
          </div>

          {/* Acciones según modo */}
          <div className="flex gap-3 mt-7">
            {mode === "formularios" && (
              <ModalActionsFormularios
                hayFormulario={hayFormulario}
                onCrear={handleCrear}
                onEditar={handleEditar}
              />
            )}
            {mode === "secciones" && (
              <ModalActionsSecciones
                hayFormulario={hayFormulario}
                haySeccion={haySeccion}
                onEditarSeccion={handleEditarSeccion}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

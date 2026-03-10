import { useState, useCallback, memo } from "react";
import type { PreguntaTabular } from "../../../../types/forms";
import { Trash2 } from "lucide-react";

// Componentes
import ConfirmDeleteModal from "../../../../shared/components/notifications/ConfirmDeleteModal";
import TablaInteractiva from "../../../../shared/components/table/TablaInteractiva";

// interfaces
import type { Fila } from "../../../../shared/components/table/TablaInteractiva";

interface PreguntaTabularProps {
  pregunta: PreguntaTabular;
  onUpdate: (pregunta: PreguntaTabular) => void;
  onDelete: () => void;
}

function PreguntaTabularComp({
  pregunta,
  onUpdate,
  onDelete,
}: PreguntaTabularProps) {
  const [deleteConfig, setDeleteConfig] = useState<{
    isOpen: boolean;
    onConfirm: () => void;
    title: string;
    message: string;
  }>({
    isOpen: false,
    onConfirm: () => {},
    title: "",
    message: "",
  });

  const requestDelete = (
    title: string,
    message: string,
    onConfirm: () => void,
  ) => {
    setDeleteConfig({ isOpen: true, onConfirm, title, message });
  };

  // ── Handlers que pasa TablaInteractiva ──────────────────────────────────────

  const handleCeldaChange = useCallback(
    (filaId: string, celdaIdx: number, valor: string) => {
      onUpdate({
        ...pregunta,
        filas: pregunta.filas.map((fila) =>
          fila.id === filaId
            ? {
                ...fila,
                celdas: fila.celdas.map((c, idx) =>
                  idx === celdaIdx ? { ...c, variable: valor } : c,
                ),
              }
            : fila,
        ),
      });
    },
    [pregunta, onUpdate],
  );

  const handleTipoChange = useCallback(
    (filaId: string, celdaIdx: number, tipo: "variable" | "etiqueta") => {
      onUpdate({
        ...pregunta,
        filas: pregunta.filas.map((fila) =>
          fila.id === filaId
            ? {
                ...fila,
                celdas: fila.celdas.map((celda, i) =>
                  i === celdaIdx ? { ...celda, tipo } : celda,
                ),
              }
            : fila,
        ),
      });
    },
    [pregunta, onUpdate],
  );

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 bg-white border-2 border-orange-200 rounded-xl">
      {/* Título */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <label className="pt-0 font-bold">
            Titulo de la pregunta o tabla
          </label>
          <div className="pt-2">
            <textarea
              value={pregunta.titulo || ""}
              onChange={(e) =>
                onUpdate({ ...pregunta, titulo: e.target.value })
              }
              placeholder="Aqui ira la pregunta a realizar"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-12 text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Codificación */}
      <div className="flex-1 pt-0">
        <label className="pt-0 font-bold">Codificación de la pregunta</label>
        <textarea
          value={pregunta.codigoPregunta || ""}
          onChange={(e) =>
            onUpdate({ ...pregunta, codigoPregunta: e.target.value })
          }
          placeholder="Deberá colocar el codigo que representa a la pregunta o una descripción, Ej: PRG12_001 ó La finalidad de la pregunta..."
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none h-12 text-gray-700"
        />
      </div>

      {/* Número de filas / columnas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Número de filas:
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
            <button
              type="button"
              onClick={() => {
                const nuevo = Math.max((pregunta.numFilas || 1) - 1, 1);
                const filas = Array.from({ length: nuevo }, (_, i) => {
                  if (pregunta.filas[i]) return pregunta.filas[i];
                  return {
                    id: crypto.randomUUID(),
                    celdas: Array.from(
                      { length: pregunta.numColumnas },
                      () => ({
                        id: crypto.randomUUID(),
                        variable: "",
                        tipo: "variable" as const,
                      }),
                    ),
                  };
                });
                onUpdate({ ...pregunta, numFilas: nuevo, filas });
              }}
              className="px-4 py-3 text-gray-600 hover:bg-gray-100 active:bg-gray-200 text-xl font-bold select-none"
            >
              ‹
            </button>
            <span className="flex-1 text-center text-gray-700 font-medium py-3 text-base">
              {pregunta.numFilas || 1}
            </span>
            <button
              type="button"
              onClick={() => {
                const nuevo = Math.min((pregunta.numFilas || 1) + 1, 50);
                if (nuevo > 50) {
                  alert("El número máximo permitido es 50");
                  return;
                }
                const filas = Array.from({ length: nuevo }, (_, i) => {
                  if (pregunta.filas[i]) return pregunta.filas[i];
                  return {
                    id: crypto.randomUUID(),
                    celdas: Array.from(
                      { length: pregunta.numColumnas },
                      () => ({
                        id: crypto.randomUUID(),
                        variable: "",
                        tipo: "variable" as const,
                      }),
                    ),
                  };
                });
                onUpdate({ ...pregunta, numFilas: nuevo, filas });
              }}
              className="px-4 py-3 text-gray-600 hover:bg-gray-100 active:bg-gray-200 text-xl font-bold select-none"
            >
              ›
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Número de columnas:
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
            <button
              type="button"
              onClick={() => {
                const nuevo = Math.max((pregunta.numColumnas || 1) - 1, 1);
                const filas = pregunta.filas.map((fila) => ({
                  ...fila,
                  celdas: Array.from(
                    { length: nuevo },
                    (_, i) =>
                      fila.celdas[i] || {
                        id: crypto.randomUUID(),
                        variable: "",
                        tipo: "variable" as const,
                      },
                  ),
                }));
                onUpdate({ ...pregunta, numColumnas: nuevo, filas });
              }}
              className="px-4 py-3 text-gray-600 hover:bg-gray-100 active:bg-gray-200 text-xl font-bold select-none"
            >
              ‹
            </button>
            <span className="flex-1 text-center text-gray-700 font-medium py-3 text-base">
              {pregunta.numColumnas || 1}
            </span>
            <button
              type="button"
              onClick={() => {
                const nuevo = Math.min((pregunta.numColumnas || 1) + 1, 50);
                if (nuevo > 50) {
                  alert("El número máximo permitido es 50");
                  return;
                }
                const filas = pregunta.filas.map((fila) => ({
                  ...fila,
                  celdas: Array.from(
                    { length: nuevo },
                    (_, i) =>
                      fila.celdas[i] || {
                        id: crypto.randomUUID(),
                        variable: "",
                        tipo: "variable" as const,
                      },
                  ),
                }));
                onUpdate({ ...pregunta, numColumnas: nuevo, filas });
              }}
              className="px-4 py-3 text-gray-600 hover:bg-gray-100 active:bg-gray-200 text-xl font-bold select-none"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Configuración dinámica */}
      <div className="mb-6 rounded-lg">
        <label className="text-sm font-semibold text-gray-700 block mb-3">
          Configuración dinámica
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {/* SWITCH */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <button
              onClick={() =>
                onUpdate({
                  ...pregunta,
                  modo: pregunta.modo === "dinamico" ? "estatico" : "dinamico",
                })
              }
              className={`relative w-28 h-10 rounded-full transition-colors border ${
                pregunta.modo === "dinamico"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              } flex items-center justify-between px-2`}
            >
              <span
                className={`absolute left-2 text-sm font-semibold transition-opacity ${
                  pregunta.modo === "dinamico" ? "opacity-100" : "opacity-0"
                }`}
              >
                Dinámico
              </span>
              <span
                className={`absolute right-2 text-sm font-semibold transition-opacity ${
                  pregunta.modo === "dinamico" ? "opacity-0" : "opacity-100"
                }`}
              >
                Estático
              </span>
              <div
                className={`w-8 h-8 rounded-full shadow transition-transform ${
                  pregunta.modo === "dinamico"
                    ? "translate-x-16 bg-white"
                    : "bg-black"
                }`}
              />
            </button>
          </div>

          {/* CÓDIGO */}
          <div className="flex flex-col relative group">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Código
            </label>
            <input
              type="text"
              disabled={pregunta.modo !== "dinamico"}
              value={pregunta.codigo || ""}
              onChange={(e) =>
                onUpdate({ ...pregunta, codigo: e.target.value })
              }
              placeholder="Ej: PRG12_01"
              onFocus={(e) => e.currentTarget.select()}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-10 text-gray-700 ${
                pregunta.modo === "dinamico"
                  ? "bg-white"
                  : "bg-gray-200 cursor-not-allowed text-gray-500"
              }`}
            />
            {pregunta.modo === "dinamico" && (
              <div className="absolute left-0 -bottom-16 w-64 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                Si tu pregunta es <strong>dinámica</strong> (depende de otra
                pregunta que se repetirá varias veces), coloca aquí el código de
                esa pregunta.
              </div>
            )}
          </div>

          {/* REPETICIONES */}
          <div className="flex flex-col relative group">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Número de repeticiones
            </label>
            <input
              type="number"
              min={1}
              max={100}
              disabled={pregunta.modo !== "dinamico"}
              value={pregunta.repeticiones ?? ""}
              onFocus={(e) => e.currentTarget.select()}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key))
                  e.preventDefault();
              }}
              onChange={(e) => {
                let value = Number(e.target.value);
                if (value > 100) value = 100;
                onUpdate({
                  ...pregunta,
                  repeticiones: isNaN(value) ? 0 : value,
                });
              }}
              placeholder="Ej: 5"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-10 text-gray-700 ${
                pregunta.modo !== "dinamico"
                  ? "bg-gray-200 cursor-not-allowed text-gray-500"
                  : "bg-white"
              }`}
            />
            {pregunta.modo === "dinamico" && (
              <div className="absolute left-0 -bottom-16 w-64 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                Ingresa cuántas veces se repetirá esta pregunta dinámica. Máximo
                100.
              </div>
            )}
          </div>
        </div>
      </div>

      <TablaInteractiva
        filas={(pregunta.filas ?? []) as Fila[]}
        numColumnas={pregunta.numColumnas}
        encabezados={pregunta.encabezadoColumnas}
        onCeldaChange={handleCeldaChange}
        onTipoChange={handleTipoChange}
      />

      {/* Footer */}
      <div className="mt-2 flex items-center justify-between pt-4">
        <div className="text-xs text-gray-500 font-medium">
          Tipo: Pregunta Tabular ({pregunta.numFilas}x{pregunta.numColumnas})
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            requestDelete(
              "Eliminar Pregunta",
              `Vas a eliminar la pregunta "${pregunta.titulo}". ¿Estás seguro?`,
              () => onDelete(),
            );
          }}
          className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[#E91C1C] hover:bg-red-200 rounded-lg transition-colors border-2 bg-[#FFCFCF] text-sm sm:text-base"
        >
          <Trash2 size={16} />
          Eliminar Pregunta
        </button>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteConfig.isOpen}
        title={deleteConfig.title}
        message={deleteConfig.message}
        onClose={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
        onConfirm={deleteConfig.onConfirm}
      />
    </div>
  );
}

export default memo(PreguntaTabularComp);

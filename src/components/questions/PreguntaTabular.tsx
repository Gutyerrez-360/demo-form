import { useState } from "react";
import type { PreguntaTabular } from "../../types/forms";
import { Trash2 } from "lucide-react";

//modal component
import ConfirmDeleteModal from "../notifications/ConfirmDeleteModal";

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
  const updateFila = (filaId: string, celda: number, valor: string) => {
    onUpdate({
      ...pregunta,
      filas: pregunta.filas.map((fila) =>
        fila.id === filaId
          ? {
              ...fila,
              celdas: fila.celdas.map((c, idx) =>
                idx === celda ? { ...c, variable: valor } : c,
              ),
            }
          : fila,
      ),
    });
  };

  const updateEncabezado = (colIdx: number, valor: string) => {
    const nuevosEncabezados = [...(pregunta.encabezadoColumnas || [])];
    nuevosEncabezados[colIdx] = valor;
    onUpdate({
      ...pregunta,
      encabezadoColumnas: nuevosEncabezados,
    });
  };

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
    setDeleteConfig({
      isOpen: true,
      onConfirm,
      title,
      message,
    });
  };

  return (
    <div className="p-6 bg-white border-2 border-orange-200 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={pregunta.titulo}
            onChange={(e) => onUpdate({ ...pregunta, titulo: e.target.value })}
            placeholder="Título de la pregunta"
            className="w-full text-lg font-bold text-gray-900 bg-transparent border-b-2 border-gray-200 focus:border-orange-500 outline-none pb-2 transition-colors"
          />
        </div>
      </div>

      <textarea
        value={pregunta.descripcion || ""}
        onChange={(e) => onUpdate({ ...pregunta, descripcion: e.target.value })}
        placeholder="Descripción opcional"
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none h-12 text-gray-700"
      />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Número de filas:
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={pregunta.numFilas === 0 ? "" : pregunta.numFilas}
            onFocus={(e) => e.currentTarget.select()}
            onClick={(e) => e.currentTarget.select()}
            onChange={(e) => {
              const nuevo = Math.min(parseInt(e.target.value) || 1, 50);

              if (parseInt(e.target.value) > 50) {
                alert("El número máximo permitido es 50");
              }
              const filas = Array.from({ length: nuevo }, (_, i) => {
                if (pregunta.filas[i]) return pregunta.filas[i];
                return {
                  id: crypto.randomUUID(),
                  celdas: Array.from({ length: pregunta.numColumnas }, () => ({
                    id: crypto.randomUUID(),
                    variable: "",
                  })),
                };
              });
              onUpdate({ ...pregunta, numFilas: nuevo, filas });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-700"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Número de columnas:
          </label>
          <input
            type="number"
            placeholder="1"
            min={1}
            max={50}
            onFocus={(e) => e.currentTarget.select()}
            onClick={(e) => e.currentTarget.select()}
            value={pregunta.numColumnas === 0 ? "" : pregunta.numColumnas}
            onChange={(e) => {
              const nuevo = Math.min(parseInt(e.target.value) || 1, 50);

              if (parseInt(e.target.value) > 50) {
                alert("El número máximo permitido es 50");
              }

              const filas = pregunta.filas.map((fila) => ({
                ...fila,
                celdas: Array.from(
                  { length: nuevo },
                  (_, i) =>
                    fila.celdas[i] || { id: crypto.randomUUID(), variable: "" },
                ),
              }));

              onUpdate({ ...pregunta, numColumnas: nuevo, filas });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-700"
          />
        </div>
      </div>

      <div className="mb-4 p-4 pt-2 bg-orange-50 rounded-lg border border-orange-200">
        <label className="text-sm font-semibold text-gray-700 block mb-3">
          Títulos de columnas:
        </label>
        <div className="overflow-x-auto py-2">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(8, minmax(80px, 1fr))`,
              gridAutoRows: "auto",
            }}
          >
            {Array.from({ length: pregunta.numColumnas }).map((_, colIdx) => (
              <input
                key={colIdx}
                type="text"
                value={
                  pregunta.encabezadoColumnas?.[colIdx] ||
                  (colIdx === 0 ? "Pregunta" : "")
                }
                onChange={(e) => updateEncabezado(colIdx, e.target.value)}
                placeholder={
                  colIdx === 0 ? "Pregunta" : `Columna ${colIdx + 1}`
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-700 text-sm font-medium w-full"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-orange-50 rounded-lg border border-orange-200 p-4 overflow-auto max-h-[400px]">
        {" "}
        <table className="w-full text-sm">
          <thead className="border-b-2 border-orange-300">
            <tr>
              <th className="p-2 text-left font-bold text-gray-700 bg-orange-100 border border-orange-200">
                {pregunta.encabezadoColumnas?.[0] || "Pregunta"}
              </th>
              {Array.from({ length: pregunta.numColumnas - 1 }).map(
                (_, colIdx) => (
                  <th
                    key={colIdx}
                    className="p-2 text-center font-bold text-gray-700 bg-orange-100 border border-orange-200"
                  >
                    {pregunta.encabezadoColumnas?.[colIdx + 1] ||
                      `Col ${colIdx + 2}`}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {pregunta.filas.map((fila, filaIdx) => (
              <tr
                key={fila.id}
                className={filaIdx % 2 === 0 ? "bg-white" : "bg-orange-50"}
              >
                {fila.celdas.map((celda, celdaIdx) => (
                  <td
                    key={celda.id}
                    className={`p-2 border border-orange-200 ${celdaIdx === 0 ? "bg-orange-100 font-semibold" : ""}`}
                  >
                    <input
                      type="text"
                      value={celda.variable}
                      onChange={(e) =>
                        updateFila(fila.id, celdaIdx, e.target.value)
                      }
                      placeholder={
                        celdaIdx === 0
                          ? `Pregunta ${filaIdx + 1}`
                          : `Resp ${filaIdx + 1}`
                      }
                      className={`w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none text-gray-700 text-xs ${celdaIdx === 0 ? "font-semibold" : ""}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 flex items-center justify-between pt-4">
        {/* Texto a la izquierda */}
        <div className="text-xs text-gray-500 font-medium">
          Tipo: Pregunta Tabular ({pregunta.numFilas}x{pregunta.numColumnas})
        </div>

        {/* Botón a la derecha */}
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

export default PreguntaTabularComp;

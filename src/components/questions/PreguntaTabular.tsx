import { useState, useRef, useEffect } from "react";
import type { PreguntaTabular } from "../../types/forms";
import { Trash2, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

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
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  // guardamos la posicion de la tabla al hacer clic dentro de la celda
  //y guardamos la celda activa
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [activeCell, setActiveCell] = useState<{
    filaId: string;
    celdaIdx: number;
  } | null>(null);

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

  const updateTipoCelda = (
    filaId: string,
    celdaIdx: number,
    tipo: "variable" | "etiqueta",
  ) => {
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
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //  esta logica solo funciona para esta tabla
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    filaIdx: number,
    celdaIdx: number,
  ) => {
    const numFilas = pregunta.filas.length;
    const numColumnas = pregunta.numColumnas;

    let nextFila = filaIdx;
    let nextCelda = celdaIdx;

    switch (e.key) {
      case "ArrowRight":
        nextCelda = celdaIdx + 1 < numColumnas ? celdaIdx + 1 : celdaIdx;
        break;
      case "ArrowLeft":
        nextCelda = celdaIdx - 1 >= 0 ? celdaIdx - 1 : celdaIdx;
        break;
      case "ArrowDown":
        nextFila = filaIdx + 1 < numFilas ? filaIdx + 1 : filaIdx;
        break;
      case "ArrowUp":
        nextFila = filaIdx - 1 >= 0 ? filaIdx - 1 : filaIdx;
        break;
      case "Tab":
        e.preventDefault();
        if (e.shiftKey) {
          if (celdaIdx > 0) nextCelda = celdaIdx - 1;
          else if (filaIdx > 0) {
            nextFila = filaIdx - 1;
            nextCelda = numColumnas - 1;
          }
        } else {
          if (celdaIdx < numColumnas - 1) nextCelda = celdaIdx + 1;
          else if (filaIdx < numFilas - 1) {
            nextFila = filaIdx + 1;
            nextCelda = 0;
          }
        }
        break;
      default:
        return;
    }

    const nextKey = `${nextFila}-${nextCelda}`;
    const nextInput = inputRefs.current[nextKey];

    // Saltar celdas deshabilitadas
    if (nextInput?.disabled) {
      handleKeyDown(e as any, nextFila, nextCelda);
      return;
    }

    nextInput?.focus();

    requestAnimationFrame(() => {
      nextInput?.select();
    });

    setActiveCell({
      filaId: pregunta.filas[nextFila].id,
      celdaIdx: nextCelda,
    });
  };

  return (
    <div className="p-6 bg-white border-2 border-orange-200 rounded-xl">
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

      <div className="flex-1 pt-0">
        <label className="pt-0 font-bold">Codificación de la pregunta</label>
        <textarea
          value={pregunta.descripcion || ""}
          onChange={(e) =>
            onUpdate({ ...pregunta, descripcion: e.target.value })
          }
          placeholder="Deberá colocar el codigo que representa a la pregunta o una descripción, Ej: PRG12_001 ó La finalidad de la pregunta..."
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none h-12 text-gray-700"
        />{" "}
      </div>

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
                    tipo: "variable",
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
              {/* Texto izquierdo */}
              <span
                className={`absolute left-2 text-sm font-semibold transition-opacity ${
                  pregunta.modo === "dinamico" ? "opacity-100" : "opacity-0"
                }`}
              >
                Dinámico
              </span>

              {/* Texto derecho */}
              <span
                className={`absolute right-2 text-sm font-semibold transition-opacity ${
                  pregunta.modo === "dinamico" ? "opacity-0" : "opacity-100"
                }`}
              >
                Estático
              </span>

              {/* Circulo */}
              <div
                className={`w-8 h-8 rounded-full shadow transition-transform ${
                  pregunta.modo === "dinamico"
                    ? "translate-x-16 bg-white"
                    : "bg-black"
                }`}
              />
            </button>
          </div>

          {/* CODIGO */}
          <div className="flex flex-col relative group">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Código
            </label>

            <input
              type="text"
              disabled={pregunta.modo != "dinamico"}
              value={pregunta.codigo || ""}
              onChange={(e) =>
                onUpdate({
                  ...pregunta,
                  codigo: e.target.value,
                })
              }
              placeholder="Ej: PRG12_01"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-10 text-gray-700 ${
                pregunta.modo === "dinamico"
                  ? "bg-white"
                  : " bg-gray-200 cursor-not-allowed text-gray-500"
              }`}
              onFocus={(e) => e.currentTarget.select()}
            />

            {/* Tooltip amigable */}
            {pregunta.modo === "dinamico" ? (
              <div className="absolute left-0 -bottom-16 w-64 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                Si tu pregunta es <strong>dinámica</strong> (depende de otra
                pregunta que se repetirá varias veces), coloca aquí el código de
                esa pregunta.
              </div>
            ) : (
              ""
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
                // Evitar euler, signos y punto
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
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

            {/* Tooltip amigable */}
            {pregunta.modo === "dinamico" && (
              <div className="absolute left-0 -bottom-16 w-64 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                Ingresa cuántas veces se repetirá esta pregunta dinámica. Máximo
                100.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 p-4 pt-2 bg-gray-100 rounded-lg border border-gray-50">
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

      <div className="bg-[#F4F5F7] rounded-lg border border-gray-50 p-4 overflow-auto max-h-100">
        <table className="w-full text-sm border-collapse">
          <thead className="border-b-2 border-black">
            <tr>
              <th className="p-2 text-left font-bold text-gray-700 bg-[#CFCFCF]">
                {pregunta.encabezadoColumnas?.[0] || "Pregunta"}
              </th>

              {Array.from({ length: pregunta.numColumnas - 1 }).map(
                (_, colIdx) => (
                  <th
                    key={colIdx}
                    className="p-2 text-center font-bold text-gray-700 bg-[#CFCFCF] "
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
                className={filaIdx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                {fila.celdas.map((celda, celdaIdx) => (
                  <td
                    key={celda.id}
                    className={`p-0 border border-gray-400 ${
                      celdaIdx === 0
                        ? ` ${
                            activeCell?.filaId === fila.id &&
                            activeCell?.celdaIdx === celdaIdx
                              ? "bg-blue-200" // color de celda activa
                              : ""
                          } font-semibold`
                        : ""
                    } ${
                      activeCell?.filaId === fila.id &&
                      activeCell?.celdaIdx === celdaIdx
                        ? "bg-blue-200" // color de celda activa
                        : ""
                    }`}
                  >
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={celda.variable}
                        disabled={celda.tipo === "etiqueta"}
                        onChange={(e) =>
                          updateFila(fila.id, celdaIdx, e.target.value)
                        }
                        onFocus={(e) => {
                          requestAnimationFrame(() => e.target.select());
                        }}
                        placeholder={
                          celdaIdx === 0
                            ? `Pregunta ${filaIdx + 1}`
                            : `Variables ${filaIdx + 1}`
                        }
                        className={`w-full px-3 py-3 pr-7 outline-none text-md min-h-9.5 ${celdaIdx === 0 ? "font-semibold" : ""} ${celda.tipo === "etiqueta" ? "text-gray-400 cursor-not-allowed bg-gray-200 opacity-70" : "text-gray-700 bg-transparent"} ${activeCell?.filaId === fila.id && activeCell?.celdaIdx === celdaIdx ? (celda.tipo === "etiqueta" ? "bg-blue-300" : "bg-blue-200") : ""}`}
                        ref={(el) => {
                          inputRefs.current[`${filaIdx}-${celdaIdx}`] = el;
                        }}
                        onKeyDown={(e) => handleKeyDown(e, filaIdx, celdaIdx)}
                      />

                      {/* ICONO */}
                      <button
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();

                          setMenuPosition({
                            x: rect.left,
                            y: rect.bottom,
                          });

                          setActiveCell({
                            filaId: fila.id,
                            celdaIdx: celdaIdx,
                          });

                          setOpenMenu(openMenu === celda.id ? null : celda.id);
                        }}
                        className="absolute right-1 p-1 hover:bg-gray-200 rounded"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {openMenu &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuPosition.y + 4,
              left: menuPosition.x,
            }}
            className="bg-white border border-gray-300 rounded-xl shadow-xl text-sm z-50 w-36"
          >
            <button
              className="block px-4 py-2 hover:bg-gray-100 w-full text-left rounded-t-xl"
              onClick={() => {
                if (activeCell) {
                  updateTipoCelda(
                    activeCell.filaId,
                    activeCell.celdaIdx,
                    "variable",
                  );
                }
                setOpenMenu(null);
              }}
            >
              Variable
            </button>

            <button
              className="block px-4 py-2 hover:bg-gray-100 w-full text-left rounded-b-xl"
              onClick={() => {
                if (activeCell) {
                  updateTipoCelda(
                    activeCell.filaId,
                    activeCell.celdaIdx,
                    "etiqueta",
                  );
                }
                setOpenMenu(null);
              }}
            >
              Etiqueta
            </button>
          </div>,
          document.body,
        )}

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

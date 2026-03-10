import { useState, useRef, useEffect, useCallback, memo } from "react";
import { ChevronDown, Pin, PinOff } from "lucide-react";
import { createPortal } from "react-dom";

//  Tipos
export interface Celda {
  id: string;
  variable: string;
  tipo: "variable" | "etiqueta";
}

export interface Fila {
  id: string;
  celdas: Celda[];
}

export interface TablaInteractivaProps {
  filas: Fila[];
  numColumnas: number;
  encabezados?: string[];
  onCeldaChange: (filaId: string, celdaIdx: number, valor: string) => void;
  onTipoChange: (
    filaId: string,
    celdaIdx: number,
    tipo: "variable" | "etiqueta",
  ) => void;
  frozenRows?: number[];
  frozenCols?: number[];
  onFreezeChange?: (rows: number[], cols: number[]) => void;
  maxHeight?: number;
}

//  Constantes
const PIN_W = 22;
const COL0_W = 90;
const COLN_W = 70;
const COL0_MW = 64;
const COLN_MW = 48;
const ROW_H = 28;
const MAX_H = 400;
const BG_ACTIVE = "#bfdbfe"; // blue-200

function buildLeftMap(
  frozenColsExtra: number[],
  c0: number,
  cN: number,
): Record<number, number> {
  const map: Record<number, number> = { 0: PIN_W };
  let acc = PIN_W + c0;
  for (const c of frozenColsExtra) {
    map[c] = acc;
    acc += cN;
  }
  return map;
}

//  Componente
function TablaInteractiva({
  filas,
  numColumnas,
  onCeldaChange,
  onTipoChange,
  frozenRows: frozenRowsProp,
  frozenCols: frozenColsProp,
  onFreezeChange,
  maxHeight = MAX_H,
}: TablaInteractivaProps) {
  const [frozenRowsInt, setFrozenRowsInt] = useState<number[]>([]);
  const [frozenColsInt, setFrozenColsInt] = useState<number[]>([]);
  const frozenRowsExtra = frozenRowsProp ?? frozenRowsInt;
  const frozenColsExtra = frozenColsProp ?? frozenColsInt;
  const frozenRowsSet = new Set([0, ...frozenRowsExtra]);
  const frozenColsSet = new Set([0, ...frozenColsExtra]);

  const setFrozenRows = useCallback(
    (n: number[]) => {
      setFrozenRowsInt(n);
      onFreezeChange?.(n, frozenColsExtra);
    },
    [frozenColsExtra, onFreezeChange],
  );

  const setFrozenCols = useCallback(
    (n: number[]) => {
      setFrozenColsInt(n);
      onFreezeChange?.(frozenRowsExtra, n);
    },
    [frozenRowsExtra, onFreezeChange],
  );

  // ── Responsivo
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const check = (w: number) => setIsMobile(w < 480);
    check(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([e]) => check(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const c0W = isMobile ? COL0_MW : COL0_W;
  const cNW = isMobile ? COLN_MW : COLN_W;
  const leftMap = buildLeftMap(frozenColsExtra, c0W, cNW);

  const allCols = Array.from({ length: numColumnas }, (_, i) => i);
  const orderedCols = [
    0,
    ...frozenColsExtra,
    ...allCols.filter((i) => !frozenColsSet.has(i)),
  ];
  const orderedRows = [
    0,
    ...frozenRowsExtra,
    ...filas.map((_, i) => i).filter((i) => !frozenRowsSet.has(i)),
  ];

  // ── Menú
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<{ fi: number; ci: number } | null>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpenMenu(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Refs de inputs y de TDs  ← CLAVE para highlight O(1)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const tdRefs = useRef<Record<string, HTMLTableCellElement | null>>({});

  // ── Highlight: accede directo al td por ref, sin querySelector
  const activeTdRef = useRef<HTMLTableCellElement | null>(null);

  const highlight = useCallback((fi: number | null, ci: number | null) => {
    // quitar color anterior
    if (activeTdRef.current) {
      activeTdRef.current.style.backgroundColor = "";
      activeTdRef.current = null;
    }
    // poner color nuevo
    if (fi !== null && ci !== null) {
      const td = tdRefs.current[`${fi}-${ci}`];
      if (td) {
        td.style.backgroundColor = BG_ACTIVE;
        activeTdRef.current = td;
      }
    }
  }, []);

  // ── Refs volátiles para handleKeyDown (evita recrear el callback)
  const filasRef = useRef(filas);
  const nColsRef = useRef(numColumnas);
  useEffect(() => {
    filasRef.current = filas;
  }, [filas]);
  useEffect(() => {
    nColsRef.current = numColumnas;
  }, [numColumnas]);

  // ── handleKeyDown — nunca se recrea, sin rAF acumulado
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, fi: number, ci: number) => {
      const rows = filasRef.current;
      const cols = nColsRef.current;
      let nf = fi,
        nc = ci;

      switch (e.key) {
        case "ArrowRight":
          nc = Math.min(nc + 1, cols - 1);
          break;
        case "ArrowLeft":
          nc = Math.max(nc - 1, 0);
          break;
        case "ArrowDown":
          nf = Math.min(nf + 1, rows.length - 1);
          break;
        case "ArrowUp":
          nf = Math.max(nf - 1, 0);
          break;
        case "Tab":
          e.preventDefault();
          if (e.shiftKey) {
            if (nc > 0) nc--;
            else if (nf > 0) {
              nf--;
              nc = cols - 1;
            }
          } else {
            if (nc < cols - 1) nc++;
            else if (nf < rows.length - 1) {
              nf++;
              nc = 0;
            }
          }
          break;
        default:
          return;
      }

      // saltar disabled
      let guard = 0;
      while (
        inputRefs.current[`${nf}-${nc}`]?.disabled &&
        guard++ < cols * rows.length
      ) {
        if (++nc >= cols) {
          nc = 0;
          if (++nf >= rows.length) return;
        }
      }

      // focus sin rAF — evita acumulación de frames al presionar rápido
      const inp = inputRefs.current[`${nf}-${nc}`];
      if (inp) {
        inp.focus();
        inp.select();
      }
      highlight(nf, nc);
    },
    [highlight],
  );

  // ── Toggle freeze
  const toggleFreezeRow = useCallback(
    (i: number) => {
      if (i === 0) return;
      const n = frozenRowsExtra.includes(i)
        ? frozenRowsExtra.filter((r) => r !== i)
        : [...frozenRowsExtra, i].sort((a, b) => a - b);
      setFrozenRows(n);
    },
    [frozenRowsExtra, setFrozenRows],
  );

  const toggleFreezeCol = useCallback(
    (i: number) => {
      if (i === 0) return;
      const n = frozenColsExtra.includes(i)
        ? frozenColsExtra.filter((c) => c !== i)
        : [...frozenColsExtra, i].sort((a, b) => a - b);
      setFrozenCols(n);
    },
    [frozenColsExtra, setFrozenCols],
  );

  // ── renderCelda — sin transition-colors, sin group/cell hover
  const renderCelda = (
    fi: number,
    ci: number,
    fila: Fila,
    isFrozenRow: boolean,
    isFrozenCol: boolean,
  ) => {
    const celda = fila.celdas[ci];
    if (!celda) return null;
    const isCol0 = ci === 0;
    const w = isCol0 ? c0W : cNW;

    // fondo base sólido (sin clases /60 /40 — evita composite layers)
    let bgBase = "";
    if (isCol0 && isFrozenRow)
      bgBase = "#cbd5e1"; // slate-300
    else if (isCol0)
      bgBase = "#e2e8f0"; // slate-200
    else if (isFrozenRow && isFrozenCol)
      bgBase = "#fde68a"; // amber-200
    else if (isFrozenCol)
      bgBase = "#f1f5f9"; // slate-100
    else if (isFrozenRow) bgBase = "#fef3c7"; // amber-100

    const stickyStyle: React.CSSProperties = isFrozenCol
      ? {
          position: "sticky",
          left: leftMap[ci],
          zIndex: 3,
          minWidth: w,
          maxWidth: w,
          backgroundColor: bgBase || undefined,
        }
      : { minWidth: w, maxWidth: w, backgroundColor: bgBase || undefined };

    return (
      <td
        key={`${fila.id}-${ci}`}
        ref={(el) => {
          tdRefs.current[`${fi}-${ci}`] = el;
        }}
        className={`p-0 border border-gray-200 ${isCol0 ? "font-semibold" : ""}`}
        style={stickyStyle}
      >
        <div
          className="flex items-center overflow-hidden"
          style={{ height: ROW_H }}
        >
          <input
            type="text"
            value={celda.variable}
            disabled={celda.tipo === "etiqueta"}
            onChange={(e) => onCeldaChange(fila.id, ci, e.target.value)}
            onFocus={() => highlight(fi, ci)}
            onBlur={() => highlight(null, null)}
            placeholder={isCol0 ? `F${fi}` : "·"}
            ref={(el) => {
              inputRefs.current[`${fi}-${ci}`] = el;
            }}
            onKeyDown={(e) => handleKeyDown(e, fi, ci)}
            style={{ height: ROW_H }}
            className={`w-full px-1.5 outline-none text-[11px] bg-transparent truncate
              ${isCol0 ? "text-gray-800" : "text-gray-600"}
              ${celda.tipo === "etiqueta" ? "opacity-40 cursor-not-allowed" : ""}`}
          />
          {/* Menú celda — visible solo en hover via CSS puro, sin JS */}
          <button
            tabIndex={-1}
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setMenuPos({ x: r.left, y: r.bottom });
              activeRef.current = { fi, ci };
              setOpenMenu((p) => (p === celda.id ? null : celda.id));
            }}
            className="tbl-menu-btn shrink-0 p-0.5 text-gray-400 hover:text-gray-700"
          >
            <ChevronDown size={10} />
          </button>
        </div>
      </td>
    );
  };

  // ─────────────────────────────────────────
  //  Render
  // ─────────────────────────────────────────
  return (
    <div ref={containerRef} data-tbl className="w-full select-none">
      {/* CSS global: sin transition en celdas, hover del menú vía CSS puro */}
      <style>{`
        [data-tbl] .tbl-menu-btn { opacity: 0; }
        [data-tbl] td:hover .tbl-menu-btn,
        [data-tbl] th:hover .tbl-menu-btn { opacity: 1; }
      `}</style>

      {/* Info + badges */}
      <div className="flex items-center justify-between mb-1 px-0.5">
        <span className="text-[10px] text-gray-400 font-medium">
          {filas.length} filas · {numColumnas} cols
        </span>
        {(frozenRowsExtra.length > 0 || frozenColsExtra.length > 0) && (
          <div className="flex gap-1.5">
            {frozenColsExtra.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5">
                <Pin size={8} strokeWidth={2.5} /> {frozenColsExtra.length}c
              </span>
            )}
            {frozenRowsExtra.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5">
                <Pin size={8} strokeWidth={2.5} /> {frozenRowsExtra.length}f
              </span>
            )}
          </div>
        )}
      </div>

      {/* Scroll container */}
      <div
        className="rounded-lg border-2 border-gray-400 overflow-auto shadow-sm"
        style={{ maxHeight }}
      >
        <table
          className="border-collapse"
          style={{
            width: "max-content",
            minWidth: "100%",
            tableLayout: "fixed",
          }}
        >
          {/* THEAD — fila 0, siempre sticky top */}
          <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
            {filas[0] &&
              (() => {
                const fila = filas[0];
                return (
                  <tr>
                    {/* Esquina */}
                    <td
                      style={{
                        position: "sticky",
                        left: 0,
                        zIndex: 20,
                        width: PIN_W,
                        minWidth: PIN_W,
                        maxWidth: PIN_W,
                        backgroundColor: "#94a3b8",
                        height: ROW_H,
                      }}
                      className="border border-gray-300 p-0"
                    >
                      <div className="flex items-center justify-center h-full">
                        <Pin size={8} className="text-white/70" />
                      </div>
                    </td>

                    {orderedCols.map((ci) => {
                      const isFrozenCol = frozenColsSet.has(ci);
                      const isCol0 = ci === 0;
                      const celda = fila.celdas[ci];
                      if (!celda) return null;
                      const w = isCol0 ? c0W : cNW;
                      const bg = isCol0
                        ? "#94a3b8"
                        : isFrozenCol
                          ? "#cbd5e1"
                          : "#e2e8f0";

                      return (
                        <th
                          key={ci}
                          ref={(el) => {
                            tdRefs.current[`0-${ci}`] =
                              el as unknown as HTMLTableCellElement;
                          }}
                          className="p-0 border border-gray-300 font-normal"
                          style={
                            isFrozenCol
                              ? {
                                  position: "sticky",
                                  left: leftMap[ci],
                                  zIndex: 15,
                                  minWidth: w,
                                  maxWidth: w,
                                  backgroundColor: bg,
                                }
                              : {
                                  minWidth: w,
                                  maxWidth: w,
                                  backgroundColor: bg,
                                }
                          }
                        >
                          <div
                            className="relative flex items-center overflow-hidden"
                            style={{ height: ROW_H }}
                          >
                            <input
                              type="text"
                              value={celda.variable}
                              disabled={celda.tipo === "etiqueta"}
                              onChange={(e) =>
                                onCeldaChange(fila.id, ci, e.target.value)
                              }
                              onFocus={() => highlight(0, ci)}
                              onBlur={() => highlight(null, null)}
                              placeholder={isCol0 ? "···" : `C${ci + 1}`}
                              ref={(el) => {
                                inputRefs.current[`0-${ci}`] = el;
                              }}
                              onKeyDown={(e) => handleKeyDown(e, 0, ci)}
                              style={{ height: ROW_H }}
                              className="w-full px-1.5 outline-none text-[11px] font-bold text-gray-800 bg-transparent truncate"
                            />
                            <div className="flex items-center shrink-0">
                              {ci !== 0 && (
                                <button
                                  tabIndex={-1}
                                  onClick={() => toggleFreezeCol(ci)}
                                  className="tbl-menu-btn p-0.5 text-gray-500 hover:text-amber-600"
                                >
                                  {isFrozenCol ? (
                                    <PinOff size={10} />
                                  ) : (
                                    <Pin size={10} />
                                  )}
                                </button>
                              )}
                              <button
                                tabIndex={-1}
                                onClick={(e) => {
                                  const r =
                                    e.currentTarget.getBoundingClientRect();
                                  setMenuPos({ x: r.left, y: r.bottom });
                                  activeRef.current = { fi: 0, ci };
                                  setOpenMenu((p) =>
                                    p === celda.id ? null : celda.id,
                                  );
                                }}
                                className="tbl-menu-btn p-0.5 text-gray-500 hover:text-gray-800"
                              >
                                <ChevronDown size={10} />
                              </button>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-500/30" />
                        </th>
                      );
                    })}
                  </tr>
                );
              })()}
          </thead>

          {/* TBODY */}
          <tbody>
            {orderedRows
              .filter((ri) => ri !== 0)
              .map((ri, renderIdx) => {
                const fila = filas[ri];
                const isFrozenRow = frozenRowsSet.has(ri);
                const isLastFrz =
                  isFrozenRow && renderIdx === frozenRowsExtra.length - 1;
                const stickyTop = isFrozenRow
                  ? ROW_H + renderIdx * ROW_H
                  : undefined;
                const rowBg = isFrozenRow
                  ? "#fef3c7"
                  : ri % 2 === 0
                    ? "#ffffff"
                    : "#f8fafc";

                return (
                  <tr
                    key={fila.id}
                    style={{
                      ...(isFrozenRow
                        ? { position: "sticky", top: stickyTop, zIndex: 8 }
                        : {}),
                      backgroundColor: rowBg,
                    }}
                    className={isLastFrz ? "border-b-2 border-amber-400" : ""}
                  >
                    {/* Pin fila */}
                    <td
                      className="p-0 border border-gray-200 group/pin"
                      style={{
                        position: "sticky",
                        left: 0,
                        zIndex: isFrozenRow ? 9 : 5,
                        width: PIN_W,
                        minWidth: PIN_W,
                        maxWidth: PIN_W,
                        backgroundColor: isFrozenRow ? "#fde68a" : "#f1f5f9",
                      }}
                    >
                      <button
                        tabIndex={-1}
                        onClick={() => toggleFreezeRow(ri)}
                        style={{ height: ROW_H }}
                        className={`w-full flex items-center justify-center
                          ${isFrozenRow ? "text-amber-600" : "text-transparent group-hover/pin:text-gray-400"}`}
                      >
                        {isFrozenRow ? (
                          <PinOff size={10} strokeWidth={2} />
                        ) : (
                          <Pin size={10} strokeWidth={2} />
                        )}
                      </button>
                    </td>

                    {orderedCols.map((ci) =>
                      renderCelda(
                        ri,
                        ci,
                        fila,
                        isFrozenRow,
                        frozenColsSet.has(ci),
                      ),
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Menú contextual */}
      {openMenu &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: menuPos.y + 4, left: menuPos.x }}
            className="bg-white border border-gray-200 rounded-lg shadow-lg text-xs z-50 w-28 overflow-hidden"
          >
            {(["variable", "etiqueta"] as const).map((tipo, i) => (
              <div key={tipo}>
                {i > 0 && <div className="h-px bg-gray-100 mx-2" />}
                <button
                  className="block px-3 py-2 hover:bg-gray-50 w-full text-left text-gray-700 font-medium capitalize"
                  onClick={() => {
                    if (activeRef.current) {
                      const { fi, ci } = activeRef.current;
                      onTipoChange(filas[fi].id, ci, tipo);
                    }
                    setOpenMenu(null);
                  }}
                >
                  {tipo}
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}

export default memo(TablaInteractiva);

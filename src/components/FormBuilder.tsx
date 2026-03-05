import { useState, useEffect } from "react";
import {
  Plus,
  Download,
  Eye,
  EyeOff,
  Trash2,
  ArrowDownToLine,
  Bookmark,
  ChevronDown,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import type {
  Pagina,
  Pregunta,
  PreguntaAbierta,
  PreguntaCerrada,
  PreguntaOpcionMultiple,
  PreguntaTabular,
  QuestionType,
  OpenGroups,
  OpenSections,
} from "../types/forms";
//import interfaces/
import QuestionTypeSelector from "./QuestionTypeSelector";
import BulkQuestionModal from "./BulkQuestionModal";
import PreguntaAbiert from "./questions/PreguntaAbierta";
import PreguntaCerradaComp from "./questions/PreguntaCerrada";
import PreguntaOpcionMultipleComp from "./questions/PreguntaOpcionMultiple";
import PreguntaTabularComp from "./questions/PreguntaTabular";

//components/
import ConfirmDeleteModal from "./notifications/ConfirmDeleteModal";

import {
  guardarFormularioBackend,
  //descargarFormularioExcel,
} from "../utils/formActions";
import Tooltip from "./notifications/Tooltip";

function FormBuilder() {
  const [pagina, setPagina] = useState<Pagina>(() => {
    const saved = localStorage.getItem("form-builder-data");
    return saved
      ? JSON.parse(saved)
      : {
          nombre: "Mi Formulario",
          descripcion: "",
          secciones: [
            {
              id: crypto.randomUUID(),
              nombre: "Sección 1",
              grupos: [
                {
                  id: crypto.randomUUID(),
                  nombre: "Grupo 1",
                  preguntas: [],
                },
              ],
            },
          ],
        };
  });
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
  const [activeSectionOpen, setActiveSectionOpen] = useState<string | null>(
    () => localStorage.getItem("form-builder-open-section"),
  );

  const [activeGroupOpen, setActiveGroupOpen] = useState<string | null>(() =>
    localStorage.getItem("form-builder-open-group"),
  );

  const [openSections, setOpenSections] = useState<OpenSections>({});
  const [openGroups, setOpenGroups] = useState<OpenGroups>({});

  const toggleSection = (id: string) => {
    const newValue = activeSectionOpen === id ? null : id;

    setActiveSectionOpen(newValue);
    setOpenSections({ [id]: newValue === id });
  };

  const toggleGroup = (seccionId: string, grupoId: string) => {
    const newValue = activeGroupOpen === grupoId ? null : grupoId;

    setActiveGroupOpen(newValue);

    setOpenGroups({
      [seccionId]: {
        [grupoId]: newValue === grupoId,
      },
    });
  };

  useEffect(() => {
    localStorage.setItem("form-builder-data", JSON.stringify(pagina));
  }, [pagina]);

  useEffect(() => {
    if (activeSectionOpen) {
      localStorage.setItem("form-builder-open-section", activeSectionOpen);
    }
  }, [activeSectionOpen]);

  useEffect(() => {
    if (activeGroupOpen) {
      localStorage.setItem("form-builder-open-group", activeGroupOpen);
    }
  }, [activeGroupOpen]);

  const [showSelector, setShowSelector] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);

  const [menuGrupoAbierto, setMenuGrupoAbierto] = useState<string | null>(null);

  const addSeccion = () => {
    setPagina({
      ...pagina,
      secciones: [
        ...pagina.secciones,
        {
          id: crypto.randomUUID(),
          nombre: `Sección ${pagina.secciones.length + 1}`,
          grupos: [],
        },
      ],
    });
  };

  const deleteSeccion = (seccionId: string) => {
    if (pagina.secciones.length > 1) {
      setPagina({
        ...pagina,
        secciones: pagina.secciones.filter((s) => s.id !== seccionId),
      });
    }
  };

  const deleteGrupo = (seccionId: string, grupoId: string) => {
    setPagina((prev) => ({
      ...prev,
      secciones: prev.secciones.map((sec) => {
        if (sec.id === seccionId) {
          return {
            ...sec,
            grupos: sec.grupos.filter((g) => g.id !== grupoId),
          };
        }
        return sec;
      }),
    }));
  };

  const addMultiplePreguntas = (type: QuestionType, count: number) => {
    if (!activeSectionId || !activeGroupId) return;

    const newPreguntas: Pregunta[] = Array.from(
      { length: count },
      (_, idx) =>
        ({
          id: crypto.randomUUID(),
          tipo: type,
          titulo: `Pregunta ${idx + 1}`,
          descripcion: "",
          ...(type === "abierta" && { respuesta: "" }),
          ...(type === "cerrada" && { respuesta: { si: "", no: "" } }),
        }) as any,
    );

    setPagina({
      ...pagina,
      secciones: pagina.secciones.map((sec) => {
        if (sec.id === activeSectionId) {
          return {
            ...sec,
            grupos: sec.grupos.map((grp) => {
              if (grp.id === activeGroupId) {
                return {
                  ...grp,
                  preguntas: [...grp.preguntas, ...newPreguntas],
                };
              }
              return grp;
            }),
          };
        }
        return sec;
      }),
    });

    setShowBulkModal(false);
  };

  const addGrupo = (seccionId: string) => {
    setPagina({
      ...pagina,
      secciones: pagina.secciones.map((sec) => {
        if (sec.id === seccionId) {
          return {
            ...sec,
            grupos: [
              ...sec.grupos,
              {
                id: crypto.randomUUID(),
                nombre: `Grupo ${sec.grupos.length + 1}`,
                preguntas: [],
              },
            ],
          };
        }
        return sec;
      }),
    });
  };

  const addPregunta = (
    seccionId: string,
    grupoId: string,
    type: QuestionType,
  ) => {
    let nuevaPregunta: Pregunta;

    switch (type) {
      case "abierta":
        nuevaPregunta = {
          id: crypto.randomUUID(),
          tipo: "abierta",
          titulo: "",
          descripcion: "",
          respuesta: "",
        } as PreguntaAbierta;
        break;

      case "cerrada":
        nuevaPregunta = {
          id: crypto.randomUUID(),
          tipo: "cerrada",
          titulo: "",
          descripcion: "",
          respuesta: "si",
        } as PreguntaCerrada;
        break;

      case "opcion-multiple":
        nuevaPregunta = {
          id: crypto.randomUUID(),
          tipo: "opcion-multiple",
          titulo: "",
          descripcion: "",
          opciones: [{ id: crypto.randomUUID(), texto: "" }],
          respuestaSeleccionada: undefined,
        } as PreguntaOpcionMultiple;
        break;

      case "tabular":
        const numFilas = 3;
        const numColumnas = 3;

        const encabezadoColumnas = Array.from(
          { length: numColumnas },
          (_, i) => `Columna ${i + 1}`,
        );

        const filas = Array.from({ length: numFilas }, () => ({
          id: crypto.randomUUID(),
          celdas: Array.from({ length: numColumnas }, (_, colIndex) => ({
            id: crypto.randomUUID(),
            variable: "",
            columnaIndex: colIndex,
          })),
        }));

        nuevaPregunta = {
          id: crypto.randomUUID(),
          tipo: "tabular",
          titulo: "",
          descripcion: "",
          numFilas,
          numColumnas,
          encabezadoColumnas,
          filas,
        } as PreguntaTabular;

        break;

      default:
        throw new Error("Tipo de pregunta no válido");
    }

    setPagina((prev) => ({
      ...prev,
      secciones: prev.secciones.map((sec) => {
        if (sec.id === seccionId) {
          return {
            ...sec,
            grupos: sec.grupos.map((grp) => {
              if (grp.id === grupoId) {
                return {
                  ...grp,
                  preguntas: [...grp.preguntas, nuevaPregunta],
                };
              }
              return grp;
            }),
          };
        }
        return sec;
      }),
    }));

    setShowSelector(false);
  };

  const normalizarPreguntaTabular = (
    pregunta: PreguntaTabular,
  ): PreguntaTabular => {
    const numColumnas = pregunta.numColumnas;

    // Recorta o agrega encabezados para que coincidan con numColumnas
    let encabezadoColumnas = (pregunta.encabezadoColumnas ?? []).slice(
      0,
      numColumnas,
    );
    while (encabezadoColumnas.length < numColumnas) {
      encabezadoColumnas.push(`Columna ${encabezadoColumnas.length + 1}`);
    }

    // Normalizar celdas de cada fila
    const filas = pregunta.filas.map((fila) => {
      let celdas = fila.celdas.slice(0, numColumnas); // recorta si hay de más
      while (celdas.length < numColumnas) {
        celdas.push({
          id: crypto.randomUUID(),
          variable: "",
          columnaIndex: celdas.length,
        });
      }

      // Reindexar columnaIndex
      celdas = celdas.map((celda, index) => ({
        ...celda,
        columnaIndex: index,
      }));

      return {
        ...fila,
        celdas,
      };
    });

    return {
      ...pregunta,
      encabezadoColumnas,
      filas,
    };
  };
  const updatePregunta = (
    seccionId: string,
    grupoId: string,
    pregunta: Pregunta,
  ) => {
    let preguntaActualizada = pregunta;

    if (pregunta.tipo === "tabular") {
      preguntaActualizada = normalizarPreguntaTabular(
        pregunta as PreguntaTabular,
      );
    }

    setPagina({
      ...pagina,
      secciones: pagina.secciones.map((sec) => {
        if (sec.id === seccionId) {
          return {
            ...sec,
            grupos: sec.grupos.map((grp) => {
              if (grp.id === grupoId) {
                return {
                  ...grp,
                  preguntas: grp.preguntas.map((p) =>
                    p.id === pregunta.id ? preguntaActualizada : p,
                  ),
                };
              }
              return grp;
            }),
          };
        }
        return sec;
      }),
    });
  };

  const deletePregunta = (
    seccionId: string,
    grupoId: string,
    preguntaId: string,
  ) => {
    setPagina({
      ...pagina,
      secciones: pagina.secciones.map((sec) => {
        if (sec.id === seccionId) {
          return {
            ...sec,
            grupos: sec.grupos.map((grp) => {
              if (grp.id === grupoId) {
                return {
                  ...grp,
                  preguntas: grp.preguntas.filter((p) => p.id !== preguntaId),
                };
              }
              return grp;
            }),
          };
        }
        return sec;
      }),
    });
  };

  const updateSeccion = (id: string, nombre: string) => {
    setPagina({
      ...pagina,
      secciones: pagina.secciones.map((s) =>
        s.id === id ? { ...s, nombre } : s,
      ),
    });
  };

  const updateGrupo = (seccionId: string, grupoId: string, nombre: string) => {
    setPagina({
      ...pagina,
      secciones: pagina.secciones.map((sec) => {
        if (sec.id === seccionId) {
          return {
            ...sec,
            grupos: sec.grupos.map((g) =>
              g.id === grupoId ? { ...g, nombre } : g,
            ),
          };
        }
        return sec;
      }),
    });
  };

  const generateJSON = () => {
    const paginaCorregida = structuredClone(pagina);

    paginaCorregida.secciones.forEach((sec) => {
      sec.grupos.forEach((grp) => {
        grp.preguntas = grp.preguntas.map((preg) => {
          if (preg.tipo === "tabular") {
            return normalizarPreguntaTabular(preg as PreguntaTabular);
          }
          return preg;
        });
      });
    });

    return JSON.stringify(paginaCorregida, null, 2);
  };

  const downloadJSON = () => {
    const jsonData = generateJSON();
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "formulario-estructura.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (activeSectionOpen) {
      setOpenSections({ [activeSectionOpen]: true });
    }

    if (activeSectionOpen && activeGroupOpen) {
      setOpenGroups({
        [activeSectionOpen]: {
          [activeGroupOpen]: true,
        },
      });
    }
  }, []);

  const renderPregunta = (
    pregunta: Pregunta,
    seccionId: string,
    grupoId: string,
  ) => {
    const baseProps = {
      onUpdate: (p: any) => updatePregunta(seccionId, grupoId, p),
      onDelete: () => deletePregunta(seccionId, grupoId, pregunta.id),
    };

    if (pregunta.tipo === "abierta")
      return (
        <PreguntaAbiert key={pregunta.id} pregunta={pregunta} {...baseProps} />
      );
    if (pregunta.tipo === "cerrada")
      return (
        <PreguntaCerradaComp
          key={pregunta.id}
          pregunta={pregunta}
          {...baseProps}
        />
      );
    if (pregunta.tipo === "opcion-multiple")
      return (
        <PreguntaOpcionMultipleComp
          key={pregunta.id}
          pregunta={pregunta}
          {...baseProps}
        />
      );
    if (pregunta.tipo === "tabular")
      return (
        <PreguntaTabularComp
          key={pregunta.id}
          pregunta={pregunta}
          {...baseProps}
        />
      );

    return null;
  };

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
    <div className="py-12 px-4 flex flex-col items-center justify-center min-w-100">
      <div className="w-full max-w-300 bg-[#F4F5F7] rounded-2xl p-6 sm:p-10 lg:p-12 shadow-md mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
          {/* TITULO */}
          <h1 className="text-3xl font-bold text-gray-900">
            Constructor de Formularios
          </h1>

          {/* BOTONES */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Guardar */}
            <button
              onClick={() => guardarFormularioBackend(pagina)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FFFFFF] hover:bg-gray-400 text-black rounded-lg font-medium transition"
            >
              <Bookmark size={18} />
              Guardar formulario
            </button>

            {/* Descargar */}
            {/*<button
              onClick={() =>
                descargarFormularioExcel(pagina, () =>
                  setPagina({
                    nombre: "Mi Formulario",
                    descripcion: "",
                    secciones: [
                      {
                        id: crypto.randomUUID(),
                        nombre: "Sección 1",
                        grupos: [
                          {
                            id: crypto.randomUUID(),
                            nombre: "Grupo 1",
                            preguntas: [],
                          },
                        ],
                      },
                    ],
                  }),
                )
              }
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0A0D12] hover:bg-green-700 text-white rounded-lg font-medium transition"
            >
              <ArrowDownToLine size={18} />
              Descargar formulario
            </button>
             */}
          </div>
        </div>
        <div className="bg-white rounded-4xl shadow-xl overflow-hidden mb-8">
          <div className=" px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full"></div>
          <div className="p-8 space-y-4">
            <div>
              <div className="flex items-start gap-1 mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Nombre del formulario:
                </label>
                <span className="text-red-500 text-sm">*</span>
              </div>
              <input
                type="text"
                value={pagina.nombre}
                onChange={(e) =>
                  setPagina({ ...pagina, nombre: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg font-semibold text-gray-900"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Descripción:
              </label>
              <textarea
                value={pagina.descripcion || ""}
                onChange={(e) =>
                  setPagina({ ...pagina, descripcion: e.target.value })
                }
                placeholder="Descripción del formulario"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-20 text-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="space-y-8 mb-8">
          {pagina.secciones.map((seccion) => (
            <div
              key={seccion.id}
              className="bg-[#FFFFFF] rounded-4xl shadow-lg overflow-hidden"
            >
              {/* Header de la sección */}
              <div className="px-8 py-6 flex justify-between items-center gap-4">
                {/* Input nombre sección */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={seccion.nombre}
                    onChange={(e) => updateSeccion(seccion.id, e.target.value)}
                    style={{ width: `${seccion.nombre.length + 2}ch` }}
                    className="text-2xl font-bold text-gray-900 bg-[#F4F5F7] border border-[#F4F5F7] rounded-lg px-3 py-2 focus:outline-none"
                  />
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  {pagina.secciones.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        requestDelete(
                          "Eliminar Sección",
                          `Vas a eliminar la sección "${seccion.nombre}". ¿Estás seguro?`,
                          () => deleteSeccion(seccion.id),
                        );
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-[#E91C1C] hover:bg-red-200 rounded-lg transition-colors border-2 bg-[#FFCFCF]"
                    >
                      <Trash2 size={20} />
                      Eliminar Sección
                    </button>
                  )}

                  <button
                    onClick={() => toggleSection(seccion.id)}
                    className="ml-2 p-2 hover:bg-blue-200 rounded transition"
                  >
                    {openSections[seccion.id] ? (
                      <ChevronDown size={22} />
                    ) : (
                      <ChevronRight size={22} />
                    )}
                  </button>
                </div>
              </div>

              {/* Contenido colapsable */}
              {openSections[seccion.id] && (
                <div className="p-8 pt-1">
                  {seccion.grupos.map((grupo) => (
                    <div
                      key={grupo.id}
                      className="bg-[#FFFFFF] rounded-xl mb-4 relative"
                    >
                      {/* Contenedor principal */}
                      <div className="flex items-center rounded-md overflow-hidden">
                        {/* Input + botón de 3 puntos */}
                        <div className="flex items-center flex-1">
                          <div className="w-25">
                            <input
                              type="text"
                              value={grupo.nombre}
                              onChange={(e) =>
                                updateGrupo(
                                  seccion.id,
                                  grupo.id,
                                  e.target.value,
                                )
                              }
                              className="text-xl font-bold text-gray-800 px-3 py-1 focus:outline-none focus:ring-blue-500"
                            />
                          </div>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuGrupoAbierto(
                                  menuGrupoAbierto === grupo.id
                                    ? null
                                    : grupo.id,
                                );
                              }}
                              className="p-2 hover:bg-gray-200 transition bg-white"
                            >
                              <MoreVertical size={20} />
                            </button>
                          </div>

                          {/* Dropdown acciones */}
                          {menuGrupoAbierto === grupo.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setMenuGrupoAbierto(null)}
                              />
                              <div className="absolute top-full mt-1 left-25 rounded-lg shadow-lg z-50">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    requestDelete(
                                      "Eliminar Sección",
                                      `Vas a eliminar la el grupo "${grupo.nombre}". ¿Estás seguro?`,
                                      () => deleteGrupo(seccion.id, grupo.id),
                                    );
                                    setMenuGrupoAbierto(null);
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 text-[#E91C1C] hover:bg-red-200 rounded-lg transition-colors border-2 bg-[#FFCFCF]"
                                >
                                  <Trash2 size={18} />
                                  Eliminar grupo
                                </button>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Chevron al borde derecho */}
                        <button
                          onClick={() => toggleGroup(seccion.id, grupo.id)}
                          className="ml-2 p-1 hover:bg-gray-200 rounded transition"
                        >
                          {openGroups[seccion.id]?.[grupo.id] ? (
                            <ChevronDown size={20} />
                          ) : (
                            <ChevronRight size={20} />
                          )}
                        </button>
                      </div>

                      {/* Contenido colapsable del grupo */}
                      {openGroups[seccion.id]?.[grupo.id] && (
                        <div className="px-6 pb-6 space-y-2 pt-0">
                          <div className="space-y-4 mb-6">
                            {grupo.preguntas.map((pregunta) =>
                              renderPregunta(pregunta, seccion.id, grupo.id),
                            )}
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => {
                                setActiveSectionId(seccion.id);
                                setActiveGroupId(grupo.id);
                                setShowSelector(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-[#0A0D12] text-[#FFFFFF] rounded-lg hover:bg-gray-700 transition-colors font-medium"
                            >
                              <Plus size={18} />
                              Agregar Pregunta
                            </button>

                            <button
                              onClick={() => {
                                setActiveSectionId(seccion.id);
                                setActiveGroupId(grupo.id);
                                setShowBulkModal(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-[#F4F5F7] text-[#000000] rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                              <Plus size={18} />
                              Agregar Múltiples
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-4">
                    <button
                      onClick={() => addGrupo(seccion.id)}
                      className="w-35 py-3 border-2 border-[#F4F5F7] rounded-lg text-[#000000] font-medium bg-[#F4F5F7] hover:bg-gray-200"
                    >
                      + Agregar Grupo
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          <button
            onClick={addSeccion}
            className="flex items-center gap-2 px-6 py-3 bg-[#0A0D12] text-[#FFFFFF] rounded-lg hover:bg-gray-700  transition-colors font-medium shadow-lg"
          >
            <Plus size={20} />
            Agregar Sección
          </button>

          <Tooltip message="⚠️ SOLO PARA ENTORNO DE DESARROLLO">
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-lg"
            >
              {showJson ? <EyeOff size={20} /> : <Eye size={20} />}
              {showJson ? "Ocultar JSON" : "Ver JSON"}
            </button>
          </Tooltip>

          <Tooltip message="⚠️ SOLO PARA ENTORNO DE DESARROLLO">
            <button
              onClick={downloadJSON}
              title="⚠️ Solo para entorno de desarrollo"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg"
            >
              <Download size={20} />
              Descargar JSON
            </button>
          </Tooltip>
        </div>

        {showJson && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn overflow-hidden">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Estructura JSON del Formulario:
            </h3>
            <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto font-mono text-sm max-h-96 overflow-y-auto border border-gray-700">
              <code>{generateJSON()}</code>
            </pre>
          </div>
        )}

        {showSelector && activeSectionId && activeGroupId && (
          <QuestionTypeSelector
            onSelect={(type) =>
              addPregunta(activeSectionId, activeGroupId, type)
            }
            onClose={() => setShowSelector(false)}
          />
        )}

        {showBulkModal && activeSectionId && activeGroupId && (
          <BulkQuestionModal
            onAdd={addMultiplePreguntas}
            onClose={() => setShowBulkModal(false)}
          />
        )}
        <ConfirmDeleteModal
          isOpen={deleteConfig.isOpen}
          title={deleteConfig.title}
          message={deleteConfig.message}
          onClose={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
          onConfirm={deleteConfig.onConfirm}
        />
      </div>
    </div>
  );
}

export default FormBuilder;

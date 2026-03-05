import { useState } from "react";
import { Plus, Trash2, Download, Eye, EyeOff } from "lucide-react";

interface FormRow {
  id: string;
  nombre: string;
  email: string;
  edad: string;
  puesto: string;
}

function MatrixForm() {
  const [rows, setRows] = useState<FormRow[]>([
    { id: crypto.randomUUID(), nombre: "", email: "", edad: "", puesto: "" },
  ]);
  const [showJson, setShowJson] = useState(false);

  const addRow = () => {
    setRows([
      ...rows,
      { id: crypto.randomUUID(), nombre: "", email: "", edad: "", puesto: "" },
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const updateRow = (
    id: string,
    field: keyof Omit<FormRow, "id">,
    value: string,
  ) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const generateJSON = () => {
    const data = rows.map(({ id, ...rest }) => rest);
    return JSON.stringify(data, null, 2);
  };

  const downloadJSON = () => {
    const jsonData = generateJSON();
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "formulario-matriz.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Formulario Matriz</h1>
          <p className="text-blue-100 mt-2">
            Gestiona múltiples registros y exporta a JSON
          </p>
        </div>

        <div className="p-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Nombre
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Edad
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Puesto
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={row.nombre}
                        onChange={(e) =>
                          updateRow(row.id, "nombre", e.target.value)
                        }
                        placeholder="Juan Pérez"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="email"
                        value={row.email}
                        onChange={(e) =>
                          updateRow(row.id, "email", e.target.value)
                        }
                        placeholder="correo@ejemplo.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={row.edad}
                        onChange={(e) =>
                          updateRow(row.id, "edad", e.target.value)
                        }
                        placeholder="25"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={row.puesto}
                        onChange={(e) =>
                          updateRow(row.id, "puesto", e.target.value)
                        }
                        placeholder="Desarrollador"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length === 1}
                        className="p-2 text-[#E91C1C] hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Eliminar fila"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={addRow}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Agregar Fila
            </button>

            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              {showJson ? <EyeOff size={20} /> : <Eye size={20} />}
              {showJson ? "Ocultar JSON" : "Ver JSON"}
            </button>

            <button
              onClick={downloadJSON}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              <Download size={20} />
              Descargar JSON
            </button>
          </div>

          {showJson && (
            <div className="mt-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                JSON Generado:
              </h3>
              <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto shadow-inner border border-gray-700">
                <code>{generateJSON()}</code>
              </pre>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Total de registros:</span>{" "}
              {rows.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatrixForm;

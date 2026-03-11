import * as XLSX from "xlsx";

export function descargarFormularioExcel(data: any, resetCallback: () => void) {
  // Convertir JSON a hoja Excel
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([data]);
  XLSX.utils.book_append_sheet(wb, ws, "Formulario");

  // Generar archivo
  XLSX.writeFile(wb, "formulario.xlsx");

  // Reiniciar estado
  resetCallback();
}

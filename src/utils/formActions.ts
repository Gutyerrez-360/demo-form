import * as XLSX from "xlsx";

export function guardarFormularioBackend(_data: any) {
  alert("informacion procesada lista para enviar");

  // Simulación POST al backend -- esto no debe ser asi en la nueva version
  /*return fetch('/api/formulario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(res => {
      alert('Formulario guardado -- consumiendo API');
      return res;
    })
    .catch(err => {
      console.error('Error al guardar formulario', err);
      throw err;
    });*/
}

export function descargarFormularioExcel(data: any, resetCallback: () => void) {
  // Convertir JSON a hoja Excel
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([data]); // aquí luego ajustas la estructura
  XLSX.utils.book_append_sheet(wb, ws, "Formulario");

  // Generar archivo
  XLSX.writeFile(wb, "formulario.xlsx");

  // Reiniciar estado
  resetCallback();
}

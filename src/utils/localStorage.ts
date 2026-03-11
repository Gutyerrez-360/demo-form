export const getAccessCode = (): string | null => {
  try {
    const code = localStorage.getItem("access_code");
    return code;
  } catch (error) {
    console.error("No se pudo obtener access_code del localStorage", error);
    return null;
  }
};

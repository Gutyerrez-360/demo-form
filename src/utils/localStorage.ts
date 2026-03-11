// GET SECTION

export const getAccessCode = (): string | null => {
  try {
    const code = localStorage.getItem("access_code");
    return code;
  } catch (error) {
    console.error("No se pudo obtener access_code del localStorage", error);
    return null;
  }
};

export const getBuilderData = (): string | null => {
  try {
    const code = localStorage.getItem("form-builder-data");
    return code;
  } catch (error) {
    console.error("No se pudo obtener access_code del localStorage", error);
    return null;
  }
};

// REMOVE SECTION
export const removeAccessCode = (): void => {
  try {
    localStorage.removeItem("access_code");
  } catch (error) {
    console.error("No se pudo eliminar access_code del localStorage", error);
  }
};

export const removeBuilders = (): void => {
  try {
    localStorage.removeItem("form-builder-open-group");
    localStorage.removeItem("form-builder-open-section");
    localStorage.removeItem("form-builder-data");
  } catch (error) {
    console.error("No se pudo eliminar access_code del localStorage", error);
  }
};

export const removeBuilderData = (): void => {
  try {
    localStorage.removeItem("form-builder-data");
  } catch (error) {
    console.error("No se pudo eliminar access_code del localStorage", error);
  }
};

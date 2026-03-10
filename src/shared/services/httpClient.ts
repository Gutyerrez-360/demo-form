import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import env from "../../app/config/env";

// Instancia base
const httpClient: AxiosInstance = axios.create({
  baseURL: env.API_URL + env.API_PREFIJO_RUTA,
  timeout: env.API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Subida de archivos: se puede aumentar el límite del buffer
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    switch (error.response?.status) {
      case 400:
        console.error("Bad Request");
        break;
      case 401:
        window.location.href = "/";
        break;
      case 403:
        console.error("Sin permisos");
        break;
      case 404:
        console.error("No encontrado");
        break;
      case 500:
        console.error("Error del servidor");
        break;
    }
    return Promise.reject(error);
  },
);

// ── Métodos reutilizables ─────────────────────────────────────────────────────
const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    httpClient.get<T>(url, config).then((r) => r.data),

  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    httpClient.post<T>(url, body, config).then((r) => r.data),

  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    httpClient.put<T>(url, body, config).then((r) => r.data),

  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    httpClient.patch<T>(url, body, config).then((r) => r.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    httpClient.delete<T>(url, config).then((r) => r.data),

  // Subida de archivos (multipart/form-data)
  upload: <T>(url: string, formData: FormData, config?: AxiosRequestConfig) =>
    httpClient
      .post<T>(url, formData, {
        ...config,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),
};

export { httpClient };
export default http;

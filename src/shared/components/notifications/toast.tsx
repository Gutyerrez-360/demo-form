import { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

const CONFIG = {
  success: {
    icon: CheckCircle2,
    bg: "bg-green-500",
    bar: "bg-green-500",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-500",
    bar: "bg-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-yellow-500",
    bar: "bg-yellow-500",
  },
  info: {
    icon: Info,
    bg: "bg-blue-500",
    bar: "bg-blue-500",
  },
};

//  Singleton store
type Listener = (toasts: ToastItem[]) => void;
let toasts: ToastItem[] = [];
let listeners: Listener[] = [];

const emit = () => listeners.forEach((l) => l([...toasts]));

const addToast = (
  type: ToastType,
  title: string,
  message?: string,
  duration = 4000,
) => {
  const id = crypto.randomUUID();
  toasts = [...toasts, { id, type, title, message, duration }];
  emit();

  if (duration > 0) setTimeout(() => removeToast(id), duration);
};

const removeToast = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
};

const ToastCard = ({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) => {
  const [visible, setVisible] = useState(false);
  const cfg = CONFIG[item.type];
  const Icon = cfg.icon;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 350);
  };

  return (
    <>
      <style>{`
      @keyframes shrink { from { width: 100% } to { width: 0% } }
      @keyframes toast-in {
        0%   { opacity: 0; transform: translateX(70px) scale(0.96); }
        55%  { opacity: 1; transform: translateX(-4px) scale(1.01); }
        100% { opacity: 1; transform: translateX(0) scale(1); }
      }
      @keyframes toast-out {
        0%   { opacity: 1; transform: translateX(0) scale(1); }
        100% { opacity: 0; transform: translateX(70px) scale(0.96); }
      }
      .toast-enter { animation: toast-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      .toast-exit  { animation: toast-out 0.35s cubic-bezier(0.4, 0, 1, 1) forwards; }
    `}</style>

      <div
        className={`
        ${visible ? "toast-enter" : "toast-exit"}
        relative flex flex-col w-72 bg-white rounded-2xl shadow-xl
        border border-gray-100 overflow-hidden
      `}
      >
        {/* Fila: título + icon éxito + cerrar */}
        <div className="flex items-start gap-3 px-5 pt-4 pb-2">
          <p className="flex-1 text-base font-bold text-gray-900 leading-snug break-words">
            {item.title}
          </p>

          {/* Icon con fondo sólido */}
          <span
            className={`flex items-center justify-center w-7 h-7 rounded-full text-white ${cfg.bg}`}
          >
            <Icon size={16} />
          </span>

          <button
            onClick={handleDismiss}
            className="shrink-0 p-1 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Mensaje */}
        {item.message && (
          <p className="text-sm text-gray-500 leading-relaxed px-5 pb-4 pt-1">
            {item.message}
          </p>
        )}

        {/* Barra de progreso */}
        {!!item.duration && item.duration > 0 && (
          <div className="h-1 w-full bg-gray-100">
            <div
              className={`h-full ${cfg.bar} opacity-50`}
              style={{ animation: `shrink ${item.duration}ms linear forwards` }}
            />
          </div>
        )}
      </div>
    </>
  );
};

/* ── Contenedor ── */
const ToastContainer = () => {
  const [items, setItems] = useState<ToastItem[]>([...toasts]);

  const sync = useCallback((next: ToastItem[]) => setItems(next), []);

  useEffect(() => {
    listeners.push(sync);
    return () => {
      listeners = listeners.filter((l) => l !== sync);
    };
  }, [sync]);

  return (
    <div className="fixed top-5 right-5 z-100 flex flex-col gap-2 pointer-events-none">
      {items.map((item) => (
        <div key={item.id} className="pointer-events-auto">
          <ToastCard item={item} onDismiss={() => removeToast(item.id)} />
        </div>
      ))}
    </div>
  );
};

/* ── Montar el contenedor una sola vez ── */
const mount = () => {
  if (document.getElementById("toast-root")) return;
  const el = document.createElement("div");
  el.id = "toast-root";
  document.body.appendChild(el);
  createRoot(el).render(<ToastContainer />);
};

//  API pública
export const toast = {
  success: (title: string, message?: string, duration?: number) => {
    mount();
    addToast("success", title, message, duration);
  },
  error: (title: string, message?: string, duration?: number) => {
    mount();
    addToast("error", title, message, duration);
  },
  warning: (title: string, message?: string, duration?: number) => {
    mount();
    addToast("warning", title, message, duration);
  },
  info: (title: string, message?: string, duration?: number) => {
    mount();
    addToast("info", title, message, duration);
  },
};

// src/shared/components/layout/Header.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ChevronLeft, LogOut, Menu, X } from "lucide-react";

interface HeaderProps {
  onLogout?: () => void;
}

export default function Header({ onLogout }: Readonly<HeaderProps>) {
  // Navegacion
  const navigate = useNavigate();

  // Obtener la ubicacion
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isRoot = location.pathname === "/";

  const handleBack = () => {
    if (globalThis.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    onLogout?.();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#eef0f3] shadow-sm border-b border-gray-200 rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {!isRoot && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors border border-gray-300"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Regresar</span>
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/logo/logo.png"
              alt="BCR Logo"
              className="h-9 w-9 object-contain"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-gray-900 text-sm font-bold tracking-wide">
                Demo Forms
              </span>
              <span className="text-gray-500 text-xs">
                Sistema Demo de Formularios
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-200 hover:bg-red-100 border-2 border-red-300 transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="sm:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-[#eef0f3] px-4 py-3 flex flex-col gap-2">
          {!isRoot && (
            <button
              onClick={() => {
                handleBack();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft size={16} />
              Regresar
            </button>
          )}
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}

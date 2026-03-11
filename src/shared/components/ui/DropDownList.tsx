import { ChevronDown } from "lucide-react";

// Valor generico todos los ListItem deben tener id y nombre no es opcional
export interface ListItem {
  id: string;
  nombre: string;
}

// Cada sub-componente tiene una única razón para cambiar
interface DropdownLabelProps {
  text: string;
}

function DropdownLabel({ text }: DropdownLabelProps) {
  return (
    <label className="block text-sm font-medium text-gray-800 mb-1">
      {text}
    </label>
  );
}

// Extender estados sin modificar la lógica del trigger
interface DropdownTriggerState {
  disabled: boolean;
  loading: boolean;
  selected: ListItem | null;
  placeholder: string;
  disabledPlaceholder: string;
}

function resolveDisplayText({
  disabled,
  loading,
  selected,
  placeholder,
  disabledPlaceholder,
}: DropdownTriggerState): string {
  if (disabled) return disabledPlaceholder;
  if (loading) return "Cargando...";
  if (selected) return selected.nombre;
  return placeholder;
}

interface DropdownTriggerProps extends DropdownTriggerState {
  isOpen: boolean;
  onToggle: () => void;
}

function DropdownTrigger({
  disabled,
  loading,
  selected,
  placeholder,
  disabledPlaceholder,
  isOpen,
  onToggle,
}: DropdownTriggerProps) {
  const displayText = resolveDisplayText({
    disabled,
    loading,
    selected,
    placeholder,
    disabledPlaceholder,
  });

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none text-left 
        flex items-center justify-between transition-colors
        ${
          disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-gray-400"
        }`}
    >
      <span
        className={selected && !disabled ? "text-gray-900" : "text-gray-400"}
      >
        {displayText}
      </span>
      <ChevronDown
        size={16}
        className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}

interface DropdownPanelProps {
  items: ListItem[];
  loading: boolean;
  selected: ListItem | null;
  onSelect: (item: ListItem | null) => void;
}

function DropdownPanel({
  items,
  loading,
  selected,
  onSelect,
}: DropdownPanelProps) {
  if (loading) {
    return <div className="px-4 py-3 text-sm text-gray-400">Cargando...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="px-4 py-3 text-sm text-gray-400">Sin resultados</div>
    );
  }

  return (
    <>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors
            ${selected?.id === item.id ? "bg-gray-100 font-medium" : ""}`}
        >
          {item.nombre}
        </button>
      ))}
    </>
  );
}

// Open/Closed: se puede extender con renderItem sin modificar DropdownList
export interface DropdownListProps {
  label: string;
  items: ListItem[];
  selected: ListItem | null;
  onSelect: (item: ListItem | null) => void;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  disabledPlaceholder?: string;
}

export function DropdownList({
  label,
  items,
  selected,
  onSelect,
  isOpen,
  onToggle,
  disabled = false,
  loading = false,
  placeholder = "Selecciona una opción",
  disabledPlaceholder = "No disponible",
}: DropdownListProps) {
  return (
    <div>
      <DropdownLabel text={label} />

      <div className="relative">
        <DropdownTrigger
          disabled={disabled}
          loading={loading}
          selected={selected}
          placeholder={placeholder}
          disabledPlaceholder={disabledPlaceholder}
          isOpen={isOpen}
          onToggle={onToggle}
        />

        {isOpen && (
          <div
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 
            rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            <DropdownPanel
              items={items}
              loading={loading}
              selected={selected}
              onSelect={onSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
}

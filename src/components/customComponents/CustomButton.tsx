import React, { type ReactNode } from "react";

export interface BaseButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const Button: React.FC<BaseButtonProps> = ({
  onClick,
  children,
  className = "",
  icon,
  type = "button",
  disabled = false,
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${className}`}
    disabled={disabled}
  >
    {icon && <span>{icon}</span>}
    {children}
  </button>
);

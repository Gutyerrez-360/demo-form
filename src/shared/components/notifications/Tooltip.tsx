import {type ReactNode } from "react";

interface TooltipProps {
  message: string;
  children: ReactNode;
}

export default function Tooltip({ message, children }: TooltipProps) {
  return (
    <div className="relative group inline-block">
      {children}

      {/* Tooltip con flecha */}
     <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max bg-yellow-300 text-black text-sm font-semibold px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        {message}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-300 rotate-45"></div>
        </div>
    </div>
  );
}
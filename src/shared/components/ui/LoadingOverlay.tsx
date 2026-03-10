import { memo } from "react";

type LoadingOverlayProps = {
  visible: boolean;
  message?: string;
};

const LoadingOverlay = memo(
  ({ visible, message = "Cargando..." }: LoadingOverlayProps) => {
    if (!visible) return null;

    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full border-4 border-transparent border-t-[#0a1f6e] border-r-[#0a1f6e] animate-spin" />

          <div
            className="absolute w-36 h-36 rounded-full border-4 border-transparent border-b-[#0a1f6e]/40 border-l-[#0a1f6e]/40 animate-spin"
            style={{ animationDuration: "2s", animationDirection: "reverse" }}
          />
          <img
            src="/assets/logo/logobcr.png"
            alt="BCR"
            className="w-20 h-20 object-contain animate-pulse"
            style={{ animationDuration: "1.5s" }}
          />
        </div>

        <p className="mt-6 pt-2 text-sm font-semibold text-[#0a1f6e] tracking-widest uppercase">
          {message}
        </p>

        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#0a1f6e]/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  },
);

LoadingOverlay.displayName = "LoadingOverlay";

export default LoadingOverlay;

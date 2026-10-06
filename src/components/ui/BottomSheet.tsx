import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

import "./BottomSheet.css";

interface BottomSheetProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function BottomSheet({
  open,
  title,
  children,
  onClose,
}: BottomSheetProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="bottom-sheet-layer" role="presentation">
      <button
        type="button"
        className="bottom-sheet-backdrop"
        aria-label="Cerrar"
        onClick={onClose}
      />

      <section
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="bottom-sheet__handle" aria-hidden="true" />

        <header className="bottom-sheet__header">
          <h2 id={titleId}>{title}</h2>

          <button
            ref={closeButtonRef}
            type="button"
            className="bottom-sheet__close"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <div className="bottom-sheet__body">{children}</div>
      </section>
    </div>
  );
}

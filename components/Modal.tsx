"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel: string;
  maxWidthClassName?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  ariaLabel,
  maxWidthClassName = "max-w-2xl",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-texto/50 p-4 animate-fade-in"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={`relative w-full ${maxWidthClassName} max-h-[85vh] overflow-y-auto rounded-2xl bg-blanco p-6 sm:p-8 shadow-xl`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-crema text-texto transition hover:bg-rosa-palido focus-visible:outline focus-visible:outline-2 focus-visible:outline-rosa"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

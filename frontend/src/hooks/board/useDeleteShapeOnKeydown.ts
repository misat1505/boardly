"use client";

import { useWhiteboardContext } from "@/context/WhiteboardContext";
import { TShape } from "@/types/shapes";
import { useEffect } from "react";

export default function useDeleteShapeOnKeydown(id: TShape["id"]) {
  const { clearShapeSelection, setShapes } = useWhiteboardContext();

  const deleteShape = () => {
    clearShapeSelection();
    setShapes((prev) => prev.filter((s) => s.id !== id));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (
          tag === "input" ||
          tag === "textarea" ||
          (e.target as HTMLElement).isContentEditable
        ) {
          return;
        }

        e.preventDefault();
        deleteShape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { deleteShape };
}

"use client";

import { useWhiteboardContext } from "@/context/WhiteboardContext";
import { TShape } from "@/types/shapes";

export default function useIsShapeSelected(id: TShape["id"]): boolean {
  const { groupSelectionShapes, selectedShapeId } = useWhiteboardContext();

  const isInGroupSelection = groupSelectionShapes.includes(id);
  const isSelected = selectedShapeId === id || isInGroupSelection;

  return isSelected;
}

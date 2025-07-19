import { DisplayableShape, Selection, Shape } from "@/types/shapes";

export function detectCollisions(
  shapes: Shape[],
  selectionRectangle: Selection
): Shape[] {
  const collisions: Shape[] = [];

  shapes.forEach((shape) => {
    if (!(shape instanceof DisplayableShape)) return;

    if (shape.isColliding(selectionRectangle)) {
      collisions.push(shape);
    }
  });

  return collisions;
}

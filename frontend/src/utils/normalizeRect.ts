export function normalizeRect(rect: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  let x = rect.x;
  let y = rect.y;
  let width = rect.width;
  let height = rect.height;

  if (width < 0) {
    x += width;
    width = Math.abs(width);
  }
  if (height < 0) {
    y += height;
    height = Math.abs(height);
  }

  return { x, y, width, height };
}

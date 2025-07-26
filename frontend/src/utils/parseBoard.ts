import { Board } from "@/types/Board";
import {
  Blank,
  Handwrite,
  Image,
  Rectangle,
  Selection,
  Shape,
  Text,
  TShape,
} from "@/types/shapes";

export function parseBoard(board: Board["content"]): Shape[] {
  const data = JSON.parse(board) as TShape[];

  const shapes = data.map((shape) => {
    if (shape.type === "blank") return new Blank({ ...shape });
    else if (shape.type === "handwrite") return new Handwrite({ ...shape });
    else if (shape.type === "rect") return new Rectangle({ ...shape });
    else if (shape.type === "selection") return new Selection({ ...shape });
    else if (shape.type === "image") return new Image({ ...shape });
    else return new Text({ ...shape });
  });

  return shapes;
}

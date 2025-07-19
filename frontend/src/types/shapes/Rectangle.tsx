import { normalizeRect } from "@/utils/normalizeRect";
import { Selection } from "./Selection";
import { DisplayableShape } from "./Shape";
import RectangleNode from "@/components/shapes/RectangleNode";

export type TRectangle = {
  id: string;
  x: number;
  y: number;
  type: "rect";
  width: number;
  height: number;
  color: string;
};

export class Rectangle extends DisplayableShape {
  width: number;
  height: number;
  color: string;

  constructor(data: Omit<TRectangle, "type">) {
    super({ id: data.id, x: data.x, y: data.y });
    this.width = data.width;
    this.height = data.height;
    this.color = data.color;
  }

  isColliding(selection: Selection): boolean {
    const rect = normalizeRect({
      x: this.x,
      y: this.y,
      height: this.height,
      width: this.width,
    });

    return !(
      rect.x + rect.width < selection.x ||
      selection.x + selection.width < rect.x ||
      rect.y + rect.height < selection.y ||
      selection.y + selection.height < rect.y
    );
  }

  jsonify(): TRectangle {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      color: this.color,
      width: this.width,
      height: this.height,
      type: "rect",
    };
  }

  render(): React.ReactNode {
    return <RectangleNode rectangle={this} />;
  }
}

import { Selection } from "./Selection";
import { DisplayableShape } from "./Shape";
import HandwriteNode from "@/components/shapes/HandwriteNode";

export type THandwrite = {
  id: string;
  x: number;
  y: number;
  color: string;
  width: number;
  points: number[];
  type: "handwrite";
};

export class Handwrite extends DisplayableShape {
  color: string;
  width: number;
  points: number[];

  constructor(data: Omit<THandwrite, "type">) {
    super({ id: data.id, x: data.x, y: data.y });
    this.width = data.width;
    this.color = data.color;
    this.points = data.points;
  }

  isColliding(selection: Selection): boolean {
    for (let i = 0; i < this.points.length; i += 2) {
      const x = this.points[i];
      const y = this.points[i + 1];

      if (
        x + this.x >= selection.x &&
        x + this.x <= selection.x + selection.width &&
        y + this.y >= selection.y &&
        y + this.y <= selection.y + selection.height
      ) {
        return true;
      }
    }

    return false;
  }

  jsonify(): THandwrite {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      color: this.color,
      width: this.width,
      points: this.points,
      type: "handwrite",
    };
  }

  render(): React.ReactNode {
    return <HandwriteNode handwrite={this} />;
  }
}

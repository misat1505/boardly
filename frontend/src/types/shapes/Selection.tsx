import { DisplayableShape } from "./Shape";
import SelectionNode from "@/components/shapes/SelectionNode";

export type TSelection = {
  id: string;
  x: number;
  y: number;
  type: "selection";
  width: number;
  height: number;
};

export class Selection extends DisplayableShape {
  width: number;
  height: number;

  constructor(data: Omit<TSelection, "type">) {
    super({ id: data.id, x: data.x, y: data.y });
    this.width = data.width;
    this.height = data.height;
  }

  isColliding(selection: Selection): boolean {
    return false;
  }

  normalize() {
    if (this.width < 0) {
      this.x += this.width;
      this.width = Math.abs(this.width);
    }
    if (this.height < 0) {
      this.y += this.height;
      this.height = Math.abs(this.height);
    }
  }

  jsonify(): TSelection {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      type: "selection",
    };
  }

  render(): React.ReactNode {
    return <SelectionNode selection={this} />;
  }
}

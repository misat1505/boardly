import TextNode from "@/components/shapes/TextNode";
import { Selection } from "./Selection";
import { DisplayableShape } from "./Shape";
import { normalizeRect } from "@/utils/normalizeRect";

export type TText = {
  id: string;
  x: number;
  y: number;
  type: "text";
  text: string;
  fontSize: number;
  color: string;
  width: number;
  height: number;
};

export class Text extends DisplayableShape {
  text: string;
  fontSize: number;
  color: string;
  width: number;
  height: number;

  constructor(data: Omit<TText, "type">) {
    super({ id: data.id, x: data.x, y: data.y });
    this.text = data.text;
    this.height = data.height;
    this.fontSize = data.fontSize;
    this.color = data.color;
    this.width = data.width;
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

  jsonify(): TText {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      color: this.color,
      width: this.width,
      text: this.text,
      height: this.height,
      fontSize: this.fontSize,
      type: "text",
    };
  }

  render(): React.ReactNode {
    return <TextNode text={this} />;
  }
}

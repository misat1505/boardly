import Konva from "konva";
import { TBlank } from "./Blank";
import { THandwrite } from "./Handwrite";
import { TImage } from "./Image";
import { TRectangle } from "./Rectangle";
import { Selection, TSelection } from "./Selection";
import { TText } from "./Text";

export type TShape =
  | TBlank
  | THandwrite
  | TRectangle
  | TSelection
  | TText
  | TImage;

export abstract class Shape {
  constructor(public id: string) {}

  abstract jsonify(): Record<string, any>;
}

export abstract class DisplayableShape extends Shape {
  public x: number;
  public y: number;

  constructor(data: { id: string; x: number; y: number }) {
    super(data.id);
    this.x = data.x;
    this.y = data.y;
  }

  abstract isColliding(selection: Selection): boolean;

  abstract render(): React.ReactNode;
}

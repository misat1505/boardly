import { Shape } from "./Shape";

export type TBlank = { id: string; type: "blank" };

export class Blank extends Shape {
  constructor(data: Omit<TBlank, "type">) {
    super(data.id);
  }

  jsonify(): TBlank {
    return {
      id: this.id,
      type: "blank",
    };
  }
}

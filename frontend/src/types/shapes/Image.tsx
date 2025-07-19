import { normalizeRect } from "@/utils/normalizeRect";
import { Selection } from "./Selection";
import { DisplayableShape } from "./Shape";
import ImageNode from "@/components/shapes/ImageNode";

export type TImage = {
  id: string;
  x: number;
  y: number;
  type: "image";
  imageUrl: string;
  scale: number;
  dimensions?: {
    width: number;
    height: number;
  };
};

export class Image extends DisplayableShape {
  imageUrl: string;
  scale: number;
  dimensions?: {
    width: number;
    height: number;
  };

  constructor(data: Omit<TImage, "type">) {
    super({ id: data.id, x: data.x, y: data.y });
    this.imageUrl = data.imageUrl;
    this.scale = data.scale;
    this.dimensions = data.dimensions;
  }

  isColliding(selection: Selection): boolean {
    const rect = normalizeRect({
      x: this.x,
      y: this.y,
      height: this.scale * this.dimensions!.height,
      width: this.scale * this.dimensions!.width,
    });

    return !(
      rect.x + rect.width < selection.x ||
      selection.x + selection.width < rect.x ||
      rect.y + rect.height < selection.y ||
      selection.y + selection.height < rect.y
    );
  }

  jsonify(): TImage {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      imageUrl: this.imageUrl,
      scale: this.scale,
      dimensions: this.dimensions,
      type: "image",
    };
  }

  render(): React.ReactNode {
    return <ImageNode shape={this} />;
  }
}

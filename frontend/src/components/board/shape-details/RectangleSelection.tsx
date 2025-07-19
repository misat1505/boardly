import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Input } from "@/components/ui/input";
import { useWhiteboardContext } from "@/context/WhiteboardContext";
import { Rectangle } from "@/types/shapes";
import { ChangeEvent } from "react";

const RectangleSelection = ({ rectangle }: { rectangle: Rectangle }) => {
  const { setShapes } = useWhiteboardContext();

  const handleChange =
    (attr: "x" | "y" | "width" | "height" | "color") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      let value: any = e.target.value;
      if (attr !== "color") {
        const parsed = parseFloat(e.target.value);
        value = isNaN(parsed) ? 0 : parsed;
      }

      setShapes((prev) =>
        prev.map((s) => {
          if (s.id !== rectangle.id || !(s instanceof Rectangle)) return s;

          return new Rectangle({
            ...s,
            [attr]: value,
          });
        })
      );
    };

  return (
    <div className="rounded-x p-4 w-full max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Rectangle Item</h2>

      <div className="text-sm">
        ID:{" "}
        <span className="font-mono text-muted-foreground">{rectangle.id}</span>
      </div>

      <div className="space-y-2">
        <FloatingLabelInput
          id="x"
          label="X"
          value={rectangle.x}
          type="number"
          onChange={handleChange("x")}
        />
        <FloatingLabelInput
          id="y"
          label="Y"
          value={rectangle.y}
          type="number"
          onChange={handleChange("y")}
        />

        <div className="grid grid-cols-2 gap-2 mt-4">
          <FloatingLabelInput
            id="height"
            label="Height"
            value={rectangle.height}
            type="number"
            onChange={handleChange("height")}
          />

          <FloatingLabelInput
            id="width"
            label="Width"
            value={rectangle.width}
            type="number"
            onChange={handleChange("width")}
          />
        </div>
      </div>
      <FloatingLabelInput
        id="color"
        label="Color"
        value={rectangle.color}
        type="color"
        onChange={handleChange("color")}
      />
    </div>
  );
};

export default RectangleSelection;

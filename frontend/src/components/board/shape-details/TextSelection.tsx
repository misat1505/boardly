import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { FloatingLabelTextarea } from "@/components/ui/floating-label-textarea";
import { Textarea } from "@/components/ui/textarea";
import { useWhiteboardContext } from "@/context/WhiteboardContext";
import { Text } from "@/types/shapes";
import { ChangeEvent } from "react";

const TextSelection = ({ text }: { text: Text }) => {
  const { setShapes } = useWhiteboardContext();

  const handleChange =
    (attr: "x" | "y" | "width" | "height" | "fontSize" | "color" | "text") =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value: any = e.target.value;
      if (!["color", "text"].includes(attr)) {
        const parsed = parseFloat(e.target.value);
        value = isNaN(parsed) ? 0 : parsed;
      }

      setShapes((prev) =>
        prev.map((s) => {
          if (s.id !== text.id || !(s instanceof Text)) return s;
          return new Text({
            ...s,
            [attr]: value,
          });
        })
      );
    };

  return (
    <div className="rounded-x p-4 w-full max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Text Item</h2>

      <div className="text-sm">
        ID: <span className="font-mono text-muted-foreground">{text.id}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FloatingLabelInput
          id="x"
          label="X"
          value={text.x}
          type="number"
          onChange={handleChange("x")}
        />
        <FloatingLabelInput
          id="y"
          label="Y"
          value={text.y}
          type="number"
          onChange={handleChange("y")}
        />

        <FloatingLabelInput
          id="height"
          label="Height"
          value={text.height}
          type="number"
          onChange={handleChange("height")}
        />

        <FloatingLabelInput
          id="width"
          label="Width"
          value={text.width}
          type="number"
          onChange={handleChange("width")}
        />

        <FloatingLabelInput
          id="font-size"
          label="Font size"
          value={text.fontSize}
          type="number"
          onChange={handleChange("fontSize")}
        />

        <FloatingLabelInput
          id="color"
          label="Color"
          value={text.color}
          type="color"
          onChange={handleChange("color")}
        />
      </div>

      <FloatingLabelTextarea
        id="text"
        label="Text"
        onChange={handleChange("text")}
        value={text.text}
        className="max-h-96"
      />
    </div>
  );
};

export default TextSelection;

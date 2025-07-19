import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Input } from "@/components/ui/input";
import { useWhiteboardContext } from "@/context/WhiteboardContext";
import { Handwrite } from "@/types/shapes";
import { ChangeEvent } from "react";
import { RxCross2 } from "react-icons/rx";

const HandwriteSelection = ({ handwrite }: { handwrite: Handwrite }) => {
  const { setShapes } = useWhiteboardContext();

  const handleChange =
    (attr: "x" | "y" | "width" | "color") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      let value: any = e.target.value;
      if (attr !== "color") {
        const parsed = parseFloat(e.target.value);
        value = isNaN(parsed) ? 0 : parsed;
      }

      setShapes((prev) =>
        prev.map((s) => {
          if (s.id !== handwrite.id || !(s instanceof Handwrite)) return s;
          return new Handwrite({
            ...s,
            [attr]: value,
          });
        })
      );
    };

  const handlePointsChange = (id: number, value: number) => {
    setShapes((prev) =>
      prev.map((s) => {
        if (s.id !== handwrite.id || !(s instanceof Handwrite)) return s;

        const newPoints = [...s.points];
        newPoints[id] = value;

        return new Handwrite({
          ...s,
          points: newPoints,
        });
      })
    );
  };

  const handlePointDelete = (startId: number) => {
    setShapes((prev) =>
      prev.map((s) => {
        if (s.id !== handwrite.id || !(s instanceof Handwrite)) return s;

        const newPoints = [...s.points];
        newPoints.splice(startId, 2);

        return new Handwrite({
          ...s,
          points: newPoints,
        });
      })
    );
  };

  const toCoordinatePairs = (points: number[]): Array<Array<number>> => {
    const pairs = [];
    for (let i = 0; i < points.length; i += 2) {
      pairs.push([points[i], points[i + 1]]);
    }
    return pairs;
  };

  const addPoint = (afterId?: number) => {
    setShapes((prev) =>
      prev.map((s) => {
        if (s.id !== handwrite.id || !(s instanceof Handwrite)) return s;

        const newPoints = [...s.points];
        const insertAt = afterId !== undefined ? (afterId + 1) * 2 : 0;
        newPoints.splice(insertAt, 0, 0, 0);

        return new Handwrite({
          ...s,
          points: newPoints,
        });
      })
    );
  };

  return (
    <div className="rounded-x p-4 w-full max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Handwrite Item</h2>

      <div className="text-sm">
        ID:{" "}
        <span className="font-mono text-muted-foreground">{handwrite.id}</span>
      </div>

      <div className="space-y-4">
        <FloatingLabelInput
          id="x"
          label="X"
          value={handwrite.x}
          type="number"
          onChange={handleChange("x")}
        />

        <FloatingLabelInput
          id="y"
          label="Y"
          value={handwrite.y}
          type="number"
          onChange={handleChange("y")}
        />

        <div className="grid grid-cols-2 gap-2">
          <FloatingLabelInput
            id="color"
            label="Color"
            value={handwrite.color}
            type="color"
            onChange={handleChange("color")}
          />

          <FloatingLabelInput
            id="width"
            label="Width"
            value={handwrite.width}
            type="number"
            onChange={handleChange("width")}
          />
        </div>

        <div className="p-2">
          <label className="mb-1 text-sm font-medium">Points</label>
          <div className="max-h-56 overflow-auto p-2">
            <Button
              className="hover:cursor-pointer w-full mb-2"
              variant="secondary"
              onClick={() => addPoint()}
              title="Add point"
            >
              Add point
            </Button>
            {toCoordinatePairs(handwrite.points).map((pair, id) => (
              <div key={id} className="group">
                <div className="flex gap-x-2">
                  <Input
                    type="number"
                    value={pair[0]}
                    className="mb-2"
                    onChange={(e) =>
                      handlePointsChange(id * 2, parseFloat(e.target.value))
                    }
                  />
                  <Input
                    type="number"
                    value={pair[1]}
                    className="mb-2"
                    onChange={(e) =>
                      handlePointsChange(id * 2 + 1, parseFloat(e.target.value))
                    }
                  />
                  <Button
                    variant="outline"
                    className="hover:cursor-pointer"
                    title="Delete point"
                    onClick={() => handlePointDelete(id)}
                  >
                    <RxCross2 />
                  </Button>
                </div>
                <Button
                  className="hidden group-hover:block hover:cursor-pointer w-full mb-2"
                  variant="secondary"
                  onClick={() => addPoint(id)}
                  title="Add point"
                >
                  Add point
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandwriteSelection;

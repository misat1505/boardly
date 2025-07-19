import { Tour as TourComponent } from "@/components/ui/tour";
import { PropsWithChildren } from "react";

type TourProps = PropsWithChildren;

const Tour = ({ children }: TourProps) => {
  return (
    <TourComponent
      steps={[
        {
          target: "step-tools",
          step: (
            <div>
              <h2 className="text-base font-semibold mb-1">Tool Panel</h2>
              <p className="text-sm text-muted-foreground">
                This is the main control panel of the board. Choose any tool
                from here to interact with the canvas.
              </p>
            </div>
          ),
        },
        {
          target: "step-moving-tool",
          step: (
            <div>
              <h2 className="text-base font-semibold mb-1">Move Tool</h2>
              <p className="text-sm text-muted-foreground">
                Use this to move around the board or reposition existing
                elements.
              </p>
            </div>
          ),
        },
        {
          target: "step-drawing-tool",
          step: (
            <div>
              <h2 className="text-base font-semibold mb-1">Draw Tool</h2>
              <p className="text-sm text-muted-foreground">
                Draw freely on the board with your mouse — just like a digital
                pen.
              </p>
            </div>
          ),
        },
        {
          target: "step-rectangle-tool",
          step: (
            <div>
              <h2 className="text-base font-semibold mb-1">Rectangle Tool</h2>
              <p className="text-sm text-muted-foreground">
                Click and drag to create rectangles. Useful for diagrams, boxes,
                or layouts.
              </p>
            </div>
          ),
        },
        {
          target: "step-selection-tool",
          step: (
            <div>
              <h2 className="text-base font-semibold mb-1">Selection Tool</h2>
              <p className="text-sm text-muted-foreground">
                Select and move multiple elements at once by dragging a
                selection area.
              </p>
            </div>
          ),
        },
        {
          target: "step-textarea-tool",
          step: (
            <div>
              <h2 className="text-base font-semibold mb-1">Text Tool</h2>
              <p className="text-sm text-muted-foreground">
                Add text annotations anywhere on the board using this tool.
              </p>
            </div>
          ),
        },
        {
          target: "step-color-selection",
          step: (
            <div>
              <h2 className="text-base font-semibold mb-1">Color Picker</h2>
              <p className="text-sm text-muted-foreground">
                Select a color to apply it to shapes, drawings, or text. This
                affects the next element you create.
              </p>
            </div>
          ),
        },
      ]}
    >
      {children}
    </TourComponent>
  );
};

export default Tour;

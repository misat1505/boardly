import { Button } from "@/components/ui/button";
import { useWhiteboardContext } from "@/context/WhiteboardContext";
import { Handwrite, Rectangle, Image, Text } from "@/types/shapes";
import { FaTrash } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import HandwriteSelection from "./HandwriteSelection";
import RectangleSelection from "./RectangleSelection";
import ImageSelection from "./ImageSelection";
import useDeleteShapeOnKeydown from "@/hooks/board/useDeleteShapeOnKeydown";
import TextSelection from "./TextSelection";

const SelectedShapeDetails = () => {
  const { selectedShapeId, shapes, clearShapeSelection } =
    useWhiteboardContext();

  const shape = shapes.find((s) => s.id === selectedShapeId)!;

  const { deleteShape } = useDeleteShapeOnKeydown(selectedShapeId!);

  return (
    <section className="fixed right-4 top-1/2 -translate-y-1/2 p-2 rounded-md bg-sidebar border-sidebar-border border flex flex-col gap-2 z-10 hover:cursor-auto">
      <div className="relative">
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          <Button
            onClick={deleteShape}
            variant="destructive"
            className="hover:cursor-pointer"
            title="Delete shape"
          >
            <FaTrash />
          </Button>
          <Button
            onClick={clearShapeSelection}
            className="hover:cursor-pointer"
            title="Close"
          >
            <RxCross2 />
          </Button>
        </div>
        {shape instanceof Handwrite ? (
          <HandwriteSelection handwrite={shape} />
        ) : null}
        {shape instanceof Rectangle ? (
          <RectangleSelection rectangle={shape} />
        ) : null}
        {shape instanceof Image ? <ImageSelection image={shape} /> : null}
        {shape instanceof Text ? <TextSelection text={shape} /> : null}
      </div>
    </section>
  );
};

export default SelectedShapeDetails;

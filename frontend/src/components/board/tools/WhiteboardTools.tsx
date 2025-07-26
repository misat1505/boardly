import { useWhiteboardContext } from "@/context/WhiteboardContext";
import { Button } from "../../ui/button";
import { FaSave } from "react-icons/fa";
import { PiCursorFill, PiSelectionBold } from "react-icons/pi";
import { toast } from "sonner";
import { LuRectangleHorizontal } from "react-icons/lu";
import { BoardMode } from "@/types/BoardMode";
import DrawingHoverCard from "./DrawingHoverCard";
import TextareaHoverCard from "./TextareaHoverCard";
import { Input } from "../../ui/input";
import { useLocalStorage } from "usehooks-ts";
import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKeys";

const WhiteBoardTools = () => {
  const [color, setColor] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.COLOR.name,
    LOCAL_STORAGE_KEYS.COLOR.defaultValue
  );
  const { toggleMode, mode, save } = useWhiteboardContext();

  return (
    <div className="fixed top-1/2 left-4 rounded-md bg-sidebar border-sidebar-border border -translate-y-1/2 flex flex-col p-2 gap-2 z-10 hover:cursor-auto step-tools">
      <Button
        onClick={() => toggleMode(BoardMode.MOVING)}
        title="Move"
        className="hover:cursor-pointer step-moving-tool"
        variant={mode === BoardMode.MOVING ? "default" : "outline"}
      >
        <PiCursorFill />
      </Button>

      <DrawingHoverCard />

      <Button
        variant={mode === BoardMode.CREATING_RECTANGLE ? "default" : "outline"}
        onClick={() => toggleMode(BoardMode.CREATING_RECTANGLE)}
        className="hover:cursor-pointer step-rectangle-tool"
        title="Draw rectangle"
      >
        <LuRectangleHorizontal />
      </Button>

      <Button
        variant={
          mode === BoardMode.USING_SELECTION_TOOL ? "default" : "outline"
        }
        onClick={() => toggleMode(BoardMode.USING_SELECTION_TOOL)}
        className="hover:cursor-pointer step-selection-tool"
        title="Select"
      >
        <PiSelectionBold />
      </Button>

      <TextareaHoverCard />

      <Input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="p-0 rounded-none hover:cursor-pointer step-color-selection"
      />

      <Button
        onClick={() => {
          save();
          toast("Board saved successfully.");
        }}
        title="save"
        className="hover:cursor-pointer mt-20"
        variant="outline"
      >
        <FaSave />
      </Button>
    </div>
  );
};

export default WhiteBoardTools;

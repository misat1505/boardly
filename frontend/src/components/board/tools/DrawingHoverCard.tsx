import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKeys";
import { useWhiteboardContext } from "@/context/WhiteboardContext";
import { cn } from "@/lib/utils";
import { BoardMode } from "@/types/BoardMode";
import { useRef, useState } from "react";
import { FaPen } from "react-icons/fa";
import { useLocalStorage } from "usehooks-ts";

const DrawingHoverCard = () => {
  const [brushColor, setBrushColor] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.COLOR.name,
    LOCAL_STORAGE_KEYS.COLOR.defaultValue
  );
  const [brushSize, setBrushSize] = useLocalStorage<number>(
    LOCAL_STORAGE_KEYS.BRUSH_SIZE.name,
    LOCAL_STORAGE_KEYS.BRUSH_SIZE.defaultValue
  );
  const { toggleMode, mode } = useWhiteboardContext();
  const [open, setOpen] = useState(false);
  const enterTimeout = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
      leaveTimeout.current = null;
    }

    enterTimeout.current = setTimeout(() => {
      setOpen(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (enterTimeout.current) {
      clearTimeout(enterTimeout.current);
      enterTimeout.current = null;
    }

    leaveTimeout.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  return (
    <HoverCard open={open}>
      <HoverCardTrigger asChild>
        <Button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => toggleMode(BoardMode.DRAWING)}
          className="hover:cursor-pointer step-drawing-tool"
          variant={mode === BoardMode.DRAWING ? "default" : "outline"}
        >
          <FaPen />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        side="right"
        align="center"
        className="cursor-auto w-52 p-4"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Color
            </label>
            <Input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="h-8 w-full rounded border border-input p-0 hover:cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Size
            </label>
            <div className="flex justify-between items-center gap-2">
              {[2, 6, 12].map((size) => (
                <Button
                  key={size}
                  variant={brushSize === size ? "default" : "outline"}
                  title={`${size} px`}
                  className="flex-1 hover:cursor-pointer"
                  onClick={() => setBrushSize(size)}
                >
                  <div
                    className={cn("bg-foreground mx-auto rounded-full", {
                      "bg-secondary": brushSize === size,
                    })}
                    style={{ width: `${size * 2}px`, height: `${size}px` }}
                  />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default DrawingHoverCard;

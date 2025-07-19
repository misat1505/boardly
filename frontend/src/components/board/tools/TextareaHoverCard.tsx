"use client";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKeys";
import { useWhiteboardContext } from "@/context/WhiteboardContext";
import { BoardMode } from "@/types/BoardMode";
import { useRef, useState } from "react";
import { IoText } from "react-icons/io5";
import { useLocalStorage } from "usehooks-ts";

const TextareaHoverCard = () => {
  const [textColor, setTextColor] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.COLOR.name,
    LOCAL_STORAGE_KEYS.COLOR.defaultValue
  );
  const [textSize, setTextSize] = useLocalStorage<number>(
    LOCAL_STORAGE_KEYS.TEXT_SIZE.name,
    LOCAL_STORAGE_KEYS.TEXT_SIZE.defaultValue
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

    enterTimeout.current = setTimeout(() => setOpen(true), 500);
  };

  const handleMouseLeave = () => {
    if (enterTimeout.current) {
      clearTimeout(enterTimeout.current);
      enterTimeout.current = null;
    }

    leaveTimeout.current = setTimeout(() => setOpen(false), 200);
  };

  return (
    <HoverCard open={open}>
      <HoverCardTrigger asChild>
        <Button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => toggleMode(BoardMode.CREATING_TEXTAREA)}
          className="hover:cursor-pointer step-textarea-tool"
          variant={mode === BoardMode.CREATING_TEXTAREA ? "default" : "outline"}
        >
          <IoText />
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
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-8 w-full rounded border border-input p-0 hover:cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Size
            </label>
            <Select
              value={textSize.toString()}
              onValueChange={(value) => setTextSize(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default TextareaHoverCard;

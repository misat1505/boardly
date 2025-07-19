"use client";
import { useWhiteboardContext } from "@/context/WhiteboardContext";
import { Selection } from "@/types/shapes";
import Konva from "konva";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { Group, Rect } from "react-konva";

type SelectionNodeProps = { selection: Selection };

const SelectionNode = ({ selection }: SelectionNodeProps) => {
  const { handleShapeDragEnd } = useWhiteboardContext();

  return (
    <Group
      x={selection.x}
      y={selection.y}
      draggable
      onDragEnd={(e) => handleShapeDragEnd(e, selection.id)}
    >
      <AnimatedOutlineSelection selection={selection} />
      <Rect
        key={selection.id}
        width={selection.width}
        height={selection.height}
      />
    </Group>
  );
};

const AnimatedOutlineSelection = ({ selection }: SelectionNodeProps) => {
  const outlineRef = useRef<Konva.Rect>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const anim = new Konva.Animation((frame) => {
      if (outlineRef.current && frame) {
        const offset = frame.time / 50;
        outlineRef.current.dashOffset(offset);
      }
    }, outlineRef.current?.getLayer());

    anim.start();

    return () => {
      anim.stop();
    };
  }, []);

  return (
    <Rect
      ref={outlineRef}
      width={selection.width}
      height={selection.height}
      stroke={theme === "dark" ? "white" : "black"}
      strokeWidth={4}
      dash={[20, 20]}
      lineCap="butt"
      lineJoin="miter"
      listening={false}
      fill="transparent"
    />
  );
};

export default SelectionNode;

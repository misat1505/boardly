"use client";
import { useWhiteboardContext } from "@/context/WhiteboardContext";
import useIsShapeSelected from "@/hooks/useIsShapeSelected";
import { BoardMode } from "@/types/BoardMode";
import { Rectangle } from "@/types/shapes";
import Konva from "konva";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { Group, Rect } from "react-konva";

type RectangleNodeProps = { rectangle: Rectangle };

const RectangleNode = ({ rectangle }: RectangleNodeProps) => {
  const isSelected = useIsShapeSelected(rectangle.id);
  const {
    mode,
    handleShapeDragEnd,
    handleSelectShape,
    appendToGroupSelectionOnClick,
  } = useWhiteboardContext();

  if (isSelected) return <SelectedRectangleNode rectangle={rectangle} />;

  return (
    <Rect
      key={rectangle.id}
      x={rectangle.x}
      y={rectangle.y}
      width={rectangle.width}
      height={rectangle.height}
      fill={rectangle.color}
      draggable={mode === BoardMode.MOVING}
      onDragEnd={(e) => handleShapeDragEnd(e, rectangle.id)}
      onDblClick={() => handleSelectShape(rectangle.id)}
      onClick={appendToGroupSelectionOnClick(rectangle)}
    />
  );
};

const SelectedRectangleNode = ({ rectangle }: RectangleNodeProps) => {
  const {
    mode,
    removeFromGroupSelectionOnClick,
    onDragMove,
    handleShapeDragEnd,
    handleSelectShape,
  } = useWhiteboardContext();

  return (
    <Group
      x={rectangle.x}
      y={rectangle.y}
      draggable={mode === BoardMode.MOVING}
      onClick={removeFromGroupSelectionOnClick(rectangle)}
      onDragMove={onDragMove}
      onDragEnd={(e) => handleShapeDragEnd(e, rectangle.id)}
    >
      <AnimatedOutlineRect rectangle={rectangle} />
      <Rect
        key={rectangle.id}
        width={rectangle.width}
        height={rectangle.height}
        fill={rectangle.color}
        onDblClick={() => handleSelectShape(rectangle.id)}
      />
    </Group>
  );
};

const AnimatedOutlineRect = ({ rectangle }: RectangleNodeProps) => {
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
      width={rectangle.width}
      height={rectangle.height}
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

export default RectangleNode;

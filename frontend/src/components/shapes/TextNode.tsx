"use client";
import { useWhiteboardContext } from "@/context/WhiteboardContext";
import useIsShapeSelected from "@/hooks/useIsShapeSelected";
import { BoardMode } from "@/types/BoardMode";
import { Text as TText } from "@/types/shapes";
import Konva from "konva";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { Group, Rect, Text } from "react-konva";

type TextNodeProps = { text: TText };

const TextNode = ({ text }: TextNodeProps) => {
  const isSelected = useIsShapeSelected(text.id);
  const {
    mode,
    handleShapeDragEnd,
    handleSelectShape,
    appendToGroupSelectionOnClick,
  } = useWhiteboardContext();
  const { theme } = useTheme();

  if (isSelected) return <SelectedTextNode text={text} />;

  if (text.text.trim().length === 0)
    return (
      <Group
        x={text.x}
        y={text.y}
        draggable={mode === BoardMode.MOVING}
        onClick={appendToGroupSelectionOnClick(text)}
        onDragEnd={(e) => handleShapeDragEnd(e, text.id)}
        onDblClick={() => handleSelectShape(text.id)}
      >
        <Rect
          width={text.width}
          height={text.height}
          fill={theme === "dark" ? "#222020" : "#e7e4e4"}
          stroke={theme === "dark" ? "white" : "black"}
          strokeWidth={1}
          dash={[4, 4]}
          cornerRadius={4}
        />
        <Text
          text="Double click to edit..."
          fontSize={text.fontSize || 16}
          fill={theme === "dark" ? "#aaa" : "#666"}
          width={text.width}
          height={text.height}
          padding={6}
          align="left"
          verticalAlign="middle"
        />
      </Group>
    );

  return (
    <Text
      key={text.id}
      x={text.x}
      y={text.y}
      text={text.text}
      fontSize={text.fontSize || 24}
      fill={text.color || "black"}
      width={text.width}
      height={text.height}
      draggable={mode === BoardMode.MOVING}
      onClick={appendToGroupSelectionOnClick(text)}
      onDragEnd={(e) => handleShapeDragEnd(e, text.id)}
      onDblClick={() => handleSelectShape(text.id)}
    />
  );
};

const SelectedTextNode = ({ text }: TextNodeProps) => {
  const {
    mode,
    removeFromGroupSelectionOnClick,
    onDragMove,
    handleShapeDragEnd,
    handleSelectShape,
  } = useWhiteboardContext();
  const { theme } = useTheme();

  return (
    <Group
      x={text.x}
      y={text.y}
      draggable={mode === BoardMode.MOVING}
      onClick={removeFromGroupSelectionOnClick(text)}
      onDragMove={onDragMove}
      onDragEnd={(e) => handleShapeDragEnd(e, text.id)}
    >
      <AnimatedOutlineText text={text} />
      {text.text.trim().length > 0 ? (
        <Text
          key={text.id}
          text={text.text}
          fontSize={text.fontSize || 24}
          fill={text.color || "black"}
          width={text.width}
          height={text.height}
          onDblClick={() => handleSelectShape(text.id)}
        />
      ) : (
        <>
          <Rect
            width={text.width}
            height={text.height}
            fill={theme === "dark" ? "#222020" : "#e7e4e4"}
            cornerRadius={4}
          />
          <Text
            text="Double click to edit..."
            fontSize={text.fontSize || 16}
            fill={theme === "dark" ? "#aaa" : "#666"}
            width={text.width}
            height={text.height}
            padding={6}
            align="left"
            verticalAlign="middle"
          />
        </>
      )}
    </Group>
  );
};

const AnimatedOutlineText = ({ text }: TextNodeProps) => {
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
      width={text.width}
      height={text.height}
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

export default TextNode;

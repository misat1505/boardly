"use client";
import { useWhiteboardContext } from "@/context/WhiteboardContext";
import useIsShapeSelected from "@/hooks/useIsShapeSelected";
import { BoardMode } from "@/types/BoardMode";
import { Handwrite } from "@/types/shapes";
import Konva from "konva";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { Group, Line } from "react-konva";

type HandwriteNodeProps = { handwrite: Handwrite };

const HandwriteNode = ({ handwrite }: HandwriteNodeProps) => {
  const {
    mode,
    handleSelectShape,
    handleShapeDragEnd,
    appendToGroupSelectionOnClick,
  } = useWhiteboardContext();

  const isSelected = useIsShapeSelected(handwrite.id);

  if (isSelected) return <SelectedHandwriteNode handwrite={handwrite} />;

  return (
    <Line
      key={handwrite.id}
      points={handwrite.points}
      stroke={handwrite.color}
      x={handwrite.x}
      y={handwrite.y}
      strokeWidth={handwrite.width}
      tension={0.5}
      lineCap="round"
      lineJoin="round"
      globalCompositeOperation="source-over"
      draggable={mode === BoardMode.MOVING}
      onDragEnd={(e) => handleShapeDragEnd(e, handwrite.id)}
      onDblClick={() => handleSelectShape(handwrite.id)}
      onClick={appendToGroupSelectionOnClick(handwrite)}
    />
  );
};

const SelectedHandwriteNode = ({ handwrite }: HandwriteNodeProps) => {
  const {
    mode,
    removeFromGroupSelectionOnClick,
    onDragMove,
    handleShapeDragEnd,
    handleSelectShape,
  } = useWhiteboardContext();

  return (
    <Group
      x={handwrite.x}
      y={handwrite.y}
      draggable={mode === BoardMode.MOVING}
      onClick={removeFromGroupSelectionOnClick(handwrite)}
      onDragMove={onDragMove}
      onDragEnd={(e) => handleShapeDragEnd(e, handwrite.id)}
    >
      <AnimatedOutline handwrite={handwrite} />
      <Line
        key={handwrite.id}
        points={handwrite.points}
        stroke={handwrite.color}
        strokeWidth={handwrite.width}
        shadowColor="white"
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        globalCompositeOperation="source-over"
        onDblClick={() => handleSelectShape(handwrite.id)}
      />
    </Group>
  );
};

const AnimatedOutline = ({ handwrite }: { handwrite: Handwrite }) => {
  const outlineRef = useRef<Konva.Line>(null);
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
    <Line
      ref={outlineRef}
      points={handwrite.points}
      stroke={theme === "dark" ? "white" : "black"}
      strokeWidth={handwrite.width + 4}
      tension={0.5}
      lineCap="butt"
      lineJoin="miter"
      listening={false}
      dash={[20, 20]}
      dashEnabled={true}
    />
  );
};

export default HandwriteNode;

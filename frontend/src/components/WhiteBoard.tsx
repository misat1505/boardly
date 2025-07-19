"use client";
import React from "react";
import { Stage, Layer } from "react-konva";
import { useWhiteboardContext } from "@/context/WhiteboardContext";
import WhiteBoardTools from "./board/tools/WhiteboardTools";
import UserSettings from "./UserSettings";
import { DisplayableShape } from "@/types/shapes";
import { BoardMode } from "@/types/BoardMode";
import SelectedShapeDetails from "./board/shape-details/SelectedShapeDetails";
import Tour from "./board/tour/Tour";

export default function Whiteboard() {
  const {
    mode,
    stageRef,
    width,
    height,
    scale,
    position,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setPosition,
    shapes,
    selectedShapeId,
  } = useWhiteboardContext();

  return (
    <Tour>
      <WhiteBoardTools />

      {selectedShapeId ? <SelectedShapeDetails /> : null}

      <UserSettings />

      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable={mode === BoardMode.MOVING}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onDragEnd={(e) => {
          setPosition(e.currentTarget.position());
        }}
      >
        <Layer>
          {shapes.map((shape) =>
            shape instanceof DisplayableShape ? (
              <React.Fragment key={shape.id}>{shape.render()}</React.Fragment>
            ) : null
          )}
        </Layer>
      </Stage>
    </Tour>
  );
}

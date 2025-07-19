"use client";
import { useWhiteboardContext } from "@/context/WhiteboardContext";
import useIsShapeSelected from "@/hooks/useIsShapeSelected";
import { BoardMode } from "@/types/BoardMode";
import { Shape, Image as TImage } from "@/types/shapes";
import Konva from "konva";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Group, Image, Rect } from "react-konva";

type ImageNodeProps = { shape: TImage };

const ImageNode = ({ shape }: ImageNodeProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const isSelected = useIsShapeSelected(shape.id);
  const {
    appendToGroupSelectionOnClick,
    removeFromGroupSelectionOnClick,
    onDragMove,
    setShapes,
    mode,
    handleShapeDragEnd,
    handleSelectShape,
  } = useWhiteboardContext();

  useEffect(() => {
    if (!shape.imageUrl) {
      setImage(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = shape.imageUrl;
    img.onload = () => {
      setImage(img);
      setShapes((prev) =>
        prev.map((s) => {
          if (s.id !== shape.id || !(s instanceof TImage)) return s;

          s.dimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          };

          return s;
        })
      );
    };
    img.onerror = () => setImage(null);
  }, [shape.imageUrl]);

  if (!isSelected || !shape.dimensions)
    return (
      <Image
        {...shape.jsonify()}
        image={image!}
        onClick={appendToGroupSelectionOnClick({ id: shape.id } as Shape)}
        scale={{ x: shape.scale, y: shape.scale }}
        draggable={mode === BoardMode.MOVING}
        onDragEnd={(e) => handleShapeDragEnd(e, shape.id)}
        onDblClick={() => handleSelectShape(shape.id)}
      />
    );

  return (
    <Group
      {...shape.jsonify()}
      scale={{ x: shape.scale, y: shape.scale }}
      onClick={removeFromGroupSelectionOnClick({ id: shape.id } as Shape)}
      onDragMove={onDragMove}
      draggable={mode === BoardMode.MOVING}
      onDragEnd={(e) => handleShapeDragEnd(e, shape.id)}
      onDblClick={() => handleSelectShape(shape.id)}
    >
      <AnimatedOutlineForImage
        width={shape.dimensions.width}
        height={shape.dimensions.height}
        scale={shape.scale}
      />
      <Image
        image={image!}
        width={shape.dimensions.width}
        height={shape.dimensions.height}
      />
    </Group>
  );
};

type AnimatedOutlineForImageProps = {
  width: number;
  height: number;
  scale: number;
};

function AnimatedOutlineForImage({
  width,
  height,
  scale,
}: AnimatedOutlineForImageProps) {
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
      width={width}
      height={height}
      stroke={theme === "dark" ? "white" : "black"}
      strokeWidth={4 / scale}
      dash={[20 / scale, 20 / scale]}
      lineCap="butt"
      lineJoin="miter"
      listening={false}
    />
  );
}

export default ImageNode;

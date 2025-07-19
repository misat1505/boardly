"use client";

import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKeys";
import {
  Blank,
  Handwrite,
  Image,
  Rectangle,
  Selection,
  Shape,
  Text,
  TShape,
} from "@/types/shapes";
import { Stage } from "konva/lib/Stage";
import { Dispatch, RefObject, SetStateAction, useEffect } from "react";

export default function usePersistBoard({
  shapes,
  position,
  setShapes,
  setPosition,
  stageRef,
}: {
  shapes: Shape[];
  position: { x: number; y: number };
  setShapes: Dispatch<SetStateAction<Shape[]>>;
  setPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
  stageRef: RefObject<Stage>;
}) {
  const save = async () => {
    const blob: Blob = await new Promise((resolve, reject) => {
      stageRef.current.toBlob({
        callback: (blob: Blob | null) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create blob"));
        },
      });
    });
    console.log(blob);

    const formData = new FormData();
    formData.append("file", blob, "board.png");

    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
    const url = res.url;
    console.log(url);

    const savedShapes = [
      ...shapes.filter(
        (s) => !(s instanceof Blank) && !(s instanceof Selection)
      ),
      new Blank({ id: `blank_${Date.now()}` }),
    ].map((s) => s.jsonify());

    const data = {
      shapes: savedShapes,
      position,
    };
    localStorage.setItem(LOCAL_STORAGE_KEYS.BOARD.name, JSON.stringify(data));
  };

  useEffect(() => {
    const json = localStorage.getItem(LOCAL_STORAGE_KEYS.BOARD.name);
    if (json) {
      try {
        const data = JSON.parse(json);
        const savedShapes = data.shapes as TShape[];
        if (savedShapes) {
          const parsedShapes = savedShapes.map((shape) => {
            if (shape.type === "blank") return new Blank({ ...shape });
            else if (shape.type === "handwrite")
              return new Handwrite({ ...shape });
            else if (shape.type === "rect") return new Rectangle({ ...shape });
            else if (shape.type === "selection")
              return new Selection({ ...shape });
            else if (shape.type === "image") return new Image({ ...shape });
            else return new Text({ ...shape });
          });
          setShapes(parsedShapes);
        }
        if (data.position) setPosition(data.position);
      } catch (err) {
        console.error("Failed to parse saved board", err);
      }
    }
  }, []);

  return { save };
}

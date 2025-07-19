"use client";
import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKeys";
import { Blank, Selection, Shape } from "@/types/shapes";
import { Stage } from "konva/lib/Stage";
import { RefObject } from "react";

export default function usePersistBoard({
  shapes,
  position,
  stageRef,
}: {
  shapes: Shape[];
  position: { x: number; y: number };
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

    const formData = new FormData();
    formData.append("file", blob, "board.png");

    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
    const url = res.url;

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

  return { save };
}

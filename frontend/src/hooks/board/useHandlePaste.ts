"use client";

import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKeys";
import { Board } from "@/types/Board";
import { Image, Shape, Text } from "@/types/shapes";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";

export default function useHandlePaste({
  board,
  getTransformedPointer,
  setShapes,
}: {
  board: Board;
  getTransformedPointer: () => any;
  setShapes: Dispatch<SetStateAction<Shape[]>>;
}) {
  const [textSize] = useLocalStorage<number>(
    LOCAL_STORAGE_KEYS.TEXT_SIZE.name,
    LOCAL_STORAGE_KEYS.TEXT_SIZE.defaultValue
  );
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const active = document.activeElement;
      const isInputFocused =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable);

      if (isInputFocused) return;

      const point = getTransformedPointer();
      if (!e.clipboardData) return;

      // Paste plain text
      const text = e.clipboardData.getData("text/plain");
      if (text) {
        // Example: add a text shape to Konva
        const newTextShape = new Text({
          id: `text_${Date.now()}`,
          text,
          x: point.x,
          y: point.y,
          color: "green",
          fontSize: textSize,
          height: 24,
          width: 800,
        });
        setShapes((prev) => [...prev, newTextShape]);
      }

      // Paste image from clipboard
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf("image") === 0) {
          const file = item.getAsFile();
          if (!file) continue;

          const formData = new FormData();
          formData.append("file", file);
          formData.append("key", `boards/${board.id}/images/${uuidv4()}.png`);

          const res = await fetch("/api/upload-image", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();

          if (data.url) {
            const newImageShape = new Image({
              id: `image_${Date.now()}`,
              x: point.x,
              y: point.y,
              imageUrl: data.url,
              scale: 1,
            });
            setShapes((prev) => [...prev, newImageShape]);
          } else {
            console.error("Upload failed", data.error);
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [textSize]);
}

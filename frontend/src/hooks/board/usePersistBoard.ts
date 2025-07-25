"use client";
import { updateBoard } from "@/actions/teams/updateBoard";
import { Board } from "@/types/Board";
import { UpdateBoardDTO } from "@/types/dto/UpdateBoardDTO";
import { Blank, Selection, Shape } from "@/types/shapes";
import { Stage } from "konva/lib/Stage";
import { RefObject, useEffect } from "react";

export default function usePersistBoard({
  shapes,
  stageRef,
  board,
  sendBoard,
}: {
  shapes: Shape[];
  stageRef: RefObject<Stage>;
  board: Board;
  sendBoard: (board: Board["content"]) => void;
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
    formData.append("key", `boards/${board.id}/preview.png`);

    const previewUrl = (
      await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      }).then((res) => res.json())
    ).url;

    const savedShapes = [
      ...shapes.filter(
        (s) => !(s instanceof Blank) && !(s instanceof Selection)
      ),
      new Blank({ id: `blank_${Date.now()}` }),
    ].map((s) => s.jsonify());

    const data: Partial<UpdateBoardDTO> = {
      content: JSON.stringify(savedShapes),
      previewUrl,
    };

    await updateBoard(board.id, data);

    sendBoard(data.content!);
  };

  return { save };
}

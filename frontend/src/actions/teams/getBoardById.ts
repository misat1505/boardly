import { Board } from "@/types/Board";
import { cookies } from "next/headers";

export async function getBoardById(
  boardId: Board["id"]
): Promise<Board | null> {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  const board: Board = await fetch(
    `${process.env.NEXT_APP_API_URL}/teams/boards/${boardId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((res) => {
    if (!res.ok) return null;
    return res.json();
  });

  return board;
}

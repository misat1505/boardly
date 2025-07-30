import { Board } from "@/types/Board";
import { api } from "../base";

export async function getBoardById(
  boardId: Board["id"]
): Promise<Board | null> {
  const client = await api({ attachAccessToken: true });
  const res = await client.get(`/teams/boards/${boardId}`);

  return res.data;
}

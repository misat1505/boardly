"use server";
import { Board } from "@/types/Board";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UpdateBoardDTO } from "@/types/dto/UpdateBoardDTO";
import { api } from "../base";

export async function updateBoard(
  id: Board["id"],
  updateBoardDTO: Partial<UpdateBoardDTO>
): Promise<Board> {
  const client = await api({ attachAccessToken: true });
  const res = await client.put(`/teams/boards/${id}`, updateBoardDTO);

  revalidatePath("/dashboard");

  return res.data;
}

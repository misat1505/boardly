"use server";
import { Board } from "@/types/Board";
import { CreateBoardDTO } from "@/types/dto/CreateBoardDTO";
import { revalidatePath } from "next/cache";
import { api } from "../base";

export async function createBoard(
  createBoardDTO: CreateBoardDTO
): Promise<Board> {
  const client = await api({ attachAccessToken: true });
  const res = await client.post(
    `/teams/${createBoardDTO.teamId}/boards`,
    createBoardDTO
  );

  revalidatePath("/dashboard");

  return res.data;
}

"use server";
import { Board } from "@/types/Board";
import { CreateBoardDTO } from "@/types/dto/CreateBoardDTO";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createBoard(
  createBoardDTO: CreateBoardDTO
): Promise<Board> {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  const board: Board = await fetch(
    `${process.env.NEXT_APP_API_URL}/teams/${createBoardDTO.teamId}/boards`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(createBoardDTO),
    }
  ).then((res) => {
    if (!res.ok) redirect("/login");
    return res.json();
  });

  revalidatePath("/dashboard");

  return board;
}

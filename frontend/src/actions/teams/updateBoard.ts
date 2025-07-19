"use server";
import { Board } from "@/types/Board";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UpdateBoardDTO } from "@/types/dto/UpdateBoardDTO";

export async function updateBoard(
  id: Board["id"],
  updateBoardDTO: Partial<UpdateBoardDTO>
): Promise<Board> {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  const board: Board = await fetch(
    `${process.env.NEXT_APP_API_URL}/teams/boards/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(updateBoardDTO),
    }
  ).then((res) => {
    console.log(res.status);
    if (!res.ok) redirect("/login");
    return res.json();
  });

  revalidatePath("/dashboard");

  return board;
}

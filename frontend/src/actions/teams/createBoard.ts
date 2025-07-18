"use server";
import { CreateBoardDTO } from "@/types/dto/CreateBoardDTO";
import { Team } from "@/types/Team";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createBoard(
  createBoardDTO: CreateBoardDTO
): Promise<Team> {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  const team: Team = await fetch(
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
    console.log(res.status);
    if (!res.ok) redirect("/login");
    return res.json();
  });

  revalidatePath("/dashboard");

  return team;
}

"use server";
import { CreateTeamDTO } from "@/types/dto/CreateTeamDTO";
import { Team } from "@/types/Team";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createTeam(createTeamDTO: CreateTeamDTO): Promise<Team> {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  const team: Team = await fetch(`${process.env.NEXT_APP_API_URL}/teams`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(createTeamDTO),
  }).then((res) => {
    if (!res.ok) redirect("/login");
    return res.json();
  });

  revalidatePath("/dashboard");

  redirect(`/dashboard?team=${team.id}`);

  return team;
}

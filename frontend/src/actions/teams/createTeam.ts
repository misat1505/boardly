"use server";
import { CreateTeamDTO } from "@/types/dto/CreateTeamDTO";
import { Team } from "@/types/Team";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "../base";

export async function createTeam(createTeamDTO: CreateTeamDTO): Promise<Team> {
  const client = await api({ attachAccessToken: true });
  const res = await client.post("/teams", createTeamDTO);
  const team = res.data;

  revalidatePath("/dashboard");

  redirect(`/dashboard?team=${team.id}`);

  return team;
}

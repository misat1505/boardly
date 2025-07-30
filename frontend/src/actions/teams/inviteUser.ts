"use server";
import { Team } from "@/types/Team";
import { User } from "@/types/User";
import { revalidatePath } from "next/cache";
import { api } from "../base";

export async function inviteUser(teamId: Team["id"], userId: User["id"]) {
  const client = await api({ attachAccessToken: true });
  await client.post(`/teams/${teamId}/invite`, { userId });

  revalidatePath("/dashboard");
}

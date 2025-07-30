import { Team } from "@/types/Team";
import { api } from "../base";

export async function getUserTeams(): Promise<Team[]> {
  const client = await api({ attachAccessToken: true });
  const res = await client.get("/teams");

  return res.data;
}

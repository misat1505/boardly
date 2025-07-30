import { Board } from "@/types/Board";
import { Team } from "@/types/Team";
import { api } from "../base";

export async function getTeamBoards(teamId: Team["id"]): Promise<Board[]> {
  const client = await api({ attachAccessToken: true });
  const res = await client.get(`/teams/${teamId}/boards`);

  return res.data;
}

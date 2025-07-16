import { Board } from "@/types/Board";
import { Team } from "@/types/Team";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getTeamBoards(teamId: Team["id"]): Promise<Board[]> {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  const boards: Board[] = await fetch(
    `${process.env.NEXT_APP_API_URL}/teams/${teamId}/boards`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((res) => {
    if (!res.ok) redirect("/login");
    return res.json();
  });

  return boards;
}

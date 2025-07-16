import { Team } from "@/types/Team";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getUserTeams(): Promise<Team[]> {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  const teams: Team[] = await fetch("http://localhost:8080/teams", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    if (!res.ok) redirect("/login");
    return res.json();
  });

  return teams;
}

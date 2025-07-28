"use server";

import { Team } from "@/types/Team";
import { cookies } from "next/headers";

export async function upgradeTeam(team: Team): Promise<string> {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  const res = await fetch(
    `${process.env.NEXT_APP_API_URL}/checkout/create-checkout-session`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${team.name} premium`,
        price: 2000,
      }),
    }
  );

  const data = await res.json();

  return data.id;
}

"use server";

import { Team } from "@/types/Team";
import { loadStripe } from "@stripe/stripe-js";

export async function upgradeTeam(team: Team): Promise<string> {
  const res = await fetch(
    `${process.env.NEXT_APP_API_URL}/checkout/create-checkout-session`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${team.name} premium`,
        price: 2000,
      }),
    }
  );

  const data = await res.json();

  return data.id;
}

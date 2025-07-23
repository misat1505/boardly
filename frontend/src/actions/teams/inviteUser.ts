"use server";
import { Team } from "@/types/Team";
import { User } from "@/types/User";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function inviteUser(teamId: Team["id"], userId: User["id"]) {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  await fetch(`${process.env.NEXT_APP_API_URL}/teams/${teamId}/invite`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ userId }),
  }).then((res) => {
    if (!res.ok) redirect("/login");
    return res.text();
  });

  revalidatePath("/dashboard");
}

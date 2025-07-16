"use server";

import { User } from "@/types/User";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getCurrentUser(): Promise<User> {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  console.log(accessToken);

  const user: User = await fetch(`${process.env.NEXT_APP_API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => {
    if (!res.ok) redirect("/login");
    return res.json();
  });

  return user;
}

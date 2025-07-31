"use server";

import { User } from "@/types/User";
import { api } from "../base";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const client = await api({ attachAccessToken: true });
    const res = await client.get("/auth/me");

    return res.data;
  } catch {
    return null;
  }
}

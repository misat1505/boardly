"use server";

import { User } from "@/types/User";
import { api } from "../base";

export async function searchUsers(searchString: string): Promise<User[]> {
  const client = await api();
  const res = await client.get(`/users/search?q=${searchString}`);

  return res.data;
}

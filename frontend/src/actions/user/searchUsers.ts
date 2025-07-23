"use server";

import { User } from "@/types/User";

export async function searchUsers(searchString: string): Promise<User[]> {
  const users: User[] = await fetch(
    `${process.env.NEXT_APP_API_URL}/users/search?q=${searchString}`
  ).then((res) => res.json());

  return users;
}

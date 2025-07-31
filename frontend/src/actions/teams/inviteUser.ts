"use server";
import { Team } from "@/types/Team";
import { User } from "@/types/User";
import { revalidatePath } from "next/cache";
import { api } from "../base";
import { ApiResponse } from "@/types/ApiResponse";
import { AxiosError } from "axios";

export async function inviteUser(
  teamId: Team["id"],
  userId: User["id"]
): Promise<ApiResponse<null, string>> {
  try {
    const client = await api({ attachAccessToken: true });
    await client.post(`/teams/${teamId}/invite`, { userId });

    revalidatePath("/dashboard");
    return { data: null, error: null };
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 400) {
      return {
        data: null,
        error: {
          message:
            "The user you're trying to invite has reached the maximum number of teams allowed for free accounts. They need to upgrade to PRO to join more teams.",
        },
      };
    }
    return { data: null, error: { message: "Unknown error occured" } };
  }
}

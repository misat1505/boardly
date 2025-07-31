"use server";
import { CreateTeamDTO } from "@/types/dto/CreateTeamDTO";
import { Team } from "@/types/Team";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "../base";
import { AxiosError } from "axios";

type ApiError<E> = { message: E };

type ApiResponse<T, E extends string> =
  | { data: T; error: null }
  | { data: null; error: ApiError<E> };

export async function createTeam(
  createTeamDTO: CreateTeamDTO
): Promise<ApiResponse<Team, string>> {
  try {
    const client = await api({ attachAccessToken: true });
    const res = await client.post("/teams", createTeamDTO);
    const team = res.data;

    revalidatePath("/dashboard");

    return { data: team, error: null };
  } catch (e) {
    console.log(`server action ${e}`);
    if (e instanceof AxiosError && e.response?.status === 400) {
      return {
        data: null,
        error: {
          message: `You've reached the limit of ${process.env.MAX_NON_PREMIUM_TEAMS} teams allowed for free users. Upgrade to PRO to create unlimited teams and unlock additional features.`,
        },
      };
    }
    return { data: null, error: { message: "Unknown error occured" } };
  }
}

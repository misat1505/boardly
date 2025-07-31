"use server";
import { Board } from "@/types/Board";
import { CreateBoardDTO } from "@/types/dto/CreateBoardDTO";
import { revalidatePath } from "next/cache";
import { api } from "../base";
import { ApiResponse } from "@/types/ApiResponse";
import { AxiosError } from "axios";

export async function createBoard(
  createBoardDTO: CreateBoardDTO
): Promise<ApiResponse<Board, string>> {
  try {
    const client = await api({ attachAccessToken: true });
    const res = await client.post(
      `/teams/${createBoardDTO.teamId}/boards`,
      createBoardDTO
    );

    revalidatePath("/dashboard");

    return { data: res.data, error: null };
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 400) {
      return {
        data: null,
        error: {
          message: `Team has reached the limit of ${process.env.MAX_NON_PREMIUM_BOARDS} baords allowed for free teams. Upgrade to PRO to create unlimited boards and unlock additional features.`,
        },
      };
    }
    return { data: null, error: { message: "Unknown error occured" } };
  }
}

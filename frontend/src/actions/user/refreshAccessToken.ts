"use server";
import { cookies } from "next/headers";
import axios from "axios";

export async function refreshAccessToken(): Promise<void> {
  const cookiesStore = await cookies();
  const refreshToken = cookiesStore.get("refreshToken")?.value;

  const res = await axios.post(`${process.env.NEXT_APP_API_URL}/auth/refresh`, {
    refreshToken,
  });

  cookiesStore.set("accessToken", res.data, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15,
  });
}

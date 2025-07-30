import { cookies } from "next/headers";
import axios from "axios";

export async function getAccessToken(): Promise<string | null> {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value ?? null;
  return accessToken;
}

interface ApiOptions {
  attachAccessToken?: boolean;
}

export const api = async ({ attachAccessToken = false }: ApiOptions = {}) => {
  const token = await getAccessToken();

  return axios.create({
    baseURL: process.env.NEXT_APP_API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && attachAccessToken && { Authorization: `Bearer ${token}` }),
    },
  });
};

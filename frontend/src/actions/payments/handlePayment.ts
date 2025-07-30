"use server";

import { PaymentDTO } from "@/types/dto/PaymentDTO";
import { api } from "../base";

export async function handlePayment(paymentDTO: PaymentDTO): Promise<string> {
  const client = await api({ attachAccessToken: true });
  const res = await client.post(
    "/checkout/create-checkout-session",
    paymentDTO
  );
  return res.data.id;
}

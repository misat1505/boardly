"use client";

import { User } from "@/types/User";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { handlePayment } from "@/actions/payments/handlePayment";
import { Payment } from "@/types/payments/Payment";
import { loadStripe } from "@stripe/stripe-js";

type GoProProps = { user: User };

const GoPro = ({ user }: GoProProps) => {
  const handleUpgrade = async () => {
    const sessionId = await handlePayment({
      type: Payment.UPGRADE_USER,
      id: user.id,
    });

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );

    await stripe?.redirectToCheckout({ sessionId: sessionId });
  };

  return <DropdownMenuItem onClick={handleUpgrade}>Go Pro</DropdownMenuItem>;
};

export default GoPro;

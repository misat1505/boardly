import { handlePayment } from "@/actions/payments/handlePayment";
import { Payment } from "@/types/payments/Payment";
import { Team } from "@/types/Team";
import { loadStripe } from "@stripe/stripe-js";

export default function useUpgradeTeam(id: Team["id"]) {
  const handleUpgrade = async () => {
    const sessionId = await handlePayment({
      type: Payment.UPGRADE_TEAM,
      id,
    });

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );

    await stripe?.redirectToCheckout({ sessionId: sessionId });
  };

  return handleUpgrade;
}

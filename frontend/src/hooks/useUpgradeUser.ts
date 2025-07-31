import { handlePayment } from "@/actions/payments/handlePayment";
import { getCurrentUser } from "@/actions/user/getCurrentUser";
import { Payment } from "@/types/payments/Payment";
import { loadStripe } from "@stripe/stripe-js";

export default function useUpgradeUser() {
  const handleUpgrade = async () => {
    const user = await getCurrentUser();
    const sessionId = await handlePayment({
      type: Payment.UPGRADE_USER,
      id: user!.id,
    });

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );

    await stripe?.redirectToCheckout({ sessionId: sessionId });
  };

  return handleUpgrade;
}

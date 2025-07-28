"use client";

import { Team } from "@/types/Team";
import { Button } from "../ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { upgradeTeam } from "@/actions/payments/upgradeTeam";

type UpgradeTeamProps = { team: Team };

const UpgradeTeam = ({ team }: UpgradeTeamProps) => {
  const handleUpgrade = async () => {
    const sessionId = await upgradeTeam(team);

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );

    await stripe?.redirectToCheckout({ sessionId: sessionId });
  };

  return (
    <Button
      variant="link"
      className="text-yellow-600 text-xs p-0 h-fit"
      onClick={handleUpgrade}
    >
      Upgrade your team to create as many boards as you need—no limits!
    </Button>
  );
};

export default UpgradeTeam;

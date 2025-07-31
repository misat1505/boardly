"use client";

import { Team } from "@/types/Team";
import { Button } from "../ui/button";
import useUpgradeTeam from "@/hooks/useUpgradeTeam";

type UpgradeTeamProps = { team: Team };

const UpgradeTeam = ({ team }: UpgradeTeamProps) => {
  const handleUpgrade = useUpgradeTeam(team.id);

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

import { getUserTeams } from "@/actions/teams/getUserTeams";
import UpgradeTeam from "@/components/payments/UpgradeTeam";
import { notFound } from "next/navigation";

type PremiumTeamPageProps = { params: Promise<{ id: string }> };

const PremiumTeamPage = async ({ params }: PremiumTeamPageProps) => {
  const { id } = await params;
  const teams = getUserTeams();

  const team = (await teams).find((team) => team.id === id);

  if (!team) notFound();

  if (team.isUpgraded) return <h2>{team.name} is already premium!</h2>;

  return <UpgradeTeam team={team} />;
};

export default PremiumTeamPage;

import { getUserTeams } from "@/actions/teams/getUserTeams";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import TeamDetails from "@/components/dashboard/TeamDetails";
import TeamsNavigation from "@/components/dashboard/TeamsNavigation";
import { Team } from "@/types/Team";

interface PageProps {
  searchParams: { team?: Team["id"] };
}

const DashboardPage = async ({ searchParams }: PageProps) => {
  const teams = await getUserTeams();
  const team = teams.find((t) => t.id === searchParams.team) ?? teams[0];

  return (
    <div className="flex w-screen min-h-screen">
      <TeamsNavigation teamId={searchParams.team} />
      <div className="flex-grow bg-background">
        <DashboardNavbar />
        {team ? <TeamDetails team={team} /> : <div>No team selected!</div>}
      </div>
    </div>
  );
};

export default DashboardPage;

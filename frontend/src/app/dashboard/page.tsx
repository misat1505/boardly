import { getTeamBoards } from "@/actions/teams/getTeamBoards";
import { getUserTeams } from "@/actions/teams/getUserTeams";
import { getCurrentUser } from "@/actions/user/getCurrentUser";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import TeamsNavigation from "@/components/dashboard/TeamsNavigation";
import { Button } from "@/components/ui/button";
import { Team } from "@/types/Team";

interface PageProps {
  searchParams: { team?: Team["id"] };
}

const DashboardPage = async ({ searchParams }: PageProps) => {
  const teams = await getUserTeams();

  return (
    <div className="flex w-screen min-h-screen">
      <TeamsNavigation teamId={searchParams.team} />
      <div className="flex-grow bg-background">
        <DashboardNavbar />
      </div>
    </div>
  );
};

export default DashboardPage;
